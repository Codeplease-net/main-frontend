export interface SubmissionDetailProps {
    id: number;
    date: string;
    status: string;
    code: string;
    passedTestcase: number;
    totalTestcase: number;
    runtime: string;
    memory: string;
    language: string;
  }

export interface TestCase {
    index: number
    status: "AC" | "WA" | "TLE" | "MLE" | "CE" | "RTE" // Changed status types to match DB values
    time_taken: number
    memory_taken: number
    input?: string
    expectedOutput?: string
    actualOutput?: string
  }
  
export  interface TestResultsProps {
    testCases: TestCase[]
  }