import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

task("mintFreeNFT", "Mint Free NFT from CryptoDevs NFT")
  .addParam("nftContract", "The NFT contract's address")
  .setAction(async (args, hre) => {
    const NFTContract = await hre.ethers.getContractAt(
      "CryptoDevsNFT",
      args.nftContract
    );

    const txn = await NFTContract.freeMint();
    await txn.wait();
    console.log("Successfully minted a CryptoDevs NFT");
  });

task("getNFTBalance", "Get the CryptoDevs NFT balance of your address")
  .addParam("nftContract", "The NFT contract's address")
  .setAction(async (args, hre) => {
    const NFTContract = await hre.ethers.getContractAt(
      "CryptoDevsNFT",
      args.nftContract
    );
    const signers = await hre.ethers.getSigners();
    const myAddress = signers[0].address;
    const balance = await NFTContract.balanceOf(myAddress);

    console.log(`You own ${balance.toString()} CryptoDev NFTs`);
  });

task("sendNFTToDAO", "Send CryptoDev NFT to DAO")
  .addParam("nftContract", "The NFT contract's address")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("tokenId", "The NFT token ID to send")
  .setAction(async (args, hre) => {
    const NFTContract = await hre.ethers.getContractAt(
      "CryptoDevsNFT",
      args.nftContract
    );

    const signers = await hre.ethers.getSigners();
    const myAddress = signers[0].address;

    const txn = await NFTContract["safeTransferFrom(address,address,uint256)"](
      myAddress,
      args.daoContract,
      args.tokenId
    );
    await txn.wait();
    console.log(
      "Successfully transferred a CryptoDevs NFT to the CryptoDevs DAO to gain membership"
    );
  });

task("getETHBalance", "Get the ETH balance of your address").setAction(
  async (args, hre) => {
    const signers = await hre.ethers.getSigners();
    const mySigner = signers[0];
    const balance = await mySigner.getBalance();

    console.log(balance.toString());
    console.log(
      `You currently have ${hre.ethers.utils.formatUnits(balance, "ether")} ETH`
    );
  }
);

task("quitDAO", "Quit the DAO")
  .addParam("daoContract", "The DAO contract's address")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const txn = await DAOContract.quit();
    await txn.wait();
    console.log("Sucessfully quit the DAO!");
  });

task("createProposalBuy", "Create a proposal in the DAO to buy a fake NFT")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("forTokenId", "The fake token ID to buy from the fake marketplace")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const txn = await DAOContract.createProposal(args.forTokenId, 0);
    await txn.wait();
    const numProposals = await DAOContract.numProposals();
    console.log(
      `Successfully created a BUY proposal for token ID ${
        args.forTokenId
      }: Proposal ID = ${numProposals.sub(1).toString()}`
    );
  });

task("createProposalSell", "Create a proposal in the DAO to sell a fake NFT")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("forTokenId", "The fake token ID to sell from the fake marketplace")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const txn = await DAOContract.createProposal(args.forTokenId, 1);
    await txn.wait();

    const numProposals = await DAOContract.numProposals();
    console.log(
      `Successfully created a SELL proposal for token ID ${
        args.forTokenId
      }: Proposal ID = ${numProposals.sub(1).toString()}`
    );
  });

task("getDAOBalance", "Check the DAO's ETH treasury balance")
  .addParam("daoContract", "The DAO contract's address")
  .setAction(async (args, hre) => {
    const signers = await hre.ethers.getSigners();
    const provider = signers[0].provider!;
    const balance = await provider.getBalance(args.daoContract);

    console.log(
      `DAO currently has ${hre.ethers.utils.formatUnits(balance, "ether")} ETH`
    );
  });

task("executeProposal", "Execute a proposal in the DAO")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("proposalId", "The ID of the proposal to execute")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const txn = await DAOContract.executeProposal(args.proposalId);
    await txn.wait();
    console.log(`Successfully executed Proposal ${args.proposalId}`);
  });

task("voteYesOnProposal", "Vote YAY for a proposal in the DAO")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("proposalId", "The ID of the proposal to vote on")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const txn = await DAOContract.voteOnProposal(args.proposalId, 0);
    await txn.wait();
    console.log(`Successfully voted YAY on Proposal ${args.proposalId}`);
  });

task("voteNoOnProposal", "Vote NAY for a proposal in the DAO")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("proposalId", "The ID of the proposal to vote on")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const txn = await DAOContract.voteOnProposal(args.proposalId, 1);
    await txn.wait();
    console.log(`Successfully voted NAY on Proposal ${args.proposalId}`);
  });

task("getProposal", "Get proposal")
  .addParam("daoContract", "The DAO contract's address")
  .addParam("proposalId", "The ID of the proposal to vote on")
  .setAction(async (args, hre) => {
    const DAOContract = await hre.ethers.getContractAt(
      "CryptoDevsDAO",
      args.daoContract
    );

    const proposal = await DAOContract.proposals(args.proposalId);
    console.log(
      JSON.stringify(
        {
          nftTokenId: proposal[0].toString(),
          deadline: new Date(
            Number(proposal[1].mul(1000).toString())
          ).toLocaleString(),
          yayVotes: proposal[2].toString(),
          nayVotes: proposal[3].toString(),
          executed: proposal[4],
          proposalType: proposal[5] === 0 ? "BUY" : "SELL",
        },
        null,
        2
      )
    );
  });

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000,
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
