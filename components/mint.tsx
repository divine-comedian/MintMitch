import React from "react";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, useContractRead} from "wagmi";
import { erc20ABI, fetchBalance } from "@wagmi/core";
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import Link from "next/link";

interface MintItems {
    itemsArray: any[];
    itemSum: number;
    isMintModal: Function
}

const LoadingSpinner = () => {
    return (
    <svg
            className="animate-spin h-6 w-6 text-gray-700 float-left inline mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.962 1.684 5.507 4 6.938l2-1.647z"
            ></path>
          </svg>
    )
}


export const MintModal = ({ itemsArray, itemSum, isMintModal }: MintItems) => {
    const mintItems = Array.from(itemsArray).map((item) => <li key={item.tokenID}> {item.tokenPrice}</li>)
    const [userBalance, setUserBalance] = React.useState(0);
    const [paymentTokenAddress, setPaymentTokenAddress] = useState<string | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [mintState, setMintState] = useState<string>('not approved');
    const [mintTxHash, setMintTxHash] = useState<string | undefined>(undefined);
    const approveAmount = BigNumber.from(itemSum * 10 ** 18); 
    const tokenId = itemsArray[0].tokenID;   
    const tokenBatchIds = itemsArray.map((item) => item.tokenID);
    const tokenAmounts = itemsArray.map((item) => 1)



    const { address } = useAccount();
     
    

 const mintingContract = {
    address: process.env.CONTRACT_ADDRESS,
    abi: MintingContractJSON.abi
}

const getPaymentTokenAddress = useContractRead({
    address: `0x${mintingContract.address}`,
    abi: mintingContract.abi,
    functionName: 'paymentToken',
    args: [],
  });

  

const useTokenApprove = ( approveAmount: BigNumber) => {
          const {config, error} = usePrepareContractWrite({
              address: `0x${paymentTokenAddress}`,
              abi: erc20ABI,
              functionName: 'approve',
              args: [`0x${mintingContract.address}`, approveAmount],
              onError(error) {
                  console.log(error)
              }
          })
          const approve = useContractWrite(config);
          return approve
    }


  

const useMintTokens =  (tokenId: number, mintAmount: number) => { 
    const {config, error} = usePrepareContractWrite({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
        functionName: 'mint',
        args: [address, tokenId, mintAmount],
        onError(error) {
            console.log(error)
        }
    })
    const mintTokens = useContractWrite( config);
    return mintTokens
}

const useMintBatchTokens =  (tokenId: number[], mintAmount: number[]) => { 
    const {config, error} = usePrepareContractWrite({
        address: `0x${mintingContract.address}`,
        abi: mintingContract.abi,
        functionName: 'mintBatch',
        args: [address, tokenId, mintAmount],
        onError(error) {
            console.log(error)
        }
    })
    const mintTokens = useContractWrite(config);
    return mintTokens
}

const approveTokens = useTokenApprove(approveAmount);
const mintTokens = useMintTokens(tokenId, 1);
const mintBatchTokens = useMintBatchTokens(tokenBatchIds, tokenAmounts);

const waitForApprove = useWaitForTransaction({
    hash: approveTokens?.data?.hash,
    onError(data) {
      console.log(data)
    }
}
);

const waitForMint = useWaitForTransaction({
    hash: mintTokens?.data?.hash,
    onError(data) {
       console.log(data)
    }
})

const waitForMintBatch = useWaitForTransaction({
    hash: mintBatchTokens?.data?.hash,
    onError(data) {
        console.log(data)
    }
})

useEffect(() => {
    if (address) {
        setAccount(address.slice(2));
    }
}, [address]);

useEffect(() => {
    const fetchUserBalance = async () => {
      if (address && paymentTokenAddress) {
        const balance = await fetchBalance({
          address: `0x${account}`,
          token: `0x${paymentTokenAddress}`,
        });
       const formattedBalance = parseFloat(formatEther(balance.value));
        setUserBalance(formattedBalance);
      }
    };
    fetchUserBalance();
  }, [address, account, paymentTokenAddress]);

useEffect(() => {
    if (getPaymentTokenAddress.data) {
      const updatedPaymentTokenAddress = getPaymentTokenAddress.data as string;
      setPaymentTokenAddress(updatedPaymentTokenAddress.slice(2));
    }
  }, [getPaymentTokenAddress.data]);

useEffect(() => {
    if (waitForApprove.isLoading) {
        setMintState('approve pending')
    }
    else if
    (waitForApprove.isSuccess) {
        setMintState('approved')
        console.log("approve successful", waitForApprove.isSuccess)
    }
    
}, [waitForApprove])


useEffect(() => {
    if (waitForMint.isLoading || waitForMintBatch.isLoading) {
        setMintState('mint pending')
    }
    else if (waitForMint.isSuccess || waitForMintBatch.isSuccess) {
        setMintState('minted')
        setMintTxHash(waitForMint.data?.transactionHash || waitForMintBatch.data?.transactionHash)
        console.log("mint successful", waitForMint.isSuccess)
    }
    else if (waitForMint.isError || waitForMintBatch.isError) {
        setMintState('error')
        console.log("mint error", waitForMint.isError)
        setMintTxHash(waitForMint.data?.transactionHash || waitForMintBatch.data?.transactionHash)
    }
}, [waitForMint, waitForMintBatch])

const handleMint = async () => {
    setMintState('mint pending');
    if (tokenBatchIds.length > 1) {
        if (mintBatchTokens.write) {
            await mintBatchTokens.write();
        }
    } else {
        if (mintTokens.write) {
            await mintTokens.write();
        }
    }
};


const mintStateRender = () => {
    switch (mintState) {
        case 'not approved':
            return <div className="space-y-2 font-medium dark:text-white text-black"><p>Hold tight, just a few more clicks.</p><p> Approve spending {itemSum} WETH, once you've approved to spend the tokens you'll need to Mint.</p><button
            className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => approveTokens.write ? approveTokens.write() : null}
            >Approve</button>
            </div>;     
        case 'approve pending':
            return <div className="space-y-2 font-medium dark:text-white"><p>Hold tight, just a few more clicks. Approve spending {itemSum} WETH, once you've approved to spend the tokens you'll need to Mint.</p><button
            className="bg-gray-500 cursor-default text-gray-700 font-bold py-2 px-4 rounded"
            disabled
            ><LoadingSpinner/>Approving...</button>
            </div>;
        case 'approved':
            return <div className="space-y-2 font-medium dark:text-white"><p className="text-lime-700 font-bold">Approved</p> <p>Almost there! Keep clicking to mint those mitches!</p><button
            className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {handleMint()}}
            >Mint</button>
            </div>;
        case 'error':
            return <p className="space-y-2 font-medium dark:text-white">An error occured! Check this transaction data: {waitForApprove?.data?.transactionHash}</p>;
        case 'mint pending':
            return <button
            className="bg-gray-500 cursor-default text-gray-700 font-bold py-2 px-4 rounded"
            disabled
            ><LoadingSpinner />Minting...</button>;
        case 'minted':
            return <div className="space-y-2 font-medium dark:text-white">
                <p>Amazing!! Thank you so much for minting some mitch and supporting me in my goals!</p><p><a className=" hover:dark:gray-300 hover:text-gray-700 font-bold" target="_blank" rel="noopener noreferrer" href={process.env.ETHERSCAN_URL + "/tx/" + mintTxHash}>Click here to see your minting transaction.</a></p>
                </div>;
        default:
            return <button
            className="bg-gray-500 cursor-default text-gray-700 font-bold py-2 px-4 rounded"
            disabled
            >
          One sec...</button>;
    }
}




console.log(tokenAmounts)
console.log(tokenBatchIds)    

return (
    <div className=" bg-gradient-to-r from-cyan-400 to-blue-400 dark:from-blue-600 dark:to-cyan-600 lg:w-[500px] xs:w-[200px] p-4 rounded-lg">
    <div className="float-right">
    <button className="font-bold text-lg py-0.5 px-2 hover:rounded-full hover:bg-gray-300/80" onClick={() => isMintModal(false) }>X</button>
    </div>
    <h2 className="text-2xl font-bold mb-4">Minting Time. 😎 </h2>
    <p className="text-gray-600">
        { userBalance < itemSum ? <p className="text-red-600 text-lg">You don't have the required funds! Your current balance is {itemSum} </p> :  mintStateRender()}
    </p>
   
    </div>

)
}
