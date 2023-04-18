import React from "react";

interface cartItems {
    itemsArray: any[];
    itemSum: number;
    isMintModal: Function;
}




export const CartModal = ({ itemsArray, itemSum, isMintModal}: cartItems) => {
    const cartItems = Array.from(itemsArray).map((item) => <li key={item.tokenID}> {item.tokenName} {item.tokenPrice}</li>)
    return (
        <>
        <div className="box-content border-solid border-2 lg:w-96  bg-orange-300 dark:bg-orange-800 rounded-lg border-grey-600 ">
            <div className="p-4 space-y-1">
            <h3 className="text-lg font-semibold">Current Mitch Cart</h3>
            <hr className="border-t border-gray-400 dark:border-gray-300 my-4" />

            <ul>{itemsArray.length === 0 ? "No items added yet! :'(" : cartItems }</ul>
            <p>Final Price: {itemSum} WETH</p>
            <button className={itemsArray.length === 0 ? "p-3 bg-gray-200 text-gray-400 cursor-default rounded-lg mt-2" : " mt-2 p-3 bg-orange-400 dark:bg-orange-600 hover:bg-orange-600 hover:dark:bg-orange-700 rounded-lg active:scale-90 transition-transform duration-100" }
            onClick={ () => isMintModal(true)}>
                Mint Mitch!</button>
            </div>
            
        </div>
            </>
    )
}