import '../styles/globals.css'
import '../styles/tooltip.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import {  getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {infuraProvider} from 'wagmi/providers/infura'
import { constants } from '../utils/constants'
import { Analytics } from '@vercel/analytics/react'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public';


const walletConnectId = process.env.WALLET_CONNECT_PROJECT as string
const infuraID = process.env.NEXT_PUBLIC_INFURA_ID as string
// const { NEXT_PUBLIC_ALCHEMY_ID } = config
const NEXT_PUBLIC_GNOSIS_RPC_URL = process.env.NEXT_PUBLIC_GNOSIS_RPC_URL as string
// const alchemyId = NEXT_PUBLIC_ALCHEMY_ID as string


let appChains: any[] = []
if (process.env.NODE_ENV === 'development') {
  appChains = constants.DEVELOPMENT_CHAINS
} else if (process.env.NODE_ENV === 'production') {
  appChains = constants.PRODUCTION_CHAINS
}

const { chains, publicClient } = configureChains(appChains, [
  infuraProvider({ apiKey: infuraID}),
  jsonRpcProvider({ rpc: () => ({ http: NEXT_PUBLIC_GNOSIS_RPC_URL }) }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Mint Mitch',
  projectId: walletConnectId,
  chains,
})


const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white">
        <WagmiConfig config={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
            <Analytics />
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </ThemeProvider>
  )
}
export default App
