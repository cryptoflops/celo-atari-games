# MiniPay Integration

Celo Arcade is designed to be a native MiniPay application.

## Detection
We use the `window.ethereum.isMiniPay` flag injected by the MiniPay browser.
When this is true, the user is automatically connected via Wagmi's `injected()` connector.

## Fee Abstraction
MiniPay natively supports paying gas fees in ERC-20 tokens like USDT or cUSD.
Our frontend uses standard `wagmi` transactions (`writeContractAsync`), and the MiniPay wallet automatically prompts the user to pay the fee in USDT.

This means zero smart contract changes were required to support fee abstraction!
