import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { images } from "@/src/content/images";
import type { OrbState } from "@/src/content/orbita";

const SRC: Record<OrbState, string> = {
  idle: images.orb.idle.src,
  thinking: images.orb.thinking.src,
  searching: images.orb.searching.src,
  success: images.orb.success.src,
};
const ALL: OrbState[] = ["idle", "thinking", "searching", "success"];

export type OrbProps = {
  /** diameter in px: 24 (buttons), 40 (launcher/header), 48 (mobile card), 120 (board) */
  size: number;
  /** current state */
  state?: OrbState;
  /**
   * true → stack the 4 stills and crossfade by opacity (160ms) when `state` changes
   * (chat header). false → render only the current still (buttons, launcher).
   */
  crossfade?: boolean;
  /** decorative by default (alt=""); pass a label to expose it */
  label?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * <Orb> — Órbita's "Presença" avatar: circular crop (box 157,52,380,380 of 696×471)
 * on --orb-tile with a 1px --line ring (`.orb`). Still renders only — no WebGL.
 *
 * @example <Orb size={24} />                              // hero "Falar com a Órbita"
 * @example <Orb size={40} state={orb} crossfade />        // chat header
 */
export function Orb({ size, state = "idle", crossfade = false, label, priority, className, style }: OrbProps) {
  const sizes = `${Math.ceil(size * 1.8316)}px`;
  const states = crossfade ? ALL : [state];
  return (
    <span
      className={cn("orb", className)}
      style={{ width: size, height: size, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {states.map((s) => (
        <Image
          key={s}
          src={SRC[s]}
          width={696}
          height={471}
          alt=""
          sizes={sizes}
          priority={priority && s === state}
          className={cn("orb-img", s !== state && "is-off")}
          style={{ height: "auto", maxWidth: "none" }}
        />
      ))}
    </span>
  );
}
