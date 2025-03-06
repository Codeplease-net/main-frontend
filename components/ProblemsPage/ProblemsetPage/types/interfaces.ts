export interface Category {
    code: string;
    name: string;
}
  
export interface Problem {
    id: string;
    displayTitle: any;
    categories: string[];
    difficulty: number;
    status?: string;
}
  
export interface ProblemFilters {
    search?: string;
    categories?: string[];
    page?: number;
    limit?: number;
}
  