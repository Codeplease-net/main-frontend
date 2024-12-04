"use client"

import React from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Fullscreen } from 'lucide-react'
import ProblemFormattedDescription from './Description'
import SolutionFormattedDescription from './SolutionTab'
import MySubmissionsTab from './MySubmissionsTab'
import AllSubmissionsTab from './AllSubmissionsTab'
import { SubmissionDetailProps } from './Props'
import { useTranslations } from 'next-intl'

interface ProblemDescriptionProps {
  problemNumber: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  acceptance: number
  mySubmissions?: SubmissionDetailProps[],
  allSubmissions?: SubmissionDetailProps[],
  selectedTab: string
  solutionDescription: string
  sampleCode: string
  onclickFullscreen: (e: number) => void
  onSubmissionClick: (submission: SubmissionDetailProps) => void
  onTabChange: (e: string) => void
}

export default function ProblemDescription({ 
  problemNumber,
  title,
  difficulty,
  description,
  acceptance,
  mySubmissions,
  allSubmissions,
  selectedTab,
  solutionDescription,
  sampleCode,
  onclickFullscreen,
  onSubmissionClick,
  onTabChange
}: ProblemDescriptionProps) {
  const t = useTranslations('Playground')
  return (
    <Card className="w-full flex flex-col h-[calc(93vh-2rem)] border-none shadow-none">
      <CardContent className="p-0 flex-grow overflow-auto">
        <Tabs defaultValue="description" value = {selectedTab} className="h-full flex flex-col rounded-e-none" onValueChange={(e: string) => onTabChange(e)}>
        <div className='flex justify-between items-center ml-6 mt-2'>
          <TabsList className=" border-b flex-shrink-0">
            <TabsTrigger value="description">{t('Description')}</TabsTrigger>
            <TabsTrigger value="solutions">{t('Solutions')}</TabsTrigger>
            <TabsTrigger value="submissions">{t('My Submissions')}</TabsTrigger>
            <TabsTrigger value="all_submissions">{t('All Submissions')}</TabsTrigger>
          </TabsList>
          <Fullscreen className="mr-2 cursor-pointer" onClick={() => onclickFullscreen(1)} />
        </div>
          <TabsContent value="description" className="flex-grow overflow-auto pl-6 pt-2">
            <div className="min-h-full">
              <CardTitle className="text-2xl mb-4">
                {title}
              </CardTitle>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline" className={
                  difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                  difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }>
                  {t(difficulty)}
                </Badge>
                <Badge variant="outline" className="">{t('Topics')}</Badge>
                <Badge variant="outline" className="">{t('Companies')}</Badge>
                <Badge variant="outline" className="">{t('Hint')}</Badge>
              </div>
              <div className="text-zinc-300 space-y-4">
                <ProblemFormattedDescription description={description} />
              </div>
              <div className='flex flex-row gap-2 mt-4'>
                {t('Acceptance')}:
                <div className='flex flex-row'>
                  <p className={acceptance > 70 ? "text-green-500" : acceptance > 40 ? "text-yellow-600" : "text-red-600"}>{acceptance}</p>
                  %
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="solutions">
            <div className='flex-grow overflow-auto pl-8 pt-2'>
              <SolutionFormattedDescription description={solutionDescription} code={sampleCode} />
            </div>
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
  )
}