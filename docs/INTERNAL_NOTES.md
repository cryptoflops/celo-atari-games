# Internal Developer Notes

- Testing new layout constraints for edge cases.
- Cleaned up some dead code in the utility helpers.
- The escrow contract refund timeout (7 days) seems appropriate for freelance gig markets.
- Contract reads via useReadContract work fine on Celo, but multicall batching is not supported on all RPCs.
- Investigated rendering jitter on mobile layout when switching between MiniPay and desktop contexts.
- Reviewed gas price oracle behavior on Celo. Since the Gingerbread upgrade, EIP-1559 is the default.
