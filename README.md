# Web3 Data Access Prototype

This prototype was developed for the [EC3 2023](https://ec-3.org/conference2023/) conference paper. You can find the paper [here]().

The prototype demonstrates how to use role-based and token-based smart contract access control for material passport data in the built environment. The data is stored off-chain using a data storage protocol called [Gaia](https://github.com/stacks-network/gaia).

Follow the instructions below to test the prototype.

## Test the Prototype

We deployed a test intstance of the prototype. The dApp is accessible [here](https://web3-access.vercel.app/). The smart contracts are deployed on the Stacks testnet ([RolesAccess](https://explorer.stacks.co/txid/0x28817b1e266f43e4d89672a2c77bf5ac08fe6633437a10067524a513d06b99f3?chain=testnet), [TokenAccess](https://explorer.stacks.co/txid/0x84a99f877e91f93b2396078f5f9b3449a1e97e6f0ff89158607aa5d809bb1fee?chain=testnet), [accessNFT](https://explorer.stacks.co/txid/0x413ae57460ebc38b672370163f32039e4ec90c57240356e7054ddabf88d745aa?chain=testnet), [ownershipNFT](https://explorer.stacks.co/txid/0xec1068f538fb3f7be825a07ad40a5ef378c1c962964eafc7691ecf676dab28fe?chain=testnet)).

Follow this tutorial to store and access files:

### Getting Ready

1. Install [Hiro Wallet](https://wallet.hiro.so/) for the browser of your choice. Follow the set up process and carefully memorize your Seed and password if you plan to reuse your account at a later stage.
2. Enter the menu (top right) in the Hiro wallet and "Change Network" to "testnet".
3. Move to the [Testnet faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet) to receive some free STX so you can pay for transactions. You need to connect your wallet with the account you want to fund.
4. Access the [dApp](https://web3-access.vercel.app/) and connect your account with the "Connect Wallet" button.

| ![home.png](/readme-img/home.png)|
|:--:|
| The landing page to connect the wallet. |

### Upload Data

- To upload a new file or text you can head to the ```/upload``` tab.
- Public files will not be encrypted.
- Private files (not public) will be encrypted and can only be accessed with the connected account the file was uploaded with.

| ![upload.png](/readme-img/upload.png) |
|:--:|
| Upload page. |

### Enable Sharing of Data

- After the upload the file is visible under the main page.
- Files can be deleted or shared.

| ![yourfiles11.png](/readme-img/yourfiles11.png) |
|:--:|
| The uploaded private file. |

- When clicking "Allow Sharing", the dApp receives permission to share the data.
- The sharing control button becomes available, where role-based and token-based sharing can be specified.

| ![yourfiles12.png](/readme-img/yourfiles12.png) |
|:--:|
| After enabling sharing, the file is marked as shared. |


| ![yourfiles13.png](/readme-img/yourfiles13.png) |
|:--:|
| Shared, public, and private files are marked respectively. |

### Sharing Control

- The buttons trigger the access logic in the respective smart contracts. The smart contracts are deployed on the Stacks testnet ([RolesAccess](https://explorer.stacks.co/txid/0x28817b1e266f43e4d89672a2c77bf5ac08fe6633437a10067524a513d06b99f3?chain=testnet), [TokenAccess](https://explorer.stacks.co/txid/0x84a99f877e91f93b2396078f5f9b3449a1e97e6f0ff89158607aa5d809bb1fee?chain=testnet)).
- Role-Based sharing means to share files on an address-basis. Access-rights are non-transferable.
- The owner account first needs to claim ownership by registering for the ownership role.
- Then the owner can register other accounts to grant them access to the data.

- Token-based sharing means to share files on a token basis. Every holder of an access-NFT can access the data. This means access-rights are transferable.
- The owner first claims the ownership-NFT.
- Afterwards, the owner holding the ownership-NFT can claim access-NFTs to send to other accounts to grant access.

| ![accesscontrol.png](/readme-img/accesscontrol.png) |
|:--:|
| After enabling sharing, the file is marked as shared. |

| ![account1.png](/readme-img/account1.png) |
|:--:|
| Account 1 is the owner of the file. It owns the ownership-NFT and two access-NFTs that can be sent to other accounts. |

### Access Data

- If another account connects with the dApp without permssions to access files, it sees them as private in the ```/overview``` tab (even if they were shared with the dApp or other accounts).

| ![overviewfiles3.png](/readme-img/overviewfiles3.png) |
|:--:|
| Account 3 sees the shared files with the dApp also as private. |

- Account 2 received access permission through an accessNFT.
- The dApp recognizes the connected account holds an accessNFT and grants permission to access the data. It is also visible as shared in the ```/overview``` tab.
- In case Account 2 holds an access role, the dApp notices this in the same way as it notices wether it holds an access-NFT by reading the states of access roles from the smart contract.

| ![account2.png](/readme-img/account2.png) |
|:--:|
| Account 2 owns one of the access-NFTs. |

| ![overviewfiles2.png](/readme-img/overviewfiles2.png) |
|:--:|
| Account 2 can access the shared file in the dApp. |

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
