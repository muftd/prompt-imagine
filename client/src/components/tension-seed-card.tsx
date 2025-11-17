import { useState } from "react";
import { Copy, Check, Zap, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TensionSeed } from "@shared/schema";

interface TensionSeedCardProps {
  tensionSeed: TensionSeed;
  index: number;
}

export function TensionSeedCard({ tensionSeed, index }: TensionSeedCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tensionSeed.seedSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="relative overflow-hidden backdrop-blur-xl bg-card/80 border-border/40 hover:border-purple-500/30 transition-all duration-300"
        data-testid={`card-tension-seed-${index}`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="relative p-6 space-y-5">
          {/* Seed Sentence with Copy Button */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-400/20 rounded-xl">
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <h4
                className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent leading-snug flex-1"
                data-testid={`text-seed-sentence-${index}`}
              >
                {tensionSeed.seedSentence}
              </h4>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                data-testid={`button-copy-seed-${index}`}
                className="rounded-lg border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/30"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    已复制种子句
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    复制种子句
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Follow-up Questions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>后续探索问题</span>
            </div>
            
            <div className="space-y-3">
              {tensionSeed.followUpQuestions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * qIndex }}
                  className="flex gap-3 group"
                  data-testid={`text-question-${index}-${qIndex}`}
                >
                  <span className="text-purple-500 font-bold shrink-0 mt-0.5">→</span>
                  <p className="text-base text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                    {question}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}