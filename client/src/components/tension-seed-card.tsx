import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
    <Card
      className="p-6 space-y-4 hover:shadow-lg transition-shadow"
      data-testid={`card-tension-seed-${index}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h4
          className="text-xl font-semibold text-tension leading-snug flex-1"
          data-testid={`text-seed-sentence-${index}`}
        >
          {tensionSeed.seedSentence}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          data-testid={`button-copy-seed-${index}`}
          className="hover-elevate shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Follow-up Questions
        </p>
        <ul className="space-y-2">
          {tensionSeed.followUpQuestions.map((question, qIndex) => (
            <li
              key={qIndex}
              className="flex gap-3 text-base text-foreground"
              data-testid={`text-question-${index}-${qIndex}`}
            >
              <span className="text-tension font-medium shrink-0">•</span>
              <span className="leading-relaxed">{question}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
