import { constants } from './constants';

export const checkNetwork = (network: string) => {
    const correctNetworksDevelop = constants.DEVELOPMENT_CHAINS
    .map(chain => chain.network.toString())
    const correctNetworksProduction = constants.PRODUCTION_CHAINS.map(chain => chain.network.toString())
    const environment = process.env.NODE_ENV
    
    if (environment === 'development' && correctNetworksDevelop.includes(network)) {
        return [true, correctNetworksDevelop]
    } else if (environment === 'production' && correctNetworksProduction.includes(network)) {
        return [true, correctNetworksProduction]
    } else if (environment === 'development' && !correctNetworksDevelop.includes(network)) { 
        return [false, correctNetworksDevelop]
    }
    else if (environment === 'production' && !correctNetworksProduction.includes(network)) {
        return [false, correctNetworksProduction]
    }
}
