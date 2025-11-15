import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
    <Card
      className="p-6 space-y-4 hover:shadow-lg transition-shadow"
      data-testid={`card-magic-word-${index}`}
    >
      <div>
        <Badge
          className="text-base px-3 py-1 bg-magic/10 text-magic border-magic/20 font-semibold"
          data-testid={`badge-magic-word-${index}`}
        >
          {magicWord.word}
        </Badge>
      </div>

      <p className="text-base text-foreground leading-relaxed" data-testid={`text-explanation-${index}`}>
        {magicWord.explanation}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Example Prompt Snippet
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            data-testid={`button-copy-${index}`}
            className="hover-elevate"
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
        <div
          className="bg-muted/50 p-4 rounded-lg font-mono text-sm leading-relaxed text-foreground border border-border"
          data-testid={`text-snippet-${index}`}
        >
          {magicWord.exampleSnippet}
        </div>
      </div>
    </Card>
  );
}
