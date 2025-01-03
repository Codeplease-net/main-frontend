"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProblemDescription from '@/components/PlaygroundPage/DescriptionBoard';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import CodeEditor from '@/components/PlaygroundPage/CodeEditor';
import { Suspense, useEffect, useState } from 'react';
import Login from "@/components/login";
import SubmissionDetail from "@/components/ui/SubmissionDetail";
import { Undo2 } from 'lucide-react';
import { SubmissionDetailProps } from "./Props";
import { useLocale } from "next-intl";
import { fetchProblemById } from "./GetProblemById";

interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: number;
  acceptance: number;
  status: string;
  description: string;
  solution: string;
}

interface submissionProps{
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

const initialsubmissions = [
  { id: 1, date: '2021-10-01', status: 'Accepted', code: 'console.log("Hello, World!");', passedTestcase: 6, totalTestcase: 6, runtime: "105ms", memory: "48.0MB", language: "Javascript" },
  { id: 2, date: '2021-10-02', status: 'Wrong Answer', code: 'console.log("This is a failed submission");', passedTestcase: 2, totalTestcase: 6, runtime: "N/A", memory: "N/A", language: "Javascript" },
  { id: 3, date: '2021-10-03', status: 'Accepted', code: 'function sum(a, b) { return a + b; }', passedTestcase: 6, totalTestcase: 6, runtime: "99ms", memory: "48.1MB", language: "Javascript" },
  { id: 4, date: '2021-10-04', status: 'Compile Error', code: 'function multiply(a, b) { return a * b; // Missing closing brace', passedTestcase: 0, totalTestcase: 6, runtime: "N/A", memory: "N/A", language: "Python"  },
]

const moreInitialSubmissions = [
  { id: 1, date: '2021-10-01', status: 'Accepted', code: 'console.log("Hello, World!");' , passedTestcase: 6, totalTestcase: 6, runtime: "105ms", memory: "48.0MB", language: "Javascript" },
  { id: 2, date: '2021-10-02', status: 'Wrong Answer', code: 'console.log("This is a failed submission");' , passedTestcase: 2, totalTestcase: 6, runtime: "N/A", memory: "N/A", language: "Javascript" },
  { id: 3, date: '2021-10-03', status: 'Accepted', code: 'function sum(a, b) { return a + b; }', passedTestcase: 6, totalTestcase: 6, runtime: "99ms", memory: "48.1MB", language: "Javascript" },
  { id: 4, date: '2021-10-04', status: 'Compile Error', code: 'function multiply(a, b) { return a * b; // Missing closing brace', passedTestcase: 0, totalTestcase: 6, runtime: "N/A", memory: "N/A", language: "Python"  },
  { id: 5, date: '2024-10-04', status: 'Compile Error', code: 'function ', passedTestcase: 0, totalTestcase: 6, runtime: "N/A", memory: "N/A", language: "Python"  },
]

export default function PlaygroundPage( {id}: {id: string} ) {
  const [selectedTab, onTabChange] = useState<string>('description');
  const [userSubmissions, setUserSubmissions] = useState(initialsubmissions);
  const [allSubmissions, setAllSubmissions] = useState(moreInitialSubmissions);
  const [displaySubmission, setDisplaySubmission] = useState<submissionProps>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fullscreen, setFullscreen] = useState(0);
  const locale = useLocale();
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const submitCode = async (code: string) => {
    if (user) {
      // Submit code to server
      const submission = {
        id: Math.random(),
        date: new Date().toISOString(),
        status: 'Accepted',
        code: code,
        passedTestcase: 0,
        totalTestcase: 6,
        runtime: '20ms',
        memory: '48MB',
        language: 'javascript',
      };
      setUserSubmissions([...userSubmissions, submission]);
      setAllSubmissions([...allSubmissions, submission]);
      setDisplaySubmission(submission);
      onTabChange('submissions');
    } else {
      setIsLoginVisible(true);
    }
  }

  const toggleLoginVisibility = () => {
    setIsLoginVisible(!isLoginVisible);
  };
  
  const onclickFullscreen = (e: number) => {
    if (fullscreen === e) {
      setFullscreen(0);
      return;
    }
    setFullscreen(e);
  };

  const onClickSubmission = (e: SubmissionDetailProps) => {
    setFullscreen(0);
    setDisplaySubmission(e);
  }

  useEffect(() => {
    const fetchproblems = async () => {
      try {
                
        const startTime = performance.now()
        const result = await fetchProblemById(id);
        if (!result) {
          throw new Error("Fetched data is not an array");
        }
        const problem = {
          id,
          category: result.category,
          difficulty: result.difficulty,
          acceptance: result.acceptance,
          status: result.status,
          title: result.title[locale],
          description: result.description[locale],
          solution: result.solution[locale],
        };
        setProblem(problem);
        const endTime = performance.now()
          console.log(`Took data from firebase took ${endTime - startTime} milliseconds`)
      } catch (err) {
        console.error(err);
        return;
      }
    };
    fetchproblems();
  }, [id]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getPanelStyle = (panelNumber: number) => {
    if (fullscreen === 0) return {};
    return { flexGrow: fullscreen === panelNumber ? 1 : 0, flexBasis: fullscreen === panelNumber ? '100%' : '0%' };
  };

  return (
    <div style={{ height: '90.5vh' }}>
      <ResizablePanelGroup
        direction={isMobile ? 'vertical' : 'horizontal'}
        className="h-full w-full"
      >
        {/* Problem Description Panel */}
        <ResizablePanel defaultSize={50} style={getPanelStyle(1)} className='p-2'>
          <Suspense fallback={<div>Loading...</div>}>
            <ProblemDescription
              title={problem?.title || ''}
              difficulty={problem?.difficulty || 1}
              description={problem?.description || ''}
              category={problem?.category || ''}
              solutionDescription={problem?.solution || ''}
              acceptance={problem?.acceptance || 0}
              mySubmissions={userSubmissions}
              allSubmissions={allSubmissions}
              selectedTab={selectedTab}
              onclickFullscreen={onclickFullscreen}
              onSubmissionClick={onClickSubmission}
              onTabChange={onTabChange}
            />
          </Suspense>
        </ResizablePanel>

        {/* Divider Handle */}
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}  style={getPanelStyle(2)} >
          <div className="w-full h-full m-2">
            {  displaySubmission ?
              <div>
                <div className="cursor-pointer ml-6 mt-4 -mb-2 hover:text-white/80" onClick={() => (setDisplaySubmission(undefined))}>
                  <div>⬅ Code Editor</div>
                </div>
                <SubmissionDetail 
                  id={displaySubmission.id}
                  date={displaySubmission.date}
                  status={displaySubmission.status}
                  code={displaySubmission.code}
                  passedTestcase={displaySubmission.passedTestcase}
                  totalTestcase={displaySubmission.totalTestcase}
                  runtime={displaySubmission.runtime}
                  memory={displaySubmission.memory}
                  language={displaySubmission.language}
                  /> 
              </div>
                : 
                /* Code Editor Panel */
                <CodeEditor
                  submitCode={submitCode}
                  onclickFullscreen={onclickFullscreen}/>
                }
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {isLoginVisible && <Login onClose={toggleLoginVisibility} redirectDes={`/problems/playground/${id}`} />}
    </div>
  );
}