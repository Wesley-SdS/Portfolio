/**
 * The Órbita brand mark, as shipped in the product (apps/web/public/icone.svg): a forest tile with a
 * mint orbit ellipse and a mint core. Here the orbit slowly sways and the core breathes, so the mark
 * reads as alive without drawing a second WebGL core.
 */
export function OrbitaMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill="#17302B" />
      <g className="om-orbit">
        <ellipse cx="32" cy="32" rx="23" ry="12" transform="rotate(-35 32 32)" fill="none" stroke="#C9F4B0" strokeWidth="3" />
      </g>
      <circle className="om-core" cx="32" cy="32" r="10" fill="#C9F4B0" />
    </svg>
  );
}
