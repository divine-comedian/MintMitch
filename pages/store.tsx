import React, { useCallback } from 'react'
import { NFTCard } from '../components/NFTCard'
import Navbar from '../components/navbar'
import { selectContractAddress,MintingContractProps, getNativeBalance, getPaymentTokenBalance } from '../utils/ContractHelper'
import { useState, useEffect } from 'react'
import { CartModal } from '../components/cartModal'
import { WrongNetwork } from '../components/wrongNetwork'
import { MintModal } from '../components/mint'
import Head from 'next/head'
import { checkNetwork } from '../utils/checkNetwork'
import { useNetwork, useContractRead, useAccount } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinterSupplyUpgradeable.sol/MitchMinter.json'
import { fetchToken } from '@wagmi/core'
import { constants } from '../utils/constants'
import { formatUnits } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getIpfsData } from '../utils/AxiosHelper'

export interface nftData {
  name: string
  description?: string
  image?: string
  tokenId: number
  tokenPrice: bigint
}

const Store = () => {
  const [updateBalance, setUpdateBalance] = useState<any>()
  const [isRightNetwork, setisRightNetwork] = useState<boolean | undefined>(undefined)
  const [showMintModal, setShowMintModal] = React.useState(false)
  const [mintingCart, setMintingCart] = useState<nftData[]>([])
  const [uniqueTokens, setUniqueTokens] = useState(0)
  const [isMysteryMint, setIsMysteryMint] = useState(false)
  const [nativeMinting, setNativeMinting] = useState<boolean>(false)
  const [nftData, setNftData] = useState<nftData[]>()
  const [renderWrongNetwork, setRenderWrongNetwork] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null)
  // const [nftCards, dispatch] = useReducer(nftCardsReducer, [])
  const [userBalance, setUserBalance] = useState<bigint>(0n)
  const [contractProps, setContractProps] = useState<MintingContractProps>({
    address: constants.GOERLI_CONTRACT_ADDRESS,
    chainId: 5,
  })
  const [network, setNetwork] = useState<string | undefined>(undefined)
  const [paymentTokenAddress, setPaymentTokenAddress] = useState<string>('')
  const [paymentTokenSymbol, setPaymentTokenSymbol] = useState<string>('ETH')
  const currentNetwork = useNetwork().chain?.network as string
  const { address: account, isConnected: isAccountConnected } = useAccount()

  const { data: isNativeMinting, isSuccess: isNativeMintingSuccess } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'nativeMintEnabled',
    args: [],
    chainId: contractProps.chainId,
  })

  const {
    data: paymentTokenAddressData,
    isSuccess: isPaymentTokenAddressSuccess,
    isError: isPaymentTokenAddressError,
    error: paymentTokenAddressError,
  } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'paymentToken',
    chainId: contractProps.chainId,
    args: [],
  })

  const {
    data: newUniqueTokens,
    isError: isUniqueTokensError,
    error: uniqueTokensError,
  } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'uniqueTokens',
    chainId: contractProps.chainId,
    args: [],
  })

  const {
    data: tokensOwned,
  } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'tokensOwned',
    chainId: contractProps.chainId,
    args: [account],
  })


  const tokensOwnedParsed = (tokensOwned as BigInt[])?.map((token: any) => {
    return parseFloat(formatUnits(token, 0))
  })


  function getTokensNotOwned(tokensOwned: any) {
    const tokensNotOwned = []
    for (let i = 1; i <= uniqueTokens; i++) {
      if (!tokensOwned.includes(i)) {
        tokensNotOwned.push(i)
      }
    }
    return tokensNotOwned
  }

 async function autoMint(amount: number) {
    const tokensNotOwned = getTokensNotOwned(tokensOwnedParsed) 
    if (tokensNotOwned.length !== 0) {
      let currentIndex = tokensNotOwned.length,  randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [tokensNotOwned[currentIndex], tokensNotOwned[randomIndex]] = [
          tokensNotOwned[randomIndex], tokensNotOwned[currentIndex]];
      }
      const tokensToMint = tokensNotOwned.slice(0, amount)
      console.log('tokens to mint', tokensToMint)
      async function addBatchToCart () {
        setIsMysteryMint(true)
        emptyCart()
        nftData &&
        tokensToMint.forEach((token: number) => {
            addToCart({
              tokenId: token,
              name: nftData[token-1].name,
              tokenPrice: nftData[token-1].tokenPrice,
          })
        })
        
      }
      addBatchToCart()
    } else {
      alert('You already own all the mitches you maniac!')
    }
  }

  async function fetchNFTCardData(totalTokens: number) {
    try {
      const promises: Promise<nftData>[] = [];
  
      for (let i = 1; i <= totalTokens; i++) {
        const promise = getIpfsData(i, contractProps);
        promises.push(promise);
      }
  
      const allNftData = await Promise.all(promises);
      return allNftData;
  
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
  
  const isMintModal = (state: boolean) => {
    setShowMintModal(state)
  }

  const addToCart = useCallback((item: nftData) => {
    // console.log('item added to cart', item)
    setMintingCart((prevMintingCart) => [...prevMintingCart, item])
  }, [])

  const removeFromCart = useCallback((item: nftData) => {
    setMintingCart((prevMintingCart) => prevMintingCart.filter((i) => i.tokenId !== item.tokenId))
  }, [])

  const emptyCart = useCallback(() => {
    setMintingCart([])
  }
  , [])

  // welcome to the use effect jungle
  useEffect(() => {
    isNativeMintingSuccess &&
    setNativeMinting(isNativeMinting as boolean)
  }, [isNativeMinting])


  useEffect(() => {
    if (currentNetwork !== undefined) {
      setNetwork(currentNetwork)
      emptyCart()
    }
  }, [currentNetwork])

  useEffect(() => {
    const [isRightNetworkBoolean, connectedNetworkArray] = checkNetwork(currentNetwork) as Array<any>
    setisRightNetwork(isRightNetworkBoolean)
    setCorrectNetwork(connectedNetworkArray)
    setContractProps(selectContractAddress(currentNetwork))
  }, [currentNetwork])

  useEffect(() => {
    if (isRightNetwork === false && currentNetwork !== undefined && !renderWrongNetwork ) {
      setRenderWrongNetwork(true) 
    } else {
      setRenderWrongNetwork(false)
    }
  }, [isRightNetwork, currentNetwork])

  useEffect(() => {
    if (newUniqueTokens !== undefined) {
      setUniqueTokens(Number(newUniqueTokens))
      fetchNFTCardData(Number(newUniqueTokens)).then((response) => {
        setNftData(response)
      }
      ).catch((error) => console.log(error))
    } else if (isUniqueTokensError) {
      console.log(uniqueTokensError)
    }
  }, [newUniqueTokens, contractProps])

  useEffect(() => {
    if (isPaymentTokenAddressSuccess && isNativeMinting === false) {
      fetchToken({
        address: `0x${(paymentTokenAddressData as string).substring(2)}`,
        chainId: contractProps.chainId,
      }).then((response) => {
        setPaymentTokenSymbol(response.symbol)
        setPaymentTokenAddress(paymentTokenAddressData as string)
      })
    } else if (isNativeMinting === true) {
      setPaymentTokenSymbol('ETH')
    } else if (isPaymentTokenAddressError) {
      console.log(paymentTokenAddressError)
    }
  }, [paymentTokenAddressData, isNativeMinting, isPaymentTokenAddressSuccess, isPaymentTokenAddressError])

  useEffect(() => {
    const getUserBalance = async (accountAddress: string) => {
      if (isNativeMinting === true && isAccountConnected) {
        getNativeBalance(accountAddress.substring(2)).then((balance) => setUserBalance(balance))
      } else if (isNativeMinting === false && isAccountConnected) {
        getPaymentTokenBalance(accountAddress.substring(2), contractProps).then((balance) =>
          setUserBalance(balance as bigint),
        )
      }
    }
    if (account !== undefined && isAccountConnected && isNativeMinting !== undefined) {
      getUserBalance(account)
    }
  }, [isNativeMinting, account, contractProps])

  


  const cartTotal = mintingCart.reduce((acc, item) => acc +(BigInt(item.tokenPrice)), BigInt(0))
  return (
    <>
      <Head>
        <title>Mint Mitch | Store</title>
        <meta
          name="This is the page to see all the mitches"
          content="Find all you favourite mitches here and mint them"
        />
        <link rel="icon" href="/Favicon.ico" />

        {/* Add other metadata as needed */}
      </Head>
      <div>
        <Navbar isRightNetwork={isRightNetwork} updateBalance={updateBalance} />
        {showMintModal ? (
          <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="rise-up mb-40">
              {nftData && 
              <MintModal
                itemSum={cartTotal}
                itemsArray={mintingCart}
                isMintModal={isMintModal}
                isNativeMintEnabled={isNativeMinting as boolean}
                contractProps={contractProps}
                updateBalance={updateBalance}
                setUpdateBalance={setUpdateBalance}
                userBalance={userBalance}
              />
              }
            </div>
          </div>
        ) : null}

        <div className="bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] min-h-screen dark:from-[#240046] dark:to-[#ff4800]">
          <div className="p-4">
            <div className="font-medium bg-white/30 dark:bg-black/30 lg:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
              <h1 className="text-3xl font-bold my-3">Here you will find all the Mitchs of your dreams.</h1>
              <p>Mint any Mitchs you like on Gnosis Chain, Optimism and Polygon!</p>
              <p>
                You are currently connected to <b>{contractProps.name}</b>, so you'll need to use{' '}
                {nativeMinting ? (
                  <b>ETH</b>
                ) : (
                  <b>
                    <a
                      className="text-purple-600"
                      href={contractProps.dexLink + '0x' + paymentTokenAddress.substring(2)}
                      target="_blank"
                      rel="noopener noreferrer"
                    ></a>
                    {paymentTokenSymbol}
                  </b>
                )}{' '}
                to purchase some Mitchs.
              </p>
              <p></p>
              <h3 className="text-lg font-semibold">
                Don't see a Mitch you like, or have a special request for a Mitch Pin NFT?
              </h3>{' '}
              <p>
                Send an email to{' '}
                <a
                  className="text-purple-600 hover:text-purple-700 font-bold"
                  href="mailto:mitch@mintmitch.xyz?subject=Request-A-Mitch"
                >
                  mitch@mintmitch.xyz
                </a>{' '}
                to Request-a-Mitch, and let's see what kinda magic we can make happen! 🪄{' '}
              </p>
              <p>
                <i>Also don't forget...</i> For every Mitch NFT you mint, you will receive 1 $MITCH token, these will be
                used to direct the flow of validator rewards once we reach the goal.
              </p>
            </div>
            {!network ? (
              <div className="font-medium bg-white/30 dark:bg-black/30 lg:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
                <h3 className="text-lg font-semibold">Connect with your web3 wallet to mint some Mitch!</h3>
                <div className="pt-2 pl-4">
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <>
                <div className="font-medium bg-white/30 dark:bg-black/30 lg:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
                  <h3 className="text-lg font-semibold">Keep scrolling to see all the Mitchs available to mint.</h3>
                  <p>
                    The price of each is listed on the card. For each NFT listed, click the toggle next to '👉' to add a
                    Mitch to your cart. When you've picked all your Mitchs, click the <b>'Mint Mitch!'</b> button and a
                    transaction will appear to mint all your Mitchs at once.
                  </p>
                </div>
                {/* <div className="flex lg:max-w-[50%] xl:max-w-[66%] justify-between my-3 space-x-1">
                </div> */}
               {nftData && nftData.length !== 0 && isAccountConnected &&
                <div className="lg:fixed lg:float-right z-20 mt-2 lg:top-20 right-10 mr-5 md:max-w-[40%] xl:max-w-[26%]">
                  <CartModal
                    itemsArray={mintingCart}
                    itemSum={cartTotal}
                    isMintModal={isMintModal}
                    paymentTokenSymbol={paymentTokenSymbol}
                    userBalance={userBalance}
                    emptyCart={emptyCart}
                    isMysteryMint={isMysteryMint}
                  />
                  <div className="space-y-4 mt-3 space-x-1">
                    <button
                      onClick={() => autoMint(5)}
                      className="font-bold text-xl text-white border-4 px-6 border-solid bg-gradient-to-br border-violet-700 from-violet-500 to-purple-600 rounded-2xl p-3"
                    >
                      Mystery 5 pack 🤔
                    </button>
                    <button 
                      onClick={() => autoMint(10)}
                      className="font-bold text-xl text-white border-4 px-6 border-solid bg-gradient-to-br border-violet-700 from-violet-500 to-purple-600 rounded-2xl p-3">
                      Mystery 10 pack ✨
                    </button>
                    <button 
                      onClick={() => autoMint(uniqueTokens)}
                      className="font-bold text-xl text-white border-4 px-6 border-solid bg-gradient-to-br border-violet-700 from-violet-500 to-purple-600 rounded-2xl p-3">
                      GIMME 'EM ALL 🤩
                    </button>
                  </div>
                </div>
                    }
              </>
            )}
            {nftData && nftData.length !== 0 && isAccountConnected ? (
              <div className="grid xl:grid-cols-2 grid-cols-1 gap-2 lg:gap-x-6 sm:max-w-[50%]  xl:max-w-[66%] ">
               {Array.from({ length: nftData.length }).map((_, i) => (
                // console.log('nft data', nftData[i], i),
                  <NFTCard
                    contractProps={contractProps}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    key={i}
                    tokenId={i+1}
                    paymentTokenSymbol={paymentTokenSymbol}
                    owned={tokensOwnedParsed?.includes(i + 1)}
                    name={nftData[i]?.name}
                    description={nftData[i]?.description as string}
                    image={nftData[i]?.image as string}
                    price={nftData[i].tokenPrice}
                    setIsMysteryMint={setIsMysteryMint}
                    isMysteryMint={isMysteryMint}
                    emptyCart={emptyCart}
                  />
                ))}
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        {renderWrongNetwork && (
          <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="rise-up">
              <WrongNetwork isRightNetwork={correctNetwork} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Store
