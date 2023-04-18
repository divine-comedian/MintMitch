import DarkModeToggle from './darkModeToggle'
import ConnectWallet from './connectWallet'
import Link from 'next/link'
import {usePaymentTokenBalance} from '../utils/ContractHelper'
import {useEffect, useState} from 'react'

interface IProps {
  displayConnectButton?: boolean
  isDarkModeToggleVisible?: boolean
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({
  isDarkModeToggleVisible = true,
  displayConnectButton = true,
}: // isNetworkSwitcherVisible = true,
IProps) => {
  const [progressBar, setProgressBar] = useState(0)
  const [contractAddress, setContractAddress] = useState('')
  let balance = usePaymentTokenBalance(contractAddress)
  


  console.log("this should be the contract's balance", balance)
  useEffect (() => {
    const address = process.env.CONTRACT_ADDRESS || '';
    console.log(address)
    setContractAddress(address)
  }, [])

  useEffect (() => {
    const maxEthNeeded = 32
    const percentComplete = ((balance!)  / maxEthNeeded) * 100
    setProgressBar(percentComplete)
  }, [balance])


  return (
    <nav className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-blue-500 dark:to-cyan-500 sm:max-w-screen justify-between py-2 px-4 navBarBorder">
      {/* Logo */}
      <div className=" flex  items-center justify-start">
      <div className="mx-5 p-2 mt-2 font-bold hover:bg-cyan-400 dark:hover:bg-blue-400 rounded-lg "><Link href="/">Home</Link></div>
      <div className="mr-5 p-2 mt-2 font-bold hover:bg-cyan-400 dark:hover:bg-blue-400 rounded-lg "><Link href="/store">Mint</Link></div>
      </div>
      <div className="sm:block flex items-center justify-center">
      {/* Progress bar */}
  <div className="w-full sm:w-90 mt-2 my-4">Percent completion to goal: <b>{progressBar}%</b>
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
