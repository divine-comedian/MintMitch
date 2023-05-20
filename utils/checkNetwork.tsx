import { getNetwork } from '@wagmi/core';

export const checkNetwork = (network: string) => {
    const correctNetworksDevelop = ['goerli', 'maticmum', 'gnosis']
    const correctNetworksProduction = ['polygon','optimism', 'gnosis']
    if (process.env.NODE_ENV === 'development' && correctNetworksDevelop.includes(network)) {
        return [true, correctNetworksDevelop]
    } else if (process.env.NODE_ENV === 'production' && correctNetworksProduction.includes(network)) {
        return [true, correctNetworksProduction]
    } else if (process.env.NODE_ENV === 'development' && !correctNetworksDevelop.includes(network)) { 
        return [false, correctNetworksDevelop]
    }
    else if (process.env.NODE_ENV === 'production' && !correctNetworksProduction.includes(network)) {
        return [false, correctNetworksProduction]
    }
}
