import React from 'react';
import { CircularProgress } from '@/components/ProfilePage/CircularProgress';
import ActivityCalendar from '@/components/ProfilePage/ActivityCalendar';
import RatingChart from '@/components/ProfilePage/RatingChart';
import { useTranslations } from 'next-intl';

const sampleUser = {
  name: 'Nguyễn Vĩnh Khang',
  username: 'katiue',
  avatar: 'https://firebasestorage.googleapis.com/v0/b/leaco-dev.appspot.com/o/cat-open.png?alt=media&token=fba1e13c-28dd-4c13-92cc-77e47475df33',
  rank: 5000000,
  views: 0,
  solutions: 0,
  discuss: 0,
  reputation: 0,
  languages: ['C#', 'C++', 'Python'], 
  solved: 4,
  skill: 'Intermediate',
  recentAccepted: [
    { name: 'Maximum Units on a Truck', submissionDate: '2023-12-01T10:00:00Z' },
    { name: 'Implement Stack using Queues', submissionDate: '2024-12-01T10:00:00Z' },
    { name: 'Valid Parentheses', submissionDate: '2023-12-01T10:00:00Z' }
  ],
  acceptanceRate: 80,
  levelsolved: {
    easy: 4,
    medium: 0,
    hard: 0
  },
  submissions: 25
};

const getTimeSince = (pastDate: string, t: ReturnType<typeof useTranslations>): string => {
  const now = new Date();
  const past = new Date(pastDate);
  const difference = now.getTime() - past.getTime();

  if (difference < 0) {
    return t("futureDate");
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return t("time.seconds", { count: seconds });
  if (minutes < 60) return t("time.minutes", { count: minutes });
  if (hours < 24) return t("time.hours", { count: hours });
  if (days < 7) return t("time.days", { count: days });
  if (weeks < 4) return t("time.weeks", { count: weeks });
  if (months < 12) return t("time.months", { count: months });
  return t("time.years", { count: years });
};


const UserInfo = ({ user, t }: { user: typeof sampleUser, t: any }) => (
  <div className="flex items-center mb-4">
    <img src={user.avatar} alt="User Avatar" className="w-24 h-24 rounded-lg mr-4" />
    <div>
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-400">{user.username}</p>
      <p className="text-green-500">{t('Rank', { number: user.rank})}</p>
    </div>
  </div>
);

const CommunityStats = ({ views, solutions, discuss, reputation, t }: { views: number, solutions: number, discuss: number, reputation: number, t: any }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">{t('Community Stats')}</h3>
    <div className="space-y-2">
      <p><span className="text-blue-400">{t('Views')}:</span> {views}</p>
      <p><span className="text-green-400">{t('Solutions')}:</span> {solutions}</p>
      <p><span className="text-purple-400">{t('Discuss')}:</span> {discuss}</p>
      <p><span className="text-yellow-400">{t('Reputation')}:</span> {reputation}</p>
    </div>
  </div>
);

const Languages = ({ languages, t }: {languages: string[], t: any}) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">{t('Languages')}</h3>
    <div className="flex flex-wrap gap-2 items-center">
      {languages.map((language, index) => (
        <span key={index} className="bg-muted-foreground text-white px-2 py-1 rounded">
          {language}
        </span>
      ))}
    </div>
  </div>
);

const SkillLevel = ({ skill, t }: { skill: string, t: any }) => {
  const skillColor = skill === 'Beginner' ? 'bg-green-600' : skill === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600';
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('Skills')}</h3>
      <span className={`${skillColor} text-white px-2 py-1 rounded`}>{t(skill)}</span>
    </div>
  );
};

const AcceptanceRate = ({ easy, medium, hard, t }: { easy: number, medium: number, hard: number, t: any }) => (
  <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
    <CircularProgress t = {t} percentage={40} />
    <div className="text-right">
      <div className='flex w-40 justify-between'>
        <p>{t('Easy')}:</p>
        <p className="text-green-500">{easy}/830</p>
      </div>
      <div className='flex w-40 justify-between'>
        <p>{t('Medium')}:</p>
        <p className="text-yellow-500">{medium}/1738</p>
      </div>
      <div className='flex w-40 justify-between'>
        <p>{t('Hard')}:</p>
        <p className="text-red-500">{hard}/755</p>
        </div>
    </div>
  </div>
);

const RecentSubmissions = ({ recentAccepted, t }: { recentAccepted: { name: string, submissionDate: string }[], t: any }) => (
  <div className="bg-muted p-4 rounded-lg">
    <div className="flex space-x-4 mb-4">
      <button className="bg-muted-foreground px-3 py-1 rounded text-foreground">{t('Recent Accepted Submissions')}</button>
      <button className="bg-muted-foreground px-3 py-1 rounded text-foreground">{t('List')}</button>
      <button className="bg-muted-foreground px-3 py-1 rounded text-foreground">{t('Solutions')}</button>
      <button className="bg-muted-foreground px-3 py-1 rounded text-foreground">{t('Discuss')}</button>
    </div>
    <div className="space-y-2">
      {recentAccepted.map((submission, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className='text-foreground'>{submission.name}</span>
          <span className="text-foreground">{getTimeSince(submission.submissionDate, t)}</span>
        </div>
      ))}
    </div>
  </div>
);

const activityData = [
  // { date: '2023-01-01', count: 5 },
  // { date: '2023-01-02', count: 3 },
  // { date: '2023-04-02', count: 3 },
  // ... more data
];

export default function Profile() {
  const t = useTranslations('Profile')
  return (
    <div className="bg-background text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <UserInfo user={sampleUser} t = {t}/>
          <button className="w-full bg-green-600 text-white py-2 rounded-md mb-4">{t('Edit Profile')}</button>
          <p className="text-gray-400 mb-2">{sampleUser.username}</p>
          <CommunityStats {...sampleUser} t = {t}/>
          <Languages t = {t} languages={sampleUser.languages} />
          <SkillLevel t = {t} skill={sampleUser.skill} />
        </div>
        <div className="md:col-span-3 space-y-6">
          <AcceptanceRate t = {t} {...sampleUser.levelsolved} />
          <RatingChart />
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-foreground">{t('SubmissionsLastYear', {number: 26})}</h3>
            <ActivityCalendar data={[]} year={2023} />
          </div>
          <RecentSubmissions t = {t} recentAccepted={sampleUser.recentAccepted} />
        </div>
      </div>
    </div>
  );
}
