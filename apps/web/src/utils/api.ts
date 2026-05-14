import type { FrameInput } from '@celo-arcade/game-engine';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async createSession(player: string): Promise<{ sessionId: string; seed: number }> {
    const res = await fetch(`${API_URL}/api/sessions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async validateScore(
    sessionId: string,
    player: string,
    claimedScore: number,
    nonce: number,
    replayInputs: FrameInput[]
  ): Promise<{ signature: string; deadline: number }> {
    const res = await fetch(`${API_URL}/api/scores/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, player, claimedScore, nonce, replayInputs })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getLeaderboard() {
    const res = await fetch(`${API_URL}/api/leaderboard`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
