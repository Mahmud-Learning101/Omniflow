import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian text-neutral-100 p-8 text-center font-mono">
      <h2 className="text-4xl font-bold text-racing-lime mb-4">
        404 // NODE NOT FOUND
      </h2>
      <p className="text-neutral-400 mb-8 max-w-md">
        The requested operational route or state mesh vector does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded bg-racing-lime text-obsidian font-bold text-xs uppercase tracking-wider"
      >
        Return to Mesh
      </Link>
    </div>
  );
}
