import { useState } from "react";
import { Loader2, Zap, Plus, X, Bolt, Copy, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TemperatureControl } from "@/components/temperature-control";
import { TensionSeedCard } from "@/components/tension-seed-card";
import { TensionSeedSkeleton } from "@/components/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getTensionSeedErrorMessage } from "@/lib/error-handler";
import { tensionSeedRequestSchema, type TensionSeed, type TensionSeedResponse } from "@shared/schema";

const formSchema = tensionSeedRequestSchema;

type FormValues = z.infer<typeof formSchema>;

export function TensionSeedsStudio() {
  const [results, setResults] = useState<TensionSeed[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      theme: "",
      tensionAxes: [""],
      temperature: "medium" as const,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tensionAxes",
  });

  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const validAxes = data.tensionAxes.filter((axis) => axis.trim().length > 0);
      const response = await apiRequest<TensionSeedResponse>(
        "POST",
        "/api/tension-seeds",
        {
          theme: data.theme,
          tensionAxes: validAxes,
          temperature: data.temperature,
        }
      );
      return response;
    },
    onSuccess: (data) => {
      setResults(data.tensionSeeds);
      queryClient.invalidateQueries({ queryKey: ["/api/tension-seeds"] });
      toast({
        title: "张力种子已生成！",
        description: `为您的主题创建了 ${data.tensionSeeds.length} 个张力种子。`,
      });
    },
    onError: (error: any) => {
      const friendlyError = getTensionSeedErrorMessage(error);
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

    // 格式化所有张力种子为文本
    const formattedText = results
      .map((seed, index) => {
        const questions = seed.followUpQuestions
          .map((q, i) => `   ${i + 1}. ${q}`)
          .join('\n');
        return `${index + 1}. 张力种子：\n${seed.seedSentence}\n\n后续问题：\n${questions}`;
      })
      .join('\n\n' + '='.repeat(50) + '\n\n');

    await navigator.clipboard.writeText(formattedText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);

    toast({
      title: "已复制全部内容",
      description: `${results.length} 个张力种子已复制到剪贴板`,
    });
  };

  const handleClearResults = () => {
    setResults([]);
    toast({
      title: "已清空结果",
      description: "所有生成的张力种子已清空",
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
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-violet-400/20 rounded-3xl blur-2xl" />
              <div className="relative backdrop-blur-xl bg-card/50 border border-purple-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-400/20 rounded-xl">
                    <Zap className="w-5 h-5 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent">
                    张力种子工作室
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  通过富有挑衅性的种子和后续问题激发创意灵感
                </p>
              </div>
            </div>

            {/* Input Form */}
            <div className="backdrop-blur-xl bg-card/50 border border-border/40 rounded-3xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">主题</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-theme"
                            placeholder="例如：提示词即协议"
                            {...field}
                            className="text-base rounded-xl bg-background/50 backdrop-blur-sm border-border/40 focus:border-purple-500/50 transition-colors"
                            disabled={generateMutation.isPending}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className={`text-xs ${
                            field.value.length > 200 ? 'text-destructive' :
                            field.value.length > 180 ? 'text-yellow-500' :
                            'text-muted-foreground'
                          }`}>
                            {field.value.length}/200
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel className="text-sm font-medium text-foreground/80">张力轴</FormLabel>
                        <p className="text-xs text-muted-foreground mt-1">
                          添加多个对立或冲突的概念轴
                        </p>
                      </div>
                      {fields.length < 5 && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append("")}
                            disabled={generateMutation.isPending}
                            className="rounded-xl border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10"
                            data-testid="button-add-axis"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            添加轴
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          <FormField
                            control={form.control}
                            name={`tensionAxes.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      data-testid={`input-tension-axis-${index}`}
                                      placeholder={`张力轴 ${index + 1}，例如：透明 vs 隐私`}
                                      {...field}
                                      className="text-base rounded-xl bg-background/50 backdrop-blur-sm border-border/40 focus:border-purple-500/50 transition-colors"
                                      disabled={generateMutation.isPending}
                                    />
                                    {fields.length > 1 && (
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => remove(index)}
                                          disabled={generateMutation.isPending}
                                          className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                          data-testid={`button-remove-axis-${index}`}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </motion.div>
                                    )}
                                  </div>
                                </FormControl>
                                <div className="flex justify-between items-center">
                                  <FormMessage />
                                  <span className={`text-xs ${
                                    field.value.length > 100 ? 'text-destructive' :
                                    field.value.length > 90 ? 'text-yellow-500' :
                                    'text-muted-foreground'
                                  }`}>
                                    {field.value.length}/100
                                  </span>
                                </div>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

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
                            data-testid="temperature-control-tension"
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
                      data-testid="button-generate-seeds"
                      className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-600 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-200"
                      size="lg"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          生成张力种子中...
                        </>
                      ) : (
                        <>
                          <Bolt className="w-5 h-5 mr-2" />
                          生成种子
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
                  <Zap className="w-5 h-5 text-purple-500 animate-pulse" />
                  <h3 className="text-xl font-semibold">正在生成张力种子...</h3>
                </div>
                <TensionSeedSkeleton count={3} />
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
                    <Zap className="w-5 h-5 text-purple-500" />
                    <h3 className="text-xl font-semibold">生成的张力种子</h3>
                    <span className="text-sm text-muted-foreground">({results.length})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAll}
                        className="rounded-xl border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10"
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
                  {results.map((seed, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TensionSeedCard
                        tensionSeed={seed}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-400/20 rounded-full blur-3xl opacity-50" />
                  <div className="relative p-8 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl">
                    <Zap className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-semibold text-foreground/80">
                  激发创意张力
                </h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  张力种子通过挑衅性的观点和深度问题帮助您探索新的思考角度。选择一个主题，添加张力轴，开始创作。
                </p>

                <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl max-w-lg space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">💡 试试这些示例</p>
                  <div className="space-y-2 text-left">
                    <div className="text-sm text-foreground/70">
                      <span className="text-purple-500 font-medium">·</span> 主题：AI 伦理 | 轴：效率 vs 公平
                    </div>
                    <div className="text-sm text-foreground/70">
                      <span className="text-purple-500 font-medium">·</span> 主题：远程办公 | 轴：自由 vs 协作
                    </div>
                    <div className="text-sm text-foreground/70">
                      <span className="text-purple-500 font-medium">·</span> 主题：教育创新 | 轴：传统 vs 科技
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