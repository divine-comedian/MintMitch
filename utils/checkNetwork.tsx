import { getNetwork } from '@wagmi/core';
import { constants } from './constants';

export const checkNetwork = (network: string) => {
    const correctNetworksDevelop = constants.DEVELOPMENT_CHAINS
    .map(chain => chain.network.toString())
    const correctNetworksProduction = constants.PRODUCTION_CHAINS.map(chain => chain.network.toString())
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
