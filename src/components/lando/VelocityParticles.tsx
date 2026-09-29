"use client";

import React, { useEffect, useRef } from "react";

interface ParticlePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

/**
 * Lightweight 2D canvas drawing subtle spring particle ribbons trailing cursor velocity.
 * Tuned for 60fps performance on standard displays with automatic F1 deceleration decay.
 */
export function VelocityParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: ParticlePoint[] = [];
    const maxParticles = 64;
    let lastX = -100;
    let lastY = -100;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (lastX > 0 && lastY > 0) {
        const dx = x - lastX;
        const dy = y - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 1.2) {
          const spawnCount = Math.min(Math.floor(speed / 8) + 1, 4);
          for (let i = 0; i < spawnCount; i++) {
            if (particles.length >= maxParticles) particles.shift();
            particles.push({
              x: x + (Math.random() - 0.5) * 4,
              y: y + (Math.random() - 0.5) * 4,
              vx: dx * 0.12 + (Math.random() - 0.5) * 1.2,
              vy: dy * 0.12 + (Math.random() - 0.5) * 1.2,
              alpha: Math.min(0.6, 0.2 + speed / 60),
              size: Math.min(3.2, 1.2 + speed / 50),
            });
          }
        }
      }

      lastX = x;
      lastY = y;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (particles.length > 1) {
        ctx.save();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.9; // F1 braking curve decay
          p.vy *= 0.9;
          p.alpha *= 0.94; // gracefully fade out

          if (i > 0 && p.alpha > 0.02) {
            const prev = particles[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(210, 255, 0, ${p.alpha * 0.45})`;
            ctx.lineWidth = p.size;
            ctx.stroke();
          }

          if (p.alpha > 0.04) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha * 0.8})`;
            ctx.fill();
          }
        }
        ctx.restore();

        while (particles.length > 0 && particles[0].alpha <= 0.01) {
          particles.shift();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="velocity-particles-canvas"
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
