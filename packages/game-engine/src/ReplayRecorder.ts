import { Direction } from './Player';

export interface FrameInput {
  f: number; // frame number
  d: Direction; // direction
}

export class ReplayRecorder {
  private currentFrame: number = 0;
  private inputs: FrameInput[] = [];
  private lastDirection: Direction = Direction.NONE;

  public tick() {
    this.currentFrame++;
  }

  public recordInput(dir: Direction) {
    if (dir !== this.lastDirection) {
      this.inputs.push({ f: this.currentFrame, d: dir });
      this.lastDirection = dir;
    }
  }

  public getReplayHash(): string {
    // Basic deterministic hash of the replay
    // In a real app, this would be a keccak256 hash
    // Here we just stringify and encode for simplicity
    const data = JSON.stringify(this.inputs);
    return btoa(data);
  }

  public getInputs(): FrameInput[] {
    return this.inputs;
  }
}
