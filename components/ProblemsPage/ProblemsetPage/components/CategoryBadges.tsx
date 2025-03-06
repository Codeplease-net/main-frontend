import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium",
        "bg-primary/10 text-primary",
        "transition-colors hover:bg-primary/20"
      )}
    >
      <Tag className="mr-1 h-3 w-3" />
      {category}
    </span>
  );
}