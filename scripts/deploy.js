

const hre = require("hardhat");

async function main() {


  const WETH = await hre.ethers.deployContract("wETH");
  await WETH.waitForDeployment();
  const wethResult = await WETH.getAddress();

  const IUSD = await hre.ethers.deployContract("IUSDContract");
  await IUSD.waitForDeployment();
  const iusdResult = await IUSD.getAddress();

  const TrustLend = await hre.ethers.getContractFactory("TrustLend");
  const trustLend = await TrustLend.deploy(wethResult, iusdResult);
  await trustLend.waitForDeployment();
  const result = await trustLend.getAddress();

  console.log("Contracts deployed, wETH: ", wethResult , "IUSD: ", iusdResult, "TrustLend: ", result);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});