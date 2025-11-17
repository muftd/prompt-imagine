import { useState } from "react";
import { Loader2, Sparkles, Wand2, Copy, Trash2, Check, Lightbulb, Compass } from "lucide-react";
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
import { LensCard } from "@/components/lens-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getMagicWordErrorMessage } from "@/lib/error-handler";
import { magicWordRequestSchema, type MagicWordResponse } from "@shared/schema";

const formSchema = magicWordRequestSchema.extend({
  styleIntent: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function MagicWordAtelier() {
  const [results, setResults] = useState<MagicWordResponse | null>(null);
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
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ["/api/magic-words"] });
      const totalLenses = (data.vertical_lenses?.length ?? 0) + (data.horizontal_lenses?.length ?? 0);
      toast({
        title: "概念透镜已生成！",
        description: `为您的 Prompt 创建了 ${totalLenses} 个概念透镜（${data.vertical_lenses?.length ?? 0} 个纵向 + ${data.horizontal_lenses?.length ?? 0} 个横向）。`,
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
    if (!results) return;

    // 格式化所有透镜为文本
    let formattedText = "# 纵向深度透镜\n\n";
    results.vertical_lenses?.forEach((lens, index) => {
      formattedText += `${index + 1}. ${lens.name}\n`;
      formattedText += `   效果：${lens.effect_line}\n`;
      formattedText += `   示例：${lens.example_snippet}\n\n`;
    });

    formattedText += "\n" + "=".repeat(50) + "\n\n";
    formattedText += "# 横向透镜\n\n";
    results.horizontal_lenses?.forEach((lens, index) => {
      formattedText += `${index + 1}. ${lens.name}\n`;
      formattedText += `   效果：${lens.effect_line}\n`;
      formattedText += `   示例：${lens.example_snippet}\n\n`;
    });

    await navigator.clipboard.writeText(formattedText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);

    const totalLenses = (results.vertical_lenses?.length ?? 0) + (results.horizontal_lenses?.length ?? 0);
    toast({
      title: "已复制全部内容",
      description: `${totalLenses} 个概念透镜已复制到剪贴板`,
    });
  };

  const handleClearResults = () => {
    setResults(null);
    toast({
      title: "已清空结果",
      description: "所有生成的概念透镜已清空",
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
                  为严肃任务的 Prompt 配一小撮概念补丁，逃离平均值答案
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
                          您的 Prompt（或任务描述）
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="textarea-task-description"
                            placeholder="直接贴入您要发给 AI 的完整 Prompt，或简要描述任务。&#10;&#10;示例 1（架构设计）：&#10;请帮我设计一个多 Coach 协同的 AgentOS 架构，需要考虑上下文流转、任务分发和状态同步。&#10;&#10;示例 2（产品分析）：&#10;分析 Claude Code 这个产品，它的核心价值奇点在哪里？与传统 IDE 插件的差异是什么？"
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
                          风格与意向（可选）
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-style-intent"
                            placeholder="例如：结构化 + 禅意般，无PR废话 / 偏向实用主义，避免过度抽象"
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
                          生成概念透镜中...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          生成概念补丁
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
                  <h3 className="text-xl font-semibold">正在生成概念透镜...</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-sm font-medium text-muted-foreground">纵向深度</h4>
                    </div>
                    <LoadingSkeleton count={2} variant="magic" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Compass className="w-4 h-4 text-violet-500" />
                      <h4 className="text-sm font-medium text-muted-foreground">横向透镜</h4>
                    </div>
                    <LoadingSkeleton count={2} variant="magic" />
                  </div>
                </div>
              </motion.div>
            )}

            {results && ((results.vertical_lenses?.length ?? 0) > 0 || (results.horizontal_lenses?.length ?? 0) > 0) && !generateMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xl font-semibold">生成的概念透镜</h3>
                    <span className="text-sm text-muted-foreground">
                      ({(results.vertical_lenses?.length ?? 0) + (results.horizontal_lenses?.length ?? 0)})
                    </span>
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

                {/* Left-Right Layout: Vertical | Horizontal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Vertical Lenses Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-lg font-semibold">纵向深度</h4>
                      <span className="text-xs text-muted-foreground">
                        ({results.vertical_lenses?.length ?? 0})
                      </span>
                    </div>
                    <div className="space-y-4">
                      {results.vertical_lenses?.map((lens, index) => (
                        <LensCard
                          key={index}
                          lens={lens}
                          variant="vertical"
                          index={index}
                        />
                      ))}
                    </div>
                    {(results.vertical_lenses?.length ?? 0) === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        暂无纵向深度透镜
                      </p>
                    )}
                  </div>

                  {/* Horizontal Lenses Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Compass className="w-5 h-5 text-violet-500" />
                      <h4 className="text-lg font-semibold">横向透镜</h4>
                      <span className="text-xs text-muted-foreground">
                        ({results.horizontal_lenses?.length ?? 0})
                      </span>
                    </div>
                    <div className="space-y-4">
                      {results.horizontal_lenses?.map((lens, index) => (
                        <LensCard
                          key={index}
                          lens={lens}
                          variant="horizontal"
                          index={index}
                        />
                      ))}
                    </div>
                    {(results.horizontal_lenses?.length ?? 0) === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        暂无横向透镜
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {!results && !generateMutation.isPending && (
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
                  为您的 Prompt 配一小撮概念补丁
                </h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  我们只服务严肃的知识探索任务：架构设计、产品分析、学习规划、深度解释。<br/>
                  让 AI 的回答逃离平均值，走向更深刻、更锐利的特殊路径。
                </p>

                <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl max-w-lg space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">💡 适合的场景示例</p>
                  <div className="space-y-2 text-left">
                    <div className="text-sm text-foreground/70">
                      <span className="text-emerald-500 font-medium">·</span> 设计多 Coach 协同的 AgentOS 架构
                    </div>
                    <div className="text-sm text-foreground/70">
                      <span className="text-emerald-500 font-medium">·</span> 分析 Claude Code 的核心价值奇点
                    </div>
                    <div className="text-sm text-foreground/70">
                      <span className="text-emerald-500 font-medium">·</span> 规划系统性学习 PKM（个人知识管理）
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