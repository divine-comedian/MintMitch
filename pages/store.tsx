import React from 'react';
import { NFTCard } from '../components/NFTCard';
import Navbar from '../components/navbar';
import { useUniqueTokens } from '../utils/ContractHelper';
import { useState, useEffect } from 'react';
import { CartModal } from '../components/cartModal';
import { getNetwork } from '@wagmi/core';
import { WrongNetwork } from '../components/wrongNetwork';
import { MintModal } from '../components/mint';
import Head from 'next/head';

interface Item {
    tokenID: number;
    tokenName: any;
    tokenPrice: string;
}

 const Store = () =>  { 
    const [correctNetwork, setCorrectNetwork] = useState<string | null>(null);
  const [rightNetwork, setRightNetwork] = useState<boolean | null>(null);
  const [showMintModal, setShowMintModal] = React.useState(false);

  
  const [network, setNetwork] = useState(getNetwork().chain?.network);
  const checkNetwork = () => {
  if (process.env.NODE_ENV === 'development' && network === 'goerli') {
    setRightNetwork(true);
  } else if (process.env.NODE_ENV === 'production' && network === 'polygon') {
    setRightNetwork(true);
  } else if (process.env.NODE_ENV === 'development' && network !== 'goerli') { 
    setRightNetwork(false);
    console.log('Wrong network')
     setCorrectNetwork("Goerli")
  }
    else if (process.env.NODE_ENV === 'production' && network !== 'polygon') {
      setRightNetwork(false);
      console.log('Wrong network')
      setCorrectNetwork("Polygon")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentNetwork = getNetwork().chain?.network;
      setNetwork(currentNetwork);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkNetwork();
  }, [network]);

    const [mintingCart, setMintingCart] = useState<Item[]>([]);
    const [uniqueTokens, setUniqueTokens] = useState(0)
    const [nftCards, setNftCards] = useState([]) as [any, any]
   
  const isMintModal = (state: boolean) => {
    setShowMintModal(state);
  }

    const addToCart = (item: Item) => {
        setMintingCart((mintingCart) => [...mintingCart, item])
    }

    const removeFromCart = (item: Item) => {
        setMintingCart(mintingCart.filter(i => i.tokenID !== item.tokenID))
    }

    const uniqueTokensPromise = useUniqueTokens()
    useEffect (() => { 
        setUniqueTokens(uniqueTokensPromise)
        setNftCards(Array.from({ length: uniqueTokensPromise})
        .map((_, i) => <NFTCard addToCart={addToCart} 
        removeFromCart={removeFromCart} key={i} tokenId={(i + 1)} />))
    }, [uniqueTokensPromise, mintingCart])
      const cartItems = Array.from(mintingCart).map((item) => <li key={item.tokenID}> {item.tokenName} {item.tokenPrice}</li>)
      const cartTotal = mintingCart.reduce((acc, item) => acc + parseFloat(item.tokenPrice), 0)
    return (
      <>
      <Head>
        <title>Mint Mitch | Store</title>
        <meta name="This is the page to see all the mitches" content="Your custom description goes here" />
        {/* Add other metadata as needed */}
      </Head>
        <div>
            <Navbar />
            { showMintModal ? <div className='fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-40'>
            <div className="rise-up">
               <MintModal  itemSum={cartTotal} itemsArray={mintingCart} isMintModal={isMintModal} /> 
               </div>
               </div> : null }
        { rightNetwork ? 
            <div className='bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]'>
            <div className="p-4">
            <div className="font-medium bg-white/30 dark:bg-black/30 sm:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
            <h1 className="text-3xl font-bold my-3">Here's the goods! Take your picks.</h1>
            <p>All Mitchs are minted on Polygon as NFTs, and can be bought with a bit of <a className='text-purple-600' href="https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619" target="_blank" rel='noopener noreferrer'>WETH</a>.</p>
            <h3 className='text-lg font-semibold'>Don't see a Mitch you like, or have a special request for a Mitch Pin NFT?</h3>  <p>Send an email to <a className='text-purple-600 hover:text-purple-700 font-bold' href="mailto:mitch@mintmitch.xyz?subject=Request-A-Mitch">mitch@mintmitch.xyz</a> to Request-a-Mitch, and let's see what kinda magic we can make happen! 🪄 </p>
            </div>
            <div className="lg:fixed lg:float-right z-30 lg:top-40 right-10 mr-5 xl:max-w-[26%]">
            <CartModal itemsArray={mintingCart} itemSum={cartTotal} isMintModal={isMintModal}  />
            </div>
            {nftCards ? <div className="flex-initial grid xl:grid-cols-2 grid-cols-1  gap-2 gap-x-6 sm:max-w-[50%] xl:max-w-[66%] ">{nftCards}</div> : <p>Loading...</p>}
            </div>
        </div>
        : <WrongNetwork rightNetwork={correctNetwork} /> }
        </div>
        </>
    ) 
}

export default Store;
