import { useState } from "react";
import { Loader2 } from "lucide-react";
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            魔法词
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-magic mb-6">
            工坊
          </h3>
          <p className="text-lg text-muted-foreground">
            为您的任务添加魔法词，塑造AI的创意方向
          </p>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    描述您的任务和上下文
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      data-testid="textarea-task-description"
                      placeholder="任务：为Claude代码助手创建产品分析&#10;上下文：面向产品经理，技术性但易懂&#10;目标：帮助他们理解架构和价值主张"
                      {...field}
                      className="min-h-32 md:min-h-40 resize-none text-base"
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
                  <FormLabel className="text-base font-medium">
                    风格或意图（可选）
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="input-style-intent"
                      placeholder="例如：结构化 + 禅意般，无PR废话"
                      {...field}
                      className="text-base"
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
                  <FormLabel className="text-base font-medium">创意度</FormLabel>
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

            <Button
              type="submit"
              disabled={generateMutation.isPending || !form.formState.isValid}
              data-testid="button-run-magic"
              className="w-full md:w-auto px-8 py-6 text-lg font-semibold rounded-full bg-magic hover:bg-magic/90 text-magic-foreground"
              size="lg"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                "运行"
              )}
            </Button>
          </form>
        </Form>

        {results && results.length > 0 && (
          <div className="pt-8 animate-fade-in">
            <h3 className="text-xl font-semibold mb-6 text-foreground">
              魔法词
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {results.map((word, index) => (
                <MagicWordCard
                  key={index}
                  magicWord={word}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}