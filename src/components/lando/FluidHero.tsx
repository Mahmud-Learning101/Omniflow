"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { KineticHeading } from "./KineticHeading";
import { VelocityParticles } from "./VelocityParticles";
import { HeroTelemetryBar } from "./HeroTelemetryBar";

interface FluidHeroProps {
  className?: string;
}

/**
 * FluidHero section container orchestrating viewport scaling and F1 braking deceleration curve.
 * Zero hardcoded strings - reads exclusively from siteConfig.
 */
export function FluidHero({ className = "" }: FluidHeroProps) {
  const { hero } = siteConfig;

  return (
    <section
      data-testid="fluid-hero-section"
      className={`relative min-h-screen flex flex-col justify-between overflow-hidden bg-obsidian text-neutral-100 select-none [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${className}`}
    >
      {/* Ambient background lighting */}
      <div
        data-testid="fluid-hero-glow"
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_-10%,rgba(210,255,0,0.12),rgba(8,9,13,0))] pointer-events-none"
      />

      {/* 2D Spring Particle Ribbon Canvas */}
      <VelocityParticles />

      {/* Main hero orchestrator */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 w-full text-center">
        {/* Status indicator badge */}
        <div
          data-testid="fluid-hero-status-badge"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-obsidian-border bg-obsidian-card backdrop-blur-md mb-8 transition-transform hover:scale-105 ease-f1-brake"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-racing-lime" />
          </span>
          <span className="font-mono text-xs font-medium tracking-widest uppercase text-racing-lime">
            {hero.badgeStatus}
          </span>
        </div>

        {/* Kinetic Heading with velocity squish/stretch */}
        <KineticHeading
          prefix={hero.headlinePrefix}
          headline={hero.headline}
          className="mb-8"
        />

        {/* Fluid Subheadline */}
        <p
          data-testid="fluid-hero-subheadline"
          className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto font-sans leading-relaxed mb-10"
        >
          {hero.subheadline}
        </p>

        {/* Action CTAs */}
        <div
          data-testid="fluid-hero-ctas"
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href={hero.primaryCta.href}
            data-testid="hero-primary-cta"
            className="px-6 py-3 rounded-lg bg-racing-lime text-obsidian font-mono text-xs font-bold tracking-wider uppercase hover:shadow-[0_0_24px_rgba(210,255,0,0.5)] transition-all ease-f1-brake"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            data-testid="hero-secondary-cta"
            className="px-6 py-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 text-neutral-200 font-mono text-xs font-semibold tracking-wider uppercase hover:border-racing-lime/40 hover:text-white transition-all ease-f1-brake"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* Telemetry Running Ribbon */}
      <div className="relative z-10 w-full">
        <HeroTelemetryBar />
      </div>
    </section>
  );
}
