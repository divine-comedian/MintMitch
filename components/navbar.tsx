import DarkModeToggle from './darkModeToggle'
// import ConnectWallet from './connectWallet'
import Link from 'next/link'
import { MintingContractProps, getNativeBalance, getPaymentTokenBalance } from '../utils/ContractHelper'
import { useEffect, useState } from 'react'
import { formatEther } from 'ethers/lib/utils.js'
import { BigNumber } from 'ethers'
import ConnectWallet from './connectWallet'
import { useContractRead } from 'wagmi'
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'


interface IProps {
  displayConnectButton?: boolean
  isDarkModeToggleVisible?: boolean
  isRightNetwork?: boolean | undefined
  contractProps: MintingContractProps
  updateBalance?: boolean;
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
  const [isNativeMintEnabled, setIsNativeMintEnabled] = useState<boolean | undefined>(undefined)
  const [balance, setBalance] = useState(0)

  // const nativeMinting = await getIsNativeMinting()
  // setIsNativeMintEnabled(nativeMinting)
  const {
    data: isNativeMinting,
    isSuccess: nativeMintEnabledSuccess,
    isError: nativeMintEnabledError,
    error: nativeMintEnabledErrorInfo,
  } = useContractRead({
    address: `0x${contractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'nativeMintEnabled',
    args: [],
    chainId: contractProps.chainId,
  })

  useEffect(() => {
    if (isNativeMinting !== undefined) {
      setIsNativeMintEnabled(isNativeMinting as boolean)
    } else if (nativeMintEnabledError) {
      console.log('error getting native mint enabled', nativeMintEnabledErrorInfo)
    }
  }, [isNativeMinting, nativeMintEnabledSuccess,nativeMintEnabledError])
  
  const getBalance = async () => {
    try {
      if (isNativeMinting === true) {
        getNativeBalance(contractProps.address).then((response) => {
          setBalance(parseFloat(formatEther(response)))
        })
      } else {
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
    if (isRightNetwork && isNativeMintEnabled !== undefined) {
      getBalance()
    }
  }, [contractProps, isNativeMinting])

  useEffect(() => {
    getBalance()
  }, [updateBalance])


  useEffect(() => {
    const maxEthNeeded = 32
    const percentComplete = ((2 + balance!) / maxEthNeeded) * 100
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
        {isDarkModeToggleVisible && <DarkModeToggle />}
        {displayConnectButton && <ConnectWallet />}
      </div>
    </nav>
  )
}

export default Navbar
