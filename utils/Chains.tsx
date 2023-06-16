import { Chain } from "@wagmi/core";

export const gnosis: Chain = {
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
                 http:  [process.env.NEXT_PUBLIC_GNOSIS_RPC_URL as string],
            },
             public: {
                 http:  [process.env.NEXT_PUBLIC_GNOSIS_RPC_URL as string],
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
    }

export const polygon: Chain = {
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
             http:  [process.env.NEXT_PUBLIC_GATEWAY_POLYGON_RPC as string],
        },
         public: {
             http:  [process.env.NEXT_PUBLIC_GATEWAY_POLYGON_RPC as string],
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
}

export const optimism: Chain = {
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
             http:  [process.env.NEXT_PUBLIC_GATEWAY_OPTIMISM_RPC as string],
        },
         public: {
             http:  [process.env.NEXT_PUBLIC_GATEWAY_OPTIMISM_RPC as string],
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
}