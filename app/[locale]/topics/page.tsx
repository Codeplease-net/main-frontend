import {Link} from '@/i18n/routing';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Footer from '@/components/footer';
import { useTranslations } from 'next-intl';

function topics_list(t: any) {return [
  {code: 'brute-force', name: t('Brute Force')},
  {code: 'binary-search', name: t('Binary Search')},
  {code: 'greedy', name: t('Greedy')},
  {code: 'string', name: t('String')},
  {code: 'search', name: t('Search')},
  {code: 'sort', name: t('Sort')},
  {code: 'number-theory', name: t('Number Theory')},
  {code: 'ds', name: t('Data Structure')},
  {code: 'dp', name: t('Dynamic Programming')},
  {code: 'graph', name: t('Graph')},
  {code: 'tree', name: t('Tree')},
  {code: '2-pointers', name: t('Two Pointers')},
  {code: 'bit', name: t('Bit Manipulation')},
  {code: 'geometry', name: t('Geometry')},
  {code: 'games', name: t('Games')},
  {code: 'combinatorics', name: t('Combinatorics')},
  {code: 'meet-in-the-middle', name: t('Meet In The Middle')},
  {code: 'probabilities', name: t('Probabilities')},
  {code: 'crt', name: t('Chinese Remainder Theorem')},
  {code: 'fft', name: t('Fast Fourier Transform')},
  {code: 'graph-matchings', name: t('Graph Matchings')},
  {code: 'interactive', name: t('Interactive')},
  {code: 'matrix', name: t('Matrix')},
  {code: 'ternary-search', name: t('Ternary Search')}
]}

export default function TopicsPage() {
  const t = useTranslations('Topics')
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">{t('Topics')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
        {topics_list(t).map((topic) => (
          <Link key={topic.code} href={`/problems?category=${topic.code.toLowerCase().replace(' ', '-')}`}>
            <Card className="hover:bg-muted transition-colors">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  )
}