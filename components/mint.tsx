import React from 'react'
import { useWaitForTransaction, useAccount } from 'wagmi'
import { getAccount } from '@wagmi/core'
import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import {
  mintBatchTokens,
  MintingContractProps,
  mintBatchTokensNative,
  mintTokens,
  mintTokensNative,
  approveTokens,
} from '../utils/ContractHelper'
import { formatEther, parseEther } from 'ethers/lib/utils.js'

interface MintItems {
  itemsArray: any[]
  itemSum: BigNumber
  isMintModal: Function
  isNativeMintEnabled: boolean
  contractProps: MintingContractProps
  updateBalance: boolean
  setUpdateBalance: Function
  userBalance: BigNumber
}

const LoadingSpinner = () => {
  return (
    <svg
      className="animate-spin h-6 w-6 text-gray-700 float-left inline mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.962 1.684 5.507 4 6.938l2-1.647z"
      ></path>
    </svg>
  )
}

export const MintModal = ({
  itemsArray,
  itemSum,
  isMintModal,
  isNativeMintEnabled,
  contractProps,
  setUpdateBalance,
  userBalance,
}: MintItems) => {
  const tokenId = itemsArray[0].tokenID
  const twitterLink = contractProps.nftExplorerLink + '0x' + contractProps.address + '/' + tokenId
  const tokenBatchIds = itemsArray.map((item) => item.tokenID)
  const tokenLinks = itemsArray.map((item) => (
    <li className="text-purple-600 py-1 text-lg hover:text-purple-700 font-bold" key={item.tokenID}>
      {' '}
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={`${contractProps.nftExplorerLink}0x` + contractProps.address + '/' + item.tokenID}
      >
        {item.tokenName}
      </a>
    </li>
  ))
  const tokenAmounts = itemsArray.map((item) => 1)
  const [mintTxHash, setMintTxHash] = useState<string | undefined>(undefined)
  const [approveTxHash, setApproveTxHash] = useState<string | undefined>(undefined)
  const [mintState, setMintState] = useState<string>('not approved')
  const connectedAddress = useAccount().address as string
  const [errorMessage, setErrorMessage] = useState<string>('')

  const waitForMint = useWaitForTransaction({
    hash: `0x${mintTxHash}`,
    onError(data) {
      console.log('mint tx error', data)
      setMintState('mint error')
      setErrorMessage(data.message)
    },
    onSuccess(data) {
      console.log('mint tx has succeeded', data)
      setMintState('minted')
      setUpdateBalance(data)
    },
    onSettled(data) {
      console.log('mint tx has settled', data)
    },

    enabled: false,
  })

  const waitForApprove = useWaitForTransaction({
    hash: `0x${approveTxHash}`,
    onError(data) {
      console.log('approve tx error', data)
      setMintState('approve error')
      setErrorMessage(data.message)
    },
    onSuccess(data) {
      console.log('approve tx has succeeded', data)
      setMintState('approved')
    },
    onSettled(data) {
      console.log('approve tx has settled', data)
    },

    enabled: false,
  })

  const handleMint = async () => {
    if (isNativeMintEnabled) {
      if (itemsArray.length > 1) {
        setMintState('mint pending')
        mintBatchTokensNative(connectedAddress, tokenBatchIds, tokenAmounts, itemSum, contractProps)
          .then((response) => {
            setMintTxHash(response.hash.substring(2))
          })
          .catch((error) => {
            console.log('this is a minting error', error)
            setMintState('mint error')
            setErrorMessage(error.message)
          })
      } else {
        setMintState('mint pending')
        mintTokensNative(connectedAddress, tokenId, 1, itemSum, contractProps)
          .then((response) => {
            setMintTxHash(response.hash.substring(2))
          })
          .catch((error) => {
            console.log('this is a minting error', error)
            setMintState('mint error')
            setErrorMessage(error.message)
          })
      }
    } else if (connectedAddress) {
      if (itemsArray.length > 1) {
        setMintState('mint pending')
        mintBatchTokens(connectedAddress, tokenBatchIds, tokenAmounts, contractProps)
          .then((response) => {
            setMintTxHash(response.hash.substring(2))
          })
          .catch((error) => {
            console.log('this is a minting error', error)
            setMintState('mint error')
            setErrorMessage(error.message)
          })
      } else {
        setMintState('mint pending')
        mintTokens(connectedAddress, tokenId, 1, contractProps)
          .then((response) => {
            setMintTxHash(response.hash.substring(2))
          })
          .catch((error) => {
            console.log('this is a minting error', error)
            setMintState('mint error')
            setErrorMessage(error.message)
          })
      }
    } else {
      console.log('account is undefined', connectedAddress)
    }
  }
  const handleApprove = async () => {
    console.log(mintTxHash)
    const connectedAddress = await getAccount().address?.toString().substring(2)
    if (connectedAddress) {
      setMintState('approve pending')
      approveTokens(parseEther(itemSum.toString()), contractProps)
        .then((response) => {
          {
            setApproveTxHash(response.hash.substring(2))
          }
        })
        .catch((error) => {
          console.log('this is an approve error', error)
          setMintState('approve error')
          setErrorMessage(error.message)
        })
    } else {
      console.log('account is undefined', connectedAddress)
    }
  }

  const handleError = () => {
    if (isNativeMintEnabled) {
      setMintState('native token')
    } else {
      setMintState('not approved')
    }
  }

  useEffect(() => {
    if (isNativeMintEnabled) {
      console.log('native minting is enabled')
      setMintState('native token')
    }
  }, [isNativeMintEnabled])

  useEffect(() => {
    if (approveTxHash) {
      console.log('approve tx hash', approveTxHash)
      waitForApprove.refetch()
    }
  }, [approveTxHash])

  useEffect(() => {
    if (mintTxHash) {
      console.log('mint tx hash', mintTxHash)
      waitForMint.refetch()
    }
  }, [mintTxHash])

  const mintStateRender = () => {
    switch (mintState) {
      case 'not approved':
        return (
          <div className="space-y-2 font-medium dark:text-white text-black">
            <p>Hold tight, just a few more clicks.</p>
            <p> Approve spending {parseFloat(formatEther(itemSum))} WETH, once you've approved to spend the tokens you'll need to Mint.</p>
            <button
              className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleApprove()
              }}
            >
              Approve
            </button>
          </div>
        )
      case 'approve pending':
        return (
          <div className="space-y-2 font-medium dark:text-white">
            <p>Hold tight, just a few more clicks.</p>{' '}
            <p>Approve spending {parseFloat(formatEther(itemSum))} WETH, once you've approved to spend the tokens you'll need to Mint.</p>
            <button className="bg-gray-500 cursor-default text-gray-700 font-bold py-2 px-4 rounded" disabled>
              <LoadingSpinner />
              Approving...
            </button>
          </div>
        )
      case 'approved':
        return (
          <div className="space-y-2 font-medium dark:text-white">
            <p className="dark:text-green-300 text-green-700 font-bold">Approved</p>{' '}
            <p>Almost there! Keep clicking to mint those mitches!</p>
            <button
              className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleMint()
              }}
            >
              Mint
            </button>
          </div>
        )
      case 'native token':
        return (
          <div className="space-y-2 font-medium dark:text-white">
            {' '}
            <p>Let's Mint that Mitch!</p>
            <button
              className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleMint()
              }}
            >
              Mint
            </button>
          </div>
        )
      case 'approve error':
        return (
          <div className="space-y-2 font-medium dark:text-white">
            <p>
              An error occured: <i>{errorMessage}</i>! <br />{' '}
              {approveTxHash ? <p>Check this transaction data: {approveTxHash}</p> : ''}
            </p>{' '}
            <button
              className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleError()
              }}
            >
              Try Again
            </button>
          </div>
        )
      case 'mint error':
        return (
          <div className="space-y-2 font-medium dark:text-white">
            <p>
              An error occured: <i>{errorMessage}</i>! <br />{' '}
              {mintTxHash ? <p>Check this transaction data: {mintTxHash}</p> : ''}
            </p>{' '}
            <button
              className="active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleError()
              }}
            >
              Try Again
            </button>
          </div>
        )
      case 'mint pending':
        return (
          <button className="bg-gray-500 cursor-default text-gray-700 font-bold py-2 px-4 rounded" disabled>
            <LoadingSpinner />
            Minting...
          </button>
        )
      case 'minted':
        return (
          <div className="space-y-2 font-medium dark:text-white">
            <p>Amazing! Thank you so much for minting some mitch and supporting me in my goals!</p>

            <h3 className="text-xl font-bold">Check out your Mitch's here:</h3>
            <ul>{tokenLinks}</ul>

            <p>
              You also received {itemsArray.length} $MITCH token{itemsArray.length > 1 ? 's' : ''}. Remember:{' '}
              <i>...with great $MITCH comes great responsibility...</i>
              <div className="py-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I just minted a Mitch Pin NFT, check it out on the blockchain. 😎 \n ${twitterLink} \n\n Support Mitch (@divine_comedian) and get a chance at earning ETH rewards for your project! 🙌 \n https://mintmitch.xyz \n`,
                  )}&hashtags=MintMitch`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="twitter-share-button active:scale-90 transition-transform duration-100 bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-2xl"
                  data-size="large"
                  data-url="https://mintmitch.xyz"
                  data-show-count="false"
                >
                  <button>Share on Twitter 💖</button>
                </a>
                <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
              </div>
            </p>
            <p>
              <a
                className=" hover:dark:gray-300 hover:text-gray-700 font-bold"
                target="_blank"
                rel="noopener noreferrer"
                href={contractProps.explorerLink + 'tx/0x' + mintTxHash}
              >
                View your minting transaction.
              </a>
            </p>
          </div>
        )
      default:
        return (
          <button className="bg-gray-500 cursor-default text-gray-700 font-bold py-2 px-4 rounded" disabled>
            One sec...
          </button>
        )
    }
  }

  return (
    <div className=" bg-gradient-to-r from-cyan-400 to-blue-400 dark:from-blue-600 dark:to-cyan-600 max-w-[500px] md:min-w-[400px] xs:w-[200px] p-4 m-4 rounded-lg">
      <div className="float-right">
        <button
          className="font-bold text-lg py-0.5 px-2 hover:rounded-full hover:bg-gray-300/80"
          onClick={() => isMintModal(false)}
        >
          X
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Minting Time. 😎 </h2>
      <div className="text-gray-600">
        {userBalance.lt(itemSum) ? (
          <p className="text-red-600 text-lg">You don't have the required funds! Your current balance is {parseFloat(formatEther(itemSum))} </p>
        ) : (
          mintStateRender()
        )}
      </div>
    </div>
  )
}
