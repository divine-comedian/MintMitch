import image from '../images/Favicon.png'
import Image from 'next/image';
import { useTokenInfo } from '../utils/ContractHelper';
import { ethers, BigNumber } from 'ethers';
import { useParseIpfsData, useParseIpfsImage } from '../utils/AxiosHelper';
import { useState, useEffect } from 'react';


interface NFTCardProps { 
    tokenId: number;
    addToCart: Function,
    removeFromCart: Function;
}

export const NFTCard: React.FC<NFTCardProps> = ({tokenId, addToCart, removeFromCart} ) => {
    
    const [ipfsData, setIpfsData] = useState({}) as any;
    const [ipfsImage, setIpfsImage] = useState() as any;
    const [tokenPrice, tokenURI] = useTokenInfo(tokenId) as [number, string]
    const [isInCart, setIsInCart] = useState(false) as [boolean, any]
    const [showFadeText, setShowFadeText] = useState(false);
    const [randomMsg, setRandomMsg] = useState('');


    const newIpfsImage = useParseIpfsImage(tokenId)
    const newIpfsData = useParseIpfsData(tokenId)

    const tokenName = ipfsData.name
    const tokenDescription = ipfsData.description
    const tokenID = tokenId
    const showFadeInOutText = () => {
        setShowFadeText(true);
        setTimeout(() => {
            setShowFadeText(false);
        }, 500); // Adjust the duration as needed (in milliseconds)
    };
    


    useEffect(() => {
         setIpfsData(newIpfsData)
         setIpfsImage(newIpfsImage)
    }, [newIpfsData, newIpfsImage])

    const handleCart = () => { 
        setIsInCart(!isInCart)
        setRandomMsg(randomMessage())
        if (!isInCart) {
           addToCart({tokenID, tokenName, tokenPrice}) 
           showFadeInOutText()
    }
        else {
            removeFromCart({tokenID, tokenName, tokenPrice})
        }
}

    const randomMessage = () => {
        const messages = ['Nice!', 'WOW!', 'Sweet!', 'Awesome!', 'Rad!', 'You da best!', 'Yes!', 'Magnificient!', 'Godlike!']
        const randomIndex = Math.floor(Math.random() * messages.length)
        return messages[randomIndex]
    }
    
    return (
    <div className="shadow-lg  container border-solid bg-[#ffb627] dark:bg-[#3C096C] border-2 rounded-lg border-grey-600">
        <div className="p-3 space-y-2">
        <h2 className="text-lg font-bold py-2">{tokenName}</h2>
        <div className='flex justify-center mr-5 py-3'>
        {ipfsImage ? <Image alt="some text here" src={ipfsImage} width={250} height={250} /> : <div>Loading...</div>}
        </div>
        <p>{tokenDescription}</p>
        <p>{`${tokenPrice} ETH`}</p>
        <div>
        <span>Add to Cart?</span>
        <input className="mx-2 mb-1" onChange={handleCart} type="checkbox" id="mint" name="mint" value="mint" />
        <span
    className={`transition-opacity duration-300 ease-in-out font-bold italic text-2xl text-border ${
        showFadeText ? 'opacity-100' : 'opacity-0'
    }`}
>
  {isInCart ? randomMsg : "Aww..."}
</span>

        </div>
        </div>
    </div>
)
    };