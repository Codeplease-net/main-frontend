"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import getContests from "@/components/ContestPage/GetContest";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Footer from "@/components/footer";
import { useTranslations } from "next-intl";

interface Contest {
  id: number;
  name: string;
  date: string;
  duration: string;
}

function Item({ contest, t }: { contest: Contest; t: any }) {
  return (
    <Card key={contest.id} className="bg-card">
      <CardHeader className="flex w-full items-start">
        <CardTitle>{contest.name}</CardTitle>
        <CardDescription>{contest.date}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full items-start">
        <p>{t('Duration')}: {contest.duration} {t(contest.duration == "1" ? "hour" : "hours")}</p>
      </CardContent>
      <CardFooter className="gap-x-2">
        <Link href={`/contests/${contest.id}`}>
          <Button variant="outline">{t("View Details")}</Button>
        </Link>
        <Button variant="default">{t("Register")}</Button>
      </CardFooter>
    </Card>
  );
}

export default function Contest() {
  const t = useTranslations('Contests')
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
    };
    fetchContests();
  }, []);

  return (
    <>
      <div className="w-screen text-center">
        <h1 className="text-4xl font-bold mt-8 mb-8">{t('Upcoming Contests')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
          {contests
            .slice(2, 3)
            .map((contest) => <Item t = {t} contest={contest}/>)}
        </div>
        <h1 className="text-4xl font-bold mt-8 mb-8">{t('Ongoing Contests')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
          {contests
            .slice(0, 1)
            .map((contest) => <Item t = {t} contest={contest}/>)}
        </div>
        <h1 className="text-4xl font-bold mt-8 mb-8">{t('Past Contests')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
          {contests
            .slice(0)
            .slice(1,2)
            .map((contest) => <Item t = {t} contest={contest}/>)}
        </div>
      </div>
      <Footer />
    </>
  );
}
