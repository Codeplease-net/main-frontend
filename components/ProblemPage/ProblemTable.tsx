"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import { CheckCircle2, Circle, ArrowUpDown } from "lucide-react";
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

interface Problem {
  id: string;
  status: "completed" | "not-started";
  displayTitle: string;
  category: string;
  difficulty: number;
  acceptance: number;
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
        return;
      }
    };
    fetchProblems();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState(category);
  const [sortedBy, setSortedBy] = React.useState("");
  const [showedproblems, setShowedProblems] = React.useState<Problem[]>([]);
  const page = currentPage;
  const NUMBER_OF_PROBLEMS = 15;

  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>): void => {
    router.push(`/problems/playground/${e.currentTarget.id}`);
  };
  React.useEffect(() => {
    if (problems.length === 0) return;

    // Filter problems based on search term and category
    const filteredProblems = problems.filter((problem) => {
      const matchesTitle = problem.displayTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = searchCategory
        .split(",")
        .some((eachCategory) =>
          problem.category?.toLowerCase().includes(eachCategory.toLowerCase())
        );
      return matchesTitle && matchesCategory;
    });

    // Sort problems based on selected criteria
    const sortedProblems = filteredProblems.sort((a, b) => {
      if (sortedBy === "difficulty down") {
        return a.difficulty - b.difficulty;
      }
      if (sortedBy === "difficulty up") {
        return b.difficulty - a.difficulty;
      }
      if (sortedBy === "acceptance down") {
        return a.acceptance - b.acceptance;
      }
      if (sortedBy === "acceptance up") {
        return b.acceptance - a.acceptance;
      }
      return 0;
    });

    // Paginate the filtered and sorted problems
    const paginatedProblems = sortedProblems.slice(
      (page - 1) * NUMBER_OF_PROBLEMS,
      page * NUMBER_OF_PROBLEMS
    );

    setShowedProblems(paginatedProblems);
  }, [
    searchTerm,
    searchCategory,
    sortedBy,
    page,
    problems,
    NUMBER_OF_PROBLEMS,
  ]);

  return (
    <Card className="w-full space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Problem Set")}</h1>
        <div className="flex space-x-4">
          <Input
            type="search"
            placeholder={t("Search problems")}
            className="w-3/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="search"
            placeholder={t("Search category")}
            className="w-3/5"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[70px]">
                <div className="ml-1">{t("Status")}</div>
              </TableHead>
              <TableHead>{t("Title")}</TableHead>
              <TableHead>{t("Category")}</TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() =>
                    sortedBy === "difficulty up"
                      ? setSortedBy("difficulty down")
                      : setSortedBy("difficulty up")
                  }
                  className="gap-1"
                >
                  {t("Difficulty")}
                  <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() =>
                    sortedBy === "acceptance up"
                      ? setSortedBy("acceptance down")
                      : setSortedBy("acceptance up")
                  }
                  className="gap-1"
                >
                  {t("Acceptance")}
                  <ArrowUpDown className="font-normal" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showedproblems.map((problem, index) => (
              <TableRow
                id={problem.id}
                key={index}
                className={`cursor-pointer`}
                onClick={handleClick}
              >
                <TableCell>
                  {problem.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 ml-3.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground ml-3.5" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{problem.displayTitle}</TableCell>
                <TableCell>
                  <CategoryBadge category={problem.category}/>
                </TableCell>
                <TableCell className="text-center">
                  <DifficultyBox difficulty={problem.difficulty}/>
                </TableCell>
                <TableCell className="text-center">
                  {(problem.acceptance != undefined && problem.acceptance > 0)
                    ? `${problem.acceptance.toFixed(1)} %`
                    : <NewBox/>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationBar
        currentPage={page}
        maxPages={Math.ceil(problems.length / NUMBER_OF_PROBLEMS)}
      />
    </Card>
  );
}
