"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, X } from "lucide-react";
import axios from "axios";
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
import { getAuth } from "firebase/auth";

// Define submission status interface with the correct result types from the API
interface SubmissionStatus {
  id: string;
  result: 'AC' | 'WA' | 'TLE' | 'MLE' | 'CE' | 'RTE' | 'IQ';
  lastSubmission: Date | null;
}

export function ProblemSetTable({ showedproblems }: { showedproblems: Problem[] }) {
  const t = useTranslations("Problems");
  const user = getAuth().currentUser;
  const [problemStatuses, setProblemStatuses] = useState<{[key: string]: SubmissionStatus}>({});
  const [isLoading, setIsLoading] = useState(true);

  const getCategoryName = (categoryCode: string) => {
    const category = categories().find(c => c.code === categoryCode);
    return category ? category.name : categoryCode;
  };

  // Fetch submission status for the current user
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const form = new FormData();
        form.append("start", "1");
        form.append("end", "100000");
        form.append("user", user.uid);
        
        // Only request problems that are being displayed
        if (showedproblems.length > 0) {
          const problemIds = showedproblems.map(p => p.id).join(',');
          form.append("problems", problemIds);
        }
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/database/list_from_start_to_end`,
          form
        );
        
        // Process submissions and create a status map for each problem
        const statusMap: {[key: string]: SubmissionStatus} = {};
        
        // Group submissions by problem ID and sort by date (newest first)
        const submissionsByProblem: {[key: string]: any[]} = {};
        
        response.data.forEach((submission: any) => {
          const problemId = submission.problem;
          if (!submissionsByProblem[problemId]) {
            submissionsByProblem[problemId] = [];
          }
          submissionsByProblem[problemId].push(submission);
        });
        
        // Sort submissions for each problem by date (newest first)
        Object.keys(submissionsByProblem).forEach(problemId => {
          submissionsByProblem[problemId].sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          // Check if any submission is AC (Accepted)
          const hasAccepted = submissionsByProblem[problemId].some(
            (sub: any) => sub.result === "AC"
          );
          
          if (hasAccepted) {
            // If there's an accepted solution, use that
            statusMap[problemId] = {
              id: problemId,
              result: 'AC',
              lastSubmission: new Date(submissionsByProblem[problemId][0].created_at)
            };
          } else {
            // Otherwise use the latest submission result
            const latestSubmission = submissionsByProblem[problemId][0];
            statusMap[problemId] = {
              id: problemId,
              result: latestSubmission.result as any, // Cast to the enum type
              lastSubmission: new Date(latestSubmission.created_at)
            };
          }
        });
        
        setProblemStatuses(statusMap);
      } catch (error) {
        console.error("Error fetching submission status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, showedproblems]);

  // Render status icon based on submission status
  const renderStatusIcon = (problemId: string) => {
    const status = problemStatuses[problemId];
    
    if (isLoading) {
      return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />;
    }
    
    if (!status) {
      return null; // No submission yet
    }
    
    switch (status.result) {
      case 'AC':
        return (
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
        );
      case 'WA':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <X className="h-5 w-5 text-red-500 transition-transform group-hover:scale-110" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-medium">{t("incorrectSolution")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'TLE':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Clock className="h-5 w-5 text-amber-500 transition-transform group-hover:scale-110" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-medium">{t("timeLimitExceeded")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      // Add other status types as needed
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <X className="h-5 w-5 text-red-500 transition-transform group-hover:scale-110" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-medium">{t("submissionFailed")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
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
                className={cn(
                  "group transition-colors", 
                  "hover:bg-muted/50",
                  problemStatuses[problem.id]?.result === 'AC' && "bg-emerald-50/30 dark:bg-emerald-950/10"
                )}
              >
                <TableCell className="py-3 border-r border-border text-center">
                  {renderStatusIcon(problem.id)}
                </TableCell>
                <TableCell className="py-3 border-r border-border">
                  <Link
                    href={`/problems/${problem.id}`}
                    className={cn(
                      "font-medium transition-all",
                      "hover:text-primary hover:translate-x-0.5",
                      "inline-flex items-center gap-2",
                      problemStatuses[problem.id]?.result === 'AC' && "text-emerald-600 dark:text-emerald-400"
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