"use client"
import React, { Suspense } from "react"
import Footer from '@/components/footer';
import DotsLoader from "@/components/PlaygroundPage/DotsLoader";
import { useRouter } from "@/i18n/routing";
import { CheckCircle2, Circle, ArrowUpDown, Search, Tag, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import PaginationBar from "./Pagination";
import getProblems from "./GetProblems";
import { useTranslations } from "next-intl";
import DifficultyBox from "../ui/difficulty";
import CategoryBadge from "../ui/category";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface Problem {
  id: string;
  status: "completed" | "not-started";
  displayTitle: string;
  category: string;
  difficulty: number;
}

function ProblemSetTable({
    showedproblems
}: {
    showedproblems: Problem[]
}) {
  const t = useTranslations("Problems");

  return (
    <div className="relative rounded-xl overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/50 hover:bg-transparent">
          <TableHead className="w-12 font-medium text-muted-foreground">
            {t("Status")}
          </TableHead>
          <TableHead className="font-medium text-muted-foreground">{t("Title")}</TableHead>
          <TableHead className="hidden sm:table-cell font-medium text-muted-foreground">
            {t("Category")}
          </TableHead>
          <TableHead className="w-24 text-center font-medium text-muted-foreground">
            {t("Difficulty")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {showedproblems.map((problem) => (
          <TableRow
            key={problem.id}
            className="group border-b border-border/50 transition-colors hover:bg-muted/50"
          >
            <TableCell className="py-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {problem.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 transition-transform group-hover:scale-110" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-primary/70 group-hover:scale-110" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {problem.status === "completed" ? "Completed" : "Not Started"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="py-3">
              <Link 
                href={`/problems/${problem.id}`} 
                className="font-medium hover:text-primary transition-all hover:translate-x-0.5 inline-flex items-center gap-2"
              >
                {problem.displayTitle}
              </Link>
            </TableCell>

        <TableCell className="hidden sm:table-cell py-2.5">
          <CategoryBadge category={problem.category} />
        </TableCell>
        <TableCell className="text-center py-2.5">
          <DifficultyBox difficulty={problem.difficulty} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
        </div>
  );
}


export default function ProblemsPage({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) {
    const currentPage = Number(searchParams.page) || 1;
    const category = searchParams.category || '';
    const [problems, setProblems] = React.useState<Problem[]>([]);

    React.useEffect(() => {
        const fetchProblems = async () => {
          try {
            const result = await getProblems();
            if (!Array.isArray(result)) {
              throw new Error("Fetched data is not an array");
            }
            setProblems(result);
          } catch (err) {
            console.error(err);
          } finally {
          }
        };
        fetchProblems();
      }, []);
    

    return (
        <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-grow container mx-auto px-4">
            {/* Compact Header */}
            <div className="py-3 flex items-center justify-between border-b">
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                        Problem Collection
                    </h1>
                </div>
                {/* Add search/filter components here */}
            </div>

            <Suspense fallback={
                <div className="flex items-center justify-center h-20">
                    <DotsLoader size={6} />
                </div>
            }>
                <div className="mt-2">
                    <ProblemSetTable showedproblems={problems}/>
                </div>
            </Suspense>
        </main>
        <Footer />
    </div>
    )
}