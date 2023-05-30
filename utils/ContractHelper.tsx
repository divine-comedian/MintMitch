import { erc20ABI } from 'wagmi';
import {prepareWriteContract, writeContract, fetchBalance, readContract,} from '@wagmi/core'
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
 import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { constants } from './constants';

export interface MintingContractProps {
    address: string;
    chainId?: number;
    explorerLink?: string;
    dexLink?: string;
    name?: string;
}

export const selectContractAddress = (network: string) => {
    let props: MintingContractProps
    if (process.env.NODE_ENV === 'development' && network === 'goerli') {
      props = {
        address: constants.GOERLI_CONTRACT_ADDRESS ,
        chainId: 5,
        explorerLink: constants.GOERLI_ETHERSCAN_URL ,
        dexLink: 'https://app.uniswap.org/#/swap?outputCurrency=',
        name: 'Goerli'
      }
      console.log("connected to", props.name)

        return props
    }
    else if (network === 'maticmum') {
      props = {
        address: constants.MUMBAI_CONTRACT_ADDRESS ,
        chainId: 80001,
        explorerLink: constants.NEXT_PUBLIC_MUMBAI_URL ,
        dexLink: 'https://app.uniswap.org/#/swap?outputCurrency=',
        name: 'Polygon Mumbai'

      }
      console.log("connected to", props.name)

        return props
    }   
    else if (process.env.NODE_ENV === 'development' && network === 'gnosis') {
      props = {
        address: constants.GNOSIS_TEST_CONTRACT_ADDRESS ,
        chainId: 100,
        explorerLink: constants.NEXT_PUBLIC_GNOSISSCAN_URL ,
        dexLink: 'https://swap.cow.fi/#/100/swap/XDAI/',
        name: 'Gnosis Chain'

      }
      console.log("connected to", props.name)

        return props
    }
    else if (process.env.NODE_ENV === 'production' && network === 'gnosis') {
      props = {
        address: constants.GNOSIS_PROD_CONTRACT ,
        chainId: 100,
        explorerLink: constants.NEXT_PUBLIC_GNOSISSCAN_URL ,
        dexLink: 'https://swap.cow.fi/#/100/swap/XDAI/',
        name: 'Gnosis Chain'
      }
        console.log("connected to", props.name)
        return props
    } else if (network === 'optimism') {
      props = {
        address: constants.OPTIMISM_CONTRACT_ADDRESS ,
        chainId: 10,
        explorerLink: constants.NEXT_PUBLIC_OPTIMISM_URL ,
        dexLink: 'https://app.uniswap.org/#/swap?outputCurrency=',
        name: 'Optimism'
      }
      console.log("connected to", props.name)

        return props
    } else if (network === 'matic') {
      props = {
        address: constants.POLYGON_CONTRACT_ADDRESS ,
        chainId: 137,
        explorerLink: constants.NEXT_PUBLIC_POLYGON_URL ,
        dexLink: 'https://app.uniswap.org/#/swap?outputCurrency=',
        name: 'Polygon'
      }
      console.log("connected to", props.name)

        return props
    }
    else {
      props = {
        address: constants.GOERLI_CONTRACT_ADDRESS ,
        chainId: 5
      }
        console.log("no network deteced, using default")
        return props
        
    }
}

export const approveTokens = async ( approveAmount: BigNumber, mintingContractInfo: MintingContractProps) => {
  const response = await readContract({
  address: `0x${mintingContractInfo.address}`,
  abi: MintingContractJSON.abi,
  functionName: 'paymentToken',
  args: [],
  chainId: mintingContractInfo.chainId
  });
  const paymentTokenAddress = response as string;
  const config = await prepareWriteContract({
      address: `0x${paymentTokenAddress.substring(2)}`,
      abi: erc20ABI,
      functionName: 'approve',
      args: [`0x${mintingContractInfo.address}`, approveAmount],
  })
  const data = await writeContract(config)
    return data
}

