/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_GNOSIS_RPC_URL: process.env.NEXT_PUBLIC_GNOSIS_RPC_URL,
    IPFS_GATEWAY: process.env.IPFS_GATEWAY,
    NEXT_PUBLIC_GATEWAY_OPTIMISM_RPC: process.env.NEXT_PUBLIC_GATEWAY_OPTIMISM_RPC,
    NEXT_PUBLIC_GATEWAY_POLYGON_RPC: process.env.NEXT_PUBLIC_GATEWAY_POLYGON_RPC,
    NEXT_PUBLIC_GNOSIS_RPC_URL: process.env.NEXT_PUBLIC_GNOSIS_RPC_URL,
    NEXT_PUBLIC_POLYGONMUMBAI_RPC_URL: process.env.NEXT_PUBLIC_POLYGONMUMBAI_RPC_URL,
    WALLET_CONNECT_PROJECT: process.env.WALLET_CONNECT_PROJECT,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
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
