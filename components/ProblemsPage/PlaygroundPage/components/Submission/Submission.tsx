import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import axios from "axios";

// Components
import { DotsLoader } from "../DotsLoader";
import TestcaseDetail from "./TestcaseDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FitEditor from "@/components/ui/description/fit-editor";
import CopyButton from "@/components/ui/copy-button";

// Icons
import { 
  ArrowLeft, 
  Code, 
  Calendar, 
  Clock, 
  HardDrive, 
  XCircle,
  Loader2 
} from "lucide-react";

// Utilities
import { 
  getLocalTimeAndDate, 
  calculateTime, 
  calculateMemory 
} from "../../utils/formatters";
import { 
  SubmissionDetailProps, 
  TestCase 
} from "../../utils/types";
import { langToMonacoLang, FormalLang } from "../../utils/constants";

interface SubmissionProps {
  submissionId: string;
  setDisplaySubmission: (id: string | undefined) => void;
}

export default function Submission({
  submissionId,
  setDisplaySubmission,
}: SubmissionProps) {
  const [submission, setSubmission] = useState<SubmissionDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingCountRef = useRef(0);
  const t = useTranslations("Playground");
  const MAX_POLLING_ATTEMPTS = 20; // Maximum number of polling attempts (20 * 2 seconds = 40 seconds max wait)

  const fetchSubmission = async () => {
    try {
      if (!loading && !processing) setLoading(true);
      setError(null);
      
      const form = new FormData();
      form.append("id", submissionId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/database/query`, 
        form
      );
      
      // Check if submission is still in queue
      if (response.data.result === "IQ") {
        setProcessing(true);
        
        // If we've polled too many times, stop and show an error
        if (pollingCountRef.current >= MAX_POLLING_ATTEMPTS) {
          clearTimeout(pollingTimerRef.current!);
          setError(t("submissionTimeout"));
          setProcessing(false);
          setLoading(false);
          return;
        }
        
        // Poll again in 2 seconds
        pollingCountRef.current += 1;
        pollingTimerRef.current = setTimeout(fetchSubmission, 2000);
        
        // Set partial submission data to show "Processing" state
        setSubmission({
          ...response.data,
          status: "Processing"
        });
      } else {
        // Submission is complete
        setSubmission(response.data);
        setProcessing(false);
        
        // Clear any ongoing polling
        if (pollingTimerRef.current) {
          clearTimeout(pollingTimerRef.current);
          pollingTimerRef.current = null;
        }
      }
    } catch (error) {
      console.error("Error fetching submission:", error);
      setError(t("fetchError"));
      
      // Clear any ongoing polling on error
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    } finally {
      if (!processing) setLoading(false);
    }
  };

  useEffect(() => {
    if (submissionId) {
      // Reset polling counter when submission ID changes
      pollingCountRef.current = 0;
      fetchSubmission();
    }
    
    // Cleanup on unmount
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    };
  }, [submissionId]);

  // Status information helpers
  const getStatusLabel = (result: string) => {
    switch(result) {
      case "AC": return t("status.accepted");
      case "WA": return t("status.wrongAnswer");
      case "TLE": return t("status.timeLimit");
      case "RTE": return t("status.runtime");
      case "MLE": return t("status.memoryLimit");
      case "CE": return t("status.compileError");
      case "IQ": return t("status.inQueue");
      default: return result;
    }
  };

  const getStatusColor = (result: string) => {
    const colorMap: Record<string, string> = {
      AC: "bg-emerald-500 hover:bg-emerald-600",
      WA: "bg-red-500 hover:bg-red-600",
      TLE: "bg-amber-500 hover:bg-amber-600",
      RTE: "bg-red-500 hover:bg-red-600",
      MLE: "bg-orange-500 hover:bg-orange-600",
      CE: "bg-rose-500 hover:bg-rose-600",
      IQ: "bg-blue-500 hover:bg-blue-600"
    };
    return colorMap[result] || "bg-gray-500 hover:bg-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-gradient-to-b from-background to-muted/50 h-calc(100vh) overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-primary transition-all duration-200 gap-2 font-medium"
            onClick={() => setDisplaySubmission(undefined)}
          >
            <ArrowLeft className="h-5 w-5" />
            <Code className="h-5 w-5" />
            <span>{t("backToEditor")}</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        {loading && !processing ? (
          <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
            <DotsLoader size={12} />
            <p className="text-muted-foreground animate-pulse">
              {t("loadingSubmission")}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        ) : submission?.result === "CE" ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-rose-500 h-6 w-6" />
              <h2 className="text-xl font-semibold text-rose-500">
                {t("status.compileError")}
              </h2>
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm text-rose-500">
                {submission.error_log || t("noErrorMessage")}
              </pre>
            </div>
          </div>
        ) : submission?.result === "IQ" || processing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="w-full rounded-xl bg-card shadow-xl backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6">
                <motion.div
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="flex items-center gap-3"
                >
                  <h2 className="text-xl font-semibold">
                    {t("submission")} <span className="text-muted-foreground">#{submissionId.slice(-6)}</span>
                  </h2>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Badge
                    className="text-lg px-4 py-2 rounded-full transition-all bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("processing")}
                  </Badge>
                </motion.div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <DotsLoader size={8} />
                  <p className="text-muted-foreground mt-4 max-w-md">
                    {t("processingDescription")}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2">
                    {t("pollingAttempt", {
                      current: pollingCountRef.current,
                      max: MAX_POLLING_ATTEMPTS
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : submission ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="w-full rounded-xl bg-card shadow-xl backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6">
                <motion.div
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="flex items-center gap-3"
                >
                  <h2 className="text-xl font-semibold">
                    {t("submission")} <span className="text-muted-foreground">#{submissionId.slice(-6)}</span>
                  </h2>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    className={`text-lg px-4 py-2 rounded-full transition-all ${
                      getStatusColor(submission.result)
                    } text-white font-medium flex items-center gap-2`}
                  >
                    {getStatusLabel(submission.result)}
                  </Badge>
                </motion.div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  {/* Submission Metadata */}
                  <SubmissionMetadataItem
                    icon={<Calendar className="w-5 h-5" />}
                    value={getLocalTimeAndDate(submission.timestamp)}
                    label={t("submittedLabel")}
                    index={0}
                  />
                  <SubmissionMetadataItem
                    icon={<Code className="w-5 h-5" />}
                    value={FormalLang[submission.language as keyof typeof FormalLang] || submission.language}
                    label={t("languageLabel")}
                    index={1}
                  />
                  <SubmissionMetadataItem
                    icon={<Clock className="w-5 h-5" />}
                    value={calculateTime(submission.test_cases)}
                    label={t("runtimeLabel")}
                    index={2}
                  />
                  <SubmissionMetadataItem
                    icon={<HardDrive className="w-5 h-5" />}
                    value={calculateMemory(submission.test_cases)}
                    label={t("memoryLabel")}
                    index={3}
                  />
                </div>

                <div className="space-y-6">
                  {/* Test Cases */}
                    <TestcaseDetail testCases={submission.test_cases} />

                  {/* Source Code */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        {t("codeLabel")} ({FormalLang[submission.language as keyof typeof FormalLang] || submission.language})
                      </h3>
                    </div>
                      <FitEditor
                        content={submission.source}
                        language={langToMonacoLang[submission.language as keyof typeof langToMonacoLang] || "plaintext"}
                        readOnly={true}
                      />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center h-[60vh] text-muted-foreground">
            <p>{t("noSubmissionFound")}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper component for rendering submission metadata items
function SubmissionMetadataItem({ 
  icon, 
  value, 
  label, 
  index 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-base font-semibold">{value}</span>
    </motion.div>
  );
}