import React from "react";

interface WrongNetworkProps {
    rightNetwork: string | null;

}

export const WrongNetwork: React.FC<WrongNetworkProps> = ({ rightNetwork }) => {
    return (
        <div className="container place-content-center mt-20  border-solid border-2 bg-orange-300 rounded-lg border-grey-600 ">
            <div className="text-xl p-10 text-center">
                <p>You are connected to the Wrong Network!</p>
                <p>Please connect to {rightNetwork}</p>
            </div>
        </div>
    )
}