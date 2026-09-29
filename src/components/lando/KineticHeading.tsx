"use client";

import React, { useMemo } from "react";
import { siteConfig } from "@/config/site";
import { usePointerVelocity } from "@/hooks/usePointerVelocity";

interface KineticHeadingProps {
  prefix?: string;
  headline?: string;
  className?: string;
}

/**
 * Variable font headline with responsive squish and stretch responding to pointer velocity.
 * Applies F1 braking deceleration curve for kinetic stabilization.
 */
export function KineticHeading({
  prefix = siteConfig.hero.headlinePrefix,
  headline = siteConfig.hero.headline,
  className = "",
}: KineticHeadingProps) {
  const { vx, normalizedVelocity } = usePointerVelocity();

  // Dynamic kinetic distortion parameters (squish on Y, stretch on X, skew on velocity direction)
  const transformStyle = useMemo(() => {
    const scaleX = 1 + normalizedVelocity * 0.16;
    const scaleY = Math.max(0.86, 1 - normalizedVelocity * 0.08);
    const skew = Math.max(-5, Math.min(5, (vx / 1000) * 6));
    const letterSpacing = `${-0.02 + normalizedVelocity * 0.02}em`;

    return {
      transform: `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)}) skewX(${skew.toFixed(2)}deg)`,
      letterSpacing,
      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    };
  }, [vx, normalizedVelocity]);

  const words = useMemo(() => headline.split(" "), [headline]);

  return (
    <div
      data-testid="kinetic-heading-container"
      className={`relative flex flex-col items-center justify-center text-center select-none will-change-transform ${className}`}
    >
      <h1
        data-testid="kinetic-heading-text"
        style={transformStyle}
        className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-neutral-100 transition-transform duration-200"
      >
        {prefix && (
          <span
            data-testid="kinetic-heading-prefix"
            className="block font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase text-racing-lime/90 mb-3 font-semibold"
          >
            {prefix} //
          </span>
        )}
        <span className="block">
          {words.map((word, idx) => (
            <React.Fragment key={`${word}-${idx}`}>
              <span
                className={
                  idx === words.length - 1
                    ? "text-racing-lime inline-block"
                    : "inline-block mr-2 sm:mr-4"
                }
              >
                {word}
              </span>
              {idx < words.length - 1 && " "}
            </React.Fragment>
          ))}
        </span>
      </h1>
    </div>
  );
}
