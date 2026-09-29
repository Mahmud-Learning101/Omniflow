"use client";

import { useEffect, useRef, useState } from "react";
import Lenis, { type LenisOptions } from "lenis";

export interface ScrollState {
  scroll: number;
  velocity: number;
  progress: number;
}

export interface UseLenisReturn extends ScrollState {
  lenis: Lenis | null;
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }) => void;
}

/**
 * Hook providing momentum virtual smooth scroll via Lenis with requestAnimationFrame clock.
 */
export function useLenis(options?: LenisOptions): UseLenisReturn {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    scroll: 0,
    velocity: 0,
    progress: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      ...options,
    });

    lenisRef.current = lenis;

    const onScroll = (e: { scroll: number; velocity: number; progress: number }) => {
      setScrollState({
        scroll: e.scroll,
        velocity: e.velocity,
        progress: e.progress,
      });
    };

    lenis.on("scroll", onScroll);

    let rafId: number;
    const rafCallback = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(rafCallback);
    };

    rafId = requestAnimationFrame(rafCallback);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options]);

  const scrollTo = (
    target: number | string | HTMLElement,
    scrollOpts?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    lenisRef.current?.scrollTo(target, scrollOpts);
  };

  return {
    lenis: lenisRef.current,
    scroll: scrollState.scroll,
    velocity: scrollState.velocity,
    progress: scrollState.progress,
    scrollTo,
  };
}
