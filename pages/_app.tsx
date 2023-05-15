import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygonMumbai, optimism, arbitrum, goerli, gnosis, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
 
import config from '../config/env-vars'
const { NEXT_PUBLIC_ALCHEMY_ID, NEXT_PUBLIC_INFURA_ID, NEXT_PUBLIC_ETHERSCAN_API_KEY } = config

const alchemyId = NEXT_PUBLIC_ALCHEMY_ID
const etherscanApiKey = NEXT_PUBLIC_ETHERSCAN_API_KEY

const { chains, provider} =
 configureChains(
  [polygonMumbai, gnosis, goerli],
  [publicProvider(),
  alchemyProvider({ apiKey: 'SRWLpUQxML7F45zAvOmFmma1XFPsufnm' }),
    jsonRpcProvider({
    rpc: (polygonMumbai) => ({
      http: `https://matic.getblock.io/77e89e7c-3a6d-46f7-86f3-99b9eafd3f2b/testnet/`
    })
    }
  ),
  jsonRpcProvider({
    rpc: (gnosis) => ({
      http: 'https://gno.getblock.io/77e89e7c-3a6d-46f7-86f3-99b9eafd3f2b/mainnet/'
    })
  }),
  jsonRpcProvider({
    rpc: (goerli) => ({
      http: 'https://eth-goerli.g.alchemy.com/v2/SRWLpUQxML7F45zAvOmFmma1XFPsufnm'
    })
  })
],
)


const { connectors } = getDefaultWallets({
  appName: 'Web 3 Starter App',
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
