import DarkModeToggle from './darkModeToggle'
import Link from 'next/link'
import Image from 'next/image'
import { MintingContractProps, selectContractAddress } from '../utils/ContractHelper'
import { useEffect, useState } from 'react'
import ConnectWallet from './connectWallet'
import { useAccount, useNetwork } from 'wagmi'
import { fetchBalance, readContract } from '@wagmi/core'
import MintingContractJSON from '../artifacts/contracts/MitchMinterSupplyUpgradeable.sol/MitchMinter.json'
import MitchToken from '../images/MitchToken.png'
import Tooltip from '../utils/ToolTip'
import { formatEther } from 'viem'

interface IProps {
  displayConnectButton?: boolean
  isDarkModeToggleVisible?: boolean
  isRightNetwork?: boolean | undefined
  updateBalance?: boolean
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({
  isDarkModeToggleVisible = true,
  displayConnectButton = true,
  isRightNetwork,
  updateBalance,
}: // isNetworkSwitcherVisible = true,
IProps) => {
  const [progressBar, setProgressBar] = useState(0)
  const [contractProps, setContractProps] = useState<MintingContractProps | undefined>()
  const [isNativeMinting, setIsNativeMinting] = useState(true)
  const [balance, setBalance] = useState(0)
  const [rewardTokenBalance, setRewardTokenBalance] = useState(0)
  const network = useNetwork().chain?.network as string
  const account = useAccount()

  const getNativeMintEnabled = async (address: string, chainId: number) => {
    readContract({
      address: `0x${address}`,
      abi: MintingContractJSON.abi,
      functionName: 'nativeMintEnabled',
      args: [],
      chainId: chainId
    }).then((response) => {
      setIsNativeMinting(response as boolean)
    }).catch((error) => {
      console.log('error', error, 'chainID', chainId)
    }
    )
  }
    
  const getMitchTokenBalance = async (mitchTokenAddress: string) => {
    if (account.address !== undefined ) {
      fetchBalance({
        address: `0x${account.address?.substring(2)}`,
        token: `0x${mitchTokenAddress}`,
        chainId: contractProps?.chainId,
      }).then((response) => {
        if (response !== undefined) {
          const formattedBalance = parseFloat(formatEther(response.value))
          setRewardTokenBalance(formattedBalance)
        }
      }).catch((error) => {
        console.log('error', error)
      }
      )
    }
  }

  const getContractBalance = async (address: string, chainId: number) => {
    isNativeMinting ? 
        fetchBalance({
          address: `0x${address}`,
        })
        .then((response) => {
            setBalance(parseFloat(formatEther(response.value)))
        })
        : 
        readContract({
        address: `0x${address}`,
        abi: MintingContractJSON.abi,
        functionName: 'paymentToken',
        args: [],
        chainId: chainId,
      }).then((response) => {
        fetchBalance({
          address: `0x${address}`,
          token: `0x${(response as string).substring(2) }`,
          chainId: chainId,
        }).then((response) => {
          if (response !== undefined) {
            const formattedBalance = parseFloat(formatEther(response.value))
            setBalance(formattedBalance)
          }
        })
      }).catch((error) => {
        console.log('error', error)
        }
        )
  }
  useEffect(() => {
    if (isRightNetwork && contractProps?.address && contractProps?.chainId && contractProps?.mitchTokenAddress) {
      getContractBalance(contractProps.address, contractProps.chainId)
      getMitchTokenBalance(contractProps.mitchTokenAddress)
    }
  }, [contractProps, isNativeMinting, updateBalance, isRightNetwork])
 
  useEffect(() => {
    console.log('network', network)
    if (network !== undefined) {
      setContractProps(selectContractAddress(network))
    }
  }, [network])
  
  useEffect(() => {
    if (contractProps?.address && contractProps?.chainId) {
      getNativeMintEnabled(contractProps?.address, contractProps?.chainId)
    }
  }
  , [contractProps])

  useEffect(() => {
    const maxEthNeeded = 32
    const percentComplete = ((2.25 + balance!) / maxEthNeeded) * 100
    setProgressBar(Number(percentComplete.toFixed(3)))
  }, [balance])


  return (
    <nav className="flex flex-col z-30 lg:flex-row items-center bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-blue-500 dark:to-cyan-500 sm:max-w-screen justify-between py-2 px-4 navBarBorder">
      {/* Logo */}
      <div className=" flex  items-center justify-start">
        <div className="mx-5 p-2 mt-2 font-bold hover:bg-cyan-400 dark:hover:bg-blue-400 rounded-lg ">
          <Link href="/">
            <button className="text-xl">Home</button>
          </Link>
        </div>
        <div className="mr-5 p-2 mt-2 font-bold hover:bg-cyan-400 dark:hover:bg-blue-400 rounded-lg ">
          <Link href="/store">
            <button className="text-xl">Mint</button>
          </Link>
        </div>
      </div>
      <div className="sm:block flex items-center justify-center">
        {/* Progress bar */}
        <div className="w-full sm:w-90 mt-2 my-4">
          Percent completion to goal: <b>{progressBar}%</b>
          <div className="relative w-64 h-3 rounded-full bg-gray-300">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-green-500"
              style={{ width: `${progressBar}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* Connect to web3, dark mode toggle */}
      <div className="flex items-center justify-end space-x-2">
        {!Number.isNaN(rewardTokenBalance) && (
          <Tooltip content="This is your $MITCH token balance. Hold onto those!" direction="bottom">
            <div className="flex items-center bg-white/30 dark:bg-black/30 p-1 px-2 rounded-2xl">
              <span className="px-1 mt-1 text-md font-bold">{rewardTokenBalance}</span>{' '}
              <Image src={MitchToken} width={27} height={27} alt="mitch token symbol" />
            </div>
          </Tooltip>
        )}
        {isDarkModeToggleVisible && <DarkModeToggle />}
        {displayConnectButton && <ConnectWallet />}
      </div>
    </nav>
  )
}

export default Navbar
