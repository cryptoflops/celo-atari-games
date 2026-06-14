/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { privateKeyToAccount } from 'viem/accounts';
import { z } from 'zod';
import { HeadlessSimulator } from '@celo-atari-games/gas-gobbler-engine';

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
    gameId: z.string().optional().default('gas-gobbler'),
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

  const { sessionId, gameId, player, claimedScore, nonce, replayInputs } = parsed.data;

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
  const simResult = HeadlessSimulator.simulate(sessionData.seed, replayInputs as any);
  
  if (simResult.terminated) {
    return c.json({ error: "Replay exceeded maximum frame count" }, 400);
  }
  
  if (simResult.finalScore !== claimedScore) {
    return c.json({ error: `Score mismatch. Claimed: ${claimedScore}, Simulated: ${simResult.finalScore}` }, 422);
  }
  
  const score = claimedScore;

  try {
    const account = privateKeyToAccount(c.env.SIGNER_PRIVATE_KEY as `0x${string}`);
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour validity
    const chainId = parseInt(c.env.VITE_CHAIN_ID || '42220');
    
    // Get game-specific registry address
    const gameKey = gameId.toUpperCase().replace(/-/g, '_');
    const env = c.env as any;
    const registryAddress = (env[`VITE_SCORE_REGISTRY_ADDRESS_${gameKey}`] || c.env.VITE_SCORE_REGISTRY_ADDRESS) as `0x${string}`;
    
    if (!registryAddress) {
      return c.json({ error: `Registry address not found for game: ${gameId}` }, 400);
    }

    // Format game name for domain (CamelCase + ScoreRegistry)
    const formattedGameName = gameId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + "ScoreRegistry";

    const domain = {
      name: formattedGameName,
      version: "1",
      chainId,
      verifyingContract: registryAddress,
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
    await c.env.DB.prepare(`
      INSERT INTO players (address, username) 
      VALUES (?, ?) 
      ON CONFLICT(address) DO NOTHING
    `).bind(player.toLowerCase(), `Player_${player.slice(2, 8)}`).run();

    await c.env.DB.prepare(`
      INSERT INTO offchain_scores (player_address, score, session_id, game_id)
      VALUES (?, ?, ?, ?)
    `).bind(player.toLowerCase(), score, sessionId, gameId).run();

    return c.json({
      success: true,
      score,
      signature,
      deadline,
      registryAddress
    });

  } catch (error: any) {
    console.error("Signature generation error:", error);
    return c.json({ 
      error: "Failed to generate signature", 
      details: error.message,
      stack: error.stack 
    }, 500);
  }
});

// Leaderboard Endpoint
app.get('/api/leaderboard', async (c) => {
  try {
    const query = `
      SELECT 
        p.address, 
        p.username, 
        COALESCE(SUM(s.score), 0) as score 
      FROM players p
      LEFT JOIN offchain_scores s ON p.address = s.player_address
      GROUP BY p.address
      ORDER BY score DESC
      LIMIT 100
    `;
    
    const { results } = await c.env.DB.prepare(query).all();
    
    return c.json({
      leaderboard: results
    });
  } catch (error: any) {
    console.error(error);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

export default app;
