import DarkModeToggle from './darkModeToggle'
import ConnectWallet from './connectWallet'
import Link from 'next/link'

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
  return (
    <nav className="flex items-center justify-between w-full py-2 navBarBorder">
      {/* Logo */}
      <div className=" flex items-center justify-start">
      <div className="pr-4 "><Link href="/">Home</Link></div>
      <div className="pr-4 "><Link href="/store">Mint</Link></div>
      <div className="ml-1 transition duration-200 transform hover:rotate-20">
        <Link href="/">
          <a>{/* <Emoji className="text-4xl cursor-pointer " label="logo" symbol="🧑🏻‍🎨" /> */}</a>
        </Link>
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
