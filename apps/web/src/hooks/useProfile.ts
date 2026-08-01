import { useEffect, useState, useCallback } from 'react';
import { useWallet } from './useWallet';

export interface ProfileData {
  username: string;
  twitter: string;
  farcaster: string;
}

const STORAGE_KEY = 'celo-atari:profile';

/** Per-wallet profile persisted to localStorage. Profile is scoped to the
 *  connected address so different wallets keep separate identities. Falls back
 *  to a shared anonymous slot when no wallet is connected.
 *
 *  On-chain persistence is planned but not yet shipped — see Profile copy. */
export const useProfile = () => {
  const { address } = useWallet();
  const slot = address ? `${STORAGE_KEY}:${address.toLowerCase()}` : STORAGE_KEY;

  const read = useCallback((): ProfileData => {
    if (typeof window === 'undefined') return { username: '', twitter: '', farcaster: '' };
    try {
      const raw = window.localStorage.getItem(slot);
      if (raw) return { username: '', twitter: '', farcaster: '', ...JSON.parse(raw) };
    } catch {
      /* corrupt entry — fall through to defaults */
    }
    return { username: '', twitter: '', farcaster: '' };
  }, [slot]);

  const [profile, setProfile] = useState<ProfileData>(read);

  // Reload when the active wallet changes.
  useEffect(() => {
    setProfile(read());
  }, [read]);

  const updateProfile = useCallback(
    (next: ProfileData) => {
      setProfile(next);
      try {
        window.localStorage.setItem(slot, JSON.stringify(next));
      } catch {
        /* storage unavailable (private mode) — keep the in-memory copy */
      }
    },
    [slot]
  );

  return { ...profile, updateProfile };
};
