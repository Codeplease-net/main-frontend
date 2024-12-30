import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, HardDrive, Code, CheckCircle, XCircle, Check, X } from 'lucide-react'
import TestcaseDetail from './test-case-detail'
import Editor from '@monaco-editor/react'
import { SubmissionDetailProps } from '../PlaygroundPage/Props'
import { useTranslations } from 'next-intl'

const testCases = [
  { index: 1, status: "Accepted" as const, executionTime: 0.23, memoryUsage: 1024 },
  { index: 2, status: "Accepted" as const, executionTime: 0.15, memoryUsage: 896 },
  { index: 3, status: "Accepted" as const, executionTime: 2.1, memoryUsage: 2048 },
  { index: 4, status: "Accepted" as const, executionTime: 0.18, memoryUsage: 1152 },
  { index: 5, status: "Wrong Answer" as const, executionTime: 0.45, memoryUsage: 5120 },
  { index: 6, status: "Accepted" as const, executionTime: 0.12, memoryUsage: 768 },
]

export default function SubmissionDetail({ id, date, status, code, passedTestcase, totalTestcase, runtime, memory, language 
}: SubmissionDetailProps) {
  const t = useTranslations('Playground')
  const [theme, setTheme] = useState('vs-dark');

  useEffect(() => {
    // Function to update the theme based on classList change
    const updateTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setTheme('light');
      } else {
        setTheme('vs-dark');
      }
    };

    // Initial check for the theme when the component mounts
    updateTheme();

    // Create a MutationObserver to observe changes in the class attribute
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <div className='w-full h-full overflow-auto'>
        <div className="w-full max-w-3xl mx-auto bg-muted-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{t('Submission')} #{id}</CardTitle>
            <Badge 
            variant={status === 'Accepted' ? 'default' : 'destructive'}
            className="text-lg px-3 py-1 text-white"
            >
            {status === 'Accepted' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                    <XCircle className="w-5 h-5 mr-2" />
                )}
            {status}
            </Badge>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{date}</span>
            </div>
            <div className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                <span>{language}</span>
            </div>
            <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{runtime}</span>
            </div>
            <div className="flex items-center">
                <HardDrive className="w-5 h-5 mr-2" />
                <span>{memory}</span>
            </div>
            </div>
            <Separator className="my-4" />
            <div className="mb-4">
              <TestcaseDetail testCases={testCases}/>
            </div>
            <div>
            <h3 className="text-lg font-semibold mb-2">{t('Code')}</h3>
                <Editor
                    height="20rem"
                    defaultLanguage={language}
                    defaultValue={code}
                    theme= {theme}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false }
                    }}
                    />
            </div>
        </CardContent>
        </div>
    </div>
  )
}