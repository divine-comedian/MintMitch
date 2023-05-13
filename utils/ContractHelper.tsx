import { useContractRead, useContractWrite, usePrepareContractWrite, erc20ABI, useAccount } from 'wagmi';
import {prepareWriteContract, writeContract, fetchBalance, waitForTransaction, readContract,getNetwork} from '@wagmi/core'
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { useEffect, useState } from 'react';
import { formatEther, parseEther } from 'viem';

export const selectContractAddress = (network: string) => {
    if (process.env.NODE_ENV === 'development' && network === 'goerli') {
        return process.env.CONTRACT_ADDRESS as string
    }
    else if (network === 'maticmum') {
      return process.env.MUMBAI_CONTRACT_ADDRESS as string
    }   
    else if (process.env.NODE_ENV === 'development' && network === 'gnosis') {
      return process.env.GNOSIS_CONTRACT_ADDRESS as string
    }
    else {
        return "not set"
    }
}

export const approveTokens = async ( approveAmount: bigint, mintingContractAddress: string) => {
  const response = await readContract({address: `0x${mintingContractAddress}`,
  abi: MintingContractJSON.abi,
  functionName: 'paymentToken',
  args: [],
  });
  const paymentTokenAddress = response as string;
  const config = await prepareWriteContract({
      address: `0x${paymentTokenAddress.substring(2)}`,
      abi: erc20ABI,
      functionName: 'approve',
      args: [`0x${mintingContractAddress}`, approveAmount],
  })
  const data = await writeContract(config)
    return data
}

export const mintTokens = async (recipientAddress: string, tokenId: number, mintAmount: number, mintingContractAddress: string) => {
  const config = await prepareWriteContract({
    address: `0x${mintingContractAddress}`,
        abi: MintingContractJSON.abi,
        functionName: 'mint',
        args: [recipientAddress, tokenId, mintAmount],
  })
    const data = await writeContract(config)
    return data
}

export const mintBatchTokens = async (recipientAddress: string, tokenId: number[], mintAmount: number[], mintingContractAddress: string) => { 
  const config = await prepareWriteContract({
      address: `0x${mintingContractAddress}`,
      abi: MintingContractJSON.abi,
      functionName: 'mintBatch',
      args: [recipientAddress, tokenId, mintAmount],
  })
  const data = await writeContract(config)
    return data
}

export const mintTokensNative = async (
          recipientAddress: string,
          tokenId: number,
          mintAmount: number,
          nativeValue: number,
          mintingContractAddress: string
      ) => {
  const config = await prepareWriteContract({
        address: `0x${mintingContractAddress}`,
        abi: MintingContractJSON.abi,
        functionName: 'mintWithNativeToken',
        args: [recipientAddress, tokenId, mintAmount],
        value: parseEther(`${nativeValue}`),
  })
    const data = await writeContract(config)
    return data
}


export const mintBatchTokensNative = async (recipientAddress: string, tokenId: number[], mintAmount: number[], nativeValue: number, mintingContractAddress: string) => {
  const config = await prepareWriteContract({
      address: `0x${mintingContractAddress}`,
      abi: MintingContractJSON.abi,
      functionName: 'mintBatchWithNativeToken',
      args: [recipientAddress, tokenId, mintAmount],
      value: parseEther(`${nativeValue}`)
    })
      const data = await writeContract(config)
      return data
    }

export const getTokenInfo = async (tokenId:number, mintingContractAddress: string) => {
  const tokenInfo = await readContract({
    address: `0x${mintingContractAddress}`,
    abi: MintingContractJSON.abi,
    functionName: 'getTokenInfo',
    args: [tokenId]
});
  const [tokenPriceHex, tokenURI] = tokenInfo as [bigint, string]
  const tokenPrice = parseFloat(formatEther(tokenPriceHex))
  return [tokenPrice, tokenURI]
}

export const getUniqueTokens = async ( mintingContractAddress: string) => {
  const uniqueTokens = await readContract({
    address: `0x${mintingContractAddress}`,
    abi: MintingContractJSON.abi,
    functionName: 'getUniqueTokens',
    args: []
});
  return uniqueTokens as number;
}

export const getPaymentTokenBalance = async (address: string, mintingContractAddress: string) => {
  try {
    const paymentTokenAddress = await readContract({address: `0x${mintingContractAddress}`,
    abi: MintingContractJSON.abi,
    functionName: 'paymentToken',
    args: [],
    });
    await paymentTokenAddress;
    const formattedTokenAddress = paymentTokenAddress as string;
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

export const getIsNativeMinting = async (mintingContractAddress: string) => {
  try {
    console.log("this is the contract address in the function",mintingContractAddress)
   const isNativeMinting = await readContract({
      address: `0x${mintingContractAddress}`,
      abi: MintingContractJSON.abi,
      functionName: 'nativeMintEnabled',  
      args: [],
    })
    return isNativeMinting as boolean
  } catch (error) {
    console.log(error)
  }
}

export const useTokenInfo = (tokenId: number, mintingContractAddress: string) => {
    const [tokenURI, setTokenURI] = useState('')
    const [tokenPrice, setTokenPrice] = useState('')
    const _tokenInfo = useContractRead({
        address: `0x${mintingContractAddress}`,
        abi: MintingContractJSON.abi,
        functionName: 'getTokenInfo',
        args: [tokenId]
    });
    async function fetchData(tokenId: number) {
        const [newTokenPriceHex, newTokenURI] = await _tokenInfo.data as [bigint, string]
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


export const useUniqueTokens = (mintingContractAddress: string) => { 
    const [uniqueToken, setUniqueToken] = useState(0)
    const getUniqueTokens = useContractRead({
        address: `0x${mintingContractAddress}`,
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


export const usePaymentTokenBalance = (addressToCheck: string, mintingContractAddress: string) => {
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | null>(null);
    const [paymentTokenAddress, setPaymentTokenAddress] = useState<string | null>(null);
    const getPaymentTokenAddress = useContractRead({
      address: `0x${mintingContractAddress}`,
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
        const formattedBalance = parseFloat(formatEther(getBalanceData.data as bigint));
        setPaymentTokenBalance(formattedBalance);
      }
    }, [getBalanceData.data]);
  
    return paymentTokenBalance;
  };
  

  export const useIfNativeTokenMinting = (mintingContractAddress: string) => {
    const response = useContractRead({
    address: `0x${mintingContractAddress}`,
    abi: MintingContractJSON.abi,
    functionName: 'nativeMintEnabled',  
    args: [],
  })

  return response.data as boolean
};