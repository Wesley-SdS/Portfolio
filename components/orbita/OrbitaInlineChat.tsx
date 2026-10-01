"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OrbitaChat } from "./OrbitaChat";
import { useMedia } from "./hooks";

/**
 * <OrbitaInlineChat> — an embedded, independent OrbitaChat instance (draws its own frame, no close
 * button), shown at ≥1024px and mounted when it scrolls near the viewport; below 1024px it renders
 * nothing. Not used on the home since the artifact pass (docs/REDESIGN.md §14): the contact block
 * opens the drawer instead. Kept for an embedded chat elsewhere.
 *
 * @example <div data-orbita-slot><OrbitaInlineChat /></div>
 */
export function OrbitaInlineChat({ className }: { className?: string }) {
  const isDesktop = useMedia("(min-width: 1024px)");
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!isDesktop || near || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [isDesktop, near]);

  return (
    <div ref={ref} className={cn("oi-chat", className)}>
      {isDesktop && near ? <OrbitaChat variant="inline" active /> : <div className="oi-ph" aria-hidden="true" />}
    </div>
  );
}
