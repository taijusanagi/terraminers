import { ethers } from "hardhat";

async function main() {
  // const Lock = await ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  // await lock.deployed();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
