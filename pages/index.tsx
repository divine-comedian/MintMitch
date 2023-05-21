import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import HomePage from './home'
import Navbar from '../components/navbar'
import React, { useEffect, useState } from 'react'
import { selectContractAddress, MintingContractProps } from '../utils/ContractHelper'
import { WrongNetwork } from '../components/wrongNetwork'
import { checkNetwork } from '../utils/checkNetwork'
import { useNetwork } from 'wagmi'
import { constants } from '../utils/constants'

const Home: NextPage = () => {
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null)
  const [rightNetwork, setRightNetwork] = useState<boolean | undefined>(undefined)
  const [network, setNetwork] = useState<string>('goerli')
  const [contractProps, setContractProps] = useState<MintingContractProps>({
    address: constants.GOERLI_CONTRACT_ADDRESS,
    chainId: 5,
  })

  const currentNetwork = useNetwork().chain?.network as string

  useEffect(() => {
    setNetwork(currentNetwork)
  }, [currentNetwork])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const currentNetwork = getNetwork().chain?.network as string;
  //     setNetwork(currentNetwork);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    setContractProps(selectContractAddress(network))
  }, [network])

  useEffect(() => {
    const [isRightNetwork, correctNetworkArray] = checkNetwork(network) as Array<any>
    setRightNetwork(isRightNetwork)
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
      <Navbar isRightNetwork={rightNetwork} contractProps={contractProps} />
      <HomePage />
      {!network || rightNetwork ? null : (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="rise-up">
            <WrongNetwork rightNetwork={correctNetwork} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
