import React from 'react';
import { NFTCard } from '../components/NFTCard';
import Navbar from '../components/navbar';


export const Store = () =>  {    
    return (
        
        <div className="container">
            <Navbar />
        <h1 className="headingOne">Here's the goods!</h1>
        <NFTCard />
        </div>
        )  
        

    
}

export default Store;