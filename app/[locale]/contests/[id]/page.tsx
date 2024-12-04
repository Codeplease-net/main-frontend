"use client";

import fetchContestById from '@/components/ContestDetailPage/GetContestById';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/footer';
import ContestOverview from '@/components/ContestDetailPage/ContestOverview';

interface Contest {
  id: number;
  date: string;
  duration: string;
  title: string;
}

export default function ProblemPage({
    params,
  }: {
    params: { id: string };
  }) {
    const [contest, setContest] = useState<Contest | null>(null);
  
    useEffect(() => {
      const fetchContests = async () => {
        try {
          const result = await fetchContestById(parseInt(params.id));
          if (!result) {
            throw new Error("Fetched data is not an array");
          }
          const contest = {
            id: parseInt(params.id),
            title: result.title,
            date: result.date,
            duration: result.duration,
          };
          setContest(contest);
        } catch (err) {
          console.error(err);
          return;
        }
      };
      fetchContests();
    }, [params.id]);
  
    return (
        <>
            <div className='min-h-screen'>
                <ContestOverview id={params.id} />
            </div>
            <Footer />
        </>
    )
  }