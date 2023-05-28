import React from 'react'
import { useEffect, useState } from 'react'
import ConnectWallet from './connectWallet'
import { constants } from '../utils/constants'

interface WrongNetworkProps {
  isRightNetwork: string[] | null
}

export const WrongNetwork: React.FC<WrongNetworkProps> = ({ isRightNetwork }) => {
  const [networksFormatted, setNetworksFormatted] = useState<string>('')
  let networkNames: String[]
  if (process.env.NODE_ENV === 'development') {
    networkNames = constants.DEVELOPMENT_CHAINS.map((chain) => 
      chain.name.toString())
    } else {
      networkNames = constants.PRODUCTION_CHAINS.map((chain) => 
      chain.name.toString())
    }

  useEffect(() => {
    if (isRightNetwork) {
      setNetworksFormatted(networkNames.join(', '))
    }
  }, [isRightNetwork])
  return (
    <div className="min-h-screen z-30">
      <div className="p-4 flex justify-center">
        <div className="place-content-center max-w-[100%] text-2xl p-10 text-center border-solid border-2 bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800] font-bold rounded-lg border-grey-600 ">
          <p>You are connected to the Wrong Network!</p>
          {isRightNetwork && networksFormatted ? (
            <p>
              Please connect to any of the following networks: <br /> {networksFormatted}
            </p>
          ) : null}
          <div className="pt-4 grid justify-items-center ">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </div>
  )
}
