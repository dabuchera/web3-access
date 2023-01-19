# Web3 Data Access Prototype

This prototype was developed for the [EC3 2023](https://ec-3.org/conference2023/) conference paper. You can find the paper [here]().

The prototype demonstrates how to use role-based and token-based smart contract access control for material passport data in the built environment. The data is stored off-chain using a data storage protocol called [Gaia](https://github.com/stacks-network/gaia).

Follow the instructions below to test the prototype.

## Test the Prototype

We deployed a test intstance of the prototype so you can try it. The dApp is accessible [here](https://web3-access.vercel.app/). The smart contracts are deployed on the Stacks testnet ([RolesAccess](https://explorer.stacks.co/txid/0x28817b1e266f43e4d89672a2c77bf5ac08fe6633437a10067524a513d06b99f3?chain=testnet), [TokenAccess](https://explorer.stacks.co/txid/0x84a99f877e91f93b2396078f5f9b3449a1e97e6f0ff89158607aa5d809bb1fee?chain=testnet), [accessNFT](https://explorer.stacks.co/txid/0x413ae57460ebc38b672370163f32039e4ec90c57240356e7054ddabf88d745aa?chain=testnet), [ownershipNFT](https://explorer.stacks.co/txid/0xec1068f538fb3f7be825a07ad40a5ef378c1c962964eafc7691ecf676dab28fe?chain=testnet)).

Follow this tutorial to store and access files:

### Getting Ready

1. Install [Hiro Wallet](https://wallet.hiro.so/) for the browser of your choice. Follow the set up process and carefully memorize your Seed and password if you plan to reuse your account at a later stage.
2. Move to the [Testnet faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet) to receive some free STX so you can pay for transactions. You need to connect your wallet with the account you want to fund.
3. Access the [dApp](https://web3-access.vercel.app/) and connect in the top right your account with the "Connect Wallet" button.

### Upload a File


### Enable Sharing of a File


### Role-Based Sharing


### Token-Based Sharing

## Local Development

### Deploy Contracts

We use [Stacks](https://www.stacks.co/) for this protoype with smart contracts written in [Clarity](https://book.clarity-lang.org/).

To run and test the smart contracts locally, you can deploy them to a local network.

- Install [Clarinet](https://github.com/hirosystems/clarinet).
- Install and run [Docker](https://www.docker.com/).
- Spwan a local Devnet and deploy the contracts:

```sh
## Move into /contracts folder
$ cd contracts

## Start the local network and deploy contracts
$ clarinet integrate
```

### Start Frontend

The frontend was built using [React](https://reactjs.org/) and [Chakra](https://chakra-ui.com/).


```sh
## Move into /frontend folder
$ cd frontend

# Install dependencies
$ npm install

# Start dev server
$ npm run dev
```

Access the frontend on the indicated localhost, most likely http://localhost:3000.

### Connect Wallet

You need a blockchain wallet to interact with the dApp and the smart contracts. The most popular choice for Stacks is for now the [Hiro Wallet](https://wallet.hiro.so/).

- Install Hiro for the browser of your choice.
- Set up a wallet with one of the default addresses listed in the [Devnet.toml](/contracts/settings/Devnet.toml) file (so you have a funded address to play with).
