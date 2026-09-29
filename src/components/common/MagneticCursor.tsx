"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

export function MagneticCursor() {
  const { chrome } = siteConfig;
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let snapTarget: HTMLElement | null = null;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-magnetic="true"], button, a, [role="button"]'
      );
      snapTarget = target || null;
      setIsHovered(Boolean(target));
    };

    const onPointerLeave = () => {
      setIsVisible(false);
      snapTarget = null;
      setIsHovered(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;

    const tick = () => {
      if (snapTarget) {
        const rect = snapTarget.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;
        currentX = lerp(currentX, targetCenterX, chrome.cursor.springStiffness * 1.5);
        currentY = lerp(currentY, targetCenterY, chrome.cursor.springStiffness * 1.5);
      } else {
        currentX = lerp(currentX, mouseX, chrome.cursor.springStiffness);
        currentY = lerp(currentY, mouseY, chrome.cursor.springStiffness);
      }

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [chrome.cursor.springStiffness, isVisible]);

  if (!isVisible) return null;

  const outerSize = isHovered ? chrome.cursor.expandedSize : chrome.cursor.outerSize;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* Inner high-frequency tracking dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 rounded-full transition-opacity duration-150 will-change-transform"
        style={{
          width: `${chrome.cursor.innerSize}px`,
          height: `${chrome.cursor.innerSize}px`,
          backgroundColor: chrome.colors.racingLime,
          opacity: isHovered ? 0.2 : 0.9,
        }}
      />

      {/* Outer spring follower ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 rounded-full border transition-all duration-200 will-change-transform"
        style={{
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          borderColor: isHovered ? chrome.colors.racingLime : chrome.colors.borderHover,
          backgroundColor: isHovered ? "rgba(210, 255, 0, 0.08)" : "transparent",
          boxShadow: isHovered ? `0 0 16px ${chrome.colors.racingLime}33` : "none",
        }}
      />
    </div>
  );
}
