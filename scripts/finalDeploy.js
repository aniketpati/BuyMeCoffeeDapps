const hre = require("hardhat");

async function main()
{
    const Coffee = await hre.ethers.getContractFactory("Coffee");
    const contract = await Coffee.deploy();

    await contract.deployed();
    console.log("Address of Contract", contract.address);
}

main().catch((error) =>
{
    console.error(error);
    process.exitCode = 1;
});
