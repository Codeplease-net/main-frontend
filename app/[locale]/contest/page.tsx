"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import getContests from "@/components/ContestPage/GetContest";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import Footer from '@/components/footer';

interface Contest {
  id: number;
  name: string;
  date: string;
  duration: string;
}

export default function Contest() {
  const [contests, setContests] = useState<Contest[]>([]);
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const result = await getContests();
        if (!Array.isArray(result)) {
          throw new Error("Fetched data is not an array");
        }
        setContests(result);
      } catch (err) {
        console.error(err);
        return;
      }
    }
    fetchContests();
  }, [])

  return (
    <>
      <div className="w-screen h-screen text-center">
        <h1 className="text-4xl font-bold mt-8 mb-4">Upcoming Contests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Card key={contest.id} className="bg-card">
              <CardHeader className="flex w-full items-start">
                <CardTitle>{contest.name}</CardTitle>
                <CardDescription>{contest.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex w-full items-start">
                <p>Duration: {contest.duration}</p>
              </CardContent>
              <CardFooter className="gap-x-2">
                <Link href={`/contest/${contest.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Button variant="default">Register</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}