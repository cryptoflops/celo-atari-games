import { Maze, TileType, TILE_SIZE } from './Maze';

export const Direction = {
  NONE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export class Player {
  public x: number;
  public y: number;
  public gridX: number;
  public gridY: number;
  public nextDirection: Direction = Direction.NONE;
  public currentDirection: Direction = Direction.NONE;
  public maze: Maze;
  
  public speedMultiplier: number = 1.0;
  
  get speed(): number {
    return 2 * this.speedMultiplier;
  }
  
  constructor(maze: Maze, startGridX: number, startGridY: number) {
    this.maze = maze;
    this.gridX = startGridX;
    this.gridY = startGridY;
    this.x = this.gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = this.gridY * TILE_SIZE + TILE_SIZE / 2;
  }

  public setDirection(dir: Direction) {
    this.nextDirection = dir;
  }

  public update() {
    // Try to apply queued direction at tile centers
    this.gridX = Math.round((this.x - TILE_SIZE / 2) / TILE_SIZE);
    this.gridY = Math.round((this.y - TILE_SIZE / 2) / TILE_SIZE);
    
    const centerX = this.gridX * TILE_SIZE + TILE_SIZE / 2;
    const centerY = this.gridY * TILE_SIZE + TILE_SIZE / 2;
    const distToCenter = Math.abs(this.x - centerX) + Math.abs(this.y - centerY);

    if (distToCenter < this.speed + 1) {
      // Try queued direction
      if (this.nextDirection !== Direction.NONE && this.canMove(this.nextDirection)) {
        this.x = centerX;
        this.y = centerY;
        this.currentDirection = this.nextDirection;
        this.nextDirection = Direction.NONE;
      }
      
      // If stopped, also try queued direction
      if (this.currentDirection === Direction.NONE && this.nextDirection !== Direction.NONE) {
        if (this.canMove(this.nextDirection)) {
          this.x = centerX;
          this.y = centerY;
          this.currentDirection = this.nextDirection;
          this.nextDirection = Direction.NONE;
        }
      }

      // Check if current direction is about to hit a wall
      if (this.currentDirection !== Direction.NONE && !this.canMove(this.currentDirection)) {
        this.x = centerX;
        this.y = centerY;
        this.currentDirection = Direction.NONE;
        return;
      }
    }

    // Move in current direction
    if (this.currentDirection === Direction.NONE) return;

    switch (this.currentDirection) {
      case Direction.UP:    this.y -= this.speed; break;
      case Direction.DOWN:  this.y += this.speed; break;
      case Direction.LEFT:  this.x -= this.speed; break;
      case Direction.RIGHT: this.x += this.speed; break;
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