export const mintTokens = async (recipientAddress: string, tokenId: number, mintAmount: number, mintingContractInfo: MintingContractProps) => {
  const config = await prepareWriteContract({
    address: `0x${mintingContractInfo.address}`,
        abi: MintingContractJSON.abi,
        functionName: 'mint',
        args: [recipientAddress, tokenId, mintAmount],
        chainId: mintingContractInfo.chainId

  })
    const data = await writeContract(config)
    return data
}

export const mintBatchTokens = async (recipientAddress: string, tokenId: number[], mintAmount: number[], mintingContractInfo: MintingContractProps) => { 
  const config = await prepareWriteContract({
      address: `0x${mintingContractInfo.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'mintBatch',
      args: [recipientAddress, tokenId, mintAmount],
      chainId: mintingContractInfo.chainId

  })
  const data = await writeContract(config)
    return data
}

export const mintTokensNative = async (recipientAddress: string, tokenId: number, mintAmount: number, value: number, mintingContractInfo: MintingContractProps) => {
  const config = await prepareWriteContract({
    address: `0x${mintingContractInfo.address}`,
        abi: MintingContractJSON.abi,
        functionName: 'mintWithNativeToken',
        args: [recipientAddress, tokenId, mintAmount],
        chainId: mintingContractInfo.chainId,
        overrides: {
          value: parseEther(value.toString())
      }
  })
    const data = await writeContract(config)
    return data
}


export const mintBatchTokensNative = async (recipientAddress: string, tokenId: number[], mintAmount: number[], value: number, mintingContractInfo: MintingContractProps) => {
  const config = await prepareWriteContract({
      address: `0x${mintingContractInfo.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'mintBatchWithNativeToken',
      args: [recipientAddress, tokenId, mintAmount],
      chainId: mintingContractInfo.chainId,
      overrides: {
          value: parseEther(value.toString())
      }})
      const data = await writeContract(config)
      return data
    }

export const getTokenInfo = async (tokenId:number, mintingContractInfo: MintingContractProps) => {
  try {
    const tokenInfo = await readContract({
      address: `0x${mintingContractInfo.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'getTokenInfo',
      args: [tokenId]
  });
    const [tokenPriceHex, tokenURI] = tokenInfo as [BigNumber, string]
    const tokenPrice = parseFloat(formatEther(tokenPriceHex))
    return [tokenPrice, tokenURI]
  } 
  catch (error) {
    console.log(error)
  }
}

export const getUniqueTokens = async ( mintingContractInfo: MintingContractProps) => {
  try {
    const uniqueTokens = await readContract({
      address: `0x${mintingContractInfo.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'getUniqueTokens',
      args: []
  });
    return uniqueTokens as number;
  }
  catch (error) {
    console.log(error)
  }
}

export const getPaymentTokenBalance = async (address: string, mintingContractInfo: MintingContractProps) => {
  try {
      const paymentTokenAddress = await readContract({address: `0x${mintingContractInfo.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'paymentToken',
    args: [],
    });
    console.log(paymentTokenAddress)
    const formattedTokenAddress = await paymentTokenAddress as string;
    const paymentTokenBalance = await fetchBalance({
      address: `0x${address}`,
      token: `0x${formattedTokenAddress.substring(2)}`
    })
    return paymentTokenBalance.value
  }
  
  
  catch (error) {
    console.log(error)
  }
}

export const getNativeBalance = async (address:string) => {
  const nativeBalance = await fetchBalance({
    address: `0x${address}`
  }) 
  return nativeBalance.value;
}

export const getIsNativeMinting = async (mintingContractInfo: MintingContractProps) => {
  try {
   const isNativeMinting = await readContract({
      address: `0x${mintingContractInfo.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'nativeMintEnabled',  
      args: [],
    })
    return isNativeMinting as boolean
  } catch (error) {
    console.log(error)
  }
}

  