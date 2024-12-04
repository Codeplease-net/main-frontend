import ProblemSetTable from "@/components/ProblemPage/ProblemTable"
import React, {Suspense} from "react"
import Footer from '@/components/footer';

export default function Home({ searchParams }: {
  searchParams: {[key: string]: string | undefined}}) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const category = searchParams.category ? searchParams.category : '';
  return (
    <div>
      <main className="flex-grow p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ProblemSetTable currentPage={currentPage} category={category} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}