require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-gas-reporter')

 const { ETH_PRIVATE_KEY, ETHERSCAN_API_KEY, COIN_MARKETCAP_API_KEY, ETH_MAINNET_PRIVATE_KEY, ALCHEMY_GOERLI_URL } = process.env

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    gasReporter: {
      currency: 'USD',
      coinmarketcap: COIN_MARKETCAP_API_KEY,
      url: 'https://eth-mainnet.alchemyapi.io/v2/GBjvplStTQ2x1FiAa5-5Qdyv2_8ZBuwe',
    },
    goerli: {
      url: `${ALCHEMY_GOERLI_URL}`,
      account: [`0x${ETH_PRIVATE_KEY}`]
    },
    mainnet: {
      url: 'https://eth-mainnet.alchemyapi.io/v2/GBjvplStTQ2x1FiAa5-5Qdyv2_8ZBuwe',
      account: [`0x${ETH_MAINNET_PRIVATE_KEY}`]
    },
  },
  etherscan: { apiKey: ETHERSCAN_API_KEY },
}
