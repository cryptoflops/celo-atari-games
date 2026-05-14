import { useState, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { useWallet } from './useWallet';
import { useWriteContract, usePublicClient } from 'wagmi';
import type { FrameInput } from '@celo-arcade/game-engine';

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

const SCORE_REGISTRY_ADDRESS = import.meta.env.VITE_SCORE_REGISTRY_ADDRESS as `0x${string}`;

export const useGame = () => {
  const { address } = useWallet();
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
    if (!address) return;
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
      let nonce = 0n;
      if (publicClient) {
        nonce = await publicClient.readContract({
          address: SCORE_REGISTRY_ADDRESS,
          abi: ScoreRegistryABI,
          functionName: 'playerNonces',
          args: [address]
        } as any) as bigint;
      }

      // Validate score with the API (sends replay for backend simulation)
      const { signature, deadline } = await api.validateScore(
        sessionId,
        address,
        lastScore,
        Number(nonce),
        replayInputsRef.current
      );
      console.log("Score validated by backend replay! Score:", lastScore);
      
      const hash = await writeContractAsync({
        address: SCORE_REGISTRY_ADDRESS,
        abi: ScoreRegistryABI,
        functionName: 'submitScore',
        args: [
          sessionId as `0x${string}`,
          address,
          BigInt(lastScore),
          nonce,
          BigInt(deadline),
          signature as `0x${string}`
        ]
      } as any);

      console.log("Score submitted on-chain!", hash);
      setTxHash(hash);
      setIsClaimed(true);
      setSessionId(null);

    } catch (err: any) {
      console.error("Score claim failed:", err);
      setClaimError(err?.shortMessage || err?.message || "Transaction failed");
    } finally {
      setIsClaiming(false);
    }
  }, [address, sessionId, lastScore, writeContractAsync, publicClient]);

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
