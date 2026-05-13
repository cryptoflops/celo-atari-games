# Celo Arcade

A MiniPay-native arcade game platform on Celo mainnet, built for the Celo Proof of Ship rewards.

## Project Structure

This is a monorepo containing:

- `apps/web`: React + Vite + Canvas frontend
- `apps/api`: Fastify + Node.js backend for validation and anti-cheat
- `packages/contracts`: Hardhat Solidity smart contracts

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development servers:
   ```bash
   npm run dev:web
   npm run dev:api
   ```
