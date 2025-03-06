export interface TestCase {
    result: string;
    time_used: number;
    memory_used: number;
    status?: string;
    categories: string[]
  }
  
  export interface SubmissionDetailProps {
    _id: string;
    language: string;
    test_cases: TestCase[];
    result: string;
    timestamp: number;
    user: string;
    source: string;
    error_log?: string;
    id?: string;
    problem: string;
  }
  
  export interface Problem {
    id: string;
    title: string;
    categories: string[];
    difficulty: number;
    acceptance: number;
    description: string;
    solution: string;
  }
  
  export interface FormattedDescriptionProps {
    content: string;
    title: string;
    difficulty: number;
    categories: string[];
  }
  
  export interface FormattedSolutionProps {
    content: string;
  }
  
  export interface SubmissionsTabProps {
    displaySubmission: string | undefined;
    onSubmissionClick: (submissionId: string) => void;
  }
  
  export interface ProblemDescriptionProps {
    title: string;
    difficulty: number;
    description: string;
    categories: string[];
    selectedTab: string;
    solutionDescription: string;
    displaySubmission: string | undefined;
    onSubmissionClick: (submission: SubmissionDetailProps) => void;
    onTabChange: (e: string) => void;
  }