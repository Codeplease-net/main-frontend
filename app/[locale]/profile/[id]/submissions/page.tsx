import SubmissionTable from '@/components/UserSubmissionPage/SubmissionTable'
import { useTranslations } from 'next-intl'

export default function SubmissionsPage({
  params,
}: {
  params: { id: string };  
}) {
  const t = useTranslations('Profile')
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">{t('User Submissions')}</h1>
      <SubmissionTable />
    </div>
  )
}