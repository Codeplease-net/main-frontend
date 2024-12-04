import React, { useState } from 'react';
import { ChevronRight, Check, X, Filter, WholeWord, ArrowDownNarrowWideIcon } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup
} from '@/components/ui/select';
import { SubmissionDetailProps } from './Props';
import { useTranslations } from 'next-intl';

export default function AllSubmissionsTab({ submissions, onSubmissionClick }: { submissions: SubmissionDetailProps[] | undefined, onSubmissionClick: (submission: SubmissionDetailProps) => void }) {
  const t = useTranslations('Playground')
  const [filter, setFilter] = useState('All');
  const [language, setLanguage] = useState<'Javascript' | 'Python' | 'All'>('All');
  const [sortby, setSortby] = useState<'runtime' | 'memory' | "none">('none');

  const filteredSubmissions = submissions?.filter(submission => 
    filter === 'All' || submission.status === filter
  )
  .filter( submission =>
    language === 'All' || submission.language.toLowerCase() === language
  )
  .sort((a, b) => {
    if (sortby === 'runtime') {
      return parseInt(a.runtime === "N/A" ? "999999" : a.runtime.replace(/[a-zA-Z]/g, '')) - parseInt(b.runtime == "N/A" ? "999999" : b.runtime.replace(/[a-zA-Z]/g, ''));
    } else if (sortby === 'memory') {
      return parseFloat(a.memory === "N/A" ? "999999" : a.memory.replace(/[a-zA-Z]/g, '')) - parseFloat(b.memory == "N/A" ? "999999" : b.memory.replace(/[a-zA-Z]/g, ''));
    }
    return 0;
  })

  return (
    <div className="bg-background px-6 pt-2 rounded-lg max-w-3xl">
      <div className="flex items-center justify-start mb-6 gap-2">
          <Select onValueChange={(value: string) => setFilter(value)}>
            <SelectTrigger className='gap-x-2 w-fit'>
              <Filter className="text-gray-400" size={18} />
              <SelectValue placeholder={t('All')}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('Status')}</SelectLabel>
                <SelectItem value="All">{t('All')}</SelectItem>
                <SelectItem value="Accepted">{t('Accepted')}</SelectItem>
                <SelectItem value="Wrong Answer">{t('Wrong Answer')}</SelectItem>
                <SelectItem value="Compile Error">{t('Compile Error')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(value: string) => setLanguage(value as 'Javascript' | 'Python' | 'All')}>
            <SelectTrigger className='gap-x-2 w-fit'>
              <WholeWord className="text-gray-400" size={18} />
              <SelectValue placeholder={t('All')}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('Language')}</SelectLabel>
                <SelectItem value="All">{t('All')}</SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(value: string) => setSortby(value as 'runtime' | 'memory' | 'none')}>
            <SelectTrigger className='gap-x-2 w-fit'>
              <ArrowDownNarrowWideIcon className="text-gray-400" size={18} />
              <SelectValue placeholder={t('Sort by')}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('Sort by')}</SelectLabel>
                <SelectItem value="none">{t('None')}</SelectItem>
                <SelectItem value="runtime">{t('Runtime')}</SelectItem>
                <SelectItem value="memory">{t('Memory')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
      </div>
      <div className="space-y-4">
        {filteredSubmissions?.map((submission, index) => (
          <div key={submission.id} className="bg-muted rounded-lg overflow-hidden" onClick={() => onSubmissionClick(submission)}>
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
            >
              <div className="items-center">
                <div className='flex space-x-4'>
                  <span className="text-gray-400">{submission.date}</span>
                  <span className={`flex items-center ${
                    submission.status === 'Accepted' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <div className='mr-1'>{submission.passedTestcase} / {submission.totalTestcase}</div>
                    {t(submission.status)}
                    {submission.status === 'Accepted' ? (
                      <Check size={18} className="ml-1" />
                    ) : (
                      <X size={18} className="ml-1" />
                    )}
                  </span>
                </div>
                <div className='flex gap-2'>
                  <span className="text-gray-400">{submission.runtime}</span>
                  <span className="text-gray-400">{submission.memory}</span>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}