import { useState } from "react";
import { Loader2, Sparkles, Wand2, Copy, Trash2, Check } from "lucide-react";
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
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getMagicWordErrorMessage } from "@/lib/error-handler";
import { magicWordRequestSchema, type MagicWord, type MagicWordResponse } from "@shared/schema";

const formSchema = magicWordRequestSchema.extend({
  styleIntent: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function MagicWordAtelier() {
  const [results, setResults] = useState<MagicWord[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
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
      const friendlyError = getMagicWordErrorMessage(error);
      toast({
        title: friendlyError.title,
        description: friendlyError.description + (friendlyError.suggestion ? `\n\n💡 ${friendlyError.suggestion}` : ''),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    generateMutation.mutate(data);
  };

  const handleCopyAll = async () => {
    if (results.length === 0) return;

    // 格式化所有魔法词为文本
    const formattedText = results
      .map((word, index) => {
        return `${index + 1}. 魔法词：${word.word}\n\n说明：${word.explanation}\n\n示例片段：\n${word.exampleSnippet}`;
      })
      .join('\n\n' + '='.repeat(50) + '\n\n');

    await navigator.clipboard.writeText(formattedText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);

    toast({
      title: "已复制全部内容",
      description: `${results.length} 个魔法词已复制到剪贴板`,
    });
  };

  const handleClearResults = () => {
    setResults([]);
    toast({
      title: "已清空结果",
      description: "所有生成的魔法词已清空",
    });
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
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className={`text-xs ${
                            field.value.length > 500 ? 'text-destructive' :
                            field.value.length > 450 ? 'text-yellow-500' :
                            'text-muted-foreground'
                          }`}>
                            {field.value.length}/500
                          </span>
                        </div>
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
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className={`text-xs ${
                            field.value.length > 500 ? 'text-destructive' :
                            field.value.length > 450 ? 'text-yellow-500' :
                            'text-muted-foreground'
                          }`}>
                            {field.value.length}/500
                          </span>
                        </div>
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
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                  <h3 className="text-xl font-semibold">正在施展魔法...</h3>
                </div>
                <LoadingSkeleton count={3} variant="magic" />
              </motion.div>
            )}

            {results && results.length > 0 && !generateMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xl font-semibold">生成的魔法词</h3>
                    <span className="text-sm text-muted-foreground">({results.length})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAll}
                        className="rounded-xl border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                      >
                        {copiedAll ? (
                          <>
                            <Check className="w-4 h-4 mr-1.5" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1.5" />
                            复制全部
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearResults}
                        className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        清空
                      </Button>
                    </motion.div>
                  </div>
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
                className="flex flex-col items-center justify-center min-h-[400px] text-center px-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 rounded-full blur-3xl opacity-50" />
                  <div className="relative p-8 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl">
                    <Sparkles className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-semibold text-foreground/80">
                  开始创作您的魔法词
                </h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  魔法词能够塑造 AI 的回应风格和创意方向。描述您的任务，我们将为您生成专属的魔法词片段。
                </p>

                <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl max-w-lg space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">💡 试试这些示例</p>
                  <div className="space-y-2 text-left">
                    <div className="text-sm text-foreground/70">
                      <span className="text-emerald-500 font-medium">·</span> 为产品经理写技术文档
                    </div>
                    <div className="text-sm text-foreground/70">
                      <span className="text-emerald-500 font-medium">·</span> 创作科幻小说的开篇段落
                    </div>
                    <div className="text-sm text-foreground/70">
                      <span className="text-emerald-500 font-medium">·</span> 生成市场营销文案
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}