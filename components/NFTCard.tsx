import Image from 'next/image'
import { MintingContractProps } from '../utils/ContractHelper'
import { useParseIpfsData, useParseIpfsImage } from '../utils/AxiosHelper'
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { formatEther } from 'ethers/lib/utils.js'

interface NFTCardProps {
  tokenId: number
  addToCart: Function
  removeFromCart: Function
  contractProps: MintingContractProps
  paymentTokenSymbol: string
}

export const NFTCard: React.FC<NFTCardProps> = ({ tokenId, addToCart, removeFromCart, contractProps, paymentTokenSymbol }) => {
  const [ipfsData, setIpfsData] = useState({}) as any
  const [ipfsImage, setIpfsImage] = useState() as any
  const [tokenPrice, setTokenPrice] = useState(0)
  const [tokenURI, setTokenURI] = useState('')
  const [isInCart, setIsInCart] = useState<boolean>(false)
  const [showFadeText, setShowFadeText] = useState(false)
  const [randomMsg, setRandomMsg] = useState('')
  const [toggleText, setToggleText] = useState(false)
  const [tokenSymbol, setTokenSymbol] = useState('ETH')

  const handleToggle = () => {
    setToggleText(!toggleText)
  }
  
  const newIpfsImage = useParseIpfsImage(tokenId, contractProps)
  const newIpfsData = useParseIpfsData(tokenId, contractProps)

  const tokenName = ipfsData.name
  const tokenDescription = ipfsData.description
  const tokenID = tokenId
  
  const showFadeInOutText = () => {
    setShowFadeText(true)
    setTimeout(() => {
      setShowFadeText(false)
    }, 500) // Adjust the duration as needed (in milliseconds)
  }

  const handleCart = () => {
    setIsInCart((prevIsInCart) => !prevIsInCart)
    setRandomMsg(randomMessage())

    if (!isInCart) {
      addToCart({ tokenID, tokenName, tokenPrice })
      showFadeInOutText()
    } else {
      removeFromCart({ tokenID, tokenName, tokenPrice })
    }
  }

  const randomMessage = () => {
    const messages = [
      'Nice!',
      'Fresh.',
      'WOW!',
      'Sweet!',
      'Awesome!',
      'Rad!',
      'You da best!',
      'Hell Yeah!',
      'Magnificient!',
      'Godlike!',
    ]
    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex]
  }


  const {
    data: tokenInfo,
    isError: isTokenInfoError,
    error: tokenInfoError,
  } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'getTokenInfo',
    args: [tokenId],
    chainId: contractProps.chainId,
  })

  

  useEffect(() => {
    if (tokenInfo) {
      const [newTokenPriceHex, newTokenURI] = tokenInfo as [string, string]
      const newTokenPrice = parseFloat(formatEther(newTokenPriceHex))
      setTokenPrice(newTokenPrice)
      setTokenURI(newTokenURI)
    } else if (isTokenInfoError) {
      console.log(tokenInfoError)
    }
  }, [tokenInfo, isTokenInfoError])
  
  useEffect(() => {
    setIpfsData(newIpfsData)
    setIpfsImage(newIpfsImage)
  }, [newIpfsData, newIpfsImage])
  
  useEffect(() => {
    setTokenSymbol(paymentTokenSymbol)
  }, [paymentTokenSymbol])
 

  return (
    <div
      className={`shadow-2xl container bg-gray-400/30 dark:bg-gray-700/30 rounded-lg border-grey-600 transition-max-height duration-200 ease-in-out ${
        toggleText ? 'max-h-[770px]' : 'max-h-[540px]'
      }`}
    >
      <div className="p-3 space-y-2">
        <h2 className="text-xl font-bold py-2">{tokenName}</h2>
        <div className="flex justify-center mr-5 py-3">
          {ipfsImage ? <Image alt="some text here" src={ipfsImage} width={320} height={320} /> : <div>Loading...</div>}
        </div>
        <div>
          <span className="p-2">? -&gt;</span>
          <label className="switch">
            <input type="checkbox" onClick={handleToggle} />
            <span className="slider round"></span>
          </label>
        </div>
        {toggleText ? <p className="font-300 bg-gray-200/30 p-2 rounded-lg">{tokenDescription}</p> : null}
        <p>{tokenPrice}{' '}{tokenSymbol}</p>
        <div className="pb-3">
          <div className="rounded-lg p-2 bg-orange-300/50 dark:bg-orange-400/50 inline mr-2 text-lg">
            <span>Pick Me! 👉</span>
            <input
              className="mx-2 mb-1 accent-orange-300"
              onChange={handleCart}
              type="checkbox"
              id="mint"
              name="mint"
              value="mint"
            />
          </div>
          <span
            className={`transition-opacity duration-300 ease-in-out font-bold italic text-2xl text-border ${
              showFadeText ? 'opacity-400' : 'opacity-0'
            }`}
          >
            {isInCart ? randomMsg : 'Aww...'}
          </span>
        </div>
      </div>
    </div>
  )
}
