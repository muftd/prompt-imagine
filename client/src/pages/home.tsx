import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagicWordAtelier } from "@/components/magic-word-atelier";
import { TensionSeedsStudio } from "@/components/tension-seeds-studio";

export default function Home() {
  const [activeMode, setActiveMode] = useState<"magic" | "tension">("magic");

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top gradient overlay */}
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Mode-specific gradient blurs */}
        <AnimatePresence mode="wait">
          {activeMode === "magic" && (
            <motion.div
              key="magic-gradient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 via-teal-400/5 to-transparent blur-3xl"
            />
          )}
          {activeMode === "tension" && (
            <motion.div
              key="tension-gradient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 via-violet-400/5 to-transparent blur-3xl"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header with sticky navigation */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* App Title */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 blur-lg opacity-50" />
                  <div className="relative p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl border border-primary/20">
                    {activeMode === "magic" ? (
                      <Sparkles className="w-6 h-6 text-primary" />
                    ) : (
                      <Zap className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  提示词想象工作室
                </h1>
              </div>

              {/* Mode Switcher - Figma Style */}
              <div className="relative">
                <div className="flex p-1 bg-muted/30 backdrop-blur-sm rounded-full border border-border/40">
                  {/* Active Indicator */}
                  <motion.div
                    className={cn(
                      "absolute inset-y-1 rounded-full",
                      activeMode === "magic" 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                        : "bg-gradient-to-r from-purple-500 to-violet-400"
                    )}
                    layoutId="activeTab"
                    initial={false}
                    animate={{
                      x: activeMode === "magic" ? 4 : "calc(50% + 4px)",
                      width: "calc(50% - 6px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                  
                  {/* Tab Buttons */}
                  <button
                    onClick={() => setActiveMode("magic")}
                    className={cn(
                      "relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200",
                      "min-w-[140px]",
                      activeMode === "magic" 
                        ? "text-white" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    data-testid="button-mode-magic"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      魔法词工坊
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveMode("tension")}
                    className={cn(
                      "relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200",
                      "min-w-[140px]",
                      activeMode === "tension" 
                        ? "text-white" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    data-testid="button-mode-tension"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      张力种子工作室
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content Area with Animation */}
        <main className="relative">
          <AnimatePresence mode="wait">
            {activeMode === "magic" ? (
              <motion.div
                key="magic-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <MagicWordAtelier />
              </motion.div>
            ) : (
              <motion.div
                key="tension-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TensionSeedsStudio />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
