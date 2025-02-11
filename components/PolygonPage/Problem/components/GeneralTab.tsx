import { useState, useEffect } from "react";
import { Problem } from "../types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DifficultyBox from "@/components/ui/difficulty";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneralTabProps {
  problem: Problem;
  isLoading: boolean;
  onUpdate: (updates: Partial<Problem>) => Promise<void>;
}

export function GeneralTab({ problem, isLoading, onUpdate }: GeneralTabProps) {
  const [localProblem, setLocalProblem] = useState<Problem>(problem);

  useEffect(() => {
    setLocalProblem(problem);
  }, [problem]);

  const handleInputChange = (field: keyof Problem, value: string | number) => {
    setLocalProblem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await onUpdate(localProblem);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] overflow-auto bg-dot-pattern">
      <div className="mx-auto w-full px-6 py-4">
        {/* Problem Info Section */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 max-w-[100%]">
            <div className="flex">
              <Label className="text-sm font-medium text-muted-foreground">
                Problem ID
              </Label>
            </div>
            <div className="p-2.5 rounded-md font-mono text-sm bg-muted/20 border border-muted/30">
              {problem.id}
            </div>
          </div>

          <div>
            <div className="w-full justify-center items-center flex">
              <Label className="text-sm font-medium text-muted-foreground">
                Difficulty
              </Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "difficulty",
                      Math.max(0, localProblem.difficulty - 1)
                    )
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-md border-0 hover:bg-accent/50 transition-colors"
                  disabled={isLoading || localProblem.difficulty <= 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localProblem.difficulty}
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      Math.min(100, parseInt(e.target.value) || 0)
                    );
                    handleInputChange("difficulty", value);
                  }}
                  className="p-2.5 rounded-md font-mono text-sm bg-muted/20 border border-muted/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "difficulty",
                      Math.min(100, localProblem.difficulty + 1)
                    )
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-md border-0 hover:bg-accent/50 transition-colors"
                  disabled={isLoading || localProblem.difficulty >= 100}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Title Section */}
        <div className="mt-3">
          <Label
            htmlFor="displayTitle"
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            Display Title
          </Label>
          <Input
            id="displayTitle"
            placeholder="Enter display title..."
            value={localProblem.displayTitle}
            onChange={(e) => handleInputChange("displayTitle", e.target.value)}
            disabled={isLoading}
            className="bg-muted/20 border-muted/30 h-9"
          />
        </div>

        {/* Category Section */}
        <div className="mt-3">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-muted-foreground"
          >
            Category
          </Label>
          <Textarea
            id="category"
            placeholder="Enter category..."
            value={localProblem.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            disabled={isLoading}
            rows={3}
            className="mt-1.5 resize-none bg-background/50 border-muted/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                disabled={isLoading}
                className={cn(
                  "min-w-[160px] h-11",
                  "transition-all duration-200",
                  "hover:scale-102 active:scale-98",
                  "shadow-sm hover:shadow-md",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>Update Problem</span>
                )}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-[400px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to update this problem?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="hover:bg-secondary/80">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Update
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
