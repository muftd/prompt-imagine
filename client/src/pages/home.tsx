import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { MagicWordAtelier } from "@/components/magic-word-atelier";
import { TensionSeedsStudio } from "@/components/tension-seeds-studio";
import { ModeCard } from "@/components/mode-card";

type Mode = "magic" | "tension";

export default function Home() {
  const [activeMode, setActiveMode] = useState<Mode>("magic");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              提示词想象工作室
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <ModeCard
              mode="magic"
              title="魔法词工坊"
              icon={Sparkles}
              isActive={activeMode === "magic"}
              onClick={() => setActiveMode("magic")}
              data-testid="card-mode-magic"
            />
            <ModeCard
              mode="tension"
              title="张力种子工作室"
              icon={Zap}
              isActive={activeMode === "tension"}
              onClick={() => setActiveMode("tension")}
              data-testid="card-mode-tension"
            />
          </div>
        </header>

        <main className="animate-fade-in">
          {activeMode === "magic" ? (
            <MagicWordAtelier key="magic" />
          ) : (
            <TensionSeedsStudio key="tension" />
          )}
        </main>
      </div>
    </div>
  );
}
