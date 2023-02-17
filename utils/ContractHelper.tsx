import { useContractRead } from 'wagmi';
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { erc20ABI } from 'wagmi';
import { useEffect, useState
 } from 'react';

let paymentTokenAddress: string | unknown;

export const mintingContract = {
    address: process.env.GOERLI_CONTRACT,
    abi: MintingContractJSON.abi
}


export const useTokenInfo = (tokenId: number) => {
    const [tokenInfo, setTokenInfo] = useState()
    const _tokenInfo = useContractRead({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
        functionName: 'getTokenInfo',
        args: [tokenId]
    });
    useEffect(() => {
        async function fetchData(tokenId: number) {
            const res = await _tokenInfo                
        }
        fetchData(tokenId);
    }, []);
   // const [tokenPrice, tokenURI] = tokenInfo.data as [BigNumber, string]
    return  (_tokenInfo.data) 
}

export const useReadSmartContract = () => {


const paymentToken =  useContractRead({
    address: `0x${mintingContract.address}`,
    abi: mintingContract.abi,
    functionName: 'paymentToken'
});



const tokenInfo =  useContractRead({
    address: `0x${mintingContract.address}`,
    abi: mintingContract.abi,
    functionName: 'getTokenInfo'
});

paymentTokenAddress = paymentToken.data
return { tokenInfo, paymentToken}

}

export const useERC20Info = () => {
    const paymentTokenContract = {
        address: paymentTokenAddress,
        abi: erc20ABI
    }
    
}