"use client";

import { useEffect } from "react";
import React, { useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  startAt,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import DotsLoader from "../DotsLoader";
import {
  ChevronRight,
  Check,
  X,
  Filter,
  WholeWord,
  ArrowDownNarrowWideIcon,
  Database,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslations } from "next-intl";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/api/Readfirebase";

interface TestCase {
  status: string;
  time_taken: number;
  memory_taken: string;
}

interface Submission {
  id: string;
  res: keyof typeof submissionGradients;
  test: TestCase[];
  test_case_count: number;
  lang: string;
  user_handle: string;
  createdAt: number;
  runtime: string;
  memory: string;
}

const submissionGradients = {
  AC: "bg-gradient-to-br from-emerald-400/90 via-emerald-500/90 to-emerald-600/90",
  WA: "bg-gradient-to-br from-rose-400/90 via-rose-500/90 to-rose-600/90",
  TLE: "bg-gradient-to-br from-amber-400/90 via-amber-500/90 to-amber-600/90",
  RTE: "bg-gradient-to-br from-red-400/90 via-red-500/90 to-red-600/90",
  MLE: "bg-gradient-to-br from-purple-400/90 via-purple-500/90 to-purple-600/90",
  CE: "bg-gradient-to-br from-gray-400/90 via-gray-500/90 to-gray-600/90",
} as const;

export function getTimeInHoursAndMinutesWithGMT(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const gmtOffset = -date.getTimezoneOffset() / 60;
  const gmtSign = gmtOffset >= 0 ? "+" : "-";
  const gmt = `GMT${gmtSign}${Math.abs(gmtOffset)}`;
  return `${hours}:${minutes} ${gmt}`;
}

export function getDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function countAccepted(tests: TestCase[]): number {
  return tests.reduce((acc, test) => (test.status === "AC" ? acc + 1 : acc), 0);
}

function calculateTime(tests: TestCase[]): string {
  if (!tests) return "";
  const maxTime = Math.max(...tests.map((test) => test.time_taken));
  return `${maxTime} ms`;
}

function calculateMemory(tests: TestCase[]): string {
  if (!tests) return "";
  const maxMemory = Math.max(
    ...tests.map((test) => parseFloat(test.memory_taken))
  );
  return `${maxMemory} KB`;
}

export async function getUserHandle(userId: string): Promise<string> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data()?.handle || "" : "";
  } catch (error) {
    console.error("Error fetching user handle:", error);
    return "";
  }
}

interface SubmissionsTabProps {
  displaySubmission: number | undefined;
  onSubmissionClick: (submissionId: string) => void;
}

