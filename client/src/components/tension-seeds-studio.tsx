import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
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
        title: "Tension seeds generated!",
        description: `Created ${data.tensionSeeds.length} tension seeds for your theme.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate tension seeds. Please try again.",
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
            Tension Seeds
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-tension mb-6">
            Studio
          </h3>
          <p className="text-lg text-muted-foreground">
            Inject creative tension into your ideas with provocative seeds and follow-up questions
          </p>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Theme</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="input-theme"
                      placeholder="e.g., Prompt as Protocol"
                      {...field}
                      className="text-base"
                      disabled={generateMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">Tension Axes</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append("")}
                  data-testid="button-add-axis"
                  className="hover-elevate"
                  disabled={generateMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Axis
                </Button>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`tensionAxes.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              data-testid={`input-tension-axis-${index}`}
                              placeholder="e.g., Zen simplicity vs Engineering rigor"
                              {...field}
                              className="text-base flex-1"
                              disabled={generateMutation.isPending}
                            />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              data-testid={`button-remove-axis-${index}`}
                              className="hover-elevate shrink-0"
                              disabled={generateMutation.isPending}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Divergence</FormLabel>
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

            <Button
              type="submit"
              disabled={generateMutation.isPending || !form.formState.isValid}
              data-testid="button-run-tension"
              className="w-full md:w-auto px-8 py-6 text-lg font-semibold rounded-full bg-tension hover:bg-tension/90 text-tension-foreground"
              size="lg"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "RUN"
              )}
            </Button>
          </form>
        </Form>

        {results && results.length > 0 && (
          <div className="pt-8 animate-fade-in">
            <h3 className="text-xl font-semibold mb-6 text-foreground">
              Tension Seeds
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {results.map((seed, index) => (
                <TensionSeedCard
                  key={index}
                  tensionSeed={seed}
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
