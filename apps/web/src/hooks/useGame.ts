import { useState, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { useWallet } from './useWallet';
import { useWriteContract, usePublicClient } from 'wagmi';
import type { FrameInput } from '@celo-atari-games/gas-gobbler-engine';

const ScoreRegistryABI = [
  {
    type: 'function',
    name: 'playerNonces',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'submitScore',
    inputs: [
      { name: 'sessionId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'player', type: 'address', internalType: 'address' },
      { name: 'score', type: 'uint256', internalType: 'uint256' },
      { name: 'nonce', type: 'uint256', internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', internalType: 'uint256' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const;

const FALLBACK_SCORE_REGISTRY_ADDRESS = import.meta.env.VITE_SCORE_REGISTRY_ADDRESS as `0x${string}`;

export const useGame = (gameId: string = 'gas-gobbler') => {
  const { address, targetChain } = useWallet();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [seed, setSeed] = useState<number>(12345);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const replayInputsRef = useRef<FrameInput[]>([]);
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const startGame = async () => {
    if (!address) {
      alert("Please connect your wallet to play and save scores on-chain!");
      return;
    }
    setIsLoading(true);
    setLastScore(null);
    setIsClaimed(false);
    setClaimError(null);
    setTxHash(null);
    replayInputsRef.current = [];
    try {
      const { sessionId, seed } = await api.createSession(address);
      setSessionId(sessionId);
      setSeed(seed);
      setIsPlaying(true);
    } catch (err) {
      console.error("Failed to start game session:", err);
      alert("Failed to start session. Maybe you hit the rate limit?");
    } finally {
      setIsLoading(false);
    }
  };

  // Called when the game ends - saves the score and replay inputs locally
  const onGameOver = useCallback((score: number, inputs: FrameInput[]) => {
    setLastScore(score);
    replayInputsRef.current = inputs;
    setIsPlaying(false);
  }, []);

  // Called when the player explicitly taps "Claim Score"
  const claimScore = useCallback(async () => {
    if (!address || !sessionId || lastScore === null) return;

    setIsClaiming(true);
    setClaimError(null);
    try {
      const registryMap: Record<string, string | undefined> = {
        'gas-gobbler': import.meta.env.VITE_SCORE_REGISTRY_ADDRESS_GAS_GOBBLER,
        'block-breaker': import.meta.env.VITE_SCORE_REGISTRY_ADDRESS_BLOCK_BREAKER,
        'stable-sprint': import.meta.env.VITE_SCORE_REGISTRY_ADDRESS_STABLE_SPRINT,
        'mento-invaders': import.meta.env.VITE_SCORE_REGISTRY_ADDRESS_MENTO_INVADERS,
      };

      const contractAddress = (registryMap[gameId] || FALLBACK_SCORE_REGISTRY_ADDRESS) as `0x${string}`;

      let nonce = 0n;
      if (publicClient) {
        console.log(`[Claim] Reading nonce for ${address} on contract ${contractAddress}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nonce = await (publicClient as any).readContract({
          address: contractAddress,
          abi: ScoreRegistryABI,
          functionName: 'playerNonces',
          args: [address]
        }) as bigint;
        console.log(`[Claim] On-chain nonce: ${nonce.toString()}`);
      }

      // Validate score with the API (sends replay for backend simulation)
      const { signature, deadline, registryAddress } = await api.validateScore(
        sessionId,
        address,
        lastScore,
        Number(nonce),
        replayInputsRef.current,
        gameId
      );
      console.log("Score validated by backend replay! Score:", lastScore);
      
      const hash = await writeContractAsync({
        address: (registryAddress || contractAddress) as `0x${string}`,
        abi: ScoreRegistryABI,
        functionName: 'submitScore',
        args: [
          sessionId as `0x${string}`,
          address,
          BigInt(lastScore),
          nonce,
          BigInt(deadline),
          signature as `0x${string}`
        ],
        account: address,
        chain: targetChain,
      });

      console.log("Score submitted on-chain!", hash);
      setTxHash(hash);
      setIsClaimed(true);
      setSessionId(null);

    } catch (err: unknown) {
      console.error("Score claim failed:", err);
      const errorMessage = err instanceof Error 
        ? (err as { shortMessage?: string }).shortMessage || err.message 
        : "Transaction failed";
      setClaimError(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  }, [address, sessionId, lastScore, writeContractAsync, publicClient, gameId, targetChain]);

  return {
    isPlaying,
    isLoading,
    isClaiming,
    isClaimed,
    claimError,
    txHash,
    lastScore,
    seed,
    startGame,
    onGameOver,
    claimScore
  };
};
