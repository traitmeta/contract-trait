// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const LayerZeroDemo1 = await ethers.getContractFactory("LayerZeroDemo1");
  const layerZeroDemo1 = await LayerZeroDemo1.deploy(
    "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8"
  );
  await layerZeroDemo1.deployed();
  console.log("layerZeroDemo1 deployed to:", layerZeroDemo1.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
