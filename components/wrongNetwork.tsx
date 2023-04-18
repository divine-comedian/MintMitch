import React from "react";

interface WrongNetworkProps {
    rightNetwork: string | null;

}

export const WrongNetwork: React.FC<WrongNetworkProps> = ({ rightNetwork }) => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]'>  
        <div className="p-4 flex justify-center">
        <div className="place-content-center  max-w-[80%] text-2xl p-10 text-center z-40 border-solid border-2 bg-orange-300/30 font-bold rounded-lg border-grey-600 ">   
                <p>You are connected to the Wrong Network!</p>
                <p>Please connect to {rightNetwork}</p>
        </div>
            </div>   
        </div>
    )
}