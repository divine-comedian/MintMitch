import { polygonMumbai, optimism, goerli, gnosis, polygon, } from 'wagmi/chains'

const HOSTED_GATEWAY = process.env.IPFS_GATEWAY as string;

export const constants = {

     GOERLI_CONTRACT_ADDRESS: '28140243ff24d7ba81e711f084b1b8fbc993572e',
     GOERLI_MITCHTOKEN_ADDRESS: '32c3345101e6e51314f2cfcCc50B116001a89b89',
     GNOSIS_TEST_CONTRACT_ADDRESS: '721186954b6a26cCa2420A66D2b3E92b3659529e',
     GNOSIS_TEST_MITCHTOKEN_ADDRESS: 'f7dcE74803F441466528721E20CB4b0F0AdB5314',
     MUMBAI_CONTRACT_ADDRESS: 'DF520f7Fb30C4Cb807Fe141124a4b2a72C96dA62',
     MUMBAI_MITCHTOKEN_ADDRESS: '9F397aD4F786Ee7aA7E3613b4c721Be32aB95369',
     POLYGON_CONTRACT_ADDRESS: 'f7dce74803f441466528721e20cb4b0f0adb5314',
     POLYGON_MITCHTOKEN: '9f830A6562482eB11CA92051cdae820a33777995',
     OPTIMISM_CONTRACT_ADDRESS: '23Bf2C8e672C1E17037CC7D29086b86D27e84c16',
     OPTIMISM_MITCHTOKEN: '7e553D2cA84Ef26D13416563DE6F7f38597aEDD7',
     GNOSIS_PROD_CONTRACT: '3Db165eAc39DBE1608ca638997509C69B0f1c644',
     GNOSIS_PROD_MITCHTOKEN: '77dB6f261437E3D2bf84BcC77350764eA2df90B7',
     IPFS_GATEWAYS:  HOSTED_GATEWAY + ',https://ipfs.io/ipfs,https://cloudflare-ipfs.com/ipfs,https://dweb.link/ipfs',
     GOERLI_ETHERSCAN_URL: 'https://goerli.etherscan.io/',
     NEXT_PUBLIC_GNOSISSCAN_URL: 'https://gnosisscan.io/',
     NEXT_PUBLIC_MUMBAI_URL: 'https://mumbai.polygonscan.com/',
     NEXT_PUBLIC_POLYGON_URL: 'https://polygonscan.com/',
     NEXT_PUBLIC_OPTIMISM_URL: 'https://optimistic.etherscan.io/',
     PRODUCTION_CHAINS: [optimism, polygon, {...gnosis, iconUrl: 'https://honeyswap.1hive.eth.limo/static/media/gnosis-chain-logo.png'}],
     DEVELOPMENT_CHAINS: [goerli, polygonMumbai, {...gnosis, iconUrl: 'https://honeyswap.1hive.eth.limo/static/media/gnosis-chain-logo.png'}],
} 