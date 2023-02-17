const envVars = {
  API_URL: String(process.env.NEXT_PUBLIC_APIURL),
  NEXT_PUBLIC_CONTRACT_ADDRESS: String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS),
  NEXT_PUBLIC_ALCHEMY_ID: String(process.env.NEXT_PUBLIC_ALCHEMY_ID),
  NEXT_PUBLIC_INFURA_ID: String(process.env.NEXT_PUBLIC_INFURA_ID),
  NEXT_PUBLIC_ETHERSCAN_API_KEY: String(process.env.ETHERSCAN_API_KEY),
}

export default envVars
