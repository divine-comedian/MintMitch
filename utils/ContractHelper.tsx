import { useContractRead, useContractWrite, usePrepareContractWrite, erc20ABI, useAccount } from 'wagmi';
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { useEffect, useState
 } from 'react';
 import { formatEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';

let paymentTokenAddress: string | any;

export const mintingContract = {
    address: process.env.CONTRACT_ADDRESS,
    abi: MintingContractJSON.abi
}


export const useTokenInfo = (tokenId: number) => {
    const [tokenURI, setTokenURI] = useState('')
    const [tokenPrice, setTokenPrice] = useState('')
    const _tokenInfo = useContractRead({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
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


export const useUniqueTokens = () => { 
    const [uniqueToken, setUniqueToken] = useState(0)
    const getUniqueTokens = useContractRead({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
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

export const useERC20Info = () => {
    const paymentTokenContract = {
        address: paymentTokenAddress,
        abi: erc20ABI
    }
}

export const usePaymentTokenBalance = (addressToCheck: string) => {
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | null>(null);
    const [paymentTokenAddress, setPaymentTokenAddress] = useState<string | null>(null);
    const getPaymentTokenAddress = useContractRead({
      address: `0x${mintingContract.address}`,
      abi: mintingContract.abi,
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
  