"use client";

import { Link } from '@/i18n/routing';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Footer from '@/components/footer';
import { useTranslations } from 'next-intl';
import { Search, BookOpen, Filter, ArrowUpDown } from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DotsLoader from "@/components/PlaygroundPage/DotsLoader";

interface Topic {
  code: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

function topics_list(t: (key: string) => string): Topic[] {
  return [
    // Basic Algorithms
    {code: 'brute-force', name: t('Brute Force'), description: t('BruteForceDesc'), difficulty: 'Beginner'},
    {code: 'binary-search', name: t('Binary Search'), description: t('BinarySearchDesc'), difficulty: 'Intermediate'},
    {code: 'greedy', name: t('Greedy'), description: t('GreedyDesc'), difficulty: 'Intermediate'},
    
    // Fundamental Topics
    {code: 'string', name: t('String'), description: t('StringDesc'), difficulty: 'Beginner'},
    {code: 'search', name: t('Search'), description: t('SearchDesc'), difficulty: 'Beginner'}, 
    {code: 'sort', name: t('Sort'), description: t('SortDesc'), difficulty: 'Beginner'},
    
    // Core CS Topics
    {code: 'number-theory', name: t('Number Theory'), description: t('NumberTheoryDesc'), difficulty: 'Advanced'},
    {code: 'ds', name: t('Data Structure'), description: t('DSDesc'), difficulty: 'Intermediate'},
    {code: 'dp', name: t('Dynamic Programming'), description: t('DPDesc'), difficulty: 'Advanced'},
    {code: 'graph', name: t('Graph'), description: t('GraphDesc'), difficulty: 'Advanced'},
    {code: 'tree', name: t('Tree'), description: t('TreeDesc'), difficulty: 'Intermediate'},
    
    // Intermediate Techniques  
    {code: '2-pointers', name: t('Two Pointers'), description: t('TwoPointersDesc'), difficulty: 'Intermediate'},
    {code: 'bit', name: t('Bit Manipulation'), description: t('BitDesc'), difficulty: 'Intermediate'},
    {code: 'geometry', name: t('Geometry'), description: t('GeometryDesc'), difficulty: 'Advanced'},
    {code: 'games', name: t('Games'), description: t('GamesDesc'), difficulty: 'Intermediate'},
    {code: 'combinatorics', name: t('Combinatorics'), description: t('CombinatoricsDesc'), difficulty: 'Advanced'},
    
    // Advanced Topics
    {code: 'meet-in-the-middle', name: t('Meet In The Middle'), description: t('MeetInTheMiddleDesc'), difficulty: 'Advanced'},
    {code: 'probabilities', name: t('Probabilities'), description: t('ProbabilitiesDesc'), difficulty: 'Advanced'},
    {code: 'crt', name: t('Chinese Remainder Theorem'), description: t('CRTDesc'), difficulty: 'Advanced'},
    {code: 'fft', name: t('Fast Fourier Transform'), description: t('FFTDesc'), difficulty: 'Advanced'},
    {code: 'graph-matchings', name: t('Graph Matchings'), description: t('GraphMatchingsDesc'), difficulty: 'Advanced'},
    {code: 'interactive', name: t('Interactive'), description: t('InteractiveDesc'), difficulty: 'Advanced'},
    {code: 'matrix', name: t('Matrix'), description: t('MatrixDesc'), difficulty: 'Advanced'},
    {code: 'ternary-search', name: t('Ternary Search'), description: t('TernarySearchDesc'), difficulty: 'Advanced'}
  ];
}

export default function TopicsPage() {
  const t = useTranslations('Topics');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('name');
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleSort = (type: string) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  const filteredTopics = topics_list(t)
    .filter(topic => {
      const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * multiplier;
      if (sortBy === 'difficulty') return a.difficulty.localeCompare(b.difficulty) * multiplier;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotsLoader size={12} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4"
    >
      <div className="flex flex-col space-y-8 mb-4">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {t('Topics')}
          </h1>
          <p className="text-muted-foreground">{t('ExploreTopics')}</p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('SearchTopics')}
              className="pl-10 transition-all border-2 focus:border-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('All Difficulties')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t('All Difficulties')}</SelectItem>
              <SelectItem value="Beginner">{t('Beginner')}</SelectItem>
              <SelectItem value="Intermediate">{t('Intermediate')}</SelectItem>
              <SelectItem value="Advanced">{t('Advanced')}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('name')}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              {t('Name')}
              <ArrowUpDown className={`w-3 h-3 ${sortBy === 'name' ? 'text-primary' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link href={`/problems?category=${topic.code.toLowerCase().replace(' ', '-')}`}>
                  <Card className="h-full hover:bg-muted/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {topic.name}
                        </CardTitle>
                        <Badge variant={
                          topic.difficulty === 'Beginner' ? 'success' :
                          topic.difficulty === 'Intermediate' ? 'warning' : 'destructive'
                        }>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        {topic.description}
                      </CardDescription>
                      <div className="mt-4 flex justify-end items-center text-sm text-muted-foreground">
                        <span className="text-primary">{t('StartPracticing')} →</span>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}