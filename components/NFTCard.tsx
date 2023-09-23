import Image from 'next/image'
import { MintingContractProps } from '../utils/ContractHelper'
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinterSupplyUpgradeable.sol/MitchMinter.json'
import { formatEther } from 'viem'
import { getIpfsImage } from '../utils/AxiosHelper'
import { nftData } from '../pages/store'


interface NFTCardProps {
  tokenId: number
  addToCart: Function
  removeFromCart: Function
  contractProps: MintingContractProps
  paymentTokenSymbol: string
  owned: boolean
  name: string,
  description: string,
  image: string,
  price: bigint,
  setIsMysteryMint: Function,
  isMysteryMint: boolean
  emptyCart: Function
}

export const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  addToCart,
  removeFromCart,
  contractProps,
  paymentTokenSymbol,
  owned,
  name,
  description,
  image,
  price,
  setIsMysteryMint,
  isMysteryMint,
  emptyCart
}) => {
  // const [ipfsData, setIpfsData] = useState({}) as any
  const [ipfsImage, setIpfsImage] = useState() as any
  // const [tokenPrice, setTokenPrice] = useState('0')
  const [nftData, setNftData] = useState<nftData>({} as nftData)
  const [isInCart, setIsInCart] = useState<boolean>(false)
  const [showFadeText, setShowFadeText] = useState(false)
  const [randomMsg, setRandomMsg] = useState('')
  const [toggleText, setToggleText] = useState(false)
  const [tokenSymbol, setTokenSymbol] = useState('ETH')
  const [remainingSupply, setRemainingSupply] = useState('')

  const handleToggle = () => {
    setToggleText(!toggleText)
  }

  const maxTokenSupply = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'maxTokenSupply',
    args: [tokenId],
    chainId: contractProps.chainId,
    enabled: false,
  })

  const totalSupply = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'totalSupply',
    args: [tokenId],
    chainId: contractProps.chainId,
    enabled: false,
  })

  useEffect(() => {
    setNftData({ name, description, image, tokenId, tokenPrice: price })
  }, [name, description, image, price])
  

  useEffect(() => {
    setTimeout(() => {
      maxTokenSupply.refetch()
      totalSupply.refetch()
    }, tokenId * 500)

    if (maxTokenSupply.data !== undefined && totalSupply.data !== undefined) {
      let remainingSupply: string
      const [maxSupplyHex, currentSupplyHex] = [maxTokenSupply.data, totalSupply.data] as [bigint, bigint]
      const maxSupply = parseFloat(formatEther(maxSupplyHex)) * 10 ** 18
      const currentSupply = parseFloat(formatEther(currentSupplyHex)) * 10 ** 18
      if (currentSupply === maxSupply) {
        remainingSupply = 'SOLD OUT'
      } else {
        remainingSupply = `${currentSupply}/${maxSupply} Minted`
      }
      setRemainingSupply(remainingSupply)
    } else if (maxTokenSupply.isError || totalSupply.isError) {
      console.log(maxTokenSupply?.error ?? totalSupply?.error)
    }
  }, [maxTokenSupply.data, totalSupply.data, totalSupply.isError, maxTokenSupply.isError])

  const showFadeInOutText = () => {
    setShowFadeText(true)
    setTimeout(() => {
      setShowFadeText(false)
    }, 500) // Adjust the duration as needed (in milliseconds)
  }

  const handleCart = () => {
    const {tokenId: id, name: name, tokenPrice: price } = nftData
    setIsInCart((prevIsInCart) => !prevIsInCart)
    setRandomMsg(randomMessage())
    if (isMysteryMint) {
      emptyCart()
      setIsMysteryMint(false);
    }

    if (!isInCart) {
      console.log('adding to cart', id, name, price)
      addToCart({ tokenId: id, name, tokenPrice: price })
      showFadeInOutText()
    } else {
      removeFromCart({ tokenId: id, name, tokenPrice: price})
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

  // const {
  //   data: tokenInfo,
  //   isError: isTokenInfoError,
  //   error: tokenInfoError,
  // } = useContractRead({
  //   address: `0x${contractProps.address}`,
  //   abi: MintingContractJSON.abi,
  //   functionName: 'getTokenInfo',
  //   args: [tokenId],
  //   chainId: contractProps.chainId,
  // })

  // useEffect(() => {
  //   if (tokenInfo) {
  //     const [newTokenPriceHex,] = tokenInfo as [bigint, string]
  //     setTokenPrice(newTokenPriceHex.toString())
  //   } else if (isTokenInfoError) {
  //     console.log(tokenInfoError)
  //   }
  // }, [tokenInfo, isTokenInfoError])

  // if (image && name && description && !ipfsImage) {
  //   getIpfsImage(image).then((res) => {
  //     setIpfsImage(res)
  //   }
  //   )
  // }

  useEffect(() => {
    if (image && !ipfsImage) {
      getIpfsImage(image).then((res) => {
        setIpfsImage(res)
      }
      )
    }
  },[image, ipfsImage, name, description])

  useEffect(() => {
    setTokenSymbol(paymentTokenSymbol)
  }, [paymentTokenSymbol])
  return (
    <div
      className={`shadow-2xl container bg-gray-400/30 dark:bg-gray-700/30 rounded-lg border-grey-600 transition-max-height duration-200 ease-in-out ${
        toggleText ? 'max-h-[770px]' : 'max-h-[620px]'
      }`}
    >
      <div className="p-3 space-y-2">
        <div>
          {owned ? (
            <p className="inline text-md font-bold text-green-700 bg-green-200 text-left p-1 rounded-lg border-solid border-4 border-green-600">
              OWNED ✅
            </p>
          ) : null}
          <p className="float-right text-md font-bold dark:text-orange-700 text-orange-800 mt-1 text-right">
            {remainingSupply}
          </p>
        </div>
        <h2 className="text-xl font-bold py-2">{name}</h2>
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
        {toggleText ? <p className="font-300 bg-gray-200/30 p-2 rounded-lg">{description}</p> : null}
        <p>
          {parseFloat(formatEther(BigInt(price)))} {tokenSymbol}
        </p>
        {remainingSupply !== 'SOLD OUT' && (
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
        )}
      </div>
    </div>
  )
}
