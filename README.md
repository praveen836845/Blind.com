Here's how you can structure the README file for your GitHub repository:

---

# Blind.com - Professional Verification Platform

Blind.com is a decentralized platform where professionals and employers can verify employment history and share reviews about companies they’ve worked for. The project leverages Cairo for smart contracts and Starknet.js for frontend interaction, running on a Madara Devnet.

---

## Overview

This platform aims to securely verify employment history and store reviews on the blockchain, providing a transparent and trustworthy environment for professionals and employers alike.

---

## Technologies Used

### 1. *Cairo*
   - **Role**: Cairo is a programming language used to write smart contracts for StarkNet, a Layer-2 scaling solution for Ethereum.
   - **In This Project**: Cairo is used to build the core logic of the verification and review system, ensuring secure and efficient contract execution.

### 2. *Madara*
   - **Role**: Madara is a high-performance, customizable blockchain framework built on Substrate, designed for StarkNet-compatible chains.
   - **In This Project**: Madara powers the local devnet (Madara Devnet) where the project is currently deployed for testing and development. It provides a scalable and customizable environment for running StarkNet-based applications.

### 3. *Starknet.js*
   - **Role**: Starknet.js is a JavaScript library for interacting with StarkNet contracts and nodes.
   - **In This Project**: Starknet.js is used in the frontend to interact with the smart contracts deployed on the Madara Devnet. It enables seamless communication between the user interface and the blockchain.

---

## Project Workflow

1. **User Authentication**:
   - Professionals and employers log in to the platform.
   - Their identities and employment history are verified on-chain.

2. **Review Submission**:
   - Verified users can submit reviews about companies they’ve worked for.
   - Reviews are stored securely on the blockchain.

3. **Frontend Interaction**:
   - The frontend, built with Starknet.js, interacts with the Madara Devnet to fetch and display data.
   - Users can view company reviews and their own verification status.

---

## Current Status

- The project is in the development phase.
- Smart contracts are written in Cairo and deployed on a local Madara Devnet.
- Starknet.js is used for frontend integration.
- Deployment on testnet or appchain is pending due to technical challenges.

---

## Known Issues

Due to collaboration challenges with Karnot, we were unable to deploy on their platform. However, functions can be executed through the command line terminal. For example, to invoke the `create_post` function:

```bash
sncast --account account-1 invoke \
     --url http://localhost:9944 \
     --contract-address 0x06a863dc29bc031a5e33559f97570f4c99bdc9c869b6888751ae3d8accb6d24a \
     --function create_post \
     --calldata 0x4170706c652064657369676e732067726561742070726f6475637473 0x74727565 0x4170706c65
```

---

## Next Steps

1. Resolve deployment issues to move from the local Madara Devnet to a testnet or appchain.
2. Collaborate with the team to finalize production-level deployment.
3. Explore scaling options for a live launch.

---

## How to Contribute

1. Clone the repository.
2. Set up the local Madara Devnet.
3. Install dependencies for the frontend (Starknet.js).
4. Run the project locally and test the workflow.
5. Report issues or suggest improvements.

---

## Contact

For collaboration or queries, reach out to the team at [roy200297@gmail.com](mailto:roy200297@gmail.com).

---

## Acknowledgments

Special thanks to the contributors and collaborators who have helped shape this project. Your input and support are invaluable.