export default function SubmissionsTab({
  displaySubmission,
  onSubmissionClick,
}: SubmissionsTabProps) {
  const t = useTranslations("Playground");
  const [filter, setFilter] = useState("All");
  const [language, setLanguage] = useState<"Javascript" | "Python" | "All">(
    "All"
  );
  const [sortby, setSortby] = useState<"runtime" | "memory" | "none">("none");
  const [submissions, setSubmissions] = useState<Submission[] | undefined>();
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const fetchSubmissions = (page: number) => {
    try {
      setLoading(true);

      let baseQuery = query(collection(db, "submissions"));

      // Apply filters
      if (filter !== "All") {
        const status =
          filter === "Accepted"
            ? "AC"
            : filter === "Wrong Answer"
            ? "WA"
            : "CE";
        baseQuery = query(baseQuery, where("res", "==", status));
      }

      if (language !== "All") {
        baseQuery = query(
          baseQuery,
          where("lang", "==", language.toLowerCase())
        );
      }

      // Apply sorting
      if (sortby !== "none") {
        baseQuery = query(baseQuery, orderBy(sortby, "asc"));
      } else {
        baseQuery = query(baseQuery, orderBy("createdAt", "desc"));
      }

      // Get total count for pagination
      getCountFromServer(baseQuery).then((countSnapshot) => {
        const total = countSnapshot.data().count;
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      });

      // Apply pagination
      baseQuery = query(baseQuery, limit(ITEMS_PER_PAGE));
      if (page > 1) {
        getDocs(query(baseQuery, limit((page - 1) * ITEMS_PER_PAGE))).then(
          (previousSnapshot) => {
            const lastVisible =
              previousSnapshot.docs[previousSnapshot.docs.length - 1];
            baseQuery = query(baseQuery, startAfter(lastVisible));

            // Set up real-time listener
            const unsubscribe = onSnapshot(baseQuery, async (querySnapshot) => {
              const newData = await Promise.all(
                querySnapshot.docs.map(async (docSnapshot) => {
                  const data = docSnapshot.data();
                  const userDocRef = doc(db, "users", data.user_id);
                  const userDoc = await getDoc(userDocRef);
                  const userData = userDoc.exists() ? userDoc.data() : {};

                  return {
                    id: docSnapshot.id,
                    ...data,
                    user_handle: userData.handle || "",
                  } as Submission;
                })
              );
              setSubmissions(newData);
              setLoading(false);
            });

            return () => unsubscribe();
          }
        );
      } else {
        // Set up real-time listener for first page
        const unsubscribe = onSnapshot(baseQuery, async (querySnapshot) => {
          const newData = await Promise.all(
            querySnapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data();
              const userDocRef = doc(db, "users", data.user_id);
              const userDoc = await getDoc(userDocRef);
              const userData = userDoc.exists() ? userDoc.data() : {};

              return {
                id: docSnapshot.id,
                ...data,
                user_handle: userData.handle || "",
              } as Submission;
            })
          );
          setSubmissions(newData);
          setLoading(false);
        });

        return () => unsubscribe();
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchSubmissions(currentPage);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentPage, filter, language, sortby]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-background pt-2 rounded-lg w-full">
      <div className="flex items-center justify-start mb-4 gap-2">
        <Select onValueChange={setFilter}>
          <SelectTrigger className="gap-x-2 w-fit hover:bg-muted/70">
            <Filter className="text-gray-400" size={18} />
            <SelectValue placeholder={t("All")} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              <SelectLabel className="font-medium">{t("Status")}</SelectLabel>
              <SelectItem value="All">{t("All")}</SelectItem>
              <SelectItem value="Accepted">{t("Accepted")}</SelectItem>
              <SelectItem value="Wrong Answer">{t("Wrong Answer")}</SelectItem>
              <SelectItem value="Compile Error">
                {t("Compile Error")}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setLanguage(value as "Javascript" | "Python" | "All")
          }
        >
          <SelectTrigger className="gap-x-2 w-fit hover:bg-muted/70">
            <WholeWord className="text-gray-400" size={18} />
            <SelectValue placeholder={t("All")} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              <SelectLabel className="font-medium">{t("Language")}</SelectLabel>
              <SelectItem value="All">{t("All")}</SelectItem>
              <SelectItem value="javascript">Javascript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setSortby(value as "runtime" | "memory" | "none")
          }
        >
          <SelectTrigger className="gap-x-2 w-fit hover:bg-muted/70">
            <ArrowDownNarrowWideIcon className="text-gray-400" size={18} />
            <SelectValue placeholder={t("Sort by")} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              <SelectLabel className="font-medium">{t("Sort by")}</SelectLabel>
              <SelectItem value="none">{t("None")}</SelectItem>
              <SelectItem value="runtime">{t("Runtime")}</SelectItem>
              <SelectItem value="memory">{t("Memory")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        {!loading &&
          submissions?.map((submission, index) => (
            <AnimatePresence mode="wait" key={submission.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0,  
                  scale: displaySubmission?.toString() === submission.id ? 1.02 : 1
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1, // Stagger effect
                }}
              >
                <div
                  key={submission.id}
                  className={`bg-muted/50 hover:bg-muted/70 transition-all duration-200 overflow-hidden w-full p-5 mb-3 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm
                    ${displaySubmission?.toString() === submission.id 
                      ? 'border-primary/50 bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                      : 'hover:bg-muted/70 border-border/50'
                    }`}
                >
                  <div className="flex items-center justify-between w-full group">
                    <div className="flex items-center gap-8">
                      <div
                        className={`flex flex-col items-center justify-center ${
                          submissionGradients[submission.res]
                        } w-36 h-28 font-mono rounded-2xl text-white shadow-lg backdrop-blur-sm 
                  transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10  ${displaySubmission?.toString() === submission.id ? 'scale-105' : ''}`
                }
                      >
                        <div className="text-3xl font-bold tracking-tight">
                          {submission.res === "CE"
                            ? "CE"
                            : `${countAccepted(submission.test)} / ${
                                submission.test_case_count
                              }`}
                        </div>
                        <div className="text-sm font-medium mt-2 bg-black/20 px-3 py-1 rounded-full">
                          {submission.res} | {submission.lang}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <button className="font-semibold text-lg hover:text-primary transition-colors duration-200">
                            {submission.user_handle}
                          </button>
                          <span className="text-muted-foreground/80 text-sm bg-muted/60 px-3 py-1 rounded-full backdrop-blur-sm">
                            {getTimeInHoursAndMinutesWithGMT(
                              submission.createdAt
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground/90 bg-background/80 px-3 py-1.5 rounded-lg border border-border/40 backdrop-blur-sm">
                            {getDate(submission.createdAt)}
                          </span>
                          {submission.res === "AC" ? (
                            <>
                              <span className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-lg border border-border/40 backdrop-blur-sm">
                                <Clock className="w-4 h-4 text-muted-foreground/70" />
                                {calculateTime(submission.test)}
                              </span>
                              <span className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-lg border border-border/40 backdrop-blur-sm">
                                <Database className="w-4 h-4 text-muted-foreground/70" />
                                {calculateMemory(submission.test)}
                              </span>
                            </>
                          ) : submission.res === "CE" ? (
                            <span className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 backdrop-blur-sm">
                              <X className="w-4 h-4" />
                              Compilation Error
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 backdrop-blur-sm">
                              <X className="w-4 h-4" />
                              Failed test case #
                              {submission.test.findIndex(
                                (t) => t.status !== "AC"
                              ) + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSubmissionClick(submission.id)}
                      className={`cursor-pointer hover:bg-muted/80 p-3 rounded-full transition-all duration-300 group-hover:translate-x-1 hover:shadow-md ${displaySubmission?.toString() === submission.id 
                        ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                        : 'hover:bg-muted/80 group-hover:translate-x-1'
                      }`}
                    >
                      {displaySubmission?.toString() === submission.id ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <ChevronRight className="text-muted-foreground w-6 h-6" />
          )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-4"
            >
              <DotsLoader size={8} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="flex justify-center gap-2 py-4">
          <div className="flex justify-center gap-2 py-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                pageNumber === currentPage - 3 ||
                pageNumber === currentPage + 3
              ) {
                return <span key={pageNumber}>...</span>;
              }
              return null;
            })}

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
