"use client";

import { useEffect } from "react";
import type { ChipId } from "@/src/content/orbita";

/**
 * Órbita open/close bridge — decouples every "Falar com a Órbita" trigger
 * (hero CTA, header menu, Processo strip, stage extra link, contact card) from
 * the widget implementation (components/orbita/*, owned by the Órbita agent).
 *
 * Triggers call `openOrbita({ source })`; the widget root listens with
 * `useOrbitaListener`. Detail.returnFocus is the element to refocus on close.
 */

export const ORBITA_OPEN_EVENT = "orbita:open";
export const ORBITA_CLOSE_EVENT = "orbita:close";

export type OrbitaSource = "hero" | "menu" | "process" | "stage" | "contact" | "hire" | "case" | "launcher" | "lab" | "header" | "other";

/** A first message to send as soon as the chat is ready (hero "Pergunte à Órbita" box). */
export interface OrbitaAsk {
  /** free text typed by the visitor */
  text?: string;
  /** one of the opening quick replies (runs its scripted beat in demo mode) */
  chip?: ChipId;
}

export interface OrbitaOpenDetail {
  source?: OrbitaSource;
  /** element that opened the widget (focus returns here on Esc/close) */
  returnFocus?: HTMLElement | null;
  /** optional first message, sent on the visitor's behalf once the conversation has started */
  ask?: OrbitaAsk;
}

export function openOrbita(detail: OrbitaOpenDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OrbitaOpenDetail>(ORBITA_OPEN_EVENT, { detail }));
}

export function closeOrbita() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ORBITA_CLOSE_EVENT));
}

/** Subscribe to open/close requests (use once, in the widget root). */
export function useOrbitaListener(onOpen: (detail: OrbitaOpenDetail) => void, onClose?: () => void) {
  useEffect(() => {
    const open = (e: Event) => onOpen((e as CustomEvent<OrbitaOpenDetail>).detail ?? {});
    const close = () => onClose?.();
    window.addEventListener(ORBITA_OPEN_EVENT, open);
    window.addEventListener(ORBITA_CLOSE_EVENT, close);
    return () => {
      window.removeEventListener(ORBITA_OPEN_EVENT, open);
      window.removeEventListener(ORBITA_CLOSE_EVENT, close);
    };
  }, [onOpen, onClose]);
}
