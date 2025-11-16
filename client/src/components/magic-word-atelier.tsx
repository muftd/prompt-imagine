import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TemperatureControl } from "@/components/temperature-control";
import { MagicWordCard } from "@/components/magic-word-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { magicWordRequestSchema, type MagicWord, type MagicWordResponse } from "@shared/schema";

const formSchema = magicWordRequestSchema.extend({
  styleIntent: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function MagicWordAtelier() {
  const [results, setResults] = useState<MagicWord[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      taskDescription: "",
      styleIntent: "",
      temperature: "medium" as const,
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        taskDescription: data.taskDescription,
        styleIntent: data.styleIntent || undefined,
        temperature: data.temperature,
      };
      const response = await apiRequest<MagicWordResponse>(
        "POST",
        "/api/magic-words",
        payload
      );
      return response;
    },
    onSuccess: (data) => {
      setResults(data.magicWords);
      queryClient.invalidateQueries({ queryKey: ["/api/magic-words"] });
      toast({
        title: "魔法词已生成！",
        description: `为您的任务创建了 ${data.magicWords.length} 个魔法词。`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "生成失败",
        description: error.message || "无法生成魔法词，请重试。",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Panel - Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-28 space-y-6">
            {/* Mode Header */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-teal-400/20 rounded-3xl blur-2xl" />
              <div className="relative backdrop-blur-xl bg-card/50 border border-emerald-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-400/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                    魔法词工坊
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  为您的任务添加魔法词，塑造AI的创意方向
                </p>
              </div>
            </div>

            {/* Input Form */}
            <div className="backdrop-blur-xl bg-card/50 border border-border/40 rounded-3xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="taskDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          描述您的任务和上下文
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="textarea-task-description"
                            placeholder="任务：为Claude代码助手创建产品分析&#10;上下文：面向产品经理，技术性但易懂&#10;目标：帮助他们理解架构和价值主张"
                            {...field}
                            className="min-h-48 resize-none text-base rounded-xl bg-background/50 backdrop-blur-sm border-border/40 focus:border-emerald-500/50 transition-colors"
                            disabled={generateMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="styleIntent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          风格或意图（可选）
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-style-intent"
                            placeholder="例如：结构化 + 禅意般，无PR废话"
                            {...field}
                            className="text-base rounded-xl bg-background/50 backdrop-blur-sm border-border/40 focus:border-emerald-500/50 transition-colors"
                            disabled={generateMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">创意度</FormLabel>
                        <FormControl>
                          <TemperatureControl
                            value={field.value}
                            onChange={field.onChange}
                            data-testid="temperature-control-magic"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={generateMutation.isPending || !form.formState.isValid}
                      data-testid="button-run-magic"
                      className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200"
                      size="lg"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          生成魔法词中...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          运行魔法
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            {generateMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                  <div className="relative p-6 bg-gradient-to-br from-emerald-500/10 to-teal-400/10 rounded-full">
                    <Sparkles className="w-12 h-12 text-emerald-500 animate-spin" />
                  </div>
                </div>
                <p className="mt-6 text-lg text-muted-foreground">正在施展魔法...</p>
              </motion.div>
            )}

            {results && results.length > 0 && !generateMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-semibold">生成的魔法词</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {results.map((word, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <MagicWordCard
                        magicWord={word}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {!results.length && !generateMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl">
                  <Sparkles className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-muted-foreground">
                  尚未生成魔法词
                </h3>
                <p className="mt-2 text-sm text-muted-foreground/80">
                  输入任务描述并点击"运行魔法"开始生成
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}