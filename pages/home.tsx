import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import mitchPinPreview from '../images/mitchPinPreview.png'
import mitchPinCaptured from '../images/MitchPinsCaptured.jpg'

export default function HomePage() {
  return (
    <div className=" min-h-screen bg-gradient-to-br from-[#9D4EDD] to-[#FF9E00] dark:from-[#240046] dark:to-[#ff4800]">
      <div className="p-3 px-4">
        <div className="fixed top-30 right-1 float-right p-4 pl-6 md:max-w-[40%] md:inline sm:block hidden">
          <Image src={mitchPinPreview} alt="preview of a mitch pin to mint" width={500} height={500} />
        </div>
        <div className="bg-white/40 dark:bg-black/40 md:max-w-[60%] p-5 rounded-2xl ">
          <h1 className="m-auto text-center my-2 text-4xl xl:text-6xl font-extrabold">
            Welcome to the Place to Mint some Mitch
          </h1>
          <div className="text-lg font-medium space-y-3">
            <p>
              This page is a project made with love by me Mitch (NOT WITH AI) where you can mint your own "Mitch Pins"
              as NFTs and help the IRL Mitch reach his web3 goals!{' '}
            </p>
            <h3 className="text-3xl">So... this is a NFT fundraiser?</h3>
            <p>
              Yep, you got me there. I am aiming to raise enough of that sweet sweet crypto to afford to become an
              Ethereum Validator. This has been a big goal of mine since I began in earnest my web3 journey in 2020.
            </p>
            <p>
              <i>But wait, there's more...</i>
            </p>
            <p>
              Each Mitch NFT that you mint on the following page will also net you a $MITCH token. $MITCH will have a
              variety of uses but the most exciting one will be that $MITCH holders will be able to control where the
              validator rewards are sent for one full year after the validator goes online.
            </p>
            <p>
              <b>
                Want to earn a cool 5-7% interest on 32 ETH you didn't have to buy and hardware you didn't have to run?
                Come and get it! Want to DONATE that interest to your favourite public good? Now we're talkin'.
              </b>
            </p>
            <h3 className="text-3xl">What's the deal with Mitch?</h3>
            <p>
              I imagine most of you visiting this page are my beloved friends, but if for some reason this bad boy goes
              viral I'll give you a brief history of Mitch and the madness of Mitch Pins.
            </p>
            <hr className="border-t border-gray-400 dark:border-gray-300 my-4" />
            <p>
              The notorious 'Mitch Pin' phenomenom started back in 2013 with my friend Kyle, whom some of you might
              remember{' '}
              <a
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/One_red_paperclip"
              >
                as this guy
              </a>
              , took some photos of me from Facebook, made them into pins and started giving them away to our mutual
              friends, without my knowledge.
            </p>{' '}
            <p className="pb-5">
              Hilarity ensued as more "Mitch Pins" kept turning up in progressively weirder places for the next decade.{' '}
            </p>
            <div className="grid justify-items-center border-solid border-[8px] ml-[10%] rounded-lg border-cyan-400/30 inline-block overflow-hidden w-fit">
              <Image src={mitchPinCaptured} width={600} alt="A collection of geniuine mitch pins" />
            </div>
            <p className="pt-5">
              Fast forward to 2020, I (Mitch) lost my career as a professional chef to the pandemic and began learning
              to code as a hobby, while escaping the city life to the jungles of Costa Rica.
            </p>
            <p>
              I kept at it and the more I learned, the more I wanted to dive deeper. In early 2023 I finally dreamt up
              this project, Mint Mitch, that I could use to challenge my self-taught developer skills and accomplish my
              larger web3 goals
            </p>
            <p>
              This is all made with love by me (Mitch), the smart contracts, the website, the artwork, everything! I
              hope you enjoy the Mitchs and buy a couple, thanks for reading!
            </p>
            <button className="border-solid border-2 border-grey-200 bg-cyan-500/70 hover:bg-cyan-400/70 rounded-xl my-2 p-2 font-bold">
              <Link href="/store">Enough talk, take me to the Mitchs!</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
