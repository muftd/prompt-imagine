import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemperatureControlProps {
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
  "data-testid"?: string;
}

const temperatures = [
  { value: "low" as const, label: "低" },
  { value: "medium" as const, label: "中等" },
  { value: "high" as const, label: "高" },
];

export function TemperatureControl({
  value,
  onChange,
  "data-testid": testId,
}: TemperatureControlProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted p-1" data-testid={testId}>
      {temperatures.map((temp) => (
        <Button
          key={temp.value}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(temp.value)}
          data-testid={`${testId}-${temp.value}`}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors rounded-md",
            value === temp.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {temp.label}
        </Button>
      ))}
    </div>
  );
}
