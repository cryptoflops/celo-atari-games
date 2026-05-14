# Smart Contracts Architecture

## `GasGobblerScoreRegistry.sol`
This is the core anti-cheat registry.
- Implements `EIP712` for standard signature verification.
- Stores nonces per player to prevent replay attacks.
- Validates the `signerAddress` (the trusted backend).

## `GasGobblerBadges.sol`
An NFT-like contract that awards badges to players.
- Owned by the backend deployer.
- The backend triggers `claimBadge` when a player hits milestones (e.g., Score > 500).

## Deployment
Contracts are deployed on Celo Mainnet and Celo Sepolia testnet.
Mainnet uses Etherscan (Celoscan) for verification.
