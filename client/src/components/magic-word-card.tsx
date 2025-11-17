import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MagicWord } from "@shared/schema";

interface MagicWordCardProps {
  magicWord: MagicWord;
  index: number;
}

export function MagicWordCard({ magicWord, index }: MagicWordCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(magicWord.exampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="relative overflow-hidden backdrop-blur-xl bg-card/80 border-border/40 hover:border-emerald-500/30 transition-all duration-300"
        data-testid={`card-magic-word-${index}`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="relative p-6 space-y-4">
          {/* Magic Word Badge */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <Badge
              className="text-base px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold backdrop-blur-sm"
              data-testid={`badge-magic-word-${index}`}
            >
              {magicWord.word}
            </Badge>
          </div>

          {/* Explanation */}
          <p 
            className="text-base text-foreground/90 leading-relaxed" 
            data-testid={`text-explanation-${index}`}
          >
            {magicWord.explanation}
          </p>

          {/* Example Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                示例提示词片段
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  data-testid={`button-copy-${index}`}
                  className="rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5" />
                      已复制！
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1.5" />
                      复制
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
            
            <div
              className="bg-muted/30 backdrop-blur-sm p-4 rounded-xl font-mono text-sm leading-relaxed text-foreground/80 border border-border/40"
              data-testid={`text-snippet-${index}`}
            >
              {magicWord.exampleSnippet}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}