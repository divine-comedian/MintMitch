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


export const useMintTokens = async (tokenId: number, mintAmount: number) => { 
    const { address } = useAccount();
    await address;
    const {config, error} = usePrepareContractWrite({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
        functionName: 'mint',
        args: [address, tokenId, mintAmount],
        onSuccess(data) {
            console.log(data)
        },
        onError(error) {
            console.log(error)
        }
    })
    const mintTokens = useContractWrite(await config);
    return mintTokens
}

export const useMintBatchTokens = async (tokenBatchIds: number[], mintBatchAmounts: number[]) => { 
    const { address } = useAccount();
    await address;
    const {config, error} = usePrepareContractWrite({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
        functionName: 'mint',
        args: [address, tokenBatchIds, mintBatchAmounts],
        onSuccess(data) {
            console.log(data)
        },
        onError(error) {
            console.log(error)
        }
    })
    const mintBatchTokens = useContractWrite(await config);
    return mintBatchTokens
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
        fetchData(tokenId);
    }, []);
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
    async function fetchData() {
        const res = await getUniqueTokens.data as BigNumber
        setUniqueToken(res.toNumber())                
    }
    useEffect(() => {
        fetchData();
        }
    , []);
    return uniqueToken
}

export const useERC20Info = () => {
    const paymentTokenContract = {
        address: paymentTokenAddress,
        abi: erc20ABI
    }
}

export const usePaymentTokenBalance = (addressToCheck: string) => {
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | null>(null)
   const getPaymentTokenAddress = useContractRead({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
        functionName: 'paymentToken',
        args: []
    })
      console.log("this is the payment token's address", getPaymentTokenAddress.data)
    const fetchPaymentTokenBalance = async () => {
    paymentTokenAddress = await getPaymentTokenAddress.data as string
    paymentTokenAddress = paymentTokenAddress.slice(2)
    };
   // await fetchPaymentTokenBalance();
    const getBalanceData = useContractRead({
        address: `0x${paymentTokenAddress}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [`0x${addressToCheck}`]
   })

    const balanceData = getBalanceData.data as BigNumber
    useEffect(() => { 
        if (balanceData) {
            const formattedBalance = parseFloat(formatEther(balanceData))
            setPaymentTokenBalance(formattedBalance)
            console.log(formattedBalance)
        }

        if (addressToCheck) {
            fetchPaymentTokenBalance()
        } else {
            setPaymentTokenBalance(null)
        }
    }, [addressToCheck, balanceData]);
    return paymentTokenBalance
}
