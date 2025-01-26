"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProblemFormattedDescription from "./Tab/DescriptionTab";
import SolutionFormattedDescription from "./Tab/SolutionTab";
import { SubmissionDetailProps } from "./Tab/Props";
import { useTranslations } from "next-intl";
import SubmissionsTab from "./Tab/SubmissionsTab";
import { BookOpen, LightbulbIcon, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProblemDescriptionProps {
  title: string;
  difficulty: number;
  description: string;
  category: string;
  selectedTab: string;
  solutionDescription: string;
  displaySubmission: number | undefined;
  onSubmissionClick: (submission: SubmissionDetailProps) => void;
  onTabChange: (e: string) => void;
}

export default function ProblemDescription({
  title,
  difficulty,
  description,
  category,
  selectedTab,
  solutionDescription,
  displaySubmission,
  onSubmissionClick,
  onTabChange,
}: ProblemDescriptionProps) {
  const t = useTranslations("Playground");

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      <Card className="w-full flex flex-col h-full border-none rounded-none shadow-none bg-gradient-to-b from-background/90 to-background">
        <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
          <Tabs
            defaultValue="description"
            value={selectedTab}
            className="h-full flex flex-col"
            onValueChange={(e: string) => onTabChange(e)}
          >
            <motion.div 
              className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 shadow-sm"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <TabsList className="w-full h-20 bg-transparent p-3 gap-2">
                <TabsTrigger 
                  value="description"
                  className="data-[state=active]:bg-primary/10 relative h-full data-[state=active]:shadow-none rounded-xl px-8 transition-all duration-300 hover:bg-muted/80 group flex-1"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <BookOpen className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="font-medium">{t("Description")}</span>
                  </div>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    animate={{ 
                      scaleX: selectedTab === "description" ? 1 : 0,
                      opacity: selectedTab === "description" ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger 
                  value="solution"
                  className="data-[state=active]:bg-primary/10 relative h-full data-[state=active]:shadow-none rounded-xl px-8 transition-all duration-300 hover:bg-muted/80 group flex-1"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <LightbulbIcon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="font-medium">{t("Solution")}</span>
                  </div>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    animate={{ 
                      scaleX: selectedTab === "solution" ? 1 : 0,
                      opacity: selectedTab === "solution" ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions"
                  className="data-[state=active]:bg-primary/10 relative h-full data-[state=active]:shadow-none rounded-xl px-8 transition-all duration-300 hover:bg-muted/80 group flex-1"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ListChecks className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="font-medium">{t("Submissions")}</span>
                  </div>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    animate={{ 
                      scaleX: selectedTab === "submissions" ? 1 : 0,
                      opacity: selectedTab === "submissions" ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
              </TabsList>
            </motion.div>
            <div className="flex-grow overflow-y-auto">
              <AnimatePresence mode="wait" custom={selectedTab === "description" ? -1 : 1}>
                <motion.div
                  key={selectedTab}
                  custom={selectedTab === "description" ? -1 : 1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                  className="h-full"
                >
                  <TabsContent
                    value="description"
                    className="h-full p-6 focus-visible:outline-none"
                  >
                    <ProblemFormattedDescription
                      description={description}
                      title={title}
                      difficulty={difficulty}
                      category={category}
                    />
                  </TabsContent>
                  <TabsContent
                    value="solution"
                    className="h-full p-6 focus-visible:outline-none"
                  >
                    <SolutionFormattedDescription description={solutionDescription} />
                  </TabsContent>
                  <TabsContent
                    value="submissions"
                    className="h-full p-6 focus-visible:outline-none"
                  >
                    <SubmissionsTab
                      displaySubmission={displaySubmission}
                      onSubmissionClick={onSubmissionClick}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
