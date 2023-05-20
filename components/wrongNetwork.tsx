import React from "react";
import { useEffect, useState } from "react";
import ConnectWallet from './connectWallet'

interface WrongNetworkProps {
    rightNetwork: string[] | null;

}

export const WrongNetwork: React.FC<WrongNetworkProps> = ({ rightNetwork }) => {
    const [networksFormatted, setNetworksFormatted] = useState<string>("")
    const formatNetworkMessage = (networkArray: string[]) => {
        const formattedNetworks = networkArray.map((network) => {
            if (network === 'polygonMumbai') {
                return 'Polygon Mumbai'
            } else if (network === 'polygon') {
                return 'Polygon'
            } else if (network === 'goerli') {
                return 'Goerli'
            } else if (network === 'gnosis') {
                return 'Gnosis'
            } else if (network === 'optimism') {
                return 'Optimism'
            } else if (network === 'arbitrum') {
            return 'Arbitrum'
        }
    })
    return formattedNetworks.join(', ')
}
     useEffect(() => {
        if (rightNetwork) {
            setNetworksFormatted(formatNetworkMessage(rightNetwork!))
        }
     }, [rightNetwork])
    return (
        <div className='min-h-screen z-30'>  
        <div className="p-4 flex justify-center">
        <div className="place-content-center max-w-[100%] text-2xl p-10 text-center border-solid border-2 bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800] font-bold rounded-lg border-grey-600 ">   
                <p>You are connected to the Wrong Network!</p>
                {rightNetwork && networksFormatted ? 
                <p>Please connect to any of the following networks: <br /> {networksFormatted}</p> : null}
                <div className="pt-4 grid justify-items-center ">
                <ConnectWallet />
                </div>
        </div>
            </div>   
        </div>
    )
}