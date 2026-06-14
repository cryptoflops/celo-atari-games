import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const privateKey = process.env.CELO_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    celoSepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: [privateKey],
      chainId: 11142220,
    },
    celoMainnet: {
      url: "https://forno.celo.org",
      accounts: [privateKey],
      chainId: 42220,
    },
  },
  etherscan: {
    apiKey: {
      celoMainnet: process.env.CELOSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "celoMainnet",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
