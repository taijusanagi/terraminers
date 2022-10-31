import { ethers } from "hardhat";

async function main() {
  const Equipment = await ethers.getContractFactory("Equipment");
  const equipment = await Equipment.deploy();
  await equipment.deployed();

  console.log("equipment", equipment.address);

  const Material = await ethers.getContractFactory("Material");
  const material = await Material.deploy();
  await material.deployed();

  console.log("material", material.address);

  await equipment.setMaterial(material.address);
  await material.setEquipment(equipment.address);

  console.log("set done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
