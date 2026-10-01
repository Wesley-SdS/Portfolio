/**
 * Núcleo "Presença" da Órbita — port of `prototypes/orbita-presenca/orb.js` (repo Orbita):
 * neural mesh, gyroscopes and per-state reactions drawn on a Canvas 2D. No WebGL, no dependency.
 * The drawing code is kept as in the source; this file only adds types, a `tone` option
 * (the stage is always dark), `destroy()` and removes the prototype-only globals.
 * Speech/listening rhythms are illustrative: no audio is captured.
 */

const TAU = Math.PI * 2;

export type OrbMode =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "searching"
  | "connecting"
  | "executing"
  | "success"
  | "attention"
  | "error";

type RGB = [number, number, number];

export const ORB_MODES: Record<OrbMode, { hue: RGB; speed: number; energy: number }> = {
  idle: { hue: [65, 212, 162], speed: 0.3, energy: 0.36 },
  listening: { hue: [47, 219, 228], speed: 0.4, energy: 0.8 },
  thinking: { hue: [163, 135, 255], speed: 0.72, energy: 0.9 },
  speaking: { hue: [91, 236, 186], speed: 0.46, energy: 0.95 },
  searching: { hue: [79, 173, 255], speed: 0.9, energy: 0.8 },
  connecting: { hue: [44, 212, 199], speed: 0.56, energy: 0.78 },
  executing: { hue: [100, 231, 157], speed: 1, energy: 1 },
  success: { hue: [156, 245, 115], speed: 0.34, energy: 0.9 },
  attention: { hue: [246, 184, 80], speed: 0.12, energy: 0.55 },
  error: { hue: [245, 120, 94], speed: 0.16, energy: 0.5 },
};

export const ORB_MODE_LIST = Object.keys(ORB_MODES) as OrbMode[];

export interface PresenceOrbOptions {
  /** auto: follows <html data-theme> (or the OS); dark/light: fixed (e.g. the stage is always dark) */
  tone?: "auto" | "dark" | "light";
  /** pointer tilt + click pulse */
  interactive?: boolean;
  /** tiny mono read-outs beside the sphere (only drawn when the canvas is wider than 470px) */
  labels?: boolean;
  /** 0..1 amplitude of the voice/listening rhythms */
  intensity?: number;
}

type P3 = { x: number; y: number; z: number };
type Node = P3 & { phase: number };

export class PresenceOrb {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: Required<PresenceOrbOptions>;
  private state: OrbMode = "idle";
  private reduced: boolean;
  private hue: number[] = [...ORB_MODES.idle.hue];
  private energy = 0.36;
  private time = 0;
  private spin = 0;
  private last = 0;
  private lastDraw = 0;
  private frameId = 0;
  private visible = true;
  private dirty = true;
  private pointer = { x: 0, y: 0 };
  private tilt = { x: 0, y: 0 };
  private impulse = 0;
  private hover = 0;
  private hoverTarget = 0;
  private width = 0;
  private height = 0;
  private nodes: Node[];
  private edges: { a: number; b: number }[] = [];
  private sprite: HTMLCanvasElement;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private cleanup: (() => void)[] = [];

