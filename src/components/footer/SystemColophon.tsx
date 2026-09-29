"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import { Terminal, Layers, Database, Cpu, ShieldCheck } from "lucide-react";

export function SystemColophon() {
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || "a8f6657-p8";

  return (
    <footer
      data-testid="system-colophon"
      className="relative w-full border-t border-obsidian-border bg-obsidian-surface/80 text-neutral-400 py-16 px-4 sm:px-6 lg:px-8 font-mono text-xs overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Architecture Specs & Tech Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-obsidian-border">
          {/* Col 1: System Specs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
              <Terminal className="w-4 h-4 text-racing-lime" />
              <span>KERNEL ARCHITECTURE</span>
            </div>
            <ul className="space-y-1 text-neutral-400">
              <li>• Sub-millisecond distributed state consensus</li>
              <li>• Deterministic 60Hz RequestAnimationFrame clock</li>
              <li>• Zero-drift runtime validation via Zod 3.24</li>
              <li>• Three.js R163 WebGL2 shader refraction</li>
            </ul>
          </div>

          {/* Col 2: Tech Stack Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
              <Layers className="w-4 h-4 text-racing-lime" />
              <span>VERIFIED STACK COMPLIANCE</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span data-testid="stack-badge-next" className="px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border text-white">Next.js 15.2</span>
              <span data-testid="stack-badge-react" className="px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border text-white">React 19</span>
              <span data-testid="stack-badge-three" className="px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border text-white">Three.js</span>
              <span data-testid="stack-badge-mongo" className="px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border text-racing-lime">MongoDB Atlas</span>
              <span data-testid="stack-badge-ts" className="px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border text-neutral-300">TypeScript Strict</span>
            </div>
          </div>

          {/* Col 3: Build & Host Telemetry */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
              <Database className="w-4 h-4 text-racing-lime" />
              <span>DEPLOYMENT SIGNATURE</span>
            </div>
            <div className="space-y-1">
              <div>Version: <span className="text-white">{siteConfig.version}</span></div>
              <div>Git SHA: <span data-testid="commit-sha" className="text-racing-lime">{commitSha}</span></div>
              <div>Environment: <span className="text-white">Planetary Edge Mesh</span></div>
            </div>
          </div>
        </div>

        {/* Copyright & Nav Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
          <p>{siteConfig.brand.tagline}</p>
          <div className="flex items-center gap-6">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-racing-lime transition-colors"
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
