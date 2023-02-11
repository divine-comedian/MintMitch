import image from '../images/Favicon.png'
import React, { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';


export const NFTCard = () => { 
    
    return (
    <div className="nftFrame">
        <h2>Some placeholder title</h2>
        <Image alt="some text here" src={image} />
        <p>Why not a short description</p>
        <p>0.05 ETH</p>
        
        <button >Mint</button> : <p>token has already been minted!</p>
    
        <button >Get token Info</button>
        <p>The selected token price is  and it's URI is </p>
    </div>
)
    };