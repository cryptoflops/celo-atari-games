export const isMiniPay = (): boolean => {
  if (typeof window === 'undefined') return false;
  // MiniPay injects Ethereum provider with isMiniPay flag
  return Boolean((window as any).ethereum?.isMiniPay);
};
