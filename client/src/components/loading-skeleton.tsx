import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "magic" | "tension";
}

export function LoadingSkeleton({ count = 3, variant = "magic" }: LoadingSkeletonProps) {
  const borderColor = variant === "magic"
    ? "border-emerald-500/20"
    : "border-purple-500/20";

  const gradientFrom = variant === "magic"
    ? "from-emerald-500/5"
    : "from-purple-500/5";

  const gradientTo = variant === "magic"
    ? "to-teal-400/5"
    : "to-violet-400/5";

  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className={`relative overflow-hidden backdrop-blur-xl bg-card/80 border-border/40 ${borderColor}`}>
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} />

            <div className="relative p-6 space-y-4">
              {/* Badge area */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-7 w-32 rounded-full" />
              </div>

              {/* Explanation text lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>

              {/* Example section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>

                {/* Code block */}
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export function TensionSeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden backdrop-blur-xl bg-card/80 border-border/40 border-purple-500/20">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-400/5" />

            <div className="relative p-6 space-y-4">
              {/* Seed sentence area */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-10/12" />
              </div>

              {/* Follow-up questions */}
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-32" />

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-10/12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
