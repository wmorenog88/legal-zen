import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, DollarSign, Clock } from "lucide-react";

const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  description: z.string().optional(),
  valueEstimation: z.string().optional(),
  timeEstimation: z.string().min(1, "Time estimation is required"),
});

type GoalFormData = z.infer<typeof goalSchema>;

export interface Goal {
  id: string;
  name: string;
  description?: string;
  valueEstimation?: string;
  timeEstimation: string;
}

interface GoalCreationModalProps {
  onAddGoal: (goal: Omit<Goal, "id">) => void;
}

export default function GoalCreationModal({ onAddGoal }: GoalCreationModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      valueEstimation: "",
      timeEstimation: "",
    },
  });

  const onSubmit = (data: GoalFormData) => {
    onAddGoal({
      name: data.name,
      description: data.description || "",
      valueEstimation: data.valueEstimation || "",
      timeEstimation: data.timeEstimation,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter goal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the goal details" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valueEstimation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value Estimation ($)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-9"
                          step="0.01"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeEstimation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Estimation *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          placeholder="e.g., 2 weeks, 3 months" 
                          className="pl-9"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Goal
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}