'use client';

import { useState, useEffect, useRef } from 'react';
import { hubsConfig } from '@/config/nodes';
import { SphericalScene } from './SphericalScene';
import { NodeDetailsModal } from './NodeDetailsModal';
import type { OperationalHub } from '@/types/nodes';
import { Globe, Activity, Zap, Shield } from 'lucide-react';

export function MessengerSection() {
  const [selectedHub, setSelectedHub] = useState<OperationalHub | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalAgents = hubsConfig.hubs.reduce((sum, h) => sum + h.activeAgents, 0);
  const totalThroughput = hubsConfig.hubs.reduce((sum, h) => sum + h.throughputGbps, 0);

  return (
    <section
      ref={sectionRef}
      id="section-messenger"
      data-testid="messenger-section"
      className="relative w-full min-h-screen py-20 px-4 md:px-8 bg-obsidian text-neutral-100 flex flex-col items-center justify-center border-t border-obsidian-border"
    >
      <div className="max-w-5xl w-full text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-obsidian-border bg-obsidian-card backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-racing-lime" />
          <span className="text-xs font-mono tracking-widest uppercase text-racing-lime">
            03 // Messenger Mesh
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-sans">
          Planetary <span className="text-racing-lime">Agent Mesh</span>
        </h2>

        <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-sans">
          Decentralized autonomous orchestration grid with 60Hz state synchronization across 5 global telemetry cores.
        </p>

        {/* Global Network Overview Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left font-mono">
          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-card/60">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Shield className="w-3.5 h-3.5 text-racing-lime" /> Active Cores
            </span>
            <span className="text-lg font-bold text-white">{hubsConfig.hubs.length} Hubs</span>
          </div>
          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-card/60">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Zap className="w-3.5 h-3.5 text-racing-lime" /> Throughput
            </span>
            <span className="text-lg font-bold text-racing-lime">{totalThroughput.toFixed(1)} Gbps</span>
          </div>
          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-card/60">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Activity className="w-3.5 h-3.5 text-racing-lime" /> Agents
            </span>
            <span className="text-lg font-bold text-white">{totalAgents.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-card/60">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Globe className="w-3.5 h-3.5 text-racing-lime" /> Sync Clock
            </span>
            <span className="text-lg font-bold text-white">{hubsConfig.syncFrequencyHz} Hz</span>
          </div>
        </div>
      </div>

      {/* Lazy-Mounted Three.js Planetary Canvas */}
      <div className="w-full max-w-5xl rounded-2xl border border-obsidian-border bg-obsidian-card/40 backdrop-blur-md overflow-hidden relative shadow-2xl">
        {isNearViewport ? (
          <SphericalScene onSelectHub={setSelectedHub} />
        ) : (
          <div className="w-full h-[520px] md:h-[600px] flex items-center justify-center text-neutral-500 font-mono text-xs">
            Awaiting mesh activation signal...
          </div>
        )}
      </div>

      <NodeDetailsModal hub={selectedHub} onClose={() => setSelectedHub(null)} />
    </section>
  );
}
