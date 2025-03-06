"use client"
import React, { useState, useEffect } from "react";
import getProblems from "./api/problemApi";
import { Book, Users, Search, Plus, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OwnerFilter from "./components/OwnerFilter";
import ProblemSetTable from "./components/ProblemSetTable";
import { useRouter } from "next/navigation";
import { NewProblemForm } from "./components/NewProblemForm";
import { Skeleton } from "@/components/ui/skeleton";

interface Problem {
  id: string;
  owner: string;
  createdAt: number;
  numberOfTestCases: number;
  availableLanguages: string[];
  displayTitle?: string;
}
export default function ProblemsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const [isLoading, setIsLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [allOwners, setAllOwners] = useState<string[]>([]);
  
  // Pagination
  const pageSize = 10;
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  
  // Filters
  const selectedOwners = searchParams.owners
    ? searchParams.owners.split(",")
    : [];

  // Update owner filter handler
  const handleOwnerFilter = (owners: string[]) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    
    if (owners.length > 0) {
      params.set("owners", owners.join(","));
    } else {
      params.delete("owners");
    }
    
    // Reset to first page when changing filters
    params.set("page", "1");
    
    router.push(`?${params.toString()}`);
  };

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      // Pass filters and pagination params to getProblems
      const filters = {
        search: searchParams.search || "",
        owners: selectedOwners,
        page: currentPage,
        pageSize: pageSize
      };
      
      const result = await getProblems(filters);
      if (!result || typeof result !== 'object') {
        throw new Error("Fetched data is invalid");
      }

      setProblems(result.problems);
      setTotalProblems(result.total);
      setHasMore(result.hasMore);
      
      // Count unique owners from the total set (not just current page)
      if (result.allOwners) {
        setAllOwners(result.allOwners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [searchParams.search, searchParams.owners, searchParams.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams as Record<string, string>);
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    // Reset to first page when searching
    params.set("page", "1");
    
    router.push(`?${params.toString()}`);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (hasMore) {
      goToPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 bg-dot-pattern">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Problem Bank</h1>
              </div>
              <p className="text-muted-foreground">
                Design, manage and organize your competitive programming problems
              </p>
            </div>
            <NewProblemForm onSuccess={fetchProblems} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
          
          {/* Right Content - Problem List */}
          <div className="space-y-4 problem-table">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Problems</h2>
              <div className="text-sm text-muted-foreground">
                Showing {problems.length > 0 ? ((currentPage - 1) * pageSize + 1) + '-' + 
                  ((currentPage - 1) * pageSize + problems.length) : 0} of {totalProblems} problems
              </div>
            </div>
          
            <Card className=" bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading problems...</p>
                    </div>
                  </div>
                ) : (
                  <ProblemSetTable
                    showedproblems={problems}
                    onDelete={fetchProblems}
                  />
                )}
                
                {/* Pagination Controls */}
                {!isLoading && problems.length > 0 && (
                  <div className="flex items-center justify-between p-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={goToPreviousPage}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={goToNextPage}
                        disabled={!hasMore}
                      >
                        <span className="sr-only md:not-sr-only md:mr-2">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {!isLoading && problems.length === 0 && (
                  <div className="py-12 px-4 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Book className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No problems found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {searchTerm || selectedOwners.length > 0 
                        ? "Try adjusting your search criteria or filters" 
                        : "Start by adding your first problem to the bank"}
                    </p>
                    {searchTerm || selectedOwners.length > 0 ? (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("");
                          router.push("?");
                        }}
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <NewProblemForm onSuccess={fetchProblems}>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Problem
                        </Button>
                      </NewProblemForm>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Left Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Stats Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Overview
                  </h2>
                  {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-card/50 backdrop-blur-sm border hover:border-primary/50 transition-colors group">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground group-hover:text-foreground">
                        Total Problems
                        <Book className="h-4 w-4 text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      {isLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        <div className="text-2xl font-bold">{totalProblems}</div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 backdrop-blur-sm border hover:border-primary/50 transition-colors group">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground group-hover:text-foreground">
                        Contributors
                        <Users className="h-4 w-4 text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      {isLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        <div className="text-2xl font-bold">
                          {allOwners.length}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Filters Section */}
              <section className="space-y-4 bg-card/30 p-4 rounded-lg border">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Filters
                </h2>
                <div className="space-y-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search problems..."
                      className="pl-10 bg-background/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>
                  
                  <div className="pt-2 border-t">
                    <OwnerFilter
                      owners={allOwners}
                      selectedOwners={selectedOwners}
                      setSelectedOwners={handleOwnerFilter}
                    />
                  </div>
                  
                  {/* Active filters */}
                  {(selectedOwners.length > 0 || searchParams.search) && (
                    <div className="pt-3 border-t space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Active Filters:</div>
                      <div className="flex flex-wrap gap-2">
                        {searchParams.search && (
                          <Badge variant="secondary" className="group">
                            Search: {searchParams.search}
                            <button 
                              className="ml-1 text-muted-foreground group-hover:text-destructive"
                              onClick={() => {
                                setSearchTerm("");
                                const params = new URLSearchParams(searchParams as Record<string, string>);
                                params.delete("search");
                                params.set("page", "1");
                                router.push(`?${params.toString()}`);
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        )}
                        
                        {selectedOwners.map(owner => (
                          <Badge key={owner} variant="secondary" className="group">
                            Owner: {owner}
                            <button 
                              className="ml-1 text-muted-foreground group-hover:text-destructive"
                              onClick={() => {
                                handleOwnerFilter(selectedOwners.filter(o => o !== owner));
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-6 px-2 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setSearchTerm("");
                            router.push("?page=1");
                          }}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
              
              <div className="lg:hidden">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.scrollTo({top: document.querySelector('.problem-table')?.getBoundingClientRect().top || 0 + window.scrollY - 100, behavior: 'smooth'})}
                >
                  View Problems
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}