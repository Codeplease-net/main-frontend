"use client"

import React from "react"
import ProblemsPage from "@/components/ProblemPage/ProblemPage"

interface SearchParams {
  [key: string]: string | undefined
}

export default function ProblemSetPage({ searchParams }: { searchParams: SearchParams }) {
  return <ProblemsPage searchParams={searchParams} />
}