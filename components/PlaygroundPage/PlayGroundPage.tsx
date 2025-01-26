"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProblemDescription from "@/components/PlaygroundPage/DescriptionBoard";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import CodeEditor from "@/components/PlaygroundPage/CodeEditor";
import { Suspense, useEffect, useState } from "react";
import Login from "@/components/login";
import { useLocale } from "next-intl";
import { fetchProblemById } from "./GetProblemById";
import { WaitingModal } from "../ui/modal";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/api/Readfirebase";
import { motion, AnimatePresence } from "framer-motion";
import DotsLoader from "./DotsLoader";
import Submission from "./Submission";

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

interface SubmissionDetailProps {
  id: string;
  user_handle: string;
  status: string;
  runtime: string;
  memory: string;
  language: string;
  createdAt: string;
}

export default function PlaygroundPage({ id }: { id: string }) {
  const [selectedTab, onTabChange] = useState<string>("description");
  const [displaySubmission, setDisplaySubmission] = useState<number | undefined>(undefined);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fullscreen, setFullscreen] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const toggleLoginVisibility = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const onClickSubmission = (submissionId: number) => {
    setDisplaySubmission(submissionId);
  };

  const fetchProblems = async () => {
    try {
      const result = await fetchProblemById(id);
      if (!result) {
        throw new Error("Problem not found");
      }

      setProblem({
        id,
        category: result.category,
        difficulty: result.difficulty,
        acceptance: result.acceptance,
        status: result.status,
        title: result.title[locale],
        description: result.description[locale],
        solution: result.solution[locale],
      });
      setWaiting(false);
    } catch (err) {
      console.error("Error fetching problem:", err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [id, locale]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPanelStyle = (panelNumber: number) => {
    if (fullscreen === 0) return {};
    return {
      flexGrow: fullscreen === panelNumber ? 1 : 0,
      flexBasis: fullscreen === panelNumber ? "100%" : "0%",
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-5rem-1px)] flex-1"
    >
      <WaitingModal isOpen={waiting} />
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="h-full w-full"
      >
        <ResizablePanel defaultSize={50} style={getPanelStyle(1)}>
          <Suspense fallback={
            <div className="flex justify-center items-center h-full">
              <DotsLoader size={12} />
            </div>
          }>
            <ProblemDescription
              title={problem?.title || ""}
              difficulty={problem?.difficulty || 1}
              description={problem?.description || ""}
              category={problem?.category || ""}
              solutionDescription={problem?.solution || ""}
              selectedTab={selectedTab}
              onSubmissionClick={onClickSubmission}
              onTabChange={onTabChange}
              displaySubmission={displaySubmission}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} style={getPanelStyle(2)}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={displaySubmission ? 'submission' : 'editor'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {displaySubmission ? (
                <Submission
                  displaySubmission={displaySubmission}
                  setDisplaySubmission={setDisplaySubmission}
                />
              ) : (
                <CodeEditor onTabChange={onTabChange} setDisplaySubmission={setDisplaySubmission} />
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <AnimatePresence>
        {isLoginVisible && (
          <Login
            onClose={toggleLoginVisibility}
            redirectDes={`/problems/playground/${id}`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
