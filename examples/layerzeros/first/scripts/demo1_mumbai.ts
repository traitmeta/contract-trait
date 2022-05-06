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
  // 该脚本将合约实例关联到前面部署的合约地址: 0xaF996a069dE6525B6d0e542b577A90F538406Ed6
  // 脚本将读取合约中的消息计数器和最后一条消息，现在返回的是0和空字符串。
  const LayerZeroDemo1 = await ethers.getContractFactory("LayerZeroDemo1");

  // 地址是之前部署的Mubai测试网络合约
  const layerZeroDemo1 = await LayerZeroDemo1.attach(
    "0xaF996a069dE6525B6d0e542b577A90F538406Ed6"
  );
  const count = await layerZeroDemo1.messageCount();
  const msg = await layerZeroDemo1.message();
  console.log(count);
  console.log(ethers.utils.toUtf8String(msg));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
