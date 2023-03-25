// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address)
{
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses)
{
  let count = 0;
  for (const address of addresses)
  {
    console.log(`Address ${count++} balance: `, await getBalance(address));
  }
}

async function consoleMemos(memos)
{
  for (const memo of memos)
  {
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, name ${name} address ${from}, message ${message}`);
  }
}

async function main()
{
  const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  const Coffee = await hre.ethers.getContractFactory("Coffee");
  const contract = await Coffee.deploy();

  await contract.deployed();
  console.log("Address of Contract", contract.address);

  const addresses = [owner.address, from1.address];
  console.log("Before Coffee");
  await consoleBalances(addresses);
  const amount = { value: hre.ethers.utils.parseEther("1") };
  await contract.connect(from1).buyCoffee("name1", "Very nice", amount);
  await contract.connect(from1).buyCoffee("name2", "Very nice information", amount);
  await contract.connect(from1).buyCoffee("name3", "Very nice very nice", amount);

  console.log("After Coffee");
  await consoleBalances(addresses);

  const memos = await contract.getMemos();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) =>
{
  console.error(error);
  process.exitCode = 1;
});
