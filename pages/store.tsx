import React, { useCallback } from 'react';
import { NFTCard } from '../components/NFTCard';
import Navbar from '../components/navbar';
import { useUniqueTokens, useIfNativeTokenMinting, getUniqueTokens, getIsNativeMinting, selectContractAddress } from '../utils/ContractHelper';
import { useState, useEffect } from 'react';
import { CartModal } from '../components/cartModal';
import { getNetwork } from '@wagmi/core';
import { WrongNetwork } from '../components/wrongNetwork';
import { MintModal } from '../components/mint';
import Head from 'next/head';
import { checkNetwork } from '../utils/checkNetwork';
import { MintingContractProps } from '../utils/ContractHelper';
import { useNetwork } from 'wagmi';

interface Item {
    tokenID: number;
    tokenName: any;
    tokenPrice: string;
}

 const Store = () =>  { 
  const [rightNetwork, setRightNetwork] = useState<boolean | undefined>(undefined);
  const [showMintModal, setShowMintModal] = React.useState(false);
  const [isNativeMint, setIsNativeMint] = useState(false);
  const [mintingCart, setMintingCart] = useState<Item[]>([]);
  const [uniqueTokens, setUniqueTokens] = useState(0)
  const [correctNetwork, setCorrectNetwork] = useState<string[] | null>(null);
  const [nftCards, setNftCards] = useState([]) as [any, any]
  const [network, setNetwork] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_NETWORK as string);
  const [contractProps, setContractProps] = useState<MintingContractProps>({ address: process.env.CONTRACT_ADDRESS as string, chainId: 5});

  const currentNetwork = useNetwork().chain?.network as string;
  
  useEffect(() => {
    setNetwork(currentNetwork);
    console.log(currentNetwork);
  }, [currentNetwork]);

  useEffect(() => {
    const [rightNetworkBoolean, connectedNetworkArray] = checkNetwork(network) as Array<any>;
    setRightNetwork(rightNetworkBoolean);
     setCorrectNetwork(connectedNetworkArray);
     setContractProps(selectContractAddress(network));
   }, [network]);

  useEffect(() => {
    getIsNativeMinting(contractProps).then((nativeMintBoolean) => {
      nativeMintBoolean = nativeMintBoolean as boolean;
    setIsNativeMint(nativeMintBoolean)
  })}, [isNativeMint, contractProps])


  const isMintModal = (state: boolean) => {
    setShowMintModal(state);
  }

    const addToCart = useCallback((item: Item) => {
        setMintingCart((mintingCart) => [...mintingCart, item])
    }, [])

    const removeFromCart = useCallback((item: Item) => {
        setMintingCart(mintingCart.filter(i => i.tokenID !== item.tokenID))
    }, [])

    useEffect (() => { 
        getUniqueTokens(contractProps).then((response) => {
          
        setUniqueTokens(uniqueTokens)
        setNftCards(Array.from({ length: uniqueTokens})
        .map((_, i) => <NFTCard contractProps={contractProps} addToCart={addToCart} 
        removeFromCart={removeFromCart} key={i} tokenId={(i + 1)} />))
    }) }, [contractProps])

      const cartItems = Array.from(mintingCart).map((item) => <li key={item.tokenID}> {item.tokenName} {item.tokenPrice}</li>)
      const cartTotal = mintingCart.reduce((acc, item) => acc + parseFloat(item.tokenPrice), 0)
    return (
      <>
      <Head>
        <title>Mint Mitch | Store</title>
        <meta name="This is the page to see all the mitches" content="Find all you favourite mitches here and mint them" />
        {/* Add other metadata as needed */}
      </Head>
        <div>
        <Navbar isRightNetwork={rightNetwork} contractProps={contractProps} />
            { showMintModal ? 
            <div className='fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40'>
            <div className="rise-up">
               <MintModal  itemSum={cartTotal} itemsArray={mintingCart} isMintModal={isMintModal} isNativeMintEnabled={isNativeMint} contractProps={contractProps} /> 
               </div>
               </div> : null }
        
            <div className='bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]'>
            <div className="p-4">
            <div className="font-medium bg-white/30 dark:bg-black/30 lg:max-w-[50%] xl:max-w-[66%] p-5 rounded-2xl mb-5 space-y-2">
            <h1 className="text-3xl font-bold my-3">Here's the goods! Take your picks.</h1>
            <p>All Mitchs are minted on Polygon as NFTs, and can be bought with a bit of <a className='text-purple-600' href="https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619" target="_blank" rel='noopener noreferrer'>WETH</a>.</p>
            <h3 className='text-lg font-semibold'>Don't see a Mitch you like, or have a special request for a Mitch Pin NFT?</h3>  <p>Send an email to <a className='text-purple-600 hover:text-purple-700 font-bold' href="mailto:mitch@mintmitch.xyz?subject=Request-A-Mitch">mitch@mintmitch.xyz</a> to Request-a-Mitch, and let's see what kinda magic we can make happen! 🪄 </p>
            </div>
            <div className="lg:fixed lg:float-right z-20 lg:top-40 right-10 mr-5 xl:max-w-[26%]">
            <CartModal itemsArray={mintingCart} itemSum={cartTotal} isMintModal={isMintModal}  />
            </div>
            {nftCards ? <div className="flex-initial grid xl:grid-cols-2 grid-cols-1 gap-2 gap-x-6 sm:max-w-[50%] xl:max-w-[66%] ">{nftCards}</div> : <p>Loading...</p>}
            </div>
        </div>
        {!network || rightNetwork ? null : 
          <div className='fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='rise-up'>
              <WrongNetwork rightNetwork={correctNetwork} />
                </div>
                  </div> }     
        </div>
        </>
    ) 
}

export default Store;
