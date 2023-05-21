import { polygonMumbai, optimism, goerli, gnosis, polygon } from 'wagmi/chains'

export const constants = {
     GOERLI_CONTRACT_ADDRESS: '0B69e08D2dfc3aed5F27cbD3ec8B7015053472ad',
     GNOSIS_TEST_CONTRACT_ADDRESS: '9F8c0e0353234F6f644fc7AF84Ac006f02cecE77',
     MUMBAI_CONTRACT_ADDRESS: '284b39273AFF9bD336f73E5c8A937C59fd58E3E2',
     IPFS_GATEWAYS: 'https://ipfs.io/ipfs,https://cloudflare-ipfs.com/ipfs,https://dweb.link/ipfs',
     GOERLI_ETHERSCAN_URL: 'https://goerli.etherscan.io/',
     NEXT_PUBLIC_GNOSISSCAN_URL: 'https://gnosisscan.io/',
     NEXT_PUBLIC_MUMBAI_URL: 'https://mumbai.polygonscan.com/',
     PRODUCTION_CHAINS: [polygon, optimism, gnosis],
     DEVELOPMENT_CHAINS: [polygonMumbai, goerli, gnosis],
} 