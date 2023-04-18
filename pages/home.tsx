import React from "react";
import Link from "next/link";
import Image from "next/image";
import mitchPinPreview from "../images/mitchPinPreview.png";


export default function HomePage() {
      return (
        <div className=' min-h-screen bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]'>

        <div className="p-3 px-4" >
             <div className="fixed z-30 top-30 right-1 float-right p-4 pl-6 md:max-w-[40%] md:inline sm:block hidden">
              <Image src={mitchPinPreview} alt="preview of a mitch pin to mint" width={500} height={500} />
             </div>
             <div className="bg-white/40 dark:bg-black/40 md:max-w-[60%] p-5 rounded-2xl ">
            <h1 className="m-auto text-center my-2 text-4xl xl:text-6xl font-extrabold">Welcome to the Place to Mint some Mitch</h1>
        <div className="text-lg font-medium space-y-3"><p>This page is a project made with love by me Mitch where you can mint your own "Mitch Pins" as NFTs and help the IRL Mitch reach his web3 goals! </p>
            <h3 className="text-3xl">So... this is a NFT fundraiser?</h3>
            <p>Yup, I am trying to up my web3 game by participating in the decentralization of Ethereum, my goal from Mint Mitch is to acquire the 32 ETH needed to run my own home validator. Big goal tings!<br/> I have already the hardware and am a seasoned Goerli and Gnosis Chain validator so I'm ready for the challenge!
             </p>
             <h3 className="text-3xl">What's the deal with Mitch?</h3>
             <p>I imagine most of you visiting this page are my beloved friends, but if for some reason this bad boy goes viral I'll give you a brief history of Mitch.</p> 
             <hr className="border-t border-gray-400 dark:border-gray-300 my-4" />

             <p>The notorious 'Mitch Pin' phenomenom started back in 2013 with my friend Kyle, whom some of you might remember <a className="text-purple-600" target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/One_red_paperclip">as this guy</a>,
             Took some photos of me from Facebook, made them into pins and started handing them out to our friends, without my knowledge. Hilarity ensued, as more "Mitch Pins" kept turning up in progressively weirder places for the next decade. </p>
             <p>Fast forward to 2020, myself (Mitch) lost my career as a chef to the pandemic and began learning to code as a hobby, in the jungles of Costa Rica. I kept at it and the more I learned the more I thirsted. I finally dreamt up this project, Mint Mitch, that I could build myself and combine all my web3 developer goals with a bit of that ol' Mitch flavour.</p>
             <p>This is all made with love by me, the smart contracts, the website, the artwork, everything! I hope you enjoy the Mitchs and buy a couple, thanks for reading!</p>
             <button className="border-solid border-2 border-grey-200 bg-cyan-500/70 hover:bg-cyan-400/70 rounded-xl my-2 p-2 font-bold" ><Link href="/store">Enough, take me to the Mitchs!</Link></button>
             </div>
        </div>
        </div>
        </div>
      )

}
