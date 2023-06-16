import { Chain } from "@wagmi/core";

export const gnosis = {
        id: 100,
         name: "Gnosis",
         network: "gnosis",
         nativeCurrency: {
             decimals: 18,
             name: "Gnosis",
             symbol: "xDAI",
        },
         rpcUrls: {
             default: {
                 http:  ["https://gno.getblock.io/77e89e7c-3a6d-46f7-86f3-99b9eafd3f2b/mainnet/"],
            },
             public: {
                 http:  ["https://gno.getblock.io/77e89e7c-3a6d-46f7-86f3-99b9eafd3f2b/mainnet/"],
            },
        },
         blockExplorers: {
             etherscan: {
                 name: "Gnosisscan",
                 url: "https://gnosisscan.io/",
            },
             default: {
                 name: "Gnosis Chain Explorer",
                 url: "https://blockscout.com/xdai/mainnet/",
            },
        },
    } as const satisfies Chain;

export const polygon = {
     id: 137,
     name: "Polygon",
     network: "matic",
     nativeCurrency: {
         name: "MATIC",
         symbol: "MATIC",
         decimals: 18,
    },
     rpcUrls: {
         alchemy: {
             http:  ["https://polygon-mainnet.g.alchemy.com/v2"],
             webSocket:  ["wss://polygon-mainnet.g.alchemy.com/v2"],
        },
         infura: {
             http:  ["https://polygon-mainnet.infura.io/v3"],
             webSocket:  ["wss://polygon-mainnet.infura.io/ws/v3"],
        },
         default: {
             http:  ["https://rpc.eu-north-1.gateway.fm/v4/polygon/non-archival/mainnet"],
        },
         public: {
             http:  ["https://rpc.eu-north-1.gateway.fm/v4/polygon/non-archival/mainnet"],
        },
    },
     blockExplorers: {
         etherscan: {
             name: "PolygonScan",
             url: "https://polygonscan.com",
        },
         default: {
             name: "PolygonScan",
             url: "https://polygonscan.com",
        },
    }
} as const satisfies Chain;

export const optimism = {
     id: 10,
     name: "Optimism",
     network: "optimism",
     nativeCurrency: {
         name: "Ether",
         symbol: "ETH",
         decimals: 18,
    },
     rpcUrls: {
         alchemy: {
             http:  ["https://opt-mainnet.g.alchemy.com/v2"],
             webSocket:  ["wss://opt-mainnet.g.alchemy.com/v2"],
        },
         infura: {
             http:  ["https://optimism-mainnet.infura.io/v3"],
             webSocket:  ["wss://optimism-mainnet.infura.io/ws/v3"],
        },
         default: {
             http:  ["https://rpc.eu-north-1.gateway.fm/v4/optimism/non-archival/mainnet"],
        },
         public: {
             http:  ["https://rpc.eu-north-1.gateway.fm/v4/optimism/non-archival/mainnet"],
        },
    },
     blockExplorers: {
         etherscan: {
             name: "Etherscan",
             url: "https://optimistic.etherscan.io",
        },
         default: {
             name: "Optimism Explorer",
             url: "https://explorer.optimism.io",
        },
    },
     contracts: {
         multicall3: {
             address: "0xca11bde05977b3631167028862be2a173976ca11",
             blockCreated: 4286263,
        },
    },
} as const satisfies Chain;