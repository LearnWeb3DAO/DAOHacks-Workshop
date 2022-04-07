import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

/**
 * You need to create a `.env` file for this configuration to work
 * so it can read values from `process.env`
 * There is a `.env.example` file to look at for how it should look
 *
 * For `ROPSTEN_URL`, you can get a URL by signing up for a free Ropsten node
 * on Alchemy or Infura
 *
 * For `PRIVATE_KEY`, you can export a private key from Metamask that
 * has some Ropsten ETH.
 * PLEASE DONT USE A PRIVATE KEY WHICH HAS MAINNET FUNDS ON IT
 *
 * For `ETHERSCAN_API_KEY`, sign up for an account at etherscan.io
 * and get your API Key from there
 */

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
