/** Entité de base : position, corps physique, orientation. */
import { newBody, type Body } from '../physics/collision';

let nextId = 1;
export const allocEntityId = (): number => nextId++;
export const bumpEntityIds = (min: number): void => {
  if (nextId <= min) nextId = min + 1;
};

export abstract class Entity {
  id = allocEntityId();
  abstract readonly kind: string;
  body: Body;
  yaw = 0;
  pitch = 0;
  removed = false;
  age = 0;
  /** Position précédente (interpolation de rendu). */
  px = 0;
  py = 0;
  pz = 0;
  pyaw = 0;
  eye: number;
  /** Dimension où se trouve l'entité. */
  dim = 'surface';
  /** Nom affiché (messages de mort, étiquettes). */
  displayName = '';

  constructor(hw: number, h: number, eye = h * 0.85) {
    this.body = newBody(hw, h);
    this.eye = eye;
  }

  get x(): number {
    return this.body.x;
  }
  get y(): number {
    return this.body.y;
  }
  get z(): number {
    return this.body.z;
  }

  setPos(x: number, y: number, z: number): void {
    this.body.x = this.px = x;
    this.body.y = this.py = y;
    this.body.z = this.pz = z;
  }

  savePrev(): void {
    this.px = this.body.x;
    this.py = this.body.y;
    this.pz = this.body.z;
    this.pyaw = this.yaw;
  }

  distTo(x: number, y: number, z: number): number {
    return Math.hypot(this.body.x - x, this.body.y - y, this.body.z - z);
  }

  /** Centre du corps. */
  get cy(): number {
    return this.body.y + this.body.h / 2;
  }
}
