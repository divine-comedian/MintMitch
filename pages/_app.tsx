import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygonMumbai, optimism, goerli, gnosis, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import config from '../config/env-vars'
import { constants } from '../utils/constants'

const { NEXT_PUBLIC_ALCHEMY_ID, NEXT_PUBLIC_INFURA_ID, NEXT_PUBLIC_ETHERSCAN_API_KEY } = config
const alchemyId = NEXT_PUBLIC_ALCHEMY_ID as string
const etherscanApiKey = NEXT_PUBLIC_ETHERSCAN_API_KEY

let appChains: any[] = []
let defaultChain: any;
if (process.env.NODE_ENV === 'development') {
  appChains = constants.DEVELOPMENT_CHAINS
  defaultChain = constants.DEVELOPMENT_CHAINS[0]
}
else if (process.env.NODE_ENV === 'production') {
  appChains = constants.PRODUCTION_CHAINS
  defaultChain = constants.PRODUCTION_CHAINS[0]

}


const { chains, provider } = configureChains(
 appChains,
  [
    alchemyProvider({ apiKey: alchemyId as string }),
    jsonRpcProvider({
      rpc: () => ({
        priority: 0,
        http: process.env.GNOSIS_RPC_URL as string,
      }),
    }),
    publicProvider(),
  ],
)

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
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </ThemeProvider>
  )
}
export default App
