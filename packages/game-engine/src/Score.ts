import { Maze, TileType } from './Maze';
import { Player } from './Player';

export const PowerUpType = {
  NONE: 0,
  PELLET: 1,
  POWER_PELLET: 2,
  GAS_SHIELD: 3,
  FLASH_LOAN: 4,
  RUG_PULL: 5
} as const;

export type PowerUpType = (typeof PowerUpType)[keyof typeof PowerUpType];

export class Score {
  public current: number = 0;
  public pelletsEaten: number = 0;
  private totalPellets: number = 0;
  private maze: Maze;

  constructor(maze: Maze) {
    this.maze = maze;
    this.countTotalPellets();
  }

  private countTotalPellets() {
    for (let y = 0; y < this.maze.grid.length; y++) {
      for (let x = 0; x < this.maze.grid[y].length; x++) {
        const t = this.maze.grid[y][x];
        if (t === TileType.PELLET || t === TileType.POWER_PELLET || 
            t === TileType.GAS_SHIELD || t === TileType.FLASH_LOAN || t === TileType.RUG_PULL) {
          this.totalPellets++;
        }
      }
    }
  }

  public checkCollisions(player: Player): PowerUpType {
    const tile = this.maze.getTile(player.gridX, player.gridY);
    
    if (tile === TileType.PELLET) {
      this.maze.setTile(player.gridX, player.gridY, TileType.EMPTY);
      this.current += 10;
      this.pelletsEaten++;
      return PowerUpType.PELLET;
    } else if (tile === TileType.POWER_PELLET) {
      this.maze.setTile(player.gridX, player.gridY, TileType.EMPTY);
      this.current += 50;
      this.pelletsEaten++;
      return PowerUpType.POWER_PELLET;
    } else if (tile === TileType.GAS_SHIELD) {
      this.maze.setTile(player.gridX, player.gridY, TileType.EMPTY);
      this.current += 100;
      this.pelletsEaten++;
      return PowerUpType.GAS_SHIELD;
    } else if (tile === TileType.FLASH_LOAN) {
      this.maze.setTile(player.gridX, player.gridY, TileType.EMPTY);
      this.current += 100;
      this.pelletsEaten++;
      return PowerUpType.FLASH_LOAN;
    } else if (tile === TileType.RUG_PULL) {
      this.maze.setTile(player.gridX, player.gridY, TileType.EMPTY);
      this.current += 100;
      this.pelletsEaten++;
      return PowerUpType.RUG_PULL;
    }

    return PowerUpType.NONE;
  }

  public isLevelComplete(): boolean {
    return this.pelletsEaten >= this.totalPellets;
  }
}
