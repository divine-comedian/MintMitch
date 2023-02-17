import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import HomePage from './home';
import Navbar from '../components/navbar'
import React, { useEffect } from 'react';

const Home: NextPage = () => {
  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Mint Mitch</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/Favicon.ico" />
      </Head>
      <Toaster />
      <Navbar />
      <HomePage />
     
    </div>
  )
}


export default Home