import React from "react";
import Link from "next/link";
import Image from "next/image";
import mitchPinPreview from "../images/mitchPinPreview.png";


export default function HomePage() {
      return (
        <div className=' min-h-screen bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]'>

        <div className="p-3 px-4" >
             <div className="float-right p-4 pl-6 md:max-w-[40%] md:inline xs:block">
              <Image src={mitchPinPreview} alt="preview of a mitch pin to mint" width={500} height={500} />
             </div>
             <div className="bg-white/40 dark:bg-black/40 md:max-w-[60%] p-5 rounded-2xl ">
            <h1 className="m-auto text-center my-2 text-4xl xl:text-6xl font-extrabold">Welcome to the Place to Mint some Mitch</h1>
        <div className="text-lg font-medium space-y-3"><p>This page is a project made with love where you can mint your own Mitch inspired NFT and help the IRL Mitch reach his goals</p>
            <h3 className="text-3xl">What are we raising money for?</h3>
            <p>I am looking for funds to acquire my very own Ethereum Validator, I currently have all I need to run my own validator and I already run my own dappnodes on gnosis chain and goerli. Funds raised will go towards accruing the 32 ETH I need in order to make the deposit!
             </p>
             <h3 className="text-3xl">What's the deal here?</h3>
             <p>I started my web3 journey blah blah I self-taught myself how to do this over the last year or so, everything is nearly made from scratch, the website from scratch, the smart contract, launching a website, everything!!!</p>
             <button className="border-solid border-2 border-grey-200 bg-cyan-500/70 hover:bg-cyan-400/70 rounded-xl my-2 p-2 font-bold" ><Link href="/store">Enough, take me to the Mitchs!</Link></button>
             </div>
        </div>
        </div>
        </div>
      )

}
