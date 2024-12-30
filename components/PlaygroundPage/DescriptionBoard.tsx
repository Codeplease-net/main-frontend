"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fullscreen } from "lucide-react";
import ProblemFormattedDescription from "./Description";
import SolutionFormattedDescription from "./SolutionTab";
import MySubmissionsTab from "./MySubmissionsTab";
import AllSubmissionsTab from "./AllSubmissionsTab";
import { SubmissionDetailProps } from "./Props";
import { useTranslations } from "next-intl";

interface ProblemDescriptionProps {
  title: string;
  difficulty: number;
  description: string;
  category: string;
  acceptance: number;
  mySubmissions?: SubmissionDetailProps[];
  allSubmissions?: SubmissionDetailProps[];
  selectedTab: string;
  solutionDescription: string;
  onclickFullscreen: (e: number) => void;
  onSubmissionClick: (submission: SubmissionDetailProps) => void;
  onTabChange: (e: string) => void;
}

export default function ProblemDescription({
  title,
  difficulty,
  description,
  acceptance,
  mySubmissions,
  category,
  allSubmissions,
  selectedTab,
  solutionDescription,
  onclickFullscreen,
  onSubmissionClick,
  onTabChange,
}: ProblemDescriptionProps) {
  const t = useTranslations("Playground");
  return (
    <Card className="w-full flex flex-col h-[calc(93vh-2rem)] border-none shadow-none">
      <CardContent className="p-0 flex-grow overflow-auto">
        <Tabs
          defaultValue="description"
          value={selectedTab}
          className="h-full flex flex-col rounded-e-none"
          onValueChange={(e: string) => onTabChange(e)}
        >
          <div className="flex justify-between items-center ml-6 mt-2">
            <TabsList className="border-b flex-shrink-0">
              <TabsTrigger value="description">
                <div className="hover:text-white">{t("Description")}</div>
              </TabsTrigger>
              <TabsTrigger value="solution">
                <div className="hover:text-white">{t("Solution")}</div>
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <div className="hover:text-white">{t("My Submissions")}</div>
              </TabsTrigger>
              <TabsTrigger value="all_submissions">
                <div className="hover:text-white">{t("All Submissions")}</div>
              </TabsTrigger>
            </TabsList>
            <div
              className="flex border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/70 cursor-pointer rounded-sm p-2 mr-2"
              onClick={() => onclickFullscreen(1)}
            >
              <Fullscreen />
            </div>
          </div>
          <TabsContent
            value="description"
            className="flex-grow overflow-auto pl-6 pt-2"
          >
                <ProblemFormattedDescription description={description} acceptance={acceptance} title={title} difficulty={difficulty} category={category}/>              
          </TabsContent>
          <TabsContent value="solution" className="flex-grow overflow-auto pl-6 pt-2">
              <SolutionFormattedDescription
                description={solutionDescription}
              />
          </TabsContent>
          <TabsContent value="submissions">
            <MySubmissionsTab
              submissions={mySubmissions}
              onSubmissionClick={onSubmissionClick}
            />
          </TabsContent>
          <TabsContent value="all_submissions">
            <AllSubmissionsTab
              submissions={allSubmissions}
              onSubmissionClick={onSubmissionClick}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
