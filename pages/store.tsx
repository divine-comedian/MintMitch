import React from 'react';
import { NFTCard } from '../components/NFTCard';
import Navbar from '../components/navbar';
import { useUniqueTokens } from '../utils/ContractHelper';
import { useState, useEffect } from 'react';
import { CartModal } from '../components/cartModal';

interface Item {
    tokenID: number;
    tokenName: any;
    tokenPrice: string;
}

 const Store = () =>  {   
    const [mintingCart, setMintingCart] = useState<Item[]>([]);
    const [uniqueTokens, setUniqueTokens] = useState(0)
    const [nftCards, setNftCards] = useState([]) as [any, any]
   
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
        <div>
            <Navbar />
            <div className='bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]'>
            <div className="p-4">
            <div className="fixed float-right z-40 top-30 right-10 mr-5">
            <CartModal itemsArray={mintingCart} itemSum={cartTotal}  />
            </div>
            <h1 className="headingOne">Here's the goods!</h1>
            
            {nftCards ? <div className="flex-initial grid xl:grid-cols-2 grid-cols-1  gap-2 max-w-[66.67%] ">{nftCards}</div> : <p>Loading...</p>}
            </div>
        </div>
        </div>
    ) 
}

export default Store;
