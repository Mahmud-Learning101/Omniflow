export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-obsidian text-neutral-100 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(210,255,0,0.12),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-obsidian-border bg-obsidian-card backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-racing-lime animate-pulse" />
          <span className="text-xs font-mono tracking-widest uppercase text-racing-lime">
            System Online // Phase 1 Operational
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-sans">
          OmniFlow <span className="text-racing-lime">Kernel</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-sans">
          Autonomous AI Workflow & Pipeline Orchestration Laboratory. High-performance state mesh with sub-second telemetry.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 font-mono text-xs text-neutral-500">
          <span className="px-2 py-1 rounded border border-obsidian-border bg-obsidian-surface">
            Node: v24.19.0
          </span>
          <span className="px-2 py-1 rounded border border-obsidian-border bg-obsidian-surface">
            Next.js: 15.2.0
          </span>
          <span className="px-2 py-1 rounded border border-obsidian-border bg-obsidian-surface text-racing-lime">
            TypeScript: Strict Mode
          </span>
        </div>
      </div>
    </main>
  );
}
