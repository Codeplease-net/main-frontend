import ContestProblemTable from "@/components/ContestOngoingPage/ContestProblemList"
import ContestLeaderBoard from '@/components/ContestOngoingPage/ContestLeaderBoard'
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
export default function ContestDetail() {
    return (
        <div className="flex">
            <ContestProblemTable />
            <ContestLeaderBoard ContestResult={ContestResult}/>
        </div>
    )
} 