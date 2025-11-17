import { useState } from "react";
import { Copy, Check, Lightbulb, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Lens } from "@shared/schema";

interface LensCardProps {
  lens: Lens;
  variant: "vertical" | "horizontal";
  index: number;
}

export function LensCard({ lens, variant, index }: LensCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lens.example_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "已复制到剪贴板",
      description: "示例片段已复制，可直接粘贴到您的 Prompt 中",
    });
  };

  const isVertical = variant === "vertical";

  const variantStyles = {
    vertical: {
      icon: Lightbulb,
      badgeBg: "bg-gradient-to-r from-emerald-500/20 to-teal-400/20",
      badgeText: "text-emerald-500",
      badgeBorder: "border-emerald-500/30",
      cardBorder: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40",
      buttonHover: "hover:bg-emerald-500/10 hover:border-emerald-500/40",
      accentGlow: "from-emerald-500/10 to-teal-400/10",
    },
    horizontal: {
      icon: Compass,
      badgeBg: "bg-gradient-to-r from-violet-500/20 to-purple-400/20",
      badgeText: "text-violet-500",
      badgeBorder: "border-violet-500/30",
      cardBorder: "border-violet-500/20",
      hoverBorder: "hover:border-violet-500/40",
      buttonHover: "hover:bg-violet-500/10 hover:border-violet-500/40",
      accentGlow: "from-violet-500/10 to-purple-400/10",
    },
  };

  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "relative group backdrop-blur-xl bg-card/50 rounded-2xl p-6 border transition-all duration-300",
        styles.cardBorder,
        styles.hoverBorder
      )}
    >
      {/* Glow effect on hover */}
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-br rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl",
        styles.accentGlow
      )} />

      {/* Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm",
          styles.badgeBg,
          styles.badgeBorder
        )}>
          <Icon className={cn("w-3.5 h-3.5", styles.badgeText)} />
          <span className={cn("text-xs font-medium", styles.badgeText)}>
            {isVertical ? "纵向深度" : "横向透镜"}
          </span>
        </div>
      </div>

      {/* Lens Name */}
      <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-foreground/90 transition-colors">
        {lens.name}
      </h3>

      {/* Effect Line */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {lens.effect_line}
      </p>

      {/* Example Snippet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            示例片段
          </span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "h-8 rounded-lg border text-xs transition-all duration-200",
                styles.cardBorder,
                styles.buttonHover
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  复制
                </>
              )}
            </Button>
          </motion.div>
        </div>
        <div className="relative">
          <pre className="text-xs bg-background/50 backdrop-blur-sm border border-border/40 rounded-xl p-4 overflow-x-auto">
            <code className="text-foreground/80 font-mono">
              {lens.example_snippet}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
