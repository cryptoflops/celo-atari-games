import { Maze, TILE_SIZE, MAZE_COLS } from './Maze';
import { Player } from './Player';
import { Ghost, GhostState, GhostType } from './Ghost';
import { Score, PowerUpType } from './Score';
import { FrameInput } from './ReplayRecorder';

export class HeadlessSimulator {
  public static createInitialState(seed: number, levelIndex: number, currentScore: number) {
    const maze = new Maze(seed + levelIndex * 1000);
    const center = Math.floor(MAZE_COLS / 2);
    const player = new Player(maze, center, center);
    const ghosts = this.createGhosts(maze, levelIndex);
    const scoreObj = new Score(maze);
    scoreObj.current = currentScore;
    
    return {
      maze,
      player,
      ghosts,
      scoreObj,
      invincibleFrames: 180,
      powerupTimers: { freeze: 0, speed: 0 }
    };
  }

  public static simulate(seed: number, inputs: FrameInput[], maxFrames: number = 36000) {
    let currentFrame = 0;
    let inputIndex = 0;
    let levelIndex = 1;
    
    let state = this.createInitialState(seed, levelIndex, 0);
    let isOver = false;
    let terminatedEarly = false;
    
    while (!isOver && currentFrame < maxFrames) {
      // Apply inputs for the CURRENT frame BEFORE updating physics
      while (inputIndex < inputs.length && inputs[inputIndex].f === currentFrame) {
        state.player.setDirection(inputs[inputIndex].d);
        inputIndex++;
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

      // Collisions
      const collision = state.scoreObj.checkCollisions(state.player);
      if (collision !== PowerUpType.NONE) {
        if (collision === PowerUpType.GAS_SHIELD) {
          state.ghosts.forEach(g => g.state = GhostState.FROZEN);
          state.powerupTimers.freeze = 300;
        } else if (collision === PowerUpType.FLASH_LOAN) {
          state.player.speedMultiplier = 1.5;
          state.powerupTimers.speed = 300;
        } else if (collision === PowerUpType.RUG_PULL) {
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
            } else {
              isOver = true;
            }
          }
        }
      }
      
      if (isOver) break;
      
      // Level Complete
      if (state.scoreObj.isLevelComplete()) {
        state.scoreObj.current += 1000;
        state = this.createInitialState(seed, levelIndex + 1, state.scoreObj.current);
        levelIndex++;
      }

      currentFrame++;
    }
    
    if (!isOver && currentFrame >= maxFrames) {
      terminatedEarly = true;
    }
    
    return {
      finalScore: state.scoreObj.current,
      frameCount: currentFrame,
      terminated: terminatedEarly
    };
  }

  private static createGhosts(maze: Maze, levelIndex: number): Ghost[] {
    const numGhosts = Math.min(4, Math.floor((levelIndex - 1) / 2) + 1);
    const speedMult = 1.0 + Math.floor(levelIndex / 2) * 0.25;
    const ghosts: Ghost[] = [];
    const types: GhostType[] = [GhostType.BLINKY, GhostType.PINKY, GhostType.INKY, GhostType.CLYDE];
    for (let i = 0; i < numGhosts; i++) {
      ghosts.push(new Ghost(maze, 1 + i, 1, types[i % 4], speedMult));
    }
    return ghosts;
  }
}
