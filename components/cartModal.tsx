import React from 'react'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { nftData } from '../pages/store.jsx'

interface cartItems {
  itemsArray: nftData[]
  itemSum: bigint
  isMintModal: Function
  paymentTokenSymbol: string
  userBalance: bigint
  emptyCart: Function
  isMysteryMint: boolean
}

export const CartModal = ({
  userBalance,
  itemsArray,
  itemSum,
  isMintModal,
  paymentTokenSymbol,
  emptyCart,
  isMysteryMint,
}: cartItems) => {
  const [tokenSymbol, setTokenSymbol] = useState('ETH')
  const cartItems = Array.from(itemsArray).map(
    (item) => (
      console.log('token name on cart modal', item.name),
      (
        <li key={item.tokenId}>
          {' '}
          {isMysteryMint ? '????' : item.name}: {formatEther(item.tokenPrice)} {tokenSymbol}
        </li>
      )
    ),
  )

  useEffect(() => {
    setTokenSymbol(paymentTokenSymbol)
  }, [paymentTokenSymbol])

  return (
    <>
      <div className="box-content border-solid border-2 lg:w-96  bg-orange-300 dark:bg-orange-800 rounded-lg border-grey-600 ">
        <div className="p-4 space-y-1">
          <div>
            <h3 className=" inline text-lg font-semibold">Current Mitch Cart</h3>
            <button
              className={
                itemsArray.length === 0
                  ? 'inline float-right text-xs p-1 bg-gray-200 text-gray-400 cursor-default rounded-lg'
                  : 'inline float-right text-xs p-1 bg-orange-400 dark:bg-orange-700 rounded-lg active:scale-90 transition-transform duration-100'
              }
              disabled={itemsArray.length === 0}
              onClick={() => emptyCart()}
            >
              Empty Cart
            </button>
          </div>
          <hr className="border-t border-gray-400 dark:border-gray-300 my-4" />

          <ul>{itemsArray.length === 0 ? "No items added yet! :'(" : cartItems}</ul>
          <p>
            Final Price: {parseFloat(formatEther(itemSum))} {tokenSymbol}
          </p>
          {userBalance !== undefined ? (
            <p className="text-sm">
              Your Wallet Balance: {parseFloat(formatEther(userBalance)).toFixed(4)} {tokenSymbol}{' '}
            </p>
          ) : null}
          <button
            className={
              itemsArray.length === 0
                ? 'p-3 bg-gray-200 text-gray-400 cursor-default rounded-lg mt-2'
                : 'font-bold text-lg mt-2 p-3 bg-orange-400 dark:bg-orange-600 hover:bg-orange-600 hover:dark:bg-orange-700 rounded-lg active:scale-90 transition-transform duration-100'
            }
            disabled={itemsArray.length === 0}
            onClick={() => isMintModal(true)}
          >
            Mint Mitch!
          </button>
        </div>
      </div>
    </>
  )
}
