"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Code, Check, X, Clock, MemoryStick, AlertCircle, AlertTriangle, HelpCircle, ChevronDown, Calendar, HardDrive, Maximize2, Minimize2, XCircle } from "lucide-react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/api/Readfirebase";
import DotsLoader from "./DotsLoader";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { TestCase } from "./Tab/Props";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const abbreviationToFull = {
  "AC": "Accepted",
  "WA": "Wrong Answer", 
  "TLE": "Time Limit Exceeded",
  "RTE": "Runtime Error",
  "MLE": "Memory Limit Exceeded",
  "CE": "Compile Error"
} as const;

const langToMonacoLang = {
  "c++17": 'cpp'
} as const;

const FormalLang = {
  "c++17": "C++ 17"
} as const;

interface TestResultsProps {
  testCases: TestCase[];
}

interface SubmissionProps {
  id: number;
  createdAt: number;
  res: keyof typeof abbreviationToFull;
  source: string;
  test: TestCase[];
  lang: keyof typeof FormalLang;
}

interface SubmissionDetailProps {
  submission: SubmissionProps;
}

function countAccepted(tests: TestCase[]) {
  return tests.filter(test => test.status === "AC").length;
}

function getLocalTimeAndDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

function calculateTime(tests: TestCase[] | undefined): string {
  if (!tests) return "N/A";
  const timeTakenTests = tests.filter(test => test.time_taken !== undefined);
  if (timeTakenTests.length === 0) return "N/A";
  const maxTime = Math.max(...timeTakenTests.map(test => test.time_taken || 0));
  return `${maxTime} ms`;
}

function calculateMemory(tests: TestCase[] | undefined): string {
  if (!tests) return "N/A";
  const memoryTakenTests = tests.filter(test => test.memory_taken !== undefined);
  if (memoryTakenTests.length === 0) return "N/A";
  const maxMemory = Math.max(...memoryTakenTests.map(test => test.memory_taken || 0));
  return `${maxMemory} KB`;
}

