import { useState, useEffect } from "react";
import { Problem } from "../types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { categories } from "@/components/ProblemsPage/ProblemsetPage/utils/categories";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

interface GeneralTabProps {
  problem: Problem;
  isLoading: boolean;
  onUpdate: (updates: Partial<Problem>) => Promise<void>;
}

export function GeneralTab({ problem, isLoading, onUpdate }: GeneralTabProps) {
  const [localProblem, setLocalProblem] = useState<Problem>(problem);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setLocalProblem(problem);
  }, [problem]);

  const handleInputChange = (field: keyof Problem, value: any) => {
    // Reset update success state when user makes changes
    if (updateSuccess !== null) {
      setUpdateSuccess(null);
    }
    
    setLocalProblem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      setUpdateSuccess(null);
      await onUpdate(localProblem);
      setUpdateSuccess(true);
      
      toast({
        title: "Problem updated successfully",
        description: "Your changes have been saved.",
        variant: "default",
      });
      
      // Close dialog after successful update
      setAlertOpen(false);
    } catch (error) {
      console.error("Error updating problem:", error);
      setUpdateSuccess(false);
      
      toast({
        title: "Failed to update problem",
        description: "An error occurred while saving your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDifficultyChange = (value: number) => {
    // Ensure value is between 100 and 2000, and rounds to nearest 100
    const normalizedValue = Math.max(
      100,
      Math.min(2000, Math.round(value / 100) * 100)
    );
    return normalizedValue;
  };

  // Check if any changes have been made compared to the original problem
  const hasChanges = JSON.stringify(problem) !== JSON.stringify(localProblem);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-auto bg-dot-pattern">
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        {/* Container with consistent spacing */}
        <div className="space-y-8">
          {/* Problem Info Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* ID Section */}
            <div className="col-span-2">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Problem ID
              </Label>
              <div className="p-3 rounded-lg font-mono text-sm bg-muted/20 border border-muted/30">
                {problem.id}
              </div>
            </div>

            {/* Difficulty Section */}
            <div className="col-span-1">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block text-center">
                Difficulty ({localProblem.difficulty})
              </Label>
              <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="100"
                    value={localProblem.difficulty}
                    onChange={(e) => {
                      const value = handleDifficultyChange(
                        parseInt(e.target.value) || 100
                      );
                      handleInputChange("difficulty", value);
                    }}
                    className={cn(
                      "w-full p-2.5 rounded-md font-mono text-base text-center",
                      "bg-background border border-input",
                      "[appearance:textfield]",
                      "[&::-webkit-outer-spin-button]:appearance-none",
                      "[&::-webkit-inner-spin-button]:appearance-none",
                      "focus:ring-1 focus:ring-primary focus:border-primary",
                      "transition-colors"
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                    / 2000
                  </div>
                </div>

                <Slider
                  value={[localProblem.difficulty]}
                  min={100}
                  max={2000}
                  step={100}
                  disabled={isLoading || isUpdating}
                  onValueChange={([value]) => {
                    handleInputChange("difficulty", value);
                  }}
                  className={cn(
                    "py-2",
                    (isLoading || isUpdating) ? "opacity-50" : "opacity-100",
                    "transition-opacity duration-200"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-2">
            <Label
              htmlFor="displayTitle"
              className="text-sm font-medium text-muted-foreground block"
            >
              Display Title
            </Label>
            <Input
              id="displayTitle"
              placeholder="Enter display title..."
              value={localProblem.displayTitle}
              onChange={(e) => handleInputChange("displayTitle", e.target.value)}
              disabled={isLoading || isUpdating}
              className="bg-card/50 border-input/50 h-10"
            />
          </div>

          {/* Categories Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground block">
              Categories
            </Label>
            <div className="flex flex-wrap gap-2 bg-card/50 p-4 rounded-lg border border-muted/30">
              {categories().map((category) => {
                const isSelected = localProblem.categories?.includes(category.code);
                return (
                  <button
                    key={category.code}
                    onClick={() => {
                      const updatedCategories = isSelected
                        ? localProblem.categories.filter((c) => c !== category.code)
                        : [...(localProblem.categories || []), category.code];
                      handleInputChange("categories", updatedCategories);
                    }}
                    disabled={isLoading || isUpdating}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium",
                      "transition-all duration-200",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? [
                            "bg-primary text-primary-foreground",
                            "shadow-sm hover:bg-primary/90",
                          ]
                        : [
                            "bg-muted/50 hover:bg-muted",
                            "border border-muted-foreground/20",
                          ]
                    )}
                  >
                    {category.name}
                    {isSelected && <X className="ml-1.5 h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger asChild>
  <Button
    variant="default"
    disabled={isLoading || isUpdating || (!hasChanges && updateSuccess !== true)}
    className={cn(
      "min-w-[160px] h-11 transition-all duration-200",
      updateSuccess === true && "bg-emerald-600 hover:bg-emerald-700",
      !hasChanges && updateSuccess !== true && "opacity-50",
      hasChanges && "animate-subtle-pulse hover:scale-[1.01] active:scale-[0.98]",
      "shadow hover:shadow-md relative overflow-hidden"
    )}
  >
    {isLoading ? (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    ) : isUpdating ? (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Updating...</span>
      </div>
    ) : updateSuccess === true ? (
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        <span>Updated Successfully</span>
      </div>
    ) : hasChanges ? (
      <span>Save Changes</span>
    ) : (
      <span>No Changes</span>
    )}
    
    {/* Success animation overlay */}
    {updateSuccess === true && (
      <span className="absolute inset-0 bg-emerald-500/20 animate-pulse-once" />
    )}
  </Button>
</AlertDialogTrigger>              <AlertDialogContent className="sm:max-w-[400px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update this problem?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel 
                    className="hover:bg-secondary/80"
                    disabled={isUpdating}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className={isUpdating ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}