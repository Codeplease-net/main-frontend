"use client";
import React from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { CategorySection } from "./components/CategorySection";
import { ProblemSetTable } from "./components/ProblemSetTable";
import { Pagination } from "./components/Pagination";
import { useProblems } from "./hooks/problems";
import { useFilters } from "./hooks/filters";
import { useTranslations } from 'next-intl';

const ITEMS_PER_PAGE = 20;

export default function ProblemsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const t = useTranslations('Problems');
  
  const {
    searchTerm,
    selectedCategories,
    currentPage,
    handleSearch,
    handleSearchKeyDown,
    handleCategoriesChange,
    handlePageChange,
  } = useFilters({ searchParams });

  const { problems, totalProblems, isLoading, fetchProblems } =
    useProblems(ITEMS_PER_PAGE);

  const [isPanelOpen, setIsPanelOpen] = React.useState(true);

  // Fetch problems when filters change
  React.useEffect(() => {
    fetchProblems({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchParams.search,
      categories: searchParams.categories?.split(","),
    });
  }, [fetchProblems, currentPage, searchParams]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t('title')}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Problem Table Card */}
          <div className="border bg-card shadow-sm">
            <div className="flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {t('loading')}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto">
                    <ProblemSetTable showedproblems={problems} />
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalProblems / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={cn(
          "fixed right-0 top-6 z-20",
          "h-10 w-10 flex items-center justify-center",
          "bg-primary text-primary-foreground rounded-l-lg",
          "transition-transform duration-300",
          isPanelOpen && "translate-x-[320px]"
        )}
        aria-label={isPanelOpen ? t('closeSidebar') : t('openSidebar')}
      >
        {isPanelOpen ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      {/* Enhanced Search Panel */}
      <aside className="w-[320px] border-l bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="p-6 space-y-6 h-screen overflow-auto">
          <div className="space-y-4">
            {/* Search Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('searchLabel')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            {/* Categories Section */}
            {CategorySection({ 
              selectedCategories, 
              handleCategoriesChange,
            })}

            {/* Problems Count Section */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t('problemsCount')}:</label>
              <div className="text-sm font-bold">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  totalProblems.toLocaleString()
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}