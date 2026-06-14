import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameLoop } from './GameLoop';
import { Maze, TILE_SIZE, Player, Direction, Ghost, GhostState, Score, PowerUpType, ReplayRecorder, HeadlessSimulator } from '@celo-atari-games/gas-gobbler-engine';
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

  const nextDirRef = useRef<Direction>(Direction.NONE);

  const handleInput = useCallback((dir: Direction) => {
    const player = gameRef.current?.player;
    if (player && gameOverScore === null) {
      nextDirRef.current = dir;
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
      const state = HeadlessSimulator.createInitialState(seed, levelIndex, currentScore);
      
      gameRef.current = {
        ...state,
        level: levelIndex,
      };
      
      setCurrentLevel(levelIndex);
      setCurrentScore(currentScore);
    };

    // First time init
    initLevel(1, 0);

    const update = () => {
      if (isOver || !gameRef.current) return;
      const state = gameRef.current;
      
      // Sync Input
      const currentDir = nextDirRef.current;
      if (currentDir !== Direction.NONE) {
        state.player.setDirection(currentDir);
        recorder.recordInput(currentDir);
        nextDirRef.current = Direction.NONE; // Reset after recording
      }

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
        const collisionThresholdSq = (TILE_SIZE * 0.7) ** 2;
        for (const ghost of state.ghosts) {
          const dx = state.player.x - ghost.x;
          const dy = state.player.y - ghost.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < collisionThresholdSq && !ghost.isEaten && ghost.state !== GhostState.FROZEN) {
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

      recorder.tick();
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

  const handleControlEvent = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    handleInput(dir);
  };

  const dpadBtnClass = "glass-panel flex items-center justify-center aspect-square text-3xl transition-all active:scale-90 active:bg-primary/30 active:border-primary/50 text-white/90 select-none touch-none shadow-lg";
  const dpadStyle = { backdropFilter: 'blur(12px)' };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto relative p-4 touch-none" ref={containerRef}>
      {/* Score HUD */}
      <div className="flex justify-between w-full mb-3 px-1">
        <div className="glass-panel px-3 py-1.5 flex items-center gap-2 text-[10px]">
          <span className="tech-label opacity-40">SCORE</span>
          <span className="text-primary font-bold">{currentScore}</span>
        </div>
        <div className="glass-panel px-3 py-1.5 flex items-center gap-2 text-[10px]">
          <span className="tech-label opacity-40">LVL</span>
          <span className="text-secondary font-bold">{currentLevel}</span>
        </div>
      </div>
      
      {/* Game canvas with arcade cabinet frame */}
      <div className="relative overflow-hidden border border-white/10 rounded-xl glass-panel shadow-2xl">
        <canvas 
          ref={canvasRef}
          className="block w-full h-auto image-pixelated"
          style={{ maxWidth: 'min(90vw, 400px)' }}
        />
        
        {gameOverScore !== null && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <h2 className="pixel-title text-2xl text-cream mb-4">GAME OVER</h2>
            <div className="font-arcade text-4xl text-primary mb-8">{gameOverScore}</div>
            <p className="tech-label opacity-40 text-[9px] uppercase tracking-widest">Score secured on-chain</p>
          </div>
        )}
      </div>

      {/* Mobile D-pad — ergonomic layout */}
      <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-[280px] mx-auto pb-16 select-none">
        <div />
        <button 
          className={dpadBtnClass} 
          style={dpadStyle} 
          onTouchStart={handleControlEvent(Direction.UP)}
          onMouseDown={handleControlEvent(Direction.UP)}
        >
          ▲
        </button>
        <div />
        <button 
          className={dpadBtnClass} 
          style={dpadStyle} 
          onTouchStart={handleControlEvent(Direction.LEFT)}
          onMouseDown={handleControlEvent(Direction.LEFT)}
        >
          ◀
        </button>
        <button 
          className={dpadBtnClass} 
          style={dpadStyle} 
          onTouchStart={handleControlEvent(Direction.DOWN)}
          onMouseDown={handleControlEvent(Direction.DOWN)}
        >
          ▼
        </button>
        <button 
          className={dpadBtnClass} 
          style={dpadStyle} 
          onTouchStart={handleControlEvent(Direction.RIGHT)}
          onMouseDown={handleControlEvent(Direction.RIGHT)}
        >
          ▶
        </button>
      </div>
    </div>

  );
};
