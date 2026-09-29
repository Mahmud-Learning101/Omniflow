'use client';

import { useEffect } from 'react';
import { X, Activity, Radio, Cpu, Network, ShieldCheck } from 'lucide-react';
import type { OperationalHub } from '@/types/nodes';
import { playRelaySnap } from '@/lib/sound';

export interface NodeDetailsModalProps {
  hub: OperationalHub | null;
  onClose: () => void;
}

export function NodeDetailsModal({ hub, onClose }: NodeDetailsModalProps) {
  useEffect(() => {
    if (hub) {
      playRelaySnap();
    }
  }, [hub]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playRelaySnap();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hub) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-hub-title"
      data-testid="node-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playRelaySnap();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-xl border border-obsidian-border bg-obsidian-card p-6 shadow-2xl space-y-5 text-neutral-200">
        <div className="flex items-start justify-between border-b border-obsidian-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-racing-lime animate-ping" />
              <span
                data-testid="modal-hub-status"
                className="text-xs font-mono uppercase tracking-widest text-racing-lime font-semibold"
              >
                {hub.status}
              </span>
              <span className="text-xs font-mono text-neutral-500 uppercase px-2 py-0.5 rounded bg-obsidian-surface border border-obsidian-border">
                {hub.tier}
              </span>
            </div>
            <h2 id="modal-hub-title" data-testid="modal-hub-name" className="text-2xl font-bold tracking-tight text-white font-sans">
              {hub.name}
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              {hub.coordinates.city}, {hub.coordinates.country} // {hub.coordinates.region}
            </p>
          </div>
          <button
            type="button"
            data-testid="modal-close-button"
            onClick={() => {
              playRelaySnap();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-obsidian-border hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm font-mono">
          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Activity className="w-3.5 h-3.5 text-racing-lime" /> Latency
            </span>
            <div data-testid="modal-hub-latency" className="text-xl font-bold text-white">
              {hub.latencyMs} ms
            </div>
          </div>

          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Radio className="w-3.5 h-3.5 text-racing-lime" /> Throughput
            </span>
            <div data-testid="modal-hub-throughput" className="text-xl font-bold text-racing-lime">
              {hub.throughputGbps} Gbps
            </div>
          </div>

          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Cpu className="w-3.5 h-3.5 text-racing-lime" /> Active Agents
            </span>
            <div className="text-xl font-bold text-white">
              {hub.activeAgents.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-racing-lime" /> Uptime
            </span>
            <div className="text-xl font-bold text-white">
              {hub.uptimePercentage}%
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1 border-t border-obsidian-border">
          <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <Network className="w-3.5 h-3.5 text-racing-lime" /> Mesh Connections ({hub.meshConnections.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {hub.meshConnections.map((peerId) => (
              <span
                key={peerId}
                className="px-2 py-0.5 rounded text-xs font-mono bg-obsidian-surface border border-obsidian-border text-neutral-300"
              >
                {peerId}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
