'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SubmissionDetail from "@/components/ui/SubmissionDetail";
import { useTranslations } from 'next-intl'

interface SubmissionDetailProps {
  id: number
  date: string
  status: string
  code: string
  passedTestcase: number
  totalTestcase: number
  runtime: string
  memory: string
  language: string
  problemName: string
}

const mockSubmissions: SubmissionDetailProps[] = [
  {
    id: 1,
    date: '2023-07-01',
    status: 'Accepted',
    code: 'console.log("Hello, World!");',
    passedTestcase: 10,
    totalTestcase: 10,
    runtime: '1ms',
    memory: '8.1 MB',
    language: 'JavaScript',
    problemName: 'Two Sum',
  },
  // Add more mock data as needed
]

export default function SubmissionsTable() {
  const t = useTranslations('Profile')
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetailProps | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('ID')}</TableHead>
            <TableHead>{t('Date')}</TableHead>
            <TableHead>{t('Status')}</TableHead>
            <TableHead>{t('Problem')}</TableHead>
            <TableHead>{t('Action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.id}</TableCell>
              <TableCell>{submission.date}</TableCell>
              <TableCell>{t(submission.status)}</TableCell>
              <TableCell>{submission.problemName}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedSubmission(submission)}>
                      {t('View Details')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{t('Submission Details')}</DialogTitle>
                    </DialogHeader>
                    {selectedSubmission && 
                      <SubmissionDetail
                        id={selectedSubmission.id}
                        date={selectedSubmission.date}
                        status={selectedSubmission.status}
                        code={selectedSubmission.code}
                        passedTestcase={selectedSubmission.passedTestcase}
                        totalTestcase={selectedSubmission.totalTestcase}
                        runtime={selectedSubmission.runtime}
                        memory={selectedSubmission.memory}
                        language={selectedSubmission.language}
                        />}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}