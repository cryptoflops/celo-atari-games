export const TILE_SIZE = 32;
export const MAZE_COLS = 15;
export const MAZE_ROWS = 15;

export const TileType = {
  EMPTY: 0,
  WALL: 1,
  PELLET: 2,
  POWER_PELLET: 3,
  GAS_SHIELD: 4,
  FLASH_LOAN: 5,
  RUG_PULL: 6
} as const;

export type TileType = (typeof TileType)[keyof typeof TileType];

export class Maze {
  public grid: TileType[][] = [];
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
    this.generate();
  }

  // Simple LCG PRNG for deterministic maze generation
  private random(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  private generate() {
    // Start with all walls
    this.grid = [];
    for (let y = 0; y < MAZE_ROWS; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < MAZE_COLS; x++) {
        row.push(TileType.WALL);
      }
      this.grid.push(row);
    }

    // Use recursive backtracker on odd-numbered cells
    const visited: boolean[][] = [];
    for (let y = 0; y < MAZE_ROWS; y++) {
      visited.push(new Array(MAZE_COLS).fill(false));
    }

    // Start carving from (1,1)
    const stack: [number, number][] = [];
    this.grid[1][1] = TileType.PELLET;
    visited[1][1] = true;
    stack.push([1, 1]);

    const directions = [
      [0, -2], // up
      [0, 2],  // down
      [-2, 0], // left
      [2, 0],  // right
    ];

    while (stack.length > 0) {
      const [cx, cy] = stack[stack.length - 1];

      // Find unvisited neighbors (2 cells away)
      const neighbors: [number, number, number, number][] = [];
      for (const [ddx, ddy] of directions) {
        const nx = cx + ddx;
        const ny = cy + ddy;
        if (nx > 0 && nx < MAZE_COLS - 1 && ny > 0 && ny < MAZE_ROWS - 1 && !visited[ny][nx]) {
          neighbors.push([nx, ny, cx + ddx / 2, cy + ddy / 2]);
        }
      }

      if (neighbors.length > 0) {
        const idx = Math.floor(this.random() * neighbors.length);
        const [nx, ny, wallX, wallY] = neighbors[idx];

        this.grid[wallY][wallX] = TileType.PELLET;
        this.grid[ny][nx] = TileType.PELLET;
        visited[ny][nx] = true;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }

    // Open up extra passages to reduce dead ends
    for (let y = 2; y < MAZE_ROWS - 2; y++) {
      for (let x = 2; x < MAZE_COLS - 2; x++) {
        if (this.grid[y][x] === TileType.WALL) {
          const hasVerticalPair = this.grid[y - 1][x] !== TileType.WALL && this.grid[y + 1][x] !== TileType.WALL;
          const hasHorizontalPair = this.grid[y][x - 1] !== TileType.WALL && this.grid[y][x + 1] !== TileType.WALL;

          if ((hasVerticalPair || hasHorizontalPair) && this.random() < 0.35) {
            this.grid[y][x] = TileType.PELLET;
          }
        }
      }
    }

    // Place power pellets in corners
    this.setSafeTile(1, 1, TileType.POWER_PELLET);
    this.setSafeTile(MAZE_COLS - 2, 1, TileType.POWER_PELLET);
    this.setSafeTile(1, MAZE_ROWS - 2, TileType.POWER_PELLET);
    this.setSafeTile(MAZE_COLS - 2, MAZE_ROWS - 2, TileType.POWER_PELLET);

    // Ensure player spawn (center) is clear
    const cx = Math.floor(MAZE_COLS / 2);
    const cy = Math.floor(MAZE_ROWS / 2);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        this.setSafeTile(cx + dx, cy + dy, TileType.EMPTY);
      }
    }

    // Ensure ghost spawn area is clear
    this.setSafeTile(cx, cy - 2, TileType.EMPTY);
    this.setSafeTile(cx, cy - 3, TileType.PELLET);

    // Place Web3 Powerups
    this.placeRandomPowerup(TileType.GAS_SHIELD);
    this.placeRandomPowerup(TileType.FLASH_LOAN);
    this.placeRandomPowerup(TileType.RUG_PULL);
  }

  private placeRandomPowerup(type: TileType) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      const rx = Math.floor(this.random() * (MAZE_COLS - 2)) + 1;
      const ry = Math.floor(this.random() * (MAZE_ROWS - 2)) + 1;
      
      // Only replace regular pellets, to avoid overriding empty spawn areas or power pellets
      if (this.grid[ry][rx] === TileType.PELLET) {
        this.grid[ry][rx] = type;
        placed = true;
      }
      attempts++;
    }
  }

  private setSafeTile(x: number, y: number, type: TileType) {
    if (y >= 0 && y < MAZE_ROWS && x >= 0 && x < MAZE_COLS) {
      this.grid[y][x] = type;
    }
  }

  public getTile(x: number, y: number): TileType {
    if (y < 0 || y >= MAZE_ROWS || x < 0 || x >= MAZE_COLS) {
      return TileType.WALL;
    }
    return this.grid[y][x];
  }

  public setTile(x: number, y: number, type: TileType) {
    if (y >= 0 && y < MAZE_ROWS && x >= 0 && x < MAZE_COLS) {
      this.grid[y][x] = type;
    }
  }
}
