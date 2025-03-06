"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import DifficultyBox from "../../../ui/difficulty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadges";
import { Problem } from "../types/interfaces";
import { categories } from "../utils/categories";

export function ProblemSetTable({ showedproblems }: { showedproblems: Problem[] }) {
  const t = useTranslations("Problems");

  const getCategoryName = (categoryCode: string) => {
    const category = categories().find(c => c.code === categoryCode);
    return category ? category.name : categoryCode;
  };

  return (
    <div className="relative">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-12 font-medium bg-card border-r relative text-center">
              {t("statusColumn")}
            </TableHead>
            <TableHead className="font-medium bg-card border-r relative">
              {t("titleColumn")}
            </TableHead>
            <TableHead className="hidden sm:table-cell font-medium bg-card border-r px-4 relative">
              {t("categoryColumn")}
            </TableHead>
            <TableHead className="w-16 text-center font-medium bg-card">
              {t("difficultyColumn")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showedproblems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <p className="text-sm">{t("noProblemsFound")}</p>
                  <p className="text-xs mt-1">{t("tryAdjustingFilters")}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            showedproblems.map((problem, index) => (
              <TableRow
                key={problem.id}
                className={cn("group transition-colors", "hover:bg-muted/50")}
              >
                <TableCell className="py-3 border-r border-border text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 transition-transform group-hover:scale-110" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs font-medium">{t("solvedProblem")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-3 border-r border-border">
                  <Link
                    href={`/problems/${problem.id}`}
                    className={cn(
                      "font-medium transition-all",
                      "hover:text-primary hover:translate-x-0.5",
                      "inline-flex items-center gap-2"
                    )}
                  >
                    {problem.displayTitle}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2.5 border-r border-border">
                  <div className="flex flex-wrap gap-1">
                    {problem.categories.map((category, idx) => (
                      <CategoryBadge
                        key={`${problem.id}-${category}-${idx}`}
                        category={getCategoryName(category)}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center py-2.5 border-border">
                  <DifficultyBox difficulty={problem.difficulty} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}