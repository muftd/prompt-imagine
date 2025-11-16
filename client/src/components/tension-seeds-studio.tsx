import { useState } from "react";
import { Loader2, Zap, Plus, X, Lightning } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tensionSeedRequestSchema, type TensionSeed, type TensionSeedResponse } from "@shared/schema";

const formSchema = tensionSeedRequestSchema;

type FormValues = z.infer<typeof formSchema>;

export function TensionSeedsStudio() {
  const [results, setResults] = useState<TensionSeed[]>([]);
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
      toast({
        title: "生成失败",
        description: error.message || "无法生成张力种子，请重试。",
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
                        <FormMessage />
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
                                <FormMessage />
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
                          <Lightning className="w-5 h-5 mr-2" />
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
                className="flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                  <div className="relative p-6 bg-gradient-to-br from-purple-500/10 to-violet-400/10 rounded-full">
                    <Zap className="w-12 h-12 text-purple-500 animate-pulse" />
                  </div>
                </div>
                <p className="mt-6 text-lg text-muted-foreground">正在生成张力种子...</p>
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
                  <Zap className="w-5 h-5 text-purple-500" />
                  <h3 className="text-xl font-semibold">生成的张力种子</h3>
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
                className="flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl">
                  <Zap className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-muted-foreground">
                  尚未生成张力种子
                </h3>
                <p className="mt-2 text-sm text-muted-foreground/80">
                  输入主题和张力轴，点击"生成种子"开始创建
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}