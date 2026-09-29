"use client";

import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";

/**
 * Global smooth momentum scroll controller utilizing Lenis.
 * Applies continuous inertial momentum with requestAnimationFrame sync across the DOM.
 */
export function SmoothScroll() {
  useLenis({
    lerp: 0.08,
    duration: 1.2,
    smoothWheel: true,
  });

  // Enable anchor smooth scrolling via Lenis
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return null;
}
