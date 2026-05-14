/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { privateKeyToAccount } from 'viem/accounts';
import { z } from 'zod';
import { HeadlessSimulator } from '@celo-arcade/game-engine';

export interface Env {
  SESSIONS: KVNamespace;
  DB: D1Database;
  SIGNER_PRIVATE_KEY: string;
  VITE_SCORE_REGISTRY_ADDRESS: string;
  VITE_CHAIN_ID: string;
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({ origin: '*' }))

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() })
})

// Session Generation Endpoint
app.post('/api/sessions/create', async (c) => {
  const schema = z.object({
    player: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
  });

  const body = await c.req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  
  if (!parsed.success) {
    return c.json({ error: "Invalid player address" }, 400);
  }

  const { player } = parsed.data;

  // Rate Limiting using KV (Simple implementation)
  const rateLimitKey = `rate_limit:${player.toLowerCase()}`;
  let countStr = await c.env.SESSIONS.get(rateLimitKey);
  let count = countStr ? parseInt(countStr) : 0;
  
  if (count > 100) {
    return c.json({ error: "Rate limit exceeded. Maximum 100 games per hour." }, 429);
  }
  
  count++;
  await c.env.SESSIONS.put(rateLimitKey, count.toString(), { expirationTtl: 3600 });

  const sessionId = "0x" + crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const seed = Math.floor(Math.random() * 1000000);
  
  // Store session in KV for 10 minutes
  const sessionData = { player: player.toLowerCase(), seed };
  await c.env.SESSIONS.put(`session:${sessionId}`, JSON.stringify(sessionData), { expirationTtl: 600 });

  return c.json({ sessionId, seed });
});

// Score Validation Endpoint
app.post('/api/scores/validate', async (c) => {
  const schema = z.object({
    sessionId: z.string(),
    player: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
    claimedScore: z.number().int().min(0),
    nonce: z.number().int().min(0),
    replayInputs: z.array(z.object({
      f: z.number().int().min(0),
      d: z.number().int().min(0).max(4)
    })).max(36000)
  });

  const body = await c.req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  
  if (!parsed.success) {
    return c.json({ error: "Invalid request payload", details: parsed.error }, 400);
  }

  const { sessionId, player, claimedScore, nonce, replayInputs } = parsed.data;

  // Validate session
  const sessionDataStr = await c.env.SESSIONS.get(`session:${sessionId}`);
  if (!sessionDataStr) {
    return c.json({ error: "Session invalid or expired" }, 410);
  }

  const sessionData = JSON.parse(sessionDataStr);
  if (sessionData.player !== player.toLowerCase()) {
    return c.json({ error: "Session belongs to a different player" }, 401);
  }

  // Run Headless Simulator
  const simResult = HeadlessSimulator.simulate(sessionData.seed, replayInputs);
  
  if (simResult.terminated) {
    return c.json({ error: "Replay exceeded maximum frame count" }, 400);
  }
  
  if (simResult.finalScore !== claimedScore) {
    return c.json({ error: `Score mismatch. Claimed: ${claimedScore}, Simulated: ${simResult.finalScore}` }, 422);
  }
  
  const score = claimedScore;

  const account = privateKeyToAccount(c.env.SIGNER_PRIVATE_KEY as `0x${string}`);

  try {
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour validity
    const chainId = parseInt(c.env.VITE_CHAIN_ID || '42220');
    
    const domain = {
      name: "GasGobblerScoreRegistry",
      version: "1",
      chainId,
      verifyingContract: c.env.VITE_SCORE_REGISTRY_ADDRESS as `0x${string}`,
    };

    const types = {
      ScoreAttestation: [
        { name: "sessionId", type: "bytes32" },
        { name: "player", type: "address" },
        { name: "score", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      sessionId: sessionId as `0x${string}`,
      player: player as `0x${string}`,
      score: BigInt(score),
      nonce: BigInt(nonce),
      deadline: BigInt(deadline)
    };

    const signature = await account.signTypedData({
      domain,
      types,
      primaryType: 'ScoreAttestation',
      message
    });

    // Delete session
    await c.env.SESSIONS.delete(`session:${sessionId}`);
    
    // Save to offchain_scores via D1
    // First, ensure player exists
    await c.env.DB.prepare(`
      INSERT INTO players (address, username) 
      VALUES (?, ?) 
      ON CONFLICT(address) DO NOTHING
    `).bind(player.toLowerCase(), `Player_${player.slice(2, 8)}`).run();

    // Insert score
    await c.env.DB.prepare(`
      INSERT INTO offchain_scores (player_address, score, session_id)
      VALUES (?, ?, ?)
    `).bind(player.toLowerCase(), score, sessionId).run();

    return c.json({
      signature,
      deadline
    });

  } catch (error: any) {
    console.error(error);
    return c.json({ error: "Failed to generate signature" }, 500);
  }
});

// Leaderboard Endpoint
app.get('/api/leaderboard', async (c) => {
  try {
    const { createPublicClient, http, parseAbiItem } = await import('viem');
    const { celo } = await import('viem/chains');

    const client = createPublicClient({
      chain: celo,
      transport: http()
    });

    const address = '0x16Bbc09bFCCaae7D4C2EcD79C5d72AeA886D2bd0' as const;
    const abi = [
      parseAbiItem('function submissionCount() view returns (uint256)'),
      parseAbiItem('function submissions(uint256) view returns (address player, uint256 score, bytes32 sessionId, uint256 timestamp)')
    ];

    const count = await client.readContract({
      address,
      abi,
      functionName: 'submissionCount'
    }) as bigint;

    const calls = [];
    for (let i = 0n; i < count; i++) {
      calls.push({ address, abi, functionName: 'submissions', args: [i] } as const);
    }

    const results = await client.multicall({ contracts: calls as any });
    
    // Group by player to get MAX score
    const playerScores: Record<string, number> = {};
    for (const r of results) {
      if (r.status === 'success') {
        const [player, score] = r.result as [string, bigint, string, bigint];
        const playerLower = player.toLowerCase();
        const scoreNum = Number(score);
        if (!playerScores[playerLower] || scoreNum > playerScores[playerLower]) {
          playerScores[playerLower] = scoreNum;
        }
      }
    }

    const playerAddresses = Object.keys(playerScores);
    if (playerAddresses.length === 0) {
      return c.json({ leaderboard: [] });
    }

    // Fetch usernames from DB
    // Use chunks to prevent too many query parameters if many players
    const placeholders = playerAddresses.map(() => '?').join(',');
    const query = `SELECT address, username FROM players WHERE address IN (${placeholders})`;
    
    const { results: players } = await c.env.DB.prepare(query)
      .bind(...playerAddresses)
      .all();

    const usernameMap = Object.fromEntries(players.map((p: any) => [p.address.toLowerCase(), p.username]));

    const leaderboard = playerAddresses.map(addr => ({
      address: addr,
      username: usernameMap[addr] || `Player_${addr.slice(2, 8)}`,
      score: playerScores[addr]
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

    return c.json({ leaderboard });
  } catch (error: any) {
    console.error(error);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

export default app;
