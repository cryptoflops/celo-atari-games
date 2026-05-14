import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ScoreRegistry
  const GasGobblerScoreRegistry = await ethers.getContractFactory("GasGobblerScoreRegistry");
  const registry = await GasGobblerScoreRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("GasGobblerScoreRegistry deployed to:", registryAddress);

  // Deploy Badges
  const GasGobblerBadges = await ethers.getContractFactory("GasGobblerBadges");
  const badges = await GasGobblerBadges.deploy();
  await badges.waitForDeployment();
  const badgesAddress = await badges.getAddress();
  console.log("GasGobblerBadges deployed to:", badgesAddress);

  // Set Signer (to deployer by default, update later if needed)
  await registry.setSigner(deployer.address);
  console.log("Signer address set to deployer:", deployer.address);

  // Export addresses to root .env
  const envPath = path.join(__dirname, "../../../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    
    // Replace or append
    if (envContent.includes("VITE_SCORE_REGISTRY_ADDRESS=")) {
      envContent = envContent.replace(/VITE_SCORE_REGISTRY_ADDRESS=.*/, `VITE_SCORE_REGISTRY_ADDRESS=${registryAddress}`);
    } else {
      envContent += `\nVITE_SCORE_REGISTRY_ADDRESS=${registryAddress}`;
    }

    if (envContent.includes("VITE_BADGES_ADDRESS=")) {
      envContent = envContent.replace(/VITE_BADGES_ADDRESS=.*/, `VITE_BADGES_ADDRESS=${badgesAddress}`);
    } else {
      envContent += `\nVITE_BADGES_ADDRESS=${badgesAddress}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with contract addresses");
  }

  // Generate ABIs for the web app
  const abiDir = path.join(__dirname, "../../../apps/web/src/abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const registryArtifact = await artifacts.readArtifact("GasGobblerScoreRegistry");
  fs.writeFileSync(
    path.join(abiDir, "GasGobblerScoreRegistry.json"),
    JSON.stringify(registryArtifact.abi, null, 2)
  );

  const badgesArtifact = await artifacts.readArtifact("GasGobblerBadges");
  fs.writeFileSync(
    path.join(abiDir, "GasGobblerBadges.json"),
    JSON.stringify(badgesArtifact.abi, null, 2)
  );
  console.log("Exported ABIs to apps/web/src/abi");

  console.log("\nDeployment Verification Details:");
  console.log(`npx hardhat verify --network ${network.name} ${registryAddress}`);
  console.log(`npx hardhat verify --network ${network.name} ${badgesAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
