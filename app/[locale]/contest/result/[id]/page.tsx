"use client"

import React from 'react'
import TopPerformers from '@/components/ContestResultPage/TopPerformers'
import LeaderBoard from '@/components/ContestResultPage/ContestLeaderBoard'
import PersonalDetail from '@/components/ContestResultPage/PersonalDetail'

// Mock data for detailed scores
const ContestResult = [
  { id: "1", name: "Alice", avatar: "/cat.png", 
    problem: [
      { id: 1, status: "Accepted" },
      { id: 2, status: "Accepted" },
      { id: 3, status: "Accepted" },
    ], totalScore: 95, rank: 1 },
  { id: "2", name: "Bob", avatar: "/cat.png",
    problem: [
      { id: 1, status: "Accepted" },
      { id: 2, status: "Accepted" },
      { id: 3, status: "Failed" },
    ], totalScore: 88, rank: 2 },
  { id: "3", name: "Charlie", avatar: "/cat.png",
    problem: [
      { id: 1, status: "Accepted" },
      { id: 2, status: "Failed" },
      { id: 3, status: "Accepted" },
    ], totalScore: 82, rank: 3 },
  { id: "4", name: "David", avatar: "/cat.png",
    problem: [
      { id: 1, status: "Failed" },
      { id: 2, status: "Failed" },
      { id: 3, status: "Failed" },
    ], totalScore: 79, rank: 4 },
  { id: "5", name: "Eve", avatar: "/cat.png",
    problem: [
      { id: 1, status: "Failed" },
      { id: 2, status: "Failed" },
      { id: 3, status: "Failed" },
    ], totalScore: 75, rank: 5 },
]

// Mock user participation data
const userParticipation = {
  name: "You",
  avatar: "/cat.png",
  rank: 4,
  totalScore: 79,
  problem: [
    { id: 1, status: "Accepted" },
    { id: 2, status: "Failed" },
    { id: 3, status: "Failed" },
  ]
}

export default function DetailedScores() {

  const topPerformers = ContestResult.slice(0, 3)

  return (
    <>
      <h1 className="pt-4 text-3xl font-bold mb-6 text-center relative z-10">Coding Contest Leaderboard</h1>
      <TopPerformers topPerformers={topPerformers} />
      <div className='flex flex-col w-full items-around justify-around gap-y-4 m-2 md:flex-row'>
        <LeaderBoard ContestResult={ContestResult} />
        <PersonalDetail userParticipation={userParticipation} />
      </div>
    </>
  )
}