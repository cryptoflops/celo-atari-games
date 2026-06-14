interface MiniPayWindow extends Window {
  ethereum?: {
    isMiniPay?: boolean;
  };
}

export const isMiniPay = (): boolean => {
  if (typeof window === 'undefined') return false;
  // MiniPay injects Ethereum provider with isMiniPay flag
  return Boolean((window as MiniPayWindow).ethereum?.isMiniPay);
};
