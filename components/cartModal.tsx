import React from "react";

interface cartItems {
    itemsArray: any[];
    itemSum: number;
}

export const CartModal = ({ itemsArray, itemSum }: cartItems) => {
    const cartItems = Array.from(itemsArray).map((item) => <li key={item.tokenID}> {item.tokenName} {item.tokenPrice}</li>)
    return (
        <div className="box-content border-solid border-2 lg:w-96  bg-orange-300 dark:bg-orange-800 rounded-lg border-grey-600 ">
            <div className="p-4">
            <p>Here's your mitch's so far:</p>
            <ul>{itemsArray.length === 0 ? "No items added yet! :'(" : cartItems }</ul>
            <p>Cart total: {itemSum}</p>
            <button className="mt-2 py-2 px-4 bg-amber-500 hover:bg-amber-400 rounded-full border-solid border-2 border-grey-600"><b>Mint Mitch!</b></button>
            </div>
        </div>
    )
}