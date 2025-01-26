"use client";

import * as React from "react";
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
import NewBox from "../ui/newBox";
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

export default function ProblemSetTable({
  currentPage,
  category,
}: {
  currentPage: number;
  category: string;
}) {
  const t = useTranslations("Problems");
  const [problems, setProblems] = React.useState<Problem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const result = await getProblems();
        if (!Array.isArray(result)) {
          throw new Error("Fetched data is not an array");
        }
        setProblems(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState(category);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "up" | "down" | null;
  }>({ key: "", direction: null });
  const [showedproblems, setShowedProblems] = React.useState<Problem[]>([]);
  const page = currentPage;
  const NUMBER_OF_PROBLEMS = 10;

  const router = useRouter();

  const handleSort = (key: string) => {
    let direction: "up" | "down" = "up";
    if (sortConfig.key === key && sortConfig.direction === "up") {
      direction = "down";
    }
    setSortConfig({ key, direction });
  };

  React.useEffect(() => {
    if (problems.length === 0) return;

    let filteredProblems = problems.filter((problem) => {
      const matchesTitle = problem.displayTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = !searchCategory || searchCategory
        .split(",")
        .some((cat) => problem.category?.toLowerCase().includes(cat.trim().toLowerCase()));
      return matchesTitle && matchesCategory;
    });

    if (sortConfig.key && sortConfig.direction) {
      filteredProblems.sort((a, b) => {
        const multiplier = sortConfig.direction === "up" ? 1 : -1;
        if (sortConfig.key === "difficulty") {
          return (a.difficulty - b.difficulty) * multiplier;
        }
        if (sortConfig.key === "acceptance") {
          return (a.acceptance - b.acceptance) * multiplier;
        }
        return 0;
      });
    }

    const paginatedProblems = filteredProblems.slice(
      (page - 1) * NUMBER_OF_PROBLEMS,
      page * NUMBER_OF_PROBLEMS
    );

    setShowedProblems(paginatedProblems);
  }, [searchTerm, searchCategory, sortConfig, page, problems]);

  return (
    <TooltipProvider>
      <Card className="w-full space-y-4 p-4 md:p-8 shadow-lg backdrop-blur-sm bg-background/80 border-2 hover:border-primary/50 transition-all duration-300">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                {t("Problem Set")}
              </h1>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  {t("StartSolvingProblems")}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1 min-w-0 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-hover:text-primary" />
              <Input
                type="search"
                placeholder={t("Search problems")}
                className="pl-10 w-full transition-all border-2 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex-1 min-w-0 group">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-hover:text-primary" />
              <Input
                type="search"
                placeholder={t("Search category")}
                className="pl-10 w-full transition-all border-2 focus:border-primary"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-2 rounded-xl overflow-x-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px] md:w-[70px]">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="ml-1 cursor-help text-sm md:text-base">{t("Status")}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("Problem completion status")}
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-sm md:text-base">{t("Title")}</TableHead>
                <TableHead className="text-sm md:text-base hidden sm:table-cell">{t("Category")}</TableHead>
                <TableHead className="text-center text-sm md:text-base">
                  <Button 
                    variant="ghost"
                    onClick={() => handleSort("difficulty")}
                    className="gap-1 hover:bg-muted transition-colors p-1 md:p-2"
                  >
                    {t("Difficulty")}
                    <ArrowUpDown className={`h-3 w-3 md:h-4 md:w-4 transition-colors ${
                      sortConfig.key === "difficulty" ? "text-primary" : ""
                    }`} />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {showedproblems.map((problem, index) => (
                  <motion.tr
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50 transition-all group text-sm md:text-base"
                  >
                    <TableCell>
                      {problem.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500 ml-2 md:ml-3.5" />
                      ) : (
                        <Circle className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground ml-2 md:ml-3.5 group-hover:text-primary transition-colors" />
                      )}
                    </TableCell>
                    <TableCell>
                                            <Link 
                                              href={`/problems/${problem.id}`} 
                                              className="group-hover:text-primary hover:underline font-medium"
                                            >
                                              {problem.displayTitle}
                                            </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <CategoryBadge category={problem.category} />
                    </TableCell>
                    <TableCell className="text-center">
                      <DifficultyBox difficulty={problem.difficulty} />
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        <PaginationBar
          currentPage={page}
          maxPages={Math.ceil(problems.length / NUMBER_OF_PROBLEMS)}
        />
      </Card>
    </TooltipProvider>
  );
}
