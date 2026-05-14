export type UpdateCallback = (dt: number) => void;
export type DrawCallback = () => void;

export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly step: number = 1000 / 60; // 60 FPS fixed timestep
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private updateFn: UpdateCallback;
  private drawFn: DrawCallback;

  constructor(updateFn: UpdateCallback, drawFn: DrawCallback) {
    this.updateFn = updateFn;
    this.drawFn = drawFn;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    let dt = currentTime - this.lastTime;
    
    // Prevent spiraling of death if the tab was inactive
    if (dt > 250) {
      dt = 250;
    }

    this.lastTime = currentTime;
    this.accumulator += dt;

    // Fixed timestep update
    while (this.accumulator >= this.step) {
      this.updateFn(this.step);
      this.accumulator -= this.step;
    }

    // Render as fast as possible
    this.drawFn();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
