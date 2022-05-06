// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // Fantom 测试网测试脚本将合约实例关联上地址 0xaF996a069dE6525B6d0e542b577A90F538406Ed6
  // 该脚本会从 Fantom 测试网向BSC TEST测试网上的合约（地址: 0xDF043add7AC415BbcEF18d3e9CB18741A63f20f4) 发送一条消息“Hello LayerZero” ，
  // 并估算了消息费用（演示目的）。最后发送带有费用的消息， 为简单起见，这里为 1FTM。
  // 如果源交易比提供的金额少，它将把额外的金额退还到我们传递的地址 _refundAddress。
  const LayerZeroDemo1 = await ethers.getContractFactory("LayerZeroDemo1");
  const layerZeroDemo1 = await LayerZeroDemo1.attach(
    "0xDF043add7AC415BbcEF18d3e9CB18741A63f20f4"
  );

  console.log(formatBytes32String("Hello LayerZero"));
  const payload = formatBytes32String("Hello LayerZero");
  const fees = await layerZeroDemo1.estimateFees(
    10009,
    "0xDF043add7AC415BbcEF18d3e9CB18741A63f20f4",
    payload,
    false,
    "0x"
  );

  console.log(ethers.utils.formatEther(fees[0].toString()));
  await layerZeroDemo1.sendMsg(
    10009,
    "0xDF043add7AC415BbcEF18d3e9CB18741A63f20f4",
    formatBytes32String("Hello LayerZero"),
    { value: ethers.utils.parseEther("1") }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
