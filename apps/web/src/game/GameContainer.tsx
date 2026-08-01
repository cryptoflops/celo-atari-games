import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameLoop } from './GameLoop';
import { Maze, TILE_SIZE, MAZE_COLS, Player, Direction, Ghost, GhostState, GhostType, Score, PowerUpType, ReplayRecorder } from '@celo-atari-games/gas-gobbler-engine';
import type { FrameInput } from '@celo-atari-games/gas-gobbler-engine';
import { CanvasRenderer } from './CanvasRenderer';

interface GameContainerProps {
  onGameOver: (score: number, replayInputs: FrameInput[]) => void;
  seed?: number;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onGameOver, seed = 12345 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameOverScore, setGameOverScore] = useState<number | null>(null);
  
  const gameRef = useRef<{
    maze: Maze;
    player: Player;
    ghosts: Ghost[];
    scoreObj: Score;
    level: number;
    invincibleFrames: number;
    powerupTimers: { freeze: number; speed: number };
  } | null>(null);

  const gameState = useRef<{
    loop: GameLoop | null;
    recorder: ReplayRecorder | null;
  }>({
    loop: null,
    recorder: null,
  });

  const handleInput = useCallback((dir: Direction) => {
    const player = gameRef.current?.player;
    const recorder = gameState.current.recorder;
    if (player && recorder && gameOverScore === null) {
      player.setDirection(dir);
      recorder.recordInput(dir);
    }
  }, [gameOverScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); handleInput(Direction.UP); break;
        case 'ArrowDown': e.preventDefault(); handleInput(Direction.DOWN); break;
        case 'ArrowLeft': e.preventDefault(); handleInput(Direction.LEFT); break;
        case 'ArrowRight': e.preventDefault(); handleInput(Direction.RIGHT); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const recorder = new ReplayRecorder();
    const renderer = new CanvasRenderer(canvasRef.current);
    let isOver = false;

    const initLevel = (levelIndex: number, currentScore: number = 0) => {
      const maze = new Maze(seed + levelIndex * 1000);
      const center = Math.floor(MAZE_COLS / 2);
      const player = new Player(maze, center, center);
      
      const numGhosts = Math.min(4, Math.floor((levelIndex - 1) / 2) + 1);
      const speedMult = 1.0 + Math.floor(levelIndex / 2) * 0.25;
      
      const ghosts: Ghost[] = [];
      const types: GhostType[] = [GhostType.BLINKY, GhostType.PINKY, GhostType.INKY, GhostType.CLYDE];
      for (let i = 0; i < numGhosts; i++) {
        ghosts.push(new Ghost(maze, 1 + i, 1, types[i % 4], speedMult));
      }
      
      const scoreObj = new Score(maze);
      scoreObj.current = currentScore;
      
      gameRef.current = {
        maze, player, ghosts, scoreObj,
        level: levelIndex,
        invincibleFrames: 180,
        powerupTimers: { freeze: 0, speed: 0 }
      };
      
      setCurrentLevel(levelIndex);
      setCurrentScore(currentScore);
    };

    // First time init
    initLevel(1, 0);

    const update = (_dt: number) => {
      if (isOver || !gameRef.current) return;
      const state = gameRef.current;
      
      recorder.tick();
      state.player.update();
      state.ghosts.forEach(g => g.update(state.player));

      // Timers
      if (state.invincibleFrames > 0) state.invincibleFrames--;
      if (state.powerupTimers.freeze > 0) {
        state.powerupTimers.freeze--;
        if (state.powerupTimers.freeze === 0) {
          state.ghosts.forEach(g => { if (g.state === GhostState.FROZEN) g.state = GhostState.CHASE; });
        }
      }
      if (state.powerupTimers.speed > 0) {
        state.powerupTimers.speed--;
        if (state.powerupTimers.speed === 0) {
          state.player.speedMultiplier = 1.0;
        }
      }

      const collision = state.scoreObj.checkCollisions(state.player);
      if (collision !== PowerUpType.NONE) {
        setCurrentScore(state.scoreObj.current);
        
        if (collision === PowerUpType.GAS_SHIELD) {
          state.ghosts.forEach(g => g.state = GhostState.FROZEN);
          state.powerupTimers.freeze = 300; // 5s freeze
        } else if (collision === PowerUpType.FLASH_LOAN) {
          state.player.speedMultiplier = 1.5; // 50% speed boost
          state.powerupTimers.speed = 300;
        } else if (collision === PowerUpType.RUG_PULL) {
          // Teleport ghosts back to top-left corner area
          state.ghosts.forEach((g, i) => {
            g.x = (1 + i) * TILE_SIZE + TILE_SIZE / 2;
            g.y = 1 * TILE_SIZE + TILE_SIZE / 2;
            g.gridX = 1 + i;
            g.gridY = 1;
          });
        }
      }

      // Check ghost collisions
      if (state.invincibleFrames <= 0) {
        for (const ghost of state.ghosts) {
          const dist = Math.hypot(state.player.x - ghost.x, state.player.y - ghost.y);
          if (dist < TILE_SIZE * 0.7 && !ghost.isEaten && ghost.state !== GhostState.FROZEN) {
            if (ghost.state === GhostState.FRIGHTENED) {
              ghost.isEaten = true;
              state.scoreObj.current += 200;
              setCurrentScore(state.scoreObj.current);
            } else {
              isOver = true;
              setGameOverScore(state.scoreObj.current);
              onGameOver(state.scoreObj.current, recorder.getInputs());
              return;
            }
          }
        }
      }

      // Level Complete check
      if (state.scoreObj.isLevelComplete()) {
        state.scoreObj.current += 1000;
        initLevel(state.level + 1, state.scoreObj.current);
      }
    };

    const draw = () => {
      if (!gameRef.current) return;
      const s = gameRef.current;
      renderer.draw(s.maze, s.player, s.ghosts, s.scoreObj.current, isOver);
    };

    const loop = new GameLoop(update, draw);
    gameState.current = { loop, recorder };
    loop.start();

    return () => { loop.stop(); };
  }, [seed, onGameOver]);

  const handleTouch = (dir: Direction) => () => handleInput(dir);

  // D-pad buttons — Sega arcade control look (hard offset press, active flips to primary).
  const dpadBtnClass =
    "arcade-btn arcade-btn-secondary p-0 rounded-none font-arcade text-xl flex items-center justify-center min-h-[60px] transition-all";
  const dpadStyle = { boxShadow: '4px 4px 0 #2a2a16' };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto relative p-4" ref={containerRef}>
      {/* Score HUD */}
      <div className="flex justify-between w-full mb-3 px-1">
        <div className="hw-chip flex items-center gap-2" style={{ fontSize: '13px' }}>
          <span className="tech-label text-white/55">SCORE</span>
          <span className="font-arcade text-secondary font-bold" style={{ fontSize: '15px' }}>{currentScore}</span>
        </div>
        <div className="hw-chip flex items-center gap-2" style={{ fontSize: '13px' }}>
          <span className="tech-label text-white/55">LVL</span>
          <span className="font-arcade text-primary font-bold" style={{ fontSize: '15px' }}>{currentLevel}</span>
        </div>
      </div>

      {/* Game canvas — Sega cabinet screen frame */}
      <div className="sega-screen" style={{ aspectRatio: '4 / 3', padding: 8 }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', imageRendering: 'pixelated', display: 'block' }}
        />

        {gameOverScore !== null && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center">
            <h2 className="pixel-subtitle mb-3" style={{ fontSize: '27px', color: 'var(--color-cream)' }}>
              GAME OVER
            </h2>
            <p
              className="font-arcade text-secondary mb-6"
              style={{ fontSize: '35px', textShadow: '3px 3px 0 var(--color-ink), 0 0 12px rgba(255,218,20,0.25)' }}
            >
              {gameOverScore.toLocaleString()}
            </p>
            <p className="tech-label text-white/55" style={{ fontSize: '13px' }}>Score saved. Press START to play again.</p>
          </div>
        )}
      </div>

      {/* Mobile D-pad — arcade joystick */}
      <div className="grid grid-cols-3 gap-3 mt-6 w-60 mx-auto md:hidden pb-8">
        <div />
        <button className={dpadBtnClass} style={dpadStyle} onClick={handleTouch(Direction.UP)} aria-label="Move up">▲</button>
        <div />
        <button className={dpadBtnClass} style={dpadStyle} onClick={handleTouch(Direction.LEFT)} aria-label="Move left">◀</button>
        <button className={dpadBtnClass} style={dpadStyle} onClick={handleTouch(Direction.DOWN)} aria-label="Move down">▼</button>
        <button className={dpadBtnClass} style={dpadStyle} onClick={handleTouch(Direction.RIGHT)} aria-label="Move right">▶</button>
      </div>
    </div>
  );
};
