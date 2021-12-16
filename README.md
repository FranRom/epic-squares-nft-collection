# Epic Squares NFT collection

Mint your own NFT collection and ship a Web3 app to show them off
You know those websites where people are making millions of dollars where users can come and "mint" an NFT? We're building that.

<img width="930" alt="Screenshot 2021-12-16 at 17 10 12" src="https://user-images.githubusercontent.com/32134460/146407320-9b226caa-bfef-4bac-b49a-cfb6b8c941d6.png"><br />

The NFTs I'll be going over in this project are these NFTs that are basically a square box with a randomly generated three-word combination at the center. Why? Because I think it's funny lol.<br /><br />

<img width="1002" alt="Screenshot 2021-12-16 at 17 11 59" src="https://user-images.githubusercontent.com/32134460/146407613-8051c20e-6868-4f86-9a19-88ba3e4c2e59.png">

Everything will be happening on-chain. This means all the NFT data will live on the blockchain itself. We used Rinkeby ethereum as testnet so you don't have to use real tokens to pay the fees.

### Goal

Create and modify a smart contract to mint the NFT collection.
Let users connect their Ethereum wallet, and mint an NFT to their wallet so they actually own it. They'll even be able to re-sell the NFT on OpenSea. The NFT itself can be customized to whatever you want.

### Technologies

Hardhat, ether.js, web3, React.

### To get started

We used Rinkeby as Ethereum testnet for this project.
Deploy the contract with your own address and change this value in the App.js

Run locally:

```
npx hardhat run scripts/run.js --network rinkeby
```

Deploy:

```
npx hardhat run scripts/deploy.js --network rinkeby
```
