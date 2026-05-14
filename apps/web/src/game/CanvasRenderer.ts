import { Maze, TileType, TILE_SIZE, MAZE_COLS, MAZE_ROWS, Player, Ghost, GhostState } from '@celo-arcade/game-engine';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = MAZE_COLS * TILE_SIZE;
    this.height = MAZE_ROWS * TILE_SIZE;
    
    // Set internal resolution
    canvas.width = this.width;
    canvas.height = this.height;
    
    // Scale for crisp pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  public draw(maze: Maze, player: Player, ghosts: Ghost[], score: number, isGameOver: boolean) {
    // Clear background
    this.ctx.fillStyle = '#0F0F0F';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw maze
    for (let y = 0; y < MAZE_ROWS; y++) {
      for (let x = 0; x < MAZE_COLS; x++) {
        const tile = maze.getTile(x, y);
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        if (tile === TileType.WALL) {
          this.ctx.fillStyle = '#004E89';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          
          // Inner detail
          this.ctx.strokeStyle = '#2274A5';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        } else if (tile === TileType.PELLET) {
          this.ctx.fillStyle = '#FFB140';
          this.ctx.beginPath();
          this.ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 4, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (tile === TileType.POWER_PELLET) {
          this.ctx.fillStyle = '#FFB140';
          this.ctx.beginPath();
          // Pulsing effect based on time
          const radius = 6 + Math.sin(Date.now() / 150) * 2;
          this.ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, radius, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (tile === TileType.GAS_SHIELD) {
          this.ctx.fillStyle = '#56DF7C'; // Celo green
          this.ctx.beginPath();
          this.ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 8, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (tile === TileType.FLASH_LOAN) {
          this.ctx.fillStyle = '#FCFF52'; // Prosperity Yellow
          this.ctx.beginPath();
          this.ctx.moveTo(px + TILE_SIZE / 2, py + 4);
          this.ctx.lineTo(px + TILE_SIZE - 4, py + TILE_SIZE - 4);
          this.ctx.lineTo(px + 4, py + TILE_SIZE - 4);
          this.ctx.closePath();
          this.ctx.fill();
        } else if (tile === TileType.RUG_PULL) {
          this.ctx.fillStyle = '#F72585'; // Pink/Red
          this.ctx.fillRect(px + 6, py + 6, TILE_SIZE - 12, TILE_SIZE - 12);
        }
      }
    }

    // Draw Player
    this.ctx.fillStyle = '#FF6B35';
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, TILE_SIZE * 0.4, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw Ghosts
    for (const ghost of ghosts) {
      if (!ghost.isEaten) {
        let color = '#F72585'; // Default Pink/Red
        if (ghost.state === GhostState.FRIGHTENED) color = '#00A676';
        if (ghost.state === GhostState.FROZEN) color = '#56DF7C';
        this.ctx.fillStyle = color;
        this.ctx.fillRect(ghost.x - TILE_SIZE * 0.4, ghost.y - TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
      }
    }

    // Draw UI overlay if Game Over
    if (isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 24px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 20);
      this.ctx.fillText(`SCORE: ${score}`, this.width / 2, this.height / 2 + 20);
    }
  }
}
