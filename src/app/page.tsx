import { FluidHero } from "@/components/lando";
import { MessengerSection } from "@/components/messenger";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-obsidian text-neutral-100 overflow-x-hidden">
      <FluidHero />
      <MessengerSection />
    </main>
  );
}
