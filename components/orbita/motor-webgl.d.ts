import type { OrbMode } from "./presence-orb";

export interface NucleoOptions {
  /** pointer tilt, click/Enter pulse, role="button" (default true) */
  interactive?: boolean;
  /** auto follows <html data-theme>; dark/light force the material */
  tone?: "auto" | "dark" | "light";
}

export interface NucleoInstance {
  /** 0–1 (the product's "intensidade" setting / 100) */
  intensity: number;
  setState(mode: OrbMode): void;
  setReduced(value: boolean): void;
  energize(): void;
  invalidate(): void;
  destruir(): void;
}

/** The real Órbita core (WebGL, Canvas 2D fallback) — see motor-webgl.js. */
export declare const Nucleo: new (canvas: HTMLCanvasElement, opts?: NucleoOptions) => NucleoInstance;
export declare const ESTADOS: Record<OrbMode, { label: string; hue: [number, number, number]; speed: number; energy: number }>;
