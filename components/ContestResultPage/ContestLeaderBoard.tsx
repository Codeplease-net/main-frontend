"use client";

import { useState, useEffect } from 'react'
import { Search, Trophy, Medal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import SubmissionDetail from '../PlaygroundPage/SubmissionDetail';

interface SubmissionDetailsProps {
  participant: string;
  problem: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  code: string;
}

interface ContestResult {
  id: string;
  name: string;
  avatar: string;
  problem: { id: number, status: string }[];
  totalScore: number;
  rank: number;
}

interface Problem {
  id: number;
  status: string;
  title: string;
  category: string;
  difficulty: number;
  acceptance: number;
  description: string;
  link: string;
}

const submissionDetails = {
  status: "Accepted",
  language: "Python",
  runtime: "50ms",
  memory: "16.2MB",
  code: `def solution(nums):
    return sum(nums)

print(solution([1, 2, 3, 4, 5]))`
}

const contestData = {
  title: "Coding Contest",
  description: "This is a coding contest where participants will solve a series of problems to earn points. The participant with the highest score wins.",
  regulations: [
    "Participants must submit their solutions before the contest ends.",
    "Participants must not cheat or plagiarize solutions from others.",
    "Participants must follow the rules of the contest."
  ],
  startTime: 1633660800000, // 2021-10-08T00:00:00.000Z
  endTime: 1633747200000, // 2021-10-09T00:00:00.000Z
  problems: [
    { id: 1, status: "completed", title: "Problem 1", category: "Array", difficulty: 1, acceptance: 95, description: "Given an array of integers, find the sum of all elements.", link: "/problems/playground/1" },
    { id: 2, status: "completed", title: "Problem 2", category: "String", difficulty: 2, acceptance: 85, description: "Given a string, reverse the string.", link: "/problems/playground/2" },
    { id: 3, status: "not-started", title: "Problem 3", category: "Linked List", difficulty: 3, acceptance: 70, description: "Implement a linked list data structure.", link: "/problems/playground/3" },
  ],
}

function SubmissionDetails({ participant, problem, status, language, runtime, memory, code }: SubmissionDetailsProps) {
  const [theme, setTheme] = useState('vs-dark');

  useEffect(() => {
    const updateTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setTheme('light');
      } else {
        setTheme('vs-dark');
      }
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, []);
  
  return (
    <SubmissionDetail
      id={1}
      date="2021-10-01"
      status={status}
      code={code}
      passedTestcase={6}
      totalTestcase={6}
      runtime={runtime}
      memory={memory}
      language={language}
    />
  )
}

function ProblemStatusBadge({ status }: { status: string }) {
  const color = status === 'Accepted' ? 'bg-green-500' : 'bg-red-500';
  return (
    <Badge className={`${color} text-white`}>
      {status}
    </Badge>
  );
}

export default function LeaderBoard({ ContestResult }: { ContestResult: ContestResult[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredScores = ContestResult.filter(score =>
    score.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return(
    <Card className="w-full m-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            <Input
              type="search"
              placeholder="Search participants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                {contestData.problems.map((problem, index) => (
                  <TableHead key={`problem-${problem.id}`}>Problem {index + 1}</TableHead>
                ))}
                <TableHead className="text-right">Total Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((score, index) => (
                <TableRow key={`result-${score.id}`}>
                  <TableCell className="font-medium">
                    {score.rank === 1 && <Trophy className="inline mr-2 text-yellow-500" />}
                    {score.rank === 2 && <Medal className="inline mr-2 text-gray-400" />}
                    {score.rank === 3 && <Medal className="inline mr-2 text-amber-600" />}
                    {score.rank}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={score.avatar} alt={score.name} />
                        <AvatarFallback>{score.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{score.name}</span>
                    </div>
                  </TableCell>
                  {score.problem.map((problem: any) => (
                    <TableCell key={`problem-status-${problem.id}`}>
                      <Sheet>
                        <SheetTrigger>
                          <ProblemStatusBadge status={problem.status} />
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                          <SubmissionDetails
                            participant={score.name}
                            problem={`Problem ${problem.id}`}
                            status={problem.status}
                            language={submissionDetails.language}
                            runtime={submissionDetails.runtime}
                            memory={submissionDetails.memory}
                            code={submissionDetails.code}
                          />
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold">{score.totalScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}