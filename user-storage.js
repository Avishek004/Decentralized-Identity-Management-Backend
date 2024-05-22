const fs = require("fs-extra");
const web3 = require("./web3-Instance");

const deployedContract = JSON.parse(fs.readFileSync("deployedContract.json", "utf8"));
const contractAddress = deployedContract.address;
const contractABI = deployedContract.abi;

console.log(`Using contract address: ${contractAddress}`);

const UserStorage = new web3.eth.Contract(contractABI, contractAddress);

module.exports = UserStorage;
