import { Maze, TileType, TILE_SIZE } from './Maze';
import { Player, Direction } from './Player';

export const GhostState = {
  CHASE: 0,
  SCATTER: 1,
  FRIGHTENED: 2,
  FROZEN: 3
} as const;

export type GhostState = (typeof GhostState)[keyof typeof GhostState];

export const GhostType = {
  BLINKY: 0,
  PINKY: 1,
  INKY: 2,
  CLYDE: 3
} as const;

export type GhostType = (typeof GhostType)[keyof typeof GhostType];

export class Ghost {
  public x: number;
  public y: number;
  public gridX: number;
  public gridY: number;
  public currentDirection: Direction = Direction.NONE;
  public state: GhostState = GhostState.CHASE;
  public isEaten: boolean = false;
  public maze: Maze;
  
  public speed = 1.5;
  public type: GhostType;
  private lastGridKey: string = '';
  
  constructor(maze: Maze, startGridX: number, startGridY: number, type: GhostType = GhostType.BLINKY, speedMultiplier: number = 1.0) {
    this.maze = maze;
    this.gridX = startGridX;
    this.gridY = startGridY;
    this.x = this.gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = this.gridY * TILE_SIZE + TILE_SIZE / 2;
    this.type = type;
    this.speed = 1.5 * speedMultiplier;
  }

  public update(player: Player) {
    if (this.isEaten || this.state === GhostState.FROZEN) return;

    this.gridX = Math.round((this.x - TILE_SIZE / 2) / TILE_SIZE);
    this.gridY = Math.round((this.y - TILE_SIZE / 2) / TILE_SIZE);

    const centerX = this.gridX * TILE_SIZE + TILE_SIZE / 2;
    const centerY = this.gridY * TILE_SIZE + TILE_SIZE / 2;
    const distToCenter = Math.abs(this.x - centerX) + Math.abs(this.y - centerY);
    const gridKey = `${this.gridX},${this.gridY}`;

    if (distToCenter < this.speed + 1) {
      // Check wall ahead
      if (this.currentDirection !== Direction.NONE && !this.canMove(this.currentDirection)) {
        this.x = centerX;
        this.y = centerY;
        this.currentDirection = Direction.NONE;
      }

      // Choose new direction at each new tile
      if (gridKey !== this.lastGridKey || this.currentDirection === Direction.NONE) {
        this.x = centerX;
        this.y = centerY;
        this.lastGridKey = gridKey;
        this.chooseDirection(player);
      }
    }

    // Move
    if (this.currentDirection !== Direction.NONE) {
      switch (this.currentDirection) {
        case Direction.UP:    this.y -= this.speed; break;
        case Direction.DOWN:  this.y += this.speed; break;
        case Direction.LEFT:  this.x -= this.speed; break;
        case Direction.RIGHT: this.x += this.speed; break;
      }
    }
  }

  private chooseDirection(player: Player) {
    const possibleDirs: Direction[] = [];
    
    if (this.canMove(Direction.UP) && this.currentDirection !== Direction.DOWN) possibleDirs.push(Direction.UP);
    if (this.canMove(Direction.DOWN) && this.currentDirection !== Direction.UP) possibleDirs.push(Direction.DOWN);
    if (this.canMove(Direction.LEFT) && this.currentDirection !== Direction.RIGHT) possibleDirs.push(Direction.LEFT);
    if (this.canMove(Direction.RIGHT) && this.currentDirection !== Direction.LEFT) possibleDirs.push(Direction.RIGHT);

    if (possibleDirs.length === 0) {
      // Dead end: reverse
      switch (this.currentDirection) {
        case Direction.UP: this.currentDirection = Direction.DOWN; break;
        case Direction.DOWN: this.currentDirection = Direction.UP; break;
        case Direction.LEFT: this.currentDirection = Direction.RIGHT; break;
        case Direction.RIGHT: this.currentDirection = Direction.LEFT; break;
        default: this.currentDirection = Direction.RIGHT; break;
      }
      return;
    }

    if (this.state === GhostState.CHASE && possibleDirs.length > 1) {
      let targetX = player.gridX;
      let targetY = player.gridY;

      // Pinky targets 4 tiles ahead of player
      if (this.type === GhostType.PINKY) {
        switch (player.currentDirection) {
          case Direction.UP:    targetY -= 4; break;
          case Direction.DOWN:  targetY += 4; break;
          case Direction.LEFT:  targetX -= 4; break;
          case Direction.RIGHT: targetX += 4; break;
        }
      } else if (this.type === GhostType.INKY || this.type === GhostType.CLYDE) {
        // Just scatter randomly if it's Inky or Clyde
        const index = Math.abs(this.gridX * 31 + this.gridY * 17 + Math.floor(player.x)) % possibleDirs.length;
        this.currentDirection = possibleDirs[index];
        return;
      }

      let bestDir = possibleDirs[0];
      let bestDist = Infinity;
      for (const dir of possibleDirs) {
        let nx = this.gridX;
        let ny = this.gridY;
        switch (dir) {
          case Direction.UP:    ny -= 1; break;
          case Direction.DOWN:  ny += 1; break;
          case Direction.LEFT:  nx -= 1; break;
          case Direction.RIGHT: nx += 1; break;
        }
        const dist = Math.abs(nx - targetX) + Math.abs(ny - targetY);
        if (dist < bestDist) {
          bestDist = dist;
          bestDir = dir;
        }
      }
      this.currentDirection = bestDir;
    } else {
      const index = Math.abs(this.gridX * 31 + this.gridY * 17 + Math.floor(player.x)) % possibleDirs.length;
      this.currentDirection = possibleDirs[index];
    }
  }

  private canMove(dir: Direction): boolean {
    let checkX = this.gridX;
    let checkY = this.gridY;

    switch (dir) {
      case Direction.UP: checkY -= 1; break;
      case Direction.DOWN: checkY += 1; break;
      case Direction.LEFT: checkX -= 1; break;
      case Direction.RIGHT: checkX += 1; break;
      default: return false;
    }

    return this.maze.getTile(checkX, checkY) !== TileType.WALL;
  }
}
