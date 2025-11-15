import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModeCardProps {
  mode: "magic" | "tension";
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  "data-testid"?: string;
}

export function ModeCard({
  mode,
  title,
  icon: Icon,
  isActive,
  onClick,
  "data-testid": testId,
}: ModeCardProps) {
  const themeColors = {
    magic: {
      bg: "bg-magic-light dark:bg-magic-light",
      border: "border-magic dark:border-magic",
      text: "text-magic-dark dark:text-magic-dark",
      icon: "text-magic dark:text-magic",
    },
    tension: {
      bg: "bg-tension-light dark:bg-tension-light",
      border: "border-tension dark:border-tension",
      text: "text-tension-dark dark:text-tension-dark",
      icon: "text-tension dark:text-tension",
    },
  };

  const colors = themeColors[mode];

  return (
    <Card
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "h-24 md:h-28 flex items-center justify-center gap-4 cursor-pointer transition-all duration-200",
        "hover-elevate active-elevate-2",
        isActive
          ? cn(
              "border-4",
              colors.border,
              colors.bg,
              "shadow-lg"
            )
          : "border border-border bg-card hover:border-border/80"
      )}
    >
      <Icon
        className={cn(
          "w-7 h-7 md:w-8 md:h-8 transition-colors",
          isActive ? colors.icon : "text-muted-foreground"
        )}
      />
      <h2
        className={cn(
          "text-xl md:text-2xl font-bold transition-colors",
          isActive ? colors.text : "text-foreground"
        )}
      >
        {title}
      </h2>
    </Card>
  );
}
