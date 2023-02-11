import {Link} from "react-router-dom";
import { Router, Route } from 'react-router-dom';


export default function HomePage() {
      return (
        <div className="container" >
            <h1>Welcome to the Place to Mint some Mitch</h1>
            <p></p>
        <div><p>This page is a project made with love where you can mint your own Mitch inspired NFT and help the IRL Mitch reach his goals</p>
            <h3>What are we raising money for?</h3>
            <p>I am looking for funds to acquire my very own Ethereum Validator, I currently have all I need to run my own validator and I already run my own dappnodes on gnosis chain and goerli. Funds raised will go towards accruing the 32 ETH I need in order to make the deposit!
             </p>
             <h3>What's the deal here?</h3>
             <p>I started my web3 journey blah blah I self-taught myself how to do this over the last year or so, everything is nearly made from scratch, the website from scratch, the smart contract, launching a website, everything!!!</p>
             <button><a>Take me to your NFTs</a></button>
        </div>
        </div>
      )

}
