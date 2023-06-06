import DarkModeToggle from './darkModeToggle'
import Link from 'next/link'
import Image from 'next/image'
import { MintingContractProps, getNativeBalance, getPaymentTokenBalance } from '../utils/ContractHelper'
import { useEffect, useState } from 'react'
import { formatEther } from 'ethers/lib/utils.js'
import { BigNumber } from 'ethers'
import ConnectWallet from './connectWallet'
import { useContractRead, useBalance, useAccount } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinterSupplyUpgradeable.sol/MitchMinter.json'
import MitchToken from '../images/MitchToken.png'
import Tooltip from '../utils/ToolTip'

interface IProps {
  displayConnectButton?: boolean
  isDarkModeToggleVisible?: boolean
  isRightNetwork?: boolean | undefined
  contractProps: MintingContractProps
  updateBalance?: boolean
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({
  isDarkModeToggleVisible = true,
  displayConnectButton = true,
  isRightNetwork,
  contractProps,
  updateBalance,
}: // isNetworkSwitcherVisible = true,
IProps) => {
  const [progressBar, setProgressBar] = useState(0)
  const [balance, setBalance] = useState(0)
  const [rewardTokenBalance, setRewardTokenBalance] = useState(0)
  const account = useAccount()
  // const nativeMinting = await getIsNativeMinting()
  // setIsNativeMintEnabled(nativeMinting)
  const {
    data: isNativeMinting,
  } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'nativeMintEnabled',
    args: [],
    chainId: contractProps.chainId,
  })

  const mitchTokenBalance = useBalance({
    address: `0x${account.address?.substring(2)}`,
    token: `0x${contractProps.mitchTokenAddress}`,
    chainId: contractProps.chainId,
    enabled: false,
  })

    
  const getBalance = async () => {
    try {
      if (isNativeMinting === true) {
        getNativeBalance(contractProps.address).then((response) => {
          setBalance(parseFloat(formatEther(response)))
        })
      } else if (isNativeMinting === false) {
        getPaymentTokenBalance(contractProps.address, contractProps).then((response) => {
          const formattedBalance = parseFloat(formatEther(response as BigNumber))
          setBalance(formattedBalance)
        })
      }
    } catch (e) {
      console.log('error getting balance', e)
    }
  }
  useEffect(() => {
    if (isRightNetwork && isNativeMinting !== undefined) {
      getBalance()
    }
  }, [contractProps, isNativeMinting, updateBalance])

  // useEffect(() => {
  //   getBalance()
  // }, [updateBalance])

  useEffect(() => {
    const maxEthNeeded = 32
    const percentComplete = ((2.25 + balance!) / maxEthNeeded) * 100
    setProgressBar(Number(percentComplete.toFixed(3)))
  }, [balance])

  useEffect(() => {
    if (account) {
      mitchTokenBalance.refetch().then((response) => {
        const formattedBalance = parseFloat(response.data?.formatted as string)
        setRewardTokenBalance(formattedBalance)
      })
    }
    // if (mitchTokenBalance) {
    //   const formattedBalance = parseFloat(formatEther(mitchTokenBalance as BigNumber))
    //   setRewardTokenBalance(formattedBalance)
    // }
  }, [account, mitchTokenBalance])

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
          <Tooltip content="This is your $MITCH token balance. Hold onto those!" direction="bottom">
        <div className="flex items-center bg-white/30 dark:bg-black/30 p-1 px-2 rounded-2xl">
            <span className="px-1 mt-1 text-md font-bold">{rewardTokenBalance}</span>{' '}
            <Image src={MitchToken} width={27} height={27} alt="mitch token symbol" />
        </div>
          </Tooltip>
        {isDarkModeToggleVisible && <DarkModeToggle />}
        {displayConnectButton && <ConnectWallet />}
      </div>
    </nav>
  )
}

export default Navbar
