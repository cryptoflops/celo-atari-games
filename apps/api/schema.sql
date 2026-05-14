-- Celo Atari Games SQLite Schema (Cloudflare D1)

CREATE TABLE IF NOT EXISTS players (
    address TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offchain_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_address TEXT REFERENCES players(address),
    score INTEGER NOT NULL,
    session_id TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_offchain_scores_player ON offchain_scores(player_address);
CREATE INDEX IF NOT EXISTS idx_offchain_scores_score ON offchain_scores(score DESC);
