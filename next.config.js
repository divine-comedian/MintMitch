/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    IPFS_GATEWAYS: process.env.IPFS_GATEWAYS,
    ETHERSCAN_URL: process.env.ETHERSCAN_URL,
    GNOSIS_CONTRACT_ADDRESS: process.env.GNOSIS_CONTRACT_ADDRESS,
    MUMBAI_CONTRACT_ADDRESS: process.env.MUMBAI_CONTRACT_ADDRESS,
    NEXT_PUBLIC_GNOSISSCAN_URL: process.env.NEXT_PUBLIC_GNOSISSCAN_URL,
    NEXT_PUBLIC_MUMBAI_URL: process.env.NEXT_PUBLIC_MUMBAI_URL,
    GNOSIS_RPC_URL: process.env.GNOSIS_RPC_URL,
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/token',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
}
