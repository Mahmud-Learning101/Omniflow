"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface PointerVelocityState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  normalizedVelocity: number; // 0 to 1
}

const INITIAL_STATE: PointerVelocityState = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  speed: 0,
  normalizedVelocity: 0,
};

/**
 * Custom hook tracking pointer velocity and applying F1 braking deceleration decay
 * for kinetic typography stretch/squish and ribbon particle emission.
 */
export function usePointerVelocity(maxVelocity = 1500): PointerVelocityState {
  const [state, setState] = useState<PointerVelocityState>(INITIAL_STATE);
  const stateRef = useRef<PointerVelocityState>(INITIAL_STATE);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const rafIdRef = useRef<number | null>(null);

  const updateVelocity = useCallback(() => {
    const current = stateRef.current;
    // F1 braking deceleration curve (~0.88 decay factor per frame)
    const decayFactor = 0.88;
    const newVx = Math.abs(current.vx) > 0.05 ? current.vx * decayFactor : 0;
    const newVy = Math.abs(current.vy) > 0.05 ? current.vy * decayFactor : 0;
    const newSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
    const newNorm = Math.min(newSpeed / maxVelocity, 1);

    if (
      Math.abs(newSpeed - current.speed) > 0.01 ||
      Math.abs(newVx - current.vx) > 0.01 ||
      Math.abs(newVy - current.vy) > 0.01
    ) {
      const nextState = {
        ...current,
        vx: newVx,
        vy: newVy,
        speed: newSpeed,
        normalizedVelocity: newNorm,
      };
      stateRef.current = nextState;
      setState(nextState);
    }

    rafIdRef.current = requestAnimationFrame(updateVelocity);
  }, [maxVelocity]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const last = lastPosRef.current;
      const dt = Math.max((now - last.time) / 1000, 0.008);

      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const rawVx = dx / dt;
      const rawVy = dy / dt;

      // Smooth lerp for responsive kinetic squish
      const smoothedVx = stateRef.current.vx * 0.3 + rawVx * 0.7;
      const smoothedVy = stateRef.current.vy * 0.3 + rawVy * 0.7;
      const speed = Math.sqrt(smoothedVx * smoothedVx + smoothedVy * smoothedVy);
      const normalizedVelocity = Math.min(speed / maxVelocity, 1);

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      const next = {
        x: e.clientX,
        y: e.clientY,
        vx: smoothedVx,
        vy: smoothedVy,
        speed,
        normalizedVelocity,
      };
      stateRef.current = next;
      setState(next);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafIdRef.current = requestAnimationFrame(updateVelocity);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateVelocity, maxVelocity]);

  return state;
}
