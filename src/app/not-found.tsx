import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-obsidian text-neutral-100 font-mono text-center space-y-4">
      <h2 className="text-2xl font-bold text-racing-lime">404 // NODE NOT FOUND</h2>
      <p className="text-xs text-neutral-500 max-w-md">
        The requested routing vector or telemetry coordinate does not exist in the active planetary state mesh.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg border border-obsidian-border bg-obsidian-card text-xs uppercase hover:border-racing-lime hover:text-racing-lime transition-all"
      >
        Return to Kernel
      </Link>
    </main>
  );
}
