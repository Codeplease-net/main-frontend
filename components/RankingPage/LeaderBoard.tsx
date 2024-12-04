import {Link} from '@/i18n/routing';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTranslations } from 'next-intl';

interface LeaderboardEntry {
  username: string
  rating: number
  contestsJoined: number
  problemsSolved: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    username: 'codemaster',
    rating: 2800,
    contestsJoined: 50,
    problemsSolved: 500,
  },
  {
    username: 'algorithmguru',
    rating: 2750,
    contestsJoined: 45,
    problemsSolved: 480,
  },
  // Add more mock data as needed
]

export default function LeaderboardTable() {
  const t = useTranslations('Leaderboard')
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('Rank')}</TableHead>
          <TableHead>{t('Username')}</TableHead>
          <TableHead>{t('Rating')}</TableHead>
          <TableHead>{t('Contests Joined')}</TableHead>
          <TableHead>{t('Problems Solved')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockLeaderboard.map((entry, index) => (
          <TableRow key={entry.username}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Link href={`/profile/${entry.username}`} className="text-blue-600 hover:underline">
                {entry.username}
              </Link>
            </TableCell>
            <TableCell>{entry.rating}</TableCell>
            <TableCell>{entry.contestsJoined}</TableCell>
            <TableCell>{entry.problemsSolved}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}