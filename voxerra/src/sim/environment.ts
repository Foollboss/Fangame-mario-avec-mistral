/** Temps (cycle jour/nuit) et météo (clair, pluie, orage). */
import type { Rng } from '../engine/rng';

export const DAY_TICKS = 24000;
export type WeatherState = 'clair' | 'pluie' | 'orage';

export class Environment {
  /** Ticks absolus (20 par seconde ; 0 = lever du soleil du jour 0). */
  time = 1000;
  weather: WeatherState = 'clair';
  weatherTimer = 9000;
  /** Niveaux visuels lissés. */
  rain = 0;
  storm = 0;
  flash = 0;
  thunderTimer = 200;

  get dayTime(): number {
    return ((this.time % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  }
  get day(): number {
    return Math.floor(this.time / DAY_TICKS);
  }
  get isNight(): boolean {
    const t = this.dayTime;
    return t > 12800 && t < 23200;
  }
  /** Luminosité du ciel pour la logique (apparitions…) : 0..15 */
  get skyDarken(): number {
    const t = this.dayTime / DAY_TICKS;
    const s = Math.sin(t * Math.PI * 2);
    const base = s > 0.2 ? 0 : s < -0.2 ? 11 : Math.round((0.2 - s) / 0.4 * 11);
    return Math.min(15, base + (this.weather !== 'clair' ? 3 : 0));
  }

  /**
   * Avance d'un tick. Renvoie vrai si un éclair doit tomber.
   */
  tick(opts: { daylightCycle: boolean; weatherCycle: boolean }, rng: Rng): boolean {
    if (opts.daylightCycle) this.time++;
    if (opts.weatherCycle) {
      this.weatherTimer--;
      if (this.weatherTimer <= 0) {
        if (this.weather === 'clair') {
          this.weather = rng.chance(0.25) ? 'orage' : 'pluie';
          this.weatherTimer = rng.range(3600, 12000);
        } else {
          this.weather = 'clair';
          this.weatherTimer = rng.range(12000, 36000);
        }
      }
    }
    const targetRain = this.weather === 'clair' ? 0 : 1;
    const targetStorm = this.weather === 'orage' ? 1 : 0;
    this.rain += Math.sign(targetRain - this.rain) * Math.min(Math.abs(targetRain - this.rain), 0.005);
    this.storm += Math.sign(targetStorm - this.storm) * Math.min(Math.abs(targetStorm - this.storm), 0.005);
    this.flash = Math.max(0, this.flash - 0.08);
    if (this.weather === 'orage' && this.storm > 0.5) {
      this.thunderTimer--;
      if (this.thunderTimer <= 0) {
        this.thunderTimer = rng.range(100, 500);
        this.flash = 1;
        return true;
      }
    }
    return false;
  }

  setWeather(w: WeatherState, duration = 12000): void {
    this.weather = w;
    this.weatherTimer = duration;
  }

  /** Dormir : saute jusqu'au matin suivant. */
  skipNight(): void {
    const day = this.day;
    this.time = (day + 1) * DAY_TICKS + 200;
    if (this.weather !== 'clair') {
      this.weather = 'clair';
      this.weatherTimer = 12000;
    }
  }

  serialize(): { state: string; timer: number } {
    return { state: this.weather, timer: this.weatherTimer };
  }
}
