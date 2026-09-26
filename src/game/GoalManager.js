import { ARENA, BALL } from '../core/Config.js';

// A goal counts once the whole ball has crossed the goal line.
export class GoalManager {
  constructor() {
    this.line = ARENA.halfLength + BALL.radius;
  }

  // Returns the scoring team (0 or 1) or -1.
  check(ball) {
    if (ball.frozen || ball.hidden) return -1;
    const z = ball.pos.z;
    if (z > this.line) return 0;
    if (z < -this.line) return 1;
    return -1;
  }
}
