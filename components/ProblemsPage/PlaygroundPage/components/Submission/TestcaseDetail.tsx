import React from "react";
import { useTranslations } from "next-intl";
import { TestCase } from "@/components/ProblemsPage/PlaygroundPage/utils/types";
import { countAccepted } from "@/components/ProblemsPage/PlaygroundPage/utils/formatters";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Check,
  X,
  Clock,
  MemoryStick,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { abbreviationToFull } from "@/components/ProblemsPage/PlaygroundPage/utils/constants";

interface TestResultsProps {
  testCases: TestCase[];
}

export default function TestcaseDetail({ testCases }: TestResultsProps) {
  const t = useTranslations("Playground");
  const t2 = useTranslations("Playground.status");
  const passedTests = countAccepted(testCases);
  const totalTests = testCases?.length || 0;
  const allPassed = passedTests === totalTests && totalTests > 0;

  // Using semantic colors that align with the theme
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AC":
        return "bg-emerald-100/60 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "WA":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground";
      case "TLE":
        return "bg-amber-100/60 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "MLE":
        return "bg-orange-100/60 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "CE":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground";
      case "RTE":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground";
      default:
        return "bg-secondary/60 text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AC":
        return <Check className="h-3.5 w-3.5" />;
      case "WA":
        return <X className="h-3.5 w-3.5" />;
      case "TLE":
        return <Clock className="h-3.5 w-3.5" />;
      case "MLE":
        return <MemoryStick className="h-3.5 w-3.5" />;
      case "CE":
        return <AlertCircle className="h-3.5 w-3.5" />;
      case "RTE":
        return <AlertTriangle className="h-3.5 w-3.5" />;
      default:
        return <HelpCircle className="h-3.5 w-3.5" />;
    }
  };

  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="px-5 py-4 flex flex-row items-center justify-between space-y-0 bg-card">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base font-medium">
            {t("testCases")}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`px-2.5 py-0.5 text-xs font-medium ${
              allPassed
                ? "bg-emerald-100/60 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-amber-100/60 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            }`}
          >
            {passedTests}/{totalTests} {t("passed")}
          </Badge>
        </div>
        
        <Badge
          variant={allPassed ? "default" : "outline"}
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            allPassed
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground border-border hover:border-border/80 hover:bg-accent/50"
          }`}
        >
          {allPassed ? (
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3" /> {t("allPassed")}
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" /> {t("someFailed")}
            </span>
          )}
        </Badge>
      </CardHeader>
      
      <CardContent className="px-0 pb-0 pt-0">
        <div className="overflow-auto max-h-[350px] scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 dark:bg-muted/10 dark:hover:bg-muted/10">
                <TableHead className="w-12 text-xs font-semibold text-muted-foreground sticky top-0 bg-inherit z-10 pl-5">
                  #
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground sticky top-0 bg-inherit z-10">
                  {t("status")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right sticky top-0 bg-inherit z-10">
                  {t("time")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right sticky top-0 bg-inherit z-10 pr-5">
                  {t("memory")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testCases?.map((testCase, index) => (
                <TableRow
                  key={index}
                  className="border-b border-border/40 hover:bg-muted/20 dark:hover:bg-muted/5 transition-colors"
                >
                  <TableCell className="pl-5 py-3 font-medium text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md ${getStatusColor(
                        testCase.result
                      )}`}
                    >
                      {getStatusIcon(testCase.result)}
                      <span className="text-xs font-medium">
                        {t2(abbreviationToFull[testCase.result as keyof typeof abbreviationToFull]) || 
                         testCase.result}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right font-mono text-xs text-muted-foreground">
                    {testCase.time_used !== undefined
                      ? `${testCase.time_used} ms`
                      : "—"}
                  </TableCell>
                  <TableCell className="py-3 pr-5 text-right font-mono text-xs text-muted-foreground">
                    {testCase.memory_used !== undefined
                      ? `${(testCase.memory_used / 1024).toFixed(1)} KB`
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {!testCases?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {t("noTestCasesAvailable")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}