import React, { useCallback } from 'react'
import { NFTCard } from '../components/NFTCard'
import Navbar from '../components/navbar'
import { selectContractAddress } from '../utils/ContractHelper'
import { useState, useEffect, useReducer } from 'react'
import { CartModal } from '../components/cartModal'
import { WrongNetwork } from '../components/wrongNetwork'
import { MintModal } from '../components/mint'
import Head from 'next/head'
import { checkNetwork } from '../utils/checkNetwork'
import { MintingContractProps, getNativeBalance, getPaymentTokenBalance } from '../utils/ContractHelper'
import { useNetwork, useContractRead, useAccount } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinterSupply.sol/MitchMinter.json'
import { fetchToken } from '@wagmi/core'
import { constants } from '../utils/constants'
import { BigNumber } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface Item {
  tokenID: number
  tokenName: any
  tokenPrice: string
}

const Store = () => {
  const [updateBalance, setUpdateBalance] = useState<any>()
  const [isRightNetwork, setisRightNetwork] = useState<boolean | undefined>(undefined)
  const [showMintModal, setShowMintModal] = React.useState(false)
  const [mintingCart, setMintingCart] = useState<Item[]>([])
  const [uniqueTokens, setUniqueTokens] = useState(0)
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null)
  const [nftCards, dispatch] = useReducer(nftCardsReducer, [])
  const [userBalance, setUserBalance] = useState<BigNumber>(BigNumber.from(0))
  const [contractProps, setContractProps] = useState<MintingContractProps>({
    address: constants.GOERLI_CONTRACT_ADDRESS,
    chainId: 5,
  })
  const [paymentTokenAddress, setPaymentTokenAddress] = useState<string>('')
  const [paymentTokenSymbol, setPaymentTokenSymbol] = useState<string>('ETH')
  const currentNetwork = useNetwork().chain?.network as string
  const account = useAccount().address

  function nftCardsReducer(state: any, action: any) {
    switch (action.type) {
      case 'SET_CARDS':
        return Array.from({ length: action.uniqueTokens }).map((_, i) => (
          <NFTCard
            contractProps={action.contractProps}
            addToCart={action.addToCart}
            removeFromCart={action.removeFromCart}
            key={i}
            tokenId={i + 1}
            paymentTokenSymbol={action.paymentTokenSymbol}
          />
        ))
      default:
        throw new Error(`Unsupported action type: ${action.type}`)
    }
  }

  const {
    data: isNativeMinting,
    isSuccess: isNativeMintingSuccess,
    isError: isNativeMintingError,
    error: isNativeMintingErrorInfo,
  } = useContractRead({
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

  const isMintModal = (state: boolean) => {
    setShowMintModal(state)
  }

  const addToCart = useCallback((item: Item) => {
    setMintingCart((prevMintingCart) => [...prevMintingCart, item])
  }, [])

  const removeFromCart = useCallback((item: Item) => {
    setMintingCart((prevMintingCart) => prevMintingCart.filter((i) => i.tokenID !== item.tokenID))
  }, [])

  // welcome to the use effect jungle

  useEffect(() => {
    const [isRightNetworkBoolean, connectedNetworkArray] = checkNetwork(currentNetwork) as Array<any>
    setisRightNetwork(isRightNetworkBoolean)
    setCorrectNetwork(connectedNetworkArray)
    setContractProps(selectContractAddress(currentNetwork))
  }, [currentNetwork])

  useEffect(() => {
    console.log(paymentTokenAddressData)
    console.log(isNativeMinting)
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
      if (isNativeMinting === true && account) {
        getNativeBalance(accountAddress.substring(2)).then((balance) => setUserBalance(balance))
      } else if (isNativeMinting === false && account) {
        getPaymentTokenBalance(accountAddress.substring(2), contractProps).then((balance) =>
          setUserBalance(balance as BigNumber),
        )
      }
    }
    if (account) {
      getUserBalance(account)
    }
  }, [isNativeMinting, account, contractProps])

  useEffect(() => {
    if (newUniqueTokens !== undefined) {
      setUniqueTokens(newUniqueTokens as number)
    } else if (isUniqueTokensError) {
      console.log(uniqueTokensError)
    }
  }, [newUniqueTokens, contractProps])

  useEffect(() => {
    if (currentNetwork !== undefined) {
      dispatch({
        type: 'SET_CARDS',
        uniqueTokens: uniqueTokens,
        contractProps: contractProps,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        paymentTokenSymbol: paymentTokenSymbol,
      })
    }
  }, [uniqueTokens, currentNetwork, contractProps, paymentTokenSymbol])

  const cartTotal = mintingCart.reduce((acc, item) => acc + parseFloat(item.tokenPrice), 0)
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
        <Navbar isRightNetwork={isRightNetwork} contractProps={contractProps} updateBalance={updateBalance} />
        {showMintModal ? (
          <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="rise-up">
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
                {isNativeMinting && isNativeMintingSuccess ? (
                  <b>ETH</b>
                ) : (
                  <a
                    className="text-purple-600"
                    href={contractProps.dexLink + '0x' + paymentTokenAddress.substring(2)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b>{paymentTokenSymbol}</b>
                  </a>
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
            {currentNetwork === undefined ? (
              <div className="font-medium bg-white/30 dark:bg-black/30 lg:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
                <h3 className="text-md font-semibold">Connect with your web3 wallet to mint some Mitch!</h3>
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
                <div className="lg:fixed lg:float-right z-20 lg:top-40 right-10 mr-5 xl:max-w-[26%]">
                  <CartModal
                    itemsArray={mintingCart}
                    itemSum={cartTotal}
                    isMintModal={isMintModal}
                    paymentTokenSymbol={paymentTokenSymbol}
                    userBalance={userBalance}
                  />
                </div>
              </>
            )}
            {nftCards ? (
              <div className="flex-initial grid xl:grid-cols-2 grid-cols-1 gap-2 gap-x-6 sm:max-w-[50%] xl:max-w-[66%] ">
                {nftCards}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {!currentNetwork || isRightNetwork ? null : (
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
