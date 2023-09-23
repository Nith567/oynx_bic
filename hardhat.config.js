require("@nomicfoundation/hardhat-toolbox");
require("@tableland/hardhat");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // ...
  solidity: {
    version: "0.8.0",
    networks: {
      hardhat: {
        allowUnlimitedContractSize: true,
        allowBlocksWithSameTimestamp:true,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};