function TestcaseDetail({ testCases }: TestResultsProps) {
  const t = useTranslations('Playground');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "AC":
        return "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20";
      case "WA":
        return "text-red-500 bg-red-500/10 dark:bg-red-500/20";
      case "TLE":
        return "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20";
      case "MLE":
        return "text-orange-500 bg-orange-500/10 dark:bg-orange-500/20";
      case "CE":
        return "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20";
      case "RTE":
        return "text-red-500 bg-red-500/10 dark:bg-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 dark:bg-gray-500/20";
    }    
  };

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "AC":
        return <Check className="h-4 w-4" />;
      case "WA":
        return <X className="h-4 w-4" />;
      case "TLE":
        return <Clock className="h-4 w-4" />;
      case "MLE":
        return <MemoryStick className="h-4 w-4" />;
      case "CE":
        return <AlertCircle className="h-4 w-4" />;
      case "RTE":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }  
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <Card className="w-full border border-border/50 shadow-xl bg-card backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {t('Test Cases')}
          </CardTitle>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Badge 
            className={`text-base px-6 py-2 rounded-full transition-all ${
              countAccepted(testCases) === testCases.length 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {countAccepted(testCases)}/{testCases.length}
            {countAccepted(testCases) === testCases.length ? (
              <Check className="ml-2 h-4 w-4" />
            ) : (
              <AlertTriangle className="ml-2 h-4 w-4" />
            )}
          </Badge>
        </motion.div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-12 font-bold sticky top-0 bg-muted">#</TableHead>
              <TableHead className="font-bold sticky top-0 bg-muted">{t('Status')}</TableHead>
              <TableHead className="text-right font-bold sticky top-0 bg-muted">{t('Time')}</TableHead>
              <TableHead className="text-right font-bold sticky top-0 bg-muted">{t('Memory')}</TableHead>
              <TableHead className="w-8 sticky top-0 bg-muted"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((testCase, index) => (
              <>
                <motion.tr
                  key={index}
                  initial={false}
                  animate={{ backgroundColor: expandedRow === index ? "var(--muted)" : "transparent" }}
                  whileHover={{ backgroundColor: "var(--muted)" }}
                  className="group cursor-pointer border-t border-border transition-colors"
                  onClick={() => toggleRow(index)}
                >
                  <TableCell className="font-semibold">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(testCase.status)}`}
                    >
                      {getStatusIcon(testCase.status)}
                      <span>{abbreviationToFull[testCase.status]}</span>
                    </motion.div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {testCase.time_taken !== undefined ? `${testCase.time_taken} ms` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {testCase.memory_taken !== undefined ? `${testCase.memory_taken} KB` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <motion.div
                      animate={{ rotate: expandedRow === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </TableCell>
                </motion.tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-muted/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Input:</h4>
                          <pre className="p-2 rounded bg-muted/70 overflow-x-auto">
                            {testCase.input || 'No input'}
                          </pre>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Expected Output:</h4>
                          <pre className="p-2 rounded bg-muted/70 overflow-x-auto">
                            {testCase.expectedOutput || 'No expected output'}
                          </pre>
                        </div>
                        {testCase.actualOutput && (
                          <div className="col-span-2 space-y-2">
                            <h4 className="font-medium">Your Output:</h4>
                            <pre className="p-2 rounded bg-muted/70 overflow-x-auto">
                              {testCase.actualOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SubmissionDetail({ submission }: SubmissionDetailProps) {
  const t = useTranslations('Playground');
  const [theme, setTheme] = useState('vs-dark');
  const [isEditorOpen, setIsEditorOpen] = useState(true); // Default to open
  const [editorHeight, setEditorHeight] = useState("auto"); // Default to auto height

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "Wrong Answer":
        return "bg-red-500 hover:bg-red-600";
      case "Time Limit Exceeded":
        return "bg-amber-500 hover:bg-amber-600";
      case "Memory Limit Exceeded":
        return "bg-orange-500 hover:bg-orange-600";
      case "Compile Error":
        return "bg-rose-500 hover:bg-rose-600";
      case "Runtime Error":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <Check className="h-5 w-5" />;
      case "Wrong Answer":
        return <X className="h-5 w-5" />;
      case "Time Limit Exceeded":
        return <Clock className="h-5 w-5" />;
      case "Memory Limit Exceeded":
        return <MemoryStick className="h-5 w-5" />;
      case "Compile Error":
        return <AlertCircle className="h-5 w-5" />;
      case "Runtime Error":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }  
  };

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.documentElement.classList.contains('light') ? 'light' : 'vs-dark');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleEditorDidMount = (editor: any) => {
    // Calculate initial height based on content
    const lineCount = editor.getModel().getLineCount();
    const height = 2 + 21 * lineCount; // Match the height calculation from AutoFitEditor
    setEditorHeight(`${height}px`);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] w-full flex-1 overflow-auto">
      <div className='w-full h-full from-background to-muted flex-1'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-xl bg-card shadow-xl backdrop-blur-sm border border-border/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="flex items-center gap-3"
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('Submission')} #{submission.id}
              </CardTitle>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                className={`text-lg px-4 py-2 rounded-full transition-all ${getStatusColor(abbreviationToFull[submission.res])} text-white font-medium flex items-center gap-2`}
              >
                {abbreviationToFull[submission.res]}
                {getStatusIcon(abbreviationToFull[submission.res])}
              </Badge>
            </motion.div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {[
                { icon: <Calendar className="w-5 h-5" />, value: getLocalTimeAndDate(submission.createdAt), label: "Submitted" },
                { icon: <Code className="w-5 h-5" />, value: FormalLang[submission.lang], label: "Language" },
                { icon: <Clock className="w-5 h-5" />, value: calculateTime(submission.test), label: "Runtime" },
                { icon: <HardDrive className="w-5 h-5" />, value: calculateMemory(submission.test), label: "Memory" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-base font-semibold">{item.value}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-lg overflow-hidden"
              >
                <TestcaseDetail testCases={submission.test}/>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <Collapsible open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      {t('Code')} ({FormalLang[submission.lang]})
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {isEditorOpen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="mt-4 rounded-lg border border-border/50">
                      <div style={{ height: editorHeight, transition: "0.3s ease-in-out" }}>
                        <Editor 
                          value={submission.source} 
                          language={langToMonacoLang[submission.lang]}
                          theme={theme}
                          onMount={handleEditorDidMount}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            lineNumbers: "on",
                            renderLineHighlight: "all",
                            wordWrap: "on",
                            folding: true,
                            scrollbar: {
                              vertical: "visible",
                              horizontal: "visible",
                              useShadows: true,
                              verticalScrollbarSize: 12,
                              horizontalScrollbarSize: 12
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            </div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
}

interface SubmissionProps {
  displaySubmission: number;
  setDisplaySubmission: (id: number | undefined) => void;
}

export default function Submission({
  displaySubmission,
  setDisplaySubmission,
}: SubmissionProps) {
  const [submission, setSubmission] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!displaySubmission) return;

    const submissionRef = doc(db, "submissions", displaySubmission.toString());
    const unsubscribe = onSnapshot(submissionRef, (doc) => {
      if (doc.exists()) {
        setSubmission(doc.data());
      } else {
        setSubmission(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [displaySubmission]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-gradient-to-b from-background to-muted/50"
    >
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-primary transition-all duration-200 gap-2 font-medium"
            onClick={() => setDisplaySubmission(undefined)}
          >
            <ArrowLeft className="h-5 w-5" />
            <Code className="h-5 w-5" />
            <span>Back to Editor</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
            <DotsLoader size={12} />
            <p className="text-muted-foreground animate-pulse">Loading submission details...</p>
          </div>
        ) : submission?.res === "CE" ? (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-rose-500 h-6 w-6" />
              <h2 className="text-xl font-semibold text-rose-500">Compilation Error</h2>
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm text-rose-500">
                {submission.error_log || "No error message available"}
              </pre>
            </div>
          </div>
        ) : submission ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SubmissionDetail submission={submission} />
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center h-[60vh] text-muted-foreground">
            <p>No submission found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}