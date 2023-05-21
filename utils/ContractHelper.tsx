import { useContractRead, erc20ABI } from 'wagmi';
import {prepareWriteContract, writeContract, fetchBalance, readContract,} from '@wagmi/core'
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { useEffect, useState } from 'react';
 import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';

export interface MintingContractProps {
    address: string;
    chainId?: number;
    explorerLink?: string;
    name?: string;
}

export const selectContractAddress = (network: string) => {
    let props: MintingContractProps
    if (process.env.NODE_ENV === 'development' && network === 'goerli') {
      props = {
        address: process.env.CONTRACT_ADDRESS as string,
        chainId: 5,
        explorerLink: process.env.ETHERSCAN_URL as string,
        name: 'Goerli'
      }
        return props
    }
    else if (network === 'maticmum') {
      props = {
        address: process.env.MUMBAI_CONTRACT_ADDRESS as string,
        chainId: 80001,
        explorerLink: process.env.NEXT_PUBLIC_MUMBAI_URL as string,
        name: 'Polygon Mumbai'

      }
        return props
    }   
    else if (process.env.NODE_ENV === 'development' && network === 'gnosis') {
      props = {
        address: process.env.GNOSIS_CONTRACT_ADDRESS as string,
        chainId: 100,
        explorerLink: process.env.NEXT_PUBLIC_GNOSISSCAN_URL as string,
        name: 'Gnosis Chain'

      }
        return props
    }
    else {
      props = {
        address: process.env.CONTRACT_ADDRESS as string,
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
    console.log("is native minting inside contract", isNativeMinting)
    return isNativeMinting as boolean
  } catch (error) {
    console.log(error)
  }
}

export const useTokenInfo = (tokenId: number, mintingContractInfo: MintingContractProps) => {
    const [tokenURI, setTokenURI] = useState('')
    const [tokenPrice, setTokenPrice] = useState('')
    const _tokenInfo = useContractRead({
        address: `0x${mintingContractInfo.address}`,
        abi: MintingContractJSON.abi,
        functionName: 'getTokenInfo',
        args: [tokenId]
    });
    async function fetchData(tokenId: number) {
        const [newTokenPriceHex, newTokenURI] = await _tokenInfo.data as [string, string]
        const newTokenPrice = formatEther(newTokenPriceHex) 
        setTokenURI(newTokenURI)
        setTokenPrice(newTokenPrice)
    }

    useEffect(() => {
      if (_tokenInfo.data) {
        fetchData(tokenId);
      }
    }, [_tokenInfo.data]);
   // const [tokenPrice, tokenURI] = tokenInfo.data as [BigNumber, string]
    return  ([tokenPrice, tokenURI]) 
}


export const useUniqueTokens = (mintingContractInfo: MintingContractProps) => { 
    const [uniqueToken, setUniqueToken] = useState(0)
    const getUniqueTokens = useContractRead({
        address: `0x${mintingContractInfo.address}`,
        abi: MintingContractJSON.abi,
        functionName: 'getUniqueTokens',
        args: []
    });
   
    useEffect(() => {
        if (getUniqueTokens.data) {
            const updatedUniqueToken = getUniqueTokens.data as number;
            setUniqueToken(updatedUniqueToken);
        }
     } , [getUniqueTokens.data]);
    return uniqueToken
}


export const usePaymentTokenBalance = (addressToCheck: string, mintingContractInfo: MintingContractProps) => {
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | null>(null);
    const [paymentTokenAddress, setPaymentTokenAddress] = useState<string | null>(null);
    const getPaymentTokenAddress = useContractRead({
      address: `0x${mintingContractInfo.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'paymentToken',
      args: [],
    });
  
    useEffect(() => {
      if (getPaymentTokenAddress.data) {
        const updatedPaymentTokenAddress = getPaymentTokenAddress.data as string;
        setPaymentTokenAddress(updatedPaymentTokenAddress.slice(2));
      }
    }, [getPaymentTokenAddress.data]);
  
    const getBalanceData = useContractRead({
      address: `0x${paymentTokenAddress}`,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [`0x${addressToCheck}`],
    });
  
    useEffect(() => {
      if (getBalanceData.data) {
        const formattedBalance = parseFloat(formatEther(getBalanceData.data as BigNumber));
        setPaymentTokenBalance(formattedBalance);
      }
    }, [getBalanceData.data]);
  
    return paymentTokenBalance;
  };
  

  export const useIfNativeTokenMinting = (mintingContractInfo: MintingContractProps) => {
    const response = useContractRead({
    address: `0x${mintingContractInfo.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'nativeMintEnabled',  
    args: [],
  })

  return response.data as boolean
};