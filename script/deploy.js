const { ethers } = require("hardhat");
const fs = require("fs-extra");

async function main() {
  // Get the contract factory
  const ContractFactory = await ethers.getContractFactory("UserStorage");
  console.log("Deploying Contract Artifact...", ContractFactory);

  // Deploy the contract
  const deployedContract = await ContractFactory.deploy();
  console.log("Deploying Deployed Contract...", deployedContract);

  // Wait for the deployment transaction to be mined
  await deployedContract.waitForDeployment();

  // Get the deployed contract address
  console.log(`Contract deployed at address: ${deployedContract.target}`);

  // Save the contract address and ABI to a JSON file
  fs.writeFileSync(
    "deployedContract.json",
    JSON.stringify(
      {
        address: deployedContract.target,
        abi: JSON.parse(ContractFactory.interface.formatJson()),
      },
      null,
      2
    ) // Pretty-print the JSON
  );
}

main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exit(1);
});
