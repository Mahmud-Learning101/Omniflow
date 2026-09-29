import { FluidHero } from "@/components/lando";
import { IglooSection } from "@/components/igloo";
import { MessengerSection } from "@/components/messenger";
import { OperationsDeck } from "@/components/telemetry";
import { SystemColophon, ReturnToTop } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-obsidian text-neutral-100 overflow-x-hidden">
      <FluidHero />
      <IglooSection />
      <MessengerSection />
      <OperationsDeck />
      <SystemColophon />
      <ReturnToTop />
    </main>
  );
}
