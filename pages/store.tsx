import React, { useCallback } from 'react'
import { NFTCard } from '../components/NFTCard'
import Navbar from '../components/navbar'
import { selectContractAddress } from '../utils/ContractHelper'
import { useState, useEffect } from 'react'
import { CartModal } from '../components/cartModal'
import { WrongNetwork } from '../components/wrongNetwork'
import { MintModal } from '../components/mint'
import Head from 'next/head'
import { checkNetwork } from '../utils/checkNetwork'
import { MintingContractProps } from '../utils/ContractHelper'
import { useNetwork, useContractRead } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { fetchToken } from '@wagmi/core'
import { constants } from '../utils/constants'

interface Item {
  tokenID: number
  tokenName: any
  tokenPrice: string
}

const Store = () => {
  const [rightNetwork, setRightNetwork] = useState<boolean | undefined>(undefined)
  const [showMintModal, setShowMintModal] = React.useState(false)
  const [isNativeMint, setIsNativeMint] = useState(false)
  const [mintingCart, setMintingCart] = useState<Item[]>([])
  const [uniqueTokens, setUniqueTokens] = useState(0)
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null)
  const [nftCards, setNftCards] = useState([]) as [any, any]
  const [network, setNetwork] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_NETWORK as string)
  const [contractProps, setContractProps] = useState<MintingContractProps>({
    address: constants.GOERLI_CONTRACT_ADDRESS,
    chainId: 5,
  })
  const [paymentTokenAddress, setPaymentTokenAddress] = useState<string>('')
  const [paymentTokenSymbol, setPaymentTokenSymbol] = useState<string>('')
  const currentNetwork = useNetwork().chain?.network as string
  const { data: isNativeMinting } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'nativeMintEnabled',
    args: [],
    chainId: contractProps.chainId,
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
    functionName: 'getUniqueTokens',
    chainId: contractProps.chainId,
    args: [],
  })

  // welcome to the use effect jungle
  useEffect(() => {
    if (isPaymentTokenAddressSuccess) {
      fetchToken({
        address: `0x${(paymentTokenAddressData as string).substring(2)}`,
        chainId: contractProps.chainId,
      }).then((response) => {
        setPaymentTokenSymbol(response.symbol)
        console.log(response.symbol)
      })
      setPaymentTokenAddress(paymentTokenAddressData as string)
    } else if (isPaymentTokenAddressError) {
      console.log(paymentTokenAddressError)
    }
  }, [paymentTokenAddressData])

  useEffect(() => {
    if (isNativeMinting) {
      setIsNativeMint(isNativeMinting as boolean)
    }
  }, [isNativeMinting])
  useEffect(() => {
    if (newUniqueTokens !== undefined) {
      setUniqueTokens(newUniqueTokens as number)
    } else if (isUniqueTokensError) {
      console.log(uniqueTokensError)
    }
  }, [newUniqueTokens, contractProps])

  useEffect(() => {
    if (currentNetwork !== undefined) {
      setNftCards(
        Array.from({ length: uniqueTokens }).map((_, i) => (
          <NFTCard
            contractProps={contractProps}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            key={i}
            tokenId={i + 1}
          />
        )),
      )
    }
  }, [uniqueTokens, contractProps])

  useEffect(() => {
    setNetwork(currentNetwork)
    console.log(currentNetwork)
  }, [currentNetwork])

  useEffect(() => {
    const [rightNetworkBoolean, connectedNetworkArray] = checkNetwork(currentNetwork) as Array<any>
    setRightNetwork(rightNetworkBoolean)
    setCorrectNetwork(connectedNetworkArray)
    setContractProps(selectContractAddress(currentNetwork))
  }, [currentNetwork])

  const MintingInfo = (props: MintingContractProps) => {
    let message: any
    switch (props.chainId) {
      case 5:
        message = (
          <div>
            You are currently connected to {props.name}, you'll need a bit of{' '}
            <a
              className="text-purple-600"
              href={contractProps.explorerLink + 'token/0x' + paymentTokenAddress}
              target="_blank"
              rel="noopener noreferrer"
            >
              {paymentTokenSymbol}
            </a>{' '}
            to mint a Mitch.
          </div>
        )
      case 137:
        return (
          <div>
            You can Mint any Mitchs you like on Gnosis Chain, Optimism and Polygon! You are currently connected to{' '}
            {props.name}, you'll need a bit of{' '}
            <a
              className="text-purple-600"
              href={contractProps.explorerLink + 'token/0x' + paymentTokenAddress}
              target="_blank"
              rel="noopener noreferrer"
            >
              {paymentTokenSymbol}
            </a>{' '}
            to mint a Mitch.
          </div>
        )
    }
    return message
  }

  const cartItems = Array.from(mintingCart).map((item) => (
    <li key={item.tokenID}>
      {' '}
      {item.tokenName} {item.tokenPrice}
    </li>
  ))
  const cartTotal = mintingCart.reduce((acc, item) => acc + parseFloat(item.tokenPrice), 0)
  return (
    <>
      <Head>
        <title>Mint Mitch | Store</title>
        <meta
          name="This is the page to see all the mitches"
          content="Find all you favourite mitches here and mint them"
        />
        {/* Add other metadata as needed */}
      </Head>
      <div>
        <Navbar isRightNetwork={rightNetwork} contractProps={contractProps} />
        {showMintModal ? (
          <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="rise-up">
              <MintModal
                itemSum={cartTotal}
                itemsArray={mintingCart}
                isMintModal={isMintModal}
                isNativeMintEnabled={isNativeMint}
                contractProps={contractProps}
              />
            </div>
          </div>
        ) : null}

        <div className="bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]">
          <div className="p-4">
            <div className="font-medium bg-white/30 dark:bg-black/30 lg:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
              <h1 className="text-3xl font-bold my-3">Here's the goods! Take your picks.</h1>
              <p>You can Mint any Mitchs you like on Gnosis Chain, Optimism and Polygon!</p>
              <p>
                You are currently connected to <b>{contractProps.name}</b>,{' '}
                {isNativeMint ? (
                  <span>So you'll need a bit of ETH to mint some Mitchs.</span>
                ) : (
                  <span>
                    so you'll need a bit of{' '}
                    <a
                      className="text-purple-600"
                      href={contractProps.explorerLink + 'token/0x' + paymentTokenAddress.substring(2)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{paymentTokenSymbol}</b>
                    </a>{' '}
                    to mint a Mitch.
                  </span>
                )}
              </p>
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
            <div className="lg:fixed lg:float-right z-20 lg:top-40 right-10 mr-5 xl:max-w-[26%]">
              <CartModal itemsArray={mintingCart} itemSum={cartTotal} isMintModal={isMintModal} />
            </div>
            {nftCards ? (
              <div className="flex-initial grid xl:grid-cols-2 grid-cols-1 gap-2 gap-x-6 sm:max-w-[50%] xl:max-w-[66%] ">
                {nftCards}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {!network || rightNetwork ? null : (
          <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="rise-up">
              <WrongNetwork rightNetwork={correctNetwork} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Store
