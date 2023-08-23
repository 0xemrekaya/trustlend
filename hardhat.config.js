require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",

  paths: {
    artifacts: './src/artifacts',
  },
  networks: {

    haqqTest: {
      url: process.env.RPC_URL_HAQQTEST2,
      accounts: [process.env.ACCOUNT1_PRIVATEKEY]
    },
    // goerli: {
    //   url: process.env.GOERLI_RPC_URL,
    //   accounts: [process.env.PRIVATE_KEY]

    // },
  },
};