  constructor(canvas: HTMLCanvasElement, options: PresenceOrbOptions = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
    this.opts = { tone: "auto", interactive: true, labels: true, intensity: 0.85, ...options };
    this.reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.nodes = Array.from({ length: 116 }, (_, i) => {
      const y = 1 - (i / 115) * 2;
      const rr = Math.sqrt(1 - y * y);
      const a = i * 2.39996323;
      return { x: Math.cos(a) * rr, y, z: Math.sin(a) * rr, phase: i * 1.73 };
    });
    for (let i = 0; i < this.nodes.length; i++)
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];
        if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 0.43) this.edges.push({ a: i, b: j });
      }

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const g = sprite.getContext("2d") as CanvasRenderingContext2D;
    const glow = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "#fff");
    glow.addColorStop(0.07, "rgba(235,255,248,.95)");
    glow.addColorStop(0.24, "rgba(145,255,211,.35)");
    glow.addColorStop(1, "rgba(80,250,198,0)");
    g.fillStyle = glow;
    g.fillRect(0, 0, 64, 64);
    this.sprite = sprite;

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
    }
    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionObserver = new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        this.schedule();
      });
      this.intersectionObserver.observe(canvas);
    }
    const onVisibility = () => this.schedule();
    document.addEventListener("visibilitychange", onVisibility);
    this.cleanup.push(() => document.removeEventListener("visibilitychange", onVisibility));

    if (this.opts.interactive) {
      const move = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        this.pointer.x = (e.clientX - r.left) / r.width - 0.5;
        this.pointer.y = (e.clientY - r.top) / r.height - 0.5;
        this.hoverTarget = 1;
      };
      const leave = () => {
        this.pointer = { x: 0, y: 0 };
        this.hoverTarget = 0;
      };
      const click = () => this.energize();
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerleave", leave);
      canvas.addEventListener("click", click);
      this.cleanup.push(() => {
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerleave", leave);
        canvas.removeEventListener("click", click);
      });
    }
    this.resize();
  }

  destroy() {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    this.visible = false;
  }

  /** one-off expansive reaction (click / state change) */
  energize() {
    this.impulse = 1;
    this.dirty = true;
    this.schedule();
  }

  /** redraw once (e.g. after a theme change while motion is reduced) */
  invalidate() {
    this.dirty = true;
    this.schedule();
  }

  setState(mode: OrbMode) {
    if (!ORB_MODES[mode]) return;
    this.state = mode;
    this.dirty = true;
    this.schedule();
  }

  setReduced(reduced: boolean) {
    this.reduced = reduced;
    this.dirty = true;
    this.schedule();
  }

  private isDark() {
    if (this.opts.tone !== "auto") return this.opts.tone === "dark";
    const t = document.documentElement.dataset.theme;
    if (t === "dark") return true;
    if (t === "light") return false;
    return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.width = rect.width;
    this.height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
    this.dirty = false;
    this.schedule();
  }

  private schedule() {
    cancelAnimationFrame(this.frameId);
    if (!this.visible || document.hidden) {
      this.last = 0;
      return;
    }
    this.frameId = requestAnimationFrame((t) => this.frame(t));
  }

  private frame(now: number) {
    if (!this.visible || document.hidden) {
      this.last = 0;
      return;
    }
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.06) : 0.016;
    this.last = now;
    if (!this.reduced) {
      this.time += dt;
      this.spin += dt * ORB_MODES[this.state].speed;
      this.impulse = Math.max(0, this.impulse - dt * 0.54);
    }
    if (now - this.lastDraw >= (this.state === "idle" ? 1000 / 24 : 1000 / 30) || this.dirty) {
      if (!this.reduced || this.dirty) this.draw();
      this.lastDraw = now;
      this.dirty = false;
    }
    if (!this.reduced) this.frameId = requestAnimationFrame((t) => this.frame(t));
  }

  private draw() {
    if (!this.width || !this.height) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cfg = ORB_MODES[this.state];
    const s = this.state;
    const t = this.reduced ? 2.3 : this.time;
    const spin = this.reduced ? 0.4 : this.spin;
    const blend = this.reduced ? 1 : 0.085;
    this.hue = this.hue.map((v, i) => v + (cfg.hue[i] - v) * blend);
    this.energy += (cfg.energy - this.energy) * blend;
    this.tilt.x += (this.pointer.x - this.tilt.x) * 0.085;
    this.tilt.y += (this.pointer.y - this.tilt.y) * 0.085;
    this.hover += (this.hoverTarget - this.hover) * 0.08;
    const [rr, gg, bb] = this.hue.map(Math.round);
    const dark = this.isDark();
    const color = (a: number, white = 0) =>
      `rgba(${Math.round(rr + (255 - rr) * white)},${Math.round(gg + (255 - gg) * white)},${Math.round(bb + (255 - bb) * white)},${a})`;
    const trace = (a: number) =>
      dark ? color(a) : `rgba(${Math.round(rr * 0.26)},${Math.round(gg * 0.46)},${Math.round(bb * 0.43)},${a})`;
    const amp = 0.4 + this.opts.intensity * 0.6;
    const E = this.energy;
    const impact = this.reduced ? 0 : this.impulse;
    const voice = s === "speaking" ? (Math.sin(t * 8.8) * 0.045 + Math.sin(t * 15.5) * 0.028) * amp : 0;
    const r = Math.min(h * 0.315, w * 0.245) * (1 + Math.sin(t * 1.65) * 0.014 + voice + impact * 0.065);
    const cx = w / 2 + (this.reduced ? 0 : this.tilt.x * 10);
    const cy = h * 0.48 + (this.reduced ? 0 : this.tilt.y * 7);
    const yaw = spin * 0.35 + (this.reduced ? 0 : this.tilt.x * 0.62);
    const pitch = -0.24 + Math.sin(t * 0.36) * 0.1 + (this.reduced ? 0 : this.tilt.y * 0.45);
    const project = (p: P3, scale = 1) => {
      const x = p.x * Math.cos(yaw) + p.z * Math.sin(yaw);
      const z = -p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
      const y = p.y * Math.cos(pitch) - z * Math.sin(pitch);
      const zz = p.y * Math.sin(pitch) + z * Math.cos(pitch);
      const perspective = 3.8 / (3.8 - zz * 0.22);
      return { x: cx + x * r * scale * perspective, y: cy + y * r * scale * perspective, z: zz };
    };
    const glow = (x: number, y: number, size: number, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(this.sprite, x - size, y - size, size * 2, size * 2);
      ctx.globalAlpha = 1;
    };
    const dot = (x: number, y: number, size: number, fill: string) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, TAU);
      ctx.fill();
    };

    ctx.clearRect(0, 0, w, h);
    const aura = ctx.createRadialGradient(cx, cy, r * 0.38, cx, cy, r * 1.9);
    aura.addColorStop(0, color(dark ? 0.25 : 0.14));
    aura.addColorStop(0.6, color(0.05));
    aura.addColorStop(1, color(0));
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, w, h);

    // 3D gyroscopes, split back/front for real occlusion.
    const ringConfigs = [
      { rx: 0.37, rz: -0.43, rad: 1.47 },
      { rx: 1.04, rz: 0.69, rad: 1.37 },
      { rx: -0.7, rz: 1.6, rad: 1.27 },
    ];
    const ringPoint = (angle: number, index: number) => {
      const o = ringConfigs[index];
      const tiltA = o.rx + Math.sin(t * 0.3 + index) * 0.18;
      const radius = o.rad + (s === "connecting" ? Math.sin(t * 2.2 + index) * 0.12 : 0) + this.hover * 0.025;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * Math.cos(tiltA);
      const z = Math.sin(angle) * radius * Math.sin(tiltA);
      const turn = o.rz + spin * (index === 1 ? -0.19 : 0.14);
      return project({ x: x * Math.cos(turn) - y * Math.sin(turn), y: x * Math.sin(turn) + y * Math.cos(turn), z });
    };
    const rings = (front: boolean) => {
      for (let k = 0; k < 3; k++) {
        for (let layer = 0; layer < 2; layer++) {
          ctx.beginPath();
          let pen = false;
          for (let i = 0; i <= 144; i++) {
            const angle = (i / 144) * TAU;
            const p = ringPoint(angle, k);
            const gap = (i + k * 5 + Math.floor(spin * 9)) % 36 > 29;
            if (p.z >= 0 !== front || (s === "error" && i % 38 > 20) || (layer === 1 && gap)) {
              pen = false;
              continue;
            }
            const off = layer ? 1 : 1.012;
            const x = cx + (p.x - cx) * off;
            const y = cy + (p.y - cy) * off;
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
          }
          ctx.strokeStyle = layer ? trace(front ? 0.66 : 0.23) : trace(0.12);
          ctx.lineWidth = layer ? (k === 0 ? 1.15 : 0.7) : 0.5;
          ctx.stroke();
        }
        const a = spin * (k === 1 ? -1.5 : 1.3) + k * 2.2;
        const p = ringPoint(a, k);
        if (p.z >= 0 === front) {
          glow(p.x, p.y, 8, 0.5);
          dot(p.x, p.y, 2.1, dark ? color(1, 0.7) : trace(0.9));
        }
      }
    };
    rings(false);

    // Dark shell keeps the emissive circuits readable in both themes.
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.035, 0, TAU);
    ctx.clip();
    const shell = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.03, cx, cy, r * 1.07);
    shell.addColorStop(0, "rgba(9,32,32,.97)");
    shell.addColorStop(0.58, "rgba(8,27,30,.96)");
    shell.addColorStop(0.84, "rgba(12,44,43,.94)");
    shell.addColorStop(1, "rgba(43,91,73,.13)");
    ctx.fillStyle = shell;
    ctx.fillRect(cx - r * 1.1, cy - r * 1.1, r * 2.2, r * 2.2);
    const points = this.nodes.map((n, i) => {
      const fluctuation = 1 + Math.sin(t * (s === "thinking" ? 3.1 : 1.4) + n.phase) * 0.022 * E * amp;
      const p = project(n, fluctuation);
      if (s === "error" && i % 7 === 0) p.x += Math.sin(Math.floor(t * 2) + i) * r * 0.045;
      return p;
    });
    ctx.globalCompositeOperation = "screen";
    for (let bucket = 0; bucket < 6; bucket++) {
      ctx.beginPath();
      for (const edge of this.edges) {
        const a = points[edge.a];
        const b = points[edge.b];
        const depth = (a.z + b.z + 2) / 4;
        if (Math.min(5, Math.floor(depth * 6)) !== bucket || (s === "error" && edge.a % 9 < 2)) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.strokeStyle = color(0.05 + bucket * 0.038 + E * 0.035);
      ctx.lineWidth = 0.35 + bucket * 0.08;
      ctx.stroke();
    }
    for (let latitude = -2; latitude <= 2; latitude++) {
      const ly = latitude * 0.31;
      const rad = Math.sqrt(1 - ly * ly);
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * TAU;
        const p = project({ x: Math.cos(a) * rad, y: ly, z: Math.sin(a) * rad });
        if (p.z < 0 || i % 27 > 23) {
          pen = false;
          continue;
        }
        if (pen) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
        pen = true;
      }
      ctx.strokeStyle = color(0.15, 0.24);
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    const sweep = (t * 1.65) % TAU;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const depth = (p.z + 1) / 2;
      let brightness = 0.25 + depth * 0.6;
      if (s === "searching") {
        const ang = Math.atan2(p.y - cy, p.x - cx) - sweep;
        const delta = Math.abs(Math.atan2(Math.sin(ang), Math.cos(ang)));
        if (delta < 0.4) brightness += 1 - delta / 0.4;
      }
      const neuralFire = Math.max(0, Math.sin(t * (s === "thinking" ? 4 : 1.6) - i * 0.8) - 0.78);
      brightness += neuralFire * (s === "thinking" ? 3 : 1.2);
      const size = (i % 9 === 0 ? 1.6 : 0.8) * (0.6 + depth * 0.6);
      if (i % 6 === 0 || brightness > 0.9) glow(p.x, p.y, size * 6, Math.min(0.8, brightness * 0.55));
      dot(p.x, p.y, size, color(Math.min(1, brightness), 0.35));
    }
    const packetCount = s === "thinking" ? 24 : s === "executing" ? 28 : s === "connecting" ? 15 : 7;
    for (let i = 0; i < packetCount; i++) {
      const edge = this.edges[(i * 23 + Math.floor(i / 4) * 17) % this.edges.length];
      const a = points[edge.a];
      const b = points[edge.b];
      const progress = (t * (0.35 + (i % 5) * 0.14) * (s === "thinking" || s === "executing" ? 2.6 : 1) + i * 0.173) % 1;
      const x = a.x + (b.x - a.x) * progress;
      const y = a.y + (b.y - a.y) * progress;
      glow(x, y, 5, 0.7);
      dot(x, y, 1.05, color(0.95, 0.85));
    }
    if (s === "searching") {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r * 1.03, sweep - 0.38, sweep);
      ctx.closePath();
      ctx.fillStyle = color(0.12);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * r, cy + Math.sin(sweep) * r);
      ctx.strokeStyle = color(0.8, 0.55);
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
    ctx.restore();

    // Reactor: central energy source and segmented containment rings.
    const reactorBeat =
      1 + Math.sin(t * 2.3) * 0.08 + (s === "speaking" ? Math.sin(t * 8.8) * 0.18 + Math.sin(t * 15.5) * 0.1 : 0) + impact * 0.7;
    glow(cx, cy, r * (0.7 + E * 0.17) * reactorBeat, 0.5 + E * 0.25);
    const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.45 * reactorBeat);
    inner.addColorStop(0, "rgba(248,255,255,.98)");
    inner.addColorStop(0.09, "rgba(233,255,250,.96)");
    inner.addColorStop(0.23, color(0.85, 0.7));
    inner.addColorStop(0.43, color(0.24));
    inner.addColorStop(1, color(0));
    ctx.fillStyle = inner;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45 * reactorBeat, 0, TAU);
    ctx.fill();
    for (let k = 0; k < 3; k++) {
      const radius = r * (0.14 + k * 0.08) * (1 + voice * 1.4);
      const rotation = spin * (k % 2 ? -2.5 : 2) + k;
      for (let segment = 0; segment < 3; segment++) {
        const a = rotation + (segment * TAU) / 3;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, a, a + 1.44);
        ctx.strokeStyle = color(0.8 - k * 0.15, 0.5);
        ctx.lineWidth = k === 0 ? 2 : 1;
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.025, 0, TAU);
    ctx.strokeStyle = color(0.28, 0.2);
    ctx.lineWidth = 0.8;
    ctx.stroke();
    rings(true);

    const perimeter = r * 1.17;
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * TAU - spin * 0.08;
      const major = i % 8 === 0;
      const rad = perimeter + (s === "executing" ? Math.sin(t * 3 - i * 0.18) * 2 : 0);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      ctx.lineTo(cx + Math.cos(a) * (rad + (major ? 5 : 2)), cy + Math.sin(a) * (rad + (major ? 5 : 2)));
      ctx.strokeStyle = trace(major ? 0.47 : 0.19);
      ctx.lineWidth = major ? 1 : 0.65;
      ctx.stroke();
    }
    if (s === "listening" || s === "speaking") {
      const bars = 72;
      const base = r * (s === "listening" ? 1.23 : 1.18);
      for (let i = 0; i < bars; i++) {
        const a = (i / bars) * TAU;
        const signal = Math.sin(i * 0.43 + t * 7.5) * 0.45 + Math.sin(i * 0.79 - t * 4.1) * 0.3 + Math.sin(t * 2.7) * 0.2;
        const length = (3 + Math.abs(signal) * (s === "speaking" ? 26 : 18)) * amp;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * base, cy + Math.sin(a) * base);
        ctx.lineTo(cx + Math.cos(a) * (base + length), cy + Math.sin(a) * (base + length));
        ctx.strokeStyle = trace(0.3 + Math.abs(signal) * 0.4);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      if (s === "speaking") {
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const x = (i / 100 - 0.5) * r * 1.68;
          const y = cy + Math.sin(i * 0.26 - t * 9) * Math.sin((i / 100) * Math.PI) * r * 0.13 * amp;
          if (i) ctx.lineTo(cx + x, y);
          else ctx.moveTo(cx + x, y);
        }
        ctx.strokeStyle = color(0.9, 0.65);
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }
    if (s === "connecting" || s === "executing") {
      const count = s === "executing" ? 4 : 6;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU + spin * 0.15;
        const rad = r * (1.6 + Math.sin(t * 1.7 + i) * 0.08);
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad * 0.7;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = trace(0.24);
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.strokeStyle = trace(0.65);
        ctx.strokeRect(x - 3, y - 3, 6, 6);
        for (let j = 0; j < 3; j++) {
          const p = (t * (s === "executing" ? 0.8 : 0.45) + j / 3 + i * 0.12) % 1;
          const px = cx + (x - cx) * p;
          const py = cy + (y - cy) * p;
          glow(px, py, 6, 0.6);
          dot(px, py, 1.4, trace(0.8));
        }
      }
      if (s === "executing")
        for (let i = 0; i < 4; i++) {
          const a = (i * TAU) / 4 + spin * 0.4;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.32, a, a + 0.24 + (Math.sin(t * 2 + i) + 1) * 0.3);
          ctx.strokeStyle = trace(0.7);
          ctx.lineWidth = 3;
          ctx.stroke();
        }
    }
    if (s === "attention") {
      for (let k = 0; k < 2; k++) {
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const a = (i / 6) * TAU - Math.PI / 6;
          const rad = r * (1.27 + k * 0.09);
          if (i) ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
          else ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
        }
        ctx.strokeStyle = trace(k ? 0.2 : 0.65);
        ctx.lineWidth = k ? 0.6 : 1.2;
        ctx.stroke();
      }
      ctx.fillStyle = color(0.9, 0.6);
      ctx.fillRect(cx - 4, cy - 7, 2, 14);
      ctx.fillRect(cx + 2, cy - 7, 2, 14);
    }
    if (s === "error") {
      for (let i = 0; i < 5; i++) {
        const a = i * 1.28 + 0.4;
        const offset = Math.sin(Math.floor(t * 2) + i) * 3;
        ctx.beginPath();
        ctx.arc(cx + offset, cy, r * (1.17 + (i % 2) * 0.04), a, a + 0.46);
        ctx.strokeStyle = trace(0.65);
        ctx.lineWidth = 1.7;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx, cy + 2);
      ctx.strokeStyle = color(0.95, 0.6);
      ctx.lineWidth = 2;
      ctx.stroke();
      dot(cx, cy + 6, 1.1, color(1, 0.7));
    }
    if (s === "success") {
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx - 2, cy + 6);
      ctx.lineTo(cx + 9, cy - 7);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.2;
      ctx.stroke();
      for (let i = 0; i < 22; i++) {
        const a = i * 2.4;
        const p = (t * 0.35 + i * 0.073) % 1;
        const rad = r * (0.9 + p * 0.85);
        dot(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.75, 1.1, trace((1 - p) * 0.55));
      }
    }
    if (s === "listening" || s === "success" || impact > 0) {
      for (let i = 0; i < 2; i++) {
        let phase = (t * 0.6 + i * 0.5) % 1;
        if (s === "listening") phase = 1 - phase;
        if (impact > 0) phase = (1 - impact + i * 0.22) % 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r * (0.95 + phase * 0.68), 0, TAU);
        ctx.strokeStyle = trace((1 - phase) * (0.22 + impact * 0.4));
        ctx.lineWidth = impact > 0 ? 1.5 : 0.8;
        ctx.stroke();
      }
    }
    if (this.opts.labels && w > 470) {
      const left = cx - r * 1.72;
      const right = cx + r * 1.72;
      ctx.font = "7px Consolas, monospace";
      ctx.fillStyle = trace(0.6);
      ctx.textAlign = "right";
      ctx.fillText("NEURAL / " + String(this.nodes.length).padStart(3, "0"), left, cy - r * 0.65);
      ctx.textAlign = "left";
      ctx.fillText(s === "executing" ? "EXEC / DEMO" : s === "listening" ? "INPUT / DEMO" : "CORE / ONLINE", right, cy + r * 0.69);
      ctx.strokeStyle = trace(0.25);
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(left - 12, cy - r * 0.58);
      ctx.lineTo(left + 18, cy - r * 0.58);
      ctx.lineTo(cx - r * 0.82, cy - r * 0.38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(right + 39, cy + r * 0.56);
      ctx.lineTo(right - 9, cy + r * 0.56);
      ctx.lineTo(cx + r * 0.83, cy + r * 0.38);
      ctx.stroke();
    }
    if (this.hover > 0.03 && !this.reduced) {
      const x = cx + this.tilt.x * w * 0.45;
      const y = cy + this.tilt.y * h * 0.45;
      ctx.strokeStyle = trace(this.hover * 0.4);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - 7, y);
      ctx.lineTo(x - 3, y);
      ctx.moveTo(x + 3, y);
      ctx.lineTo(x + 7, y);
      ctx.moveTo(x, y - 7);
      ctx.lineTo(x, y - 3);
      ctx.moveTo(x, y + 3);
      ctx.lineTo(x, y + 7);
      ctx.stroke();
    }
  }
}
