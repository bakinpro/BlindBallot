# AnonVote - Anonymous Voting System for Meetings

**AnonVote** is a cutting-edge anonymous voting system built on **FHEVM (Fully Homomorphic Encryption Virtual Machine)** technology, specifically designed for meeting scenarios including board decisions, DAO proposals, and corporate governance.

## Key Features

**Complete Anonymity**: Leveraging FHEVM's homomorphic encryption, all votes are encrypted on-chain, ensuring individual voting choices remain completely private and untraceable while maintaining the integrity of the democratic process.

**Transparent Results**: While individual votes stay anonymous, the final results are publicly verifiable on the blockchain. The system automatically decrypts and displays comprehensive statistics, charts, and rankings once voting concludes.

**Secure & Reliable**: Built with enterprise-grade security featuring smart contract-based duplicate voting prevention, strict access controls, and comprehensive input validation using OpenZeppelin security libraries.

**User-Friendly Interface**: The modern React-based frontend provides an intuitive experience for both technical and non-technical users, supporting major Web3 wallets with responsive design across all devices.

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Wagmi
- **Smart Contracts**: Solidity 0.8.24 + FHEVM Library + Hardhat
- **Backend**: Serverless Functions (Vercel)
- **Visualization**: Interactive charts with Recharts

## Use Cases

Perfect for organizations requiring confidential decision-making: corporate board meetings, DAO governance proposals, employee surveys, committee decisions, and any scenario where voting privacy is crucial while maintaining result transparency.

The system represents a significant advancement in blockchain-based democratic tools, balancing privacy protection with accountability and transparency.
