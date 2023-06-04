import { polygonMumbai, optimism, goerli, gnosis, polygon, } from 'wagmi/chains'

export const constants = {
     GOERLI_CONTRACT_ADDRESS: '44BE4f47899B4C9c74E8d7A5A9c5f2638E60635E',
     GOERLI_MITCHTOKEN_ADDRESS: '32c3345101e6e51314f2cfcCc50B116001a89b89',
     GNOSIS_TEST_CONTRACT_ADDRESS: 'f07f5f2c583e1d09d1c885577d2c0d051b63da35',
     GNOSIS_TEST_MITCHTOKEN_ADDRESS: 'f7dcE74803F441466528721E20CB4b0F0AdB5314',
     MUMBAI_CONTRACT_ADDRESS: 'c93d70Ae589994a9E87c7A97e22C285D9669a325',
     MUMBAI_MITCHTOKEN_ADDRESS: '9F397aD4F786Ee7aA7E3613b4c721Be32aB95369',
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