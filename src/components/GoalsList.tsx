import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, DollarSign, Clock, Trash2 } from "lucide-react";
import { Goal } from "./GoalCreationModal";

interface GoalsListProps {
  goals: Goal[];
  onRemoveGoal: (goalId: string) => void;
}

export default function GoalsList({ goals, onRemoveGoal }: GoalsListProps) {
  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Target className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No goals added yet. Create your first goal to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <Card key={goal.id} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {goal.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveGoal(goal.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {goal.description && (
              <p className="text-muted-foreground mb-3">{goal.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {goal.valueEstimation && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${parseFloat(goal.valueEstimation).toLocaleString()}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {goal.timeEstimation}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}