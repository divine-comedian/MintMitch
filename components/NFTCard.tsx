import image from '../images/Favicon.png'
import Image from 'next/image';
import { useTokenInfo } from '../utils/ContractHelper';
import { ethers, BigNumber } from 'ethers';
import { useParseIPFS } from '../utils/IPFShelper';
import { useParseIpfsData, useParseIpfsImage } from '../utils/AxiosHelper';

export const NFTCard = () => {

    let tokenPriceHex: BigNumber | unknown = 0;
    let tokenURI: string | unknown = '';
    let tokenPrice: Number | unknown;
    let tokenData: object;
    // get token info and URI
    const tokenInfo = useTokenInfo(1);
    if (tokenInfo) {
      [tokenPriceHex, tokenURI] = tokenInfo as [BigNumber, string];
    }
   
    if (typeof tokenPriceHex === 'bigint'){
    tokenPrice = ethers.utils.formatEther(tokenPriceHex)
    }
    
    tokenData = useParseIpfsData(1)
    const tokenImage = useParseIpfsImage(1)
    console.log(tokenData.description)
    console.log(tokenImage)
   // console.log(tokenPrice);
   // console.log(tokenURI);
     
    return (
    <div className="nftFrame">
        <h2>{tokenData.name ? tokenData.name : 'Loading...'}</h2>
        <Image alt="some text here" src={image} />
        <p>Why not a short description</p>
        <p>{tokenPrice} ETH</p>
        <img src={tokenImage} alt="why not" />
        <button >Mint</button> : <p>token has already been minted!</p>
    
        <button >Get token Info</button>
        <p>The selected token price is  and it's URI is {} </p>
    </div>
)
    };