# Web3 Data Access Prototype

This prototype was developed for the [EC3 2023](https://ec-3.org/conference2023/) conference paper. You can find the paper [here]().

The prototype demonstrates how to use role-based and token-based smart contract access control for material passport data in the built environment. The data is stored off-chain using a data storage protocol called [Gaia](https://github.com/stacks-network/gaia).

Follow the instructions below to test the prototype.

## Test the Prototype

We deployed a test intstance of the prototype so you can try it. The smart contracts are deployed on the Stacks testnet (here, here, and here). The dApp is accessible under this URL: ...

Follow this tutorial to store and access files:
1. Install [Hiro Wallet](https://wallet.hiro.so/) for the browser of your choice. Follow the set up process and carefully memorize your Seed and password if you plan to reuse your account at a later stage.
2. Access the dApp and log in in the top right corner by clicking the "Connect Wallet" button.
3. ...


## Local Development

### Deploy Contracts

We use [Stacks](https://stacks.org/) for this protoype with smart contracts written in [Clarity](https://book.clarity-lang.org/).

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
