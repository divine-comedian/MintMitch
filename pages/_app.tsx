import '../styles/globals.css'
import '../styles/tooltip.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import config from '../config/env-vars'
import { constants } from '../utils/constants'
import { Analytics } from '@vercel/analytics/react';

const { NEXT_PUBLIC_ALCHEMY_ID } = config
const alchemyId = NEXT_PUBLIC_ALCHEMY_ID as string

let appChains: any[] = []
if (process.env.NODE_ENV === 'development') {
  appChains = constants.DEVELOPMENT_CHAINS
} else if (process.env.NODE_ENV === 'production') {
  appChains = constants.PRODUCTION_CHAINS
}

const { chains, provider } = configureChains(appChains, [
  alchemyProvider({ apiKey: alchemyId as string }),
  jsonRpcProvider({
    rpc: () => ({
      priority: 0,
      http: process.env.GNOSIS_RPC_URL as string,
    }),
  }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Mint Mitch',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white">
        <WagmiConfig client={wagmiClient}>
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
