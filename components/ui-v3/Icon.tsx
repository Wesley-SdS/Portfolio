import type { LucideIcon, LucideProps } from "lucide-react";

export {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Minus,
  Monitor,
  Moon,
  Orbit,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sun,
  X,
} from "lucide-react";
export type { LucideIcon };

export type IconProps = Omit<LucideProps, "ref"> & {
  icon: LucideIcon;
  /** px, default 18 (UI) — use 16 in inline text, 20–32 for status glyphs */
  size?: number;
  /** accessible label; omit for decorative icons (default aria-hidden) */
  label?: string;
};

/**
 * <Icon> — lucide icons with the v3 defaults (stroke 1.5, round caps, currentColor).
 * Never use emoji. Decorative by default (aria-hidden); pass `label` when the icon
 * alone carries meaning (prefer an aria-label on the parent button instead).
 *
 * @example <Icon icon={Sun} />                 // 18px decorative
 * @example <Icon icon={CheckCircle2} size={32} className="check-draw" style={{ color: "var(--ok)" }} />
 */
export function Icon({ icon: Glyph, size = 18, label, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Glyph
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      {...rest}
    />
  );
}
