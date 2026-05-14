import { ethers } from "hardhat";

async function main() {
  const registryAddress = process.env.VITE_SCORE_REGISTRY_ADDRESS;
  if (!registryAddress) throw new Error("VITE_SCORE_REGISTRY_ADDRESS not set");

  const GasGobblerScoreRegistry = await ethers.getContractFactory("GasGobblerScoreRegistry");
  const registry = GasGobblerScoreRegistry.attach(registryAddress);

  // The address derived from SIGNER_PRIVATE_KEY
  const apiSignerAddress = "0x30171E8913885cC05fCC21f77F7E501700023331";

  console.log("Setting signer to:", apiSignerAddress);
  const tx = await registry.setSigner(apiSignerAddress);
  await tx.wait();
  
  console.log("Signer updated successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
