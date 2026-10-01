import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** <Kbd> — keyboard hint (20×20, r4, 1px --line-strong, mono 12). @example <Kbd>/</Kbd> */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cn("kbd", className)}>{children}</kbd>;
}
