import { Maze, TILE_SIZE, MAZE_COLS } from './Maze';
import { Player } from './Player';
import { Ghost, GhostState, GhostType } from './Ghost';
import { Score, PowerUpType } from './Score';
import { FrameInput } from './ReplayRecorder';

export class HeadlessSimulator {
  public static simulate(seed: number, inputs: FrameInput[], maxFrames: number = 36000) {
    let currentFrame = 0;
    let inputIndex = 0;
    
    let levelIndex = 1;
    let currentScore = 0;
    
    let maze = new Maze(seed + levelIndex * 1000);
    const center = Math.floor(MAZE_COLS / 2);
    let player = new Player(maze, center, center);
    let ghosts = this.createGhosts(maze, levelIndex);
    let scoreObj = new Score(maze);
    scoreObj.current = currentScore;
    
    let invincibleFrames = 180;
    let powerupTimers = { freeze: 0, speed: 0 };
    let isOver = false;
    let terminatedEarly = false;
    
    const initLevel = (lvl: number, score: number) => {
      levelIndex = lvl;
      currentScore = score;
      maze = new Maze(seed + levelIndex * 1000);
      player = new Player(maze, center, center);
      ghosts = this.createGhosts(maze, levelIndex);
      scoreObj = new Score(maze);
      scoreObj.current = currentScore;
      invincibleFrames = 180;
      powerupTimers = { freeze: 0, speed: 0 };
    };

    while (!isOver && currentFrame < maxFrames) {
      currentFrame++;
      
      while (inputIndex < inputs.length && inputs[inputIndex].f === currentFrame) {
        player.setDirection(inputs[inputIndex].d);
        inputIndex++;
      }
      
      player.update();
      ghosts.forEach(g => g.update(player));
      
      if (invincibleFrames > 0) invincibleFrames--;
      if (powerupTimers.freeze > 0) {
        powerupTimers.freeze--;
        if (powerupTimers.freeze === 0) ghosts.forEach(g => { if (g.state === GhostState.FROZEN) g.state = GhostState.CHASE; });
      }
      if (powerupTimers.speed > 0) {
        powerupTimers.speed--;
        if (powerupTimers.speed === 0) player.speedMultiplier = 1.0;
      }
      
      const collision = scoreObj.checkCollisions(player);
      if (collision !== PowerUpType.NONE) {
        currentScore = scoreObj.current;
        if (collision === PowerUpType.GAS_SHIELD) {
          ghosts.forEach(g => g.state = GhostState.FROZEN);
          powerupTimers.freeze = 300;
        } else if (collision === PowerUpType.FLASH_LOAN) {
          player.speedMultiplier = 1.5;
          powerupTimers.speed = 300;
        } else if (collision === PowerUpType.RUG_PULL) {
          ghosts.forEach((g, i) => {
            g.x = (1 + i) * TILE_SIZE + TILE_SIZE / 2;
            g.y = 1 * TILE_SIZE + TILE_SIZE / 2;
            g.gridX = 1 + i;
            g.gridY = 1;
          });
        }
      }
      
      if (invincibleFrames <= 0) {
        for (const ghost of ghosts) {
          const dist = Math.hypot(player.x - ghost.x, player.y - ghost.y);
          if (dist < TILE_SIZE * 0.7 && !ghost.isEaten && ghost.state !== GhostState.FROZEN) {
            if (ghost.state === GhostState.FRIGHTENED) {
              ghost.isEaten = true;
              scoreObj.current += 200;
              currentScore = scoreObj.current;
            } else {
              isOver = true;
              break;
            }
          }
        }
      }
      
      if (isOver) break;
      
      if (scoreObj.isLevelComplete()) {
        scoreObj.current += 1000;
        currentScore = scoreObj.current;
        initLevel(levelIndex + 1, scoreObj.current);
      }
    }
    
    if (!isOver && currentFrame >= maxFrames) {
      terminatedEarly = true;
    }
    
    return {
      finalScore: currentScore,
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
