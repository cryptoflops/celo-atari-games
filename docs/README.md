# Celo Arcade Documentation

Welcome to the Celo Arcade documentation. This project was built for the Celo Proof of Ship rewards program.

## Architecture Overview

Celo Arcade uses a modern Web3 stack:
- **Frontend**: React + Vite + TailwindCSS + Wagmi
- **Backend API**: Fastify + PostgreSQL + Redis (Upstash)
- **Smart Contracts**: Solidity + Hardhat + OpenZeppelin

## Key Features
1. **Deterministic Game Engine**: Runs a fixed timestep game loop (60 FPS) to ensure inputs result in the exact same game state anywhere.
2. **EIP-712 Signatures**: The backend validates the game session and score, then signs an attestation. The smart contract verifies this signature to prevent cheating.
3. **MiniPay Native**: Uses `isMiniPay` detection for implicit wallet connections.
4. **Fee Abstraction**: By deploying on Celo, users pay gas in USDT/cUSD.

## Quick Start
See the root README for installation instructions.
