import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config();

export const accounts = process.env.DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.DEPLOYER_PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.15",

  networks: {
    trust: {
      url: "https://api.testnet-dev.trust.one/",
      accounts,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/95f65ab099894076814e8526f52c9149",
      accounts,
    },
  },
};

export default config;
