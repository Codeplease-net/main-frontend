import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { categories } from "../utils/categories";
import { useTranslations } from "next-intl";

// Update the Categories Section in the aside element
export const CategorySection = ({
  selectedCategories,
  handleCategoriesChange,
  categoryTitle,
}: {
  selectedCategories: string[];
  handleCategoriesChange: (categories: string[]) => void;
  categoryTitle?: string; // Optional prop for internationalized title
}) => {
  const t = useTranslations("Problems");
  const [selectedCategoriesInside, setSelectedCategoriesInside] =
    useState<string[]>(selectedCategories);

  // Update internal state when prop changes
  useEffect(() => {
    setSelectedCategoriesInside(selectedCategories);
  }, [selectedCategories]);

  // Track if a particular category is selected
  const isCategorySelected = (categoryCode: string) =>
    selectedCategoriesInside.includes(categoryCode);

  // Handle category selection/deselection
  const handleCategoryClick = (categoryCode: string) => {
    const newCategories = isCategorySelected(categoryCode)
      ? selectedCategoriesInside.filter((code) => code !== categoryCode)
      : [...selectedCategoriesInside, categoryCode];

    setSelectedCategoriesInside(newCategories); // Update internal state first
    handleCategoriesChange(newCategories); // Then notify parent
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {categoryTitle || t("categoriesTitle")}
        </h3>
        {selectedCategoriesInside.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategoriesInside([]); // Update internal state
              handleCategoriesChange([]); // Notify parent
            }}
            className="h-6 px-2 text-xs"
          >
            {t("clearAll")}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories().map((category) => (
          <TooltipProvider key={category.code}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    selectedCategoriesInside.includes(category.code)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryClick(category.code)}
                  className={cn(
                    "h-7 px-3 text-xs font-medium rounded-sm",
                    "transition-all duration-200",
                    selectedCategoriesInside.includes(category.code)
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:bg-muted"
                  )}
                >
                  <Tag className="mr-1.5 h-3 w-3" />
                  {category.name}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {t("filterByCategory", { category: category.name })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      {selectedCategoriesInside.length > 0 && (
        <div className="text-xs text-muted-foreground pt-1">
          {t("selectedCategories", { count: selectedCategoriesInside.length })}
        </div>
      )}
    </div>
  );
};