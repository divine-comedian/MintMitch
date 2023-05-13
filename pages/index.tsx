import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import HomePage from './home';
import Navbar from '../components/navbar'
import React, { useEffect, useState } from 'react';
import { selectContractAddress } from '../utils/ContractHelper';
import { getNetwork } from '@wagmi/core';
import { WrongNetwork } from '../components/wrongNetwork';
import { checkNetwork } from '../utils/checkNetwork';

 

const Home: NextPage = () => {
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null);
  const [rightNetwork, setRightNetwork] = useState<boolean | undefined>(undefined);
  const [network, setNetwork] = useState<string>("goerli");
  const [contractAddress, setContractAddress] = useState<string>(process.env.CONTRACT_ADDRESS as string);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNetwork = getNetwork().chain?.network as string;
      setNetwork(currentNetwork);
      console.log("this is the network", currentNetwork)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setContractAddress(prevContractAddress => {
      const newContractAddress = selectContractAddress(network);
      return newContractAddress;
    });
  }, [network]);


  useEffect(() => {
   const [isRightNetwork, correctNetworkArray] = checkNetwork(network) as Array<any>;
   setRightNetwork(isRightNetwork);
    setCorrectNetwork(correctNetworkArray);
    console.log("this is the correct network array",correctNetworkArray)
    console.log("this is the right network state", isRightNetwork)
    console.log("this is the network", network)
  }, [network]);
  return (
    <div>
      <Head>
        <title>Mint Mitch | Home</title>
        <meta name="This is the place to mint your favourite Mitch!" content="" />
        <link rel="icon" href="/Favicon.ico" />
      </Head>
      <Toaster /> 
      <Navbar isRightNetwork={rightNetwork} contractAddress={contractAddress}/>
      <HomePage/> 
      {!network || rightNetwork ? null : 
        <div className='fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-40'>
        <div className='rise-up'>
          <WrongNetwork rightNetwork={correctNetwork} />
          </div>
        </div>
      }     
    </div>
  )
}

export default Home;
