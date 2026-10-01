/** Three typing/busy dots (`.busy-dots`, v2 library). Decorative: pair with visible or sr text. */
export function BusyDots({ className }: { className?: string }) {
  return (
    <span className={className ? `busy-dots ${className}` : "busy-dots"} aria-hidden="true">
      <i style={{ ["--i" as string]: 0 }} />
      <i style={{ ["--i" as string]: 1 }} />
      <i style={{ ["--i" as string]: 2 }} />
    </span>
  );
}
