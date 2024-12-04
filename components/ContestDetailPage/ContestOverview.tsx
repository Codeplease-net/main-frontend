"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for the contest
const contestData = [
  {
  title: "Annual Coding Challenge 2024",
  description: "Join our exciting coding contest and showcase your skills!",
  regulations: [
    "All submissions must be original work",
    "Use of third-party libraries is allowed",
    "Submissions must be made before the deadline",
    "Participants can submit up to 3 solutions"
  ],
  startTime: Date.now(),
  endTime: Date.now() + 1000000,
  leaderboard: [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 88 },
    { name: "Charlie", score: 82 },
    { name: "David", score: 79 },
    { name: "Eve", score: 75 },
  ]
},
{
  title: "Annual Coding Challenge 2024",
  description: "Join our exciting coding contest and showcase your skills!",
  regulations: [
    "All submissions must be original work",
    "Use of third-party libraries is allowed",
    "Submissions must be made before the deadline",
    "Participants can submit up to 3 solutions"
  ],
  startTime: new Date('2024-03-01T00:00:00').getTime(),
  endTime: new Date('2024-03-03T23:59:59').getTime(),
  leaderboard: [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 88 },
    { name: "Charlie", score: 82 },
    { name: "David", score: 79 },
    { name: "Eve", score: 75 },
  ]
},
{
  title: "Annual Coding Challenge 2024",
  description: "Join our exciting coding contest and showcase your skills!",
  regulations: [
    "All submissions must be original work",
    "Use of third-party libraries is allowed",
    "Submissions must be made before the deadline",
    "Participants can submit up to 3 solutions"
  ],
  startTime: new Date('2024-12-12T00:00:00').getTime(),
  endTime: new Date('2024-03-03T23:59:59').getTime(),
  leaderboard: [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 88 },
    { name: "Charlie", score: 82 },
    { name: "David", score: 79 },
    { name: "Eve", score: 75 },
  ]
}]

export default function ContestOverview({id}:{id: string}) {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [TimeLeft, setTimeLeft] = useState(contestData[parseInt(id)].startTime - currentTime)
  const [contestStatus, setContestStatus] = useState<'not-started' | 'ongoing' | 'ended'>('ended')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
      if (currentTime < contestData[parseInt(id)].startTime) {
        setContestStatus('not-started')
      } else if (currentTime > contestData[parseInt(id)].endTime) {
        setContestStatus('ended')
      } else {
        setContestStatus('ongoing')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTime])

  useEffect(() => {
    setTimeLeft(contestData[parseInt(id)].startTime - currentTime)
  }, [currentTime])

  const formatTime = (time: number) => {
    const days = Math.abs(Math.floor(time / (1000 * 60 * 60 * 24)))
    const hours = Math.abs(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    const minutes = Math.abs(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)))
    const seconds = Math.abs(Math.floor((time % (1000 * 60)) / 1000))
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{contestData[parseInt(id)].title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: Description and Regulations */}
        <div className="md:w-1/2">
          <div className="shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p>{contestData[parseInt(id)].description}</p>
          </div>
          <div className="shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Regulations</h2>
            <ul className="list-disc pl-5">
              {contestData[parseInt(id)].regulations.map((regulation, index) => (
                <li key={index} className="mb-2">{regulation}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column: Contest Status */}
        <div className="md:w-1/2">
          <Card className="bg-muted-background shadow-md rounded-lg p-6">
            {contestStatus === 'not-started' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Contest Starts In</h2>
                <div className="text-4xl font-bold text-center">
                  {TimeLeft && formatTime(TimeLeft)}
                </div>
              </div>
            )}
            {contestStatus === 'ongoing' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Time Passed</h2>
                <div className="text-4xl font-bold text-center text-green-600">
                  {TimeLeft && formatTime(TimeLeft)}
                </div>
                <div className="w-full flex justify-end">
                  <Link href={`ongoing/${id}`}>
                    <Button variant='destructive' >Join Contest</Button>
                  </Link>
                </div>
              </div>
            )}
            {contestStatus === 'ended' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Leaderboard</h2>
                  <Link href={`/contests/result/${id}`} className="hover:text-green-400 flex items-center">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-muted/50'>
                      <TableHead className='bg-muted/50'>Name</TableHead>
                      <TableHead className='bg-muted/50'>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contestData[parseInt(id)].leaderboard.map((entry, index) => (
                      <TableRow key={index} className={`border-b border-gray-700" ${index % 2 == 0 ? "" : "bg-muted/50"}`}>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell>{entry.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}