import { Sparkles, Zap } from "lucide-react";
import { MagicWordAtelier } from "@/components/magic-word-atelier";
import { TensionSeedsStudio } from "@/components/tension-seeds-studio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              提示词想象工作室
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl">
            一款受Google TextFX启发的创意提示词构思工具，帮助您生成强力关键词和创意张力种子
          </p>
        </header>

        <main>
          <Tabs defaultValue="magic" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="magic" className="flex items-center gap-2" data-testid="tab-mode-magic">
                <Sparkles className="w-4 h-4" />
                <span>魔法词工坊</span>
              </TabsTrigger>
              <TabsTrigger value="tension" className="flex items-center gap-2" data-testid="tab-mode-tension">
                <Zap className="w-4 h-4" />
                <span>张力种子工作室</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="magic" className="mt-0 animate-fade-in">
              <MagicWordAtelier />
            </TabsContent>
            
            <TabsContent value="tension" className="mt-0 animate-fade-in">
              <TensionSeedsStudio />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
