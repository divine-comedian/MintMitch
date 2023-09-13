import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import HomePage from './home'
import Navbar from '../components/navbar'
import React, { useEffect, useState } from 'react'
import { WrongNetwork } from '../components/wrongNetwork'
import { checkNetwork } from '../utils/checkNetwork'
import { useNetwork } from 'wagmi'

const Home: NextPage = () => {
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null)
  const [isRightNetwork, setIsRightNetwork] = useState<boolean | undefined>(undefined)
  const [network, setNetwork] = useState<string>('goerli')
  // const [contractProps, setContractProps] = useState<MintingContractProps>({
  //   address: constants.GOERLI_CONTRACT_ADDRESS,
  //   chainId: 5,
  // })

  const currentNetwork = useNetwork().chain?.network as string

  // useEffect(() => {
  //   setNetwork(currentNetwork)
  // }, [currentNetwork])

  useEffect(() => {
    setNetwork(currentNetwork)
    // setContractProps(selectContractAddress(currentNetwork))
  }, [currentNetwork])

  useEffect(() => {
    const [isRightNetwork, correctNetworkArray] = checkNetwork(network) as Array<any>
    setIsRightNetwork(isRightNetwork)
    setCorrectNetwork(correctNetworkArray)
  }, [network])
  return (
    <div>
      <Head>
        <title>Mint Mitch | Home</title>
        <meta name="This is the place to mint your favourite Mitch!" content="" />
        <link rel="icon" href="/Favicon.ico" />
      </Head>
      <Toaster />
      <Navbar isRightNetwork={isRightNetwork} />
      <HomePage />
      {!network || isRightNetwork ? null : (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="rise-up">
            <WrongNetwork isRightNetwork={correctNetwork} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
