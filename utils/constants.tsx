import { polygonMumbai, optimism, goerli, gnosis, polygon, } from 'wagmi/chains'

export const constants = {
     GOERLI_CONTRACT_ADDRESS: '0B69e08D2dfc3aed5F27cbD3ec8B7015053472ad',
     GNOSIS_TEST_CONTRACT_ADDRESS: '9F8c0e0353234F6f644fc7AF84Ac006f02cecE77',
     MUMBAI_CONTRACT_ADDRESS: '284b39273AFF9bD336f73E5c8A937C59fd58E3E2',
     POLYGON_CONTRACT_ADDRESS: '739f9267926c69C11Ec31DEE591B690c8EC33FD2',
     OPTIMISM_CONTRACT_ADDRESS: '47449e9416D528D6aF99483DD3Dd2825ca3565bc',
     GNOSIS_PROD_CONTRACT: 'b2866f5dFDcB4605c3E6fA98AaaC94A0e7B74922',
     IPFS_GATEWAYS: 'https://ipfs.io/ipfs,https://cloudflare-ipfs.com/ipfs,https://dweb.link/ipfs',
     GOERLI_ETHERSCAN_URL: 'https://goerli.etherscan.io/',
     NEXT_PUBLIC_GNOSISSCAN_URL: 'https://gnosisscan.io/',
     NEXT_PUBLIC_MUMBAI_URL: 'https://mumbai.polygonscan.com/',
     NEXT_PUBLIC_POLYGON_URL: 'https://polygonscan.com/',
     NEXT_PUBLIC_OPTIMISM_URL: 'https://optimistic.etherscan.io/',
     PRODUCTION_CHAINS: [optimism, polygon, {...gnosis, iconUrl: 'https://honeyswap.1hive.eth.limo/static/media/gnosis-chain-logo.png'}],
     DEVELOPMENT_CHAINS: [goerli, polygonMumbai, {...gnosis, iconUrl: 'https://honeyswap.1hive.eth.limo/static/media/gnosis-chain-logo.png'}],
} 