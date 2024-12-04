'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar } from "lucide-react"

const contestDetails = {
    id: 'testcontest',
    title: 'Test Contest',
    date: '2021-10-01',
    duration: '1 hour',
    problems: [
        { id: 9, title: 'Problem 1', status: 'Accepted', difficulty: 'Easy' },
        { id: 10, title: 'Problem 2', status: 'Accepted', difficulty: 'Medium' },
        { id: 11, title: 'Problem 3', status: 'Accepted', difficulty: 'Hard' },
        { id: 12, title: 'Problem 4', status: 'Not Attempted', difficulty: 'Medium' },
    ],
}

export default function ContestProblemTable() {
    const router = useRouter()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-500'
            case 'Not Attempted':
                return 'bg-gray-500'
            default:
                return 'bg-red-500'
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-200 text-green-800'
            case 'Medium':
                return 'bg-yellow-200 text-yellow-800'
            case 'Hard':
                return 'bg-red-200 text-red-800'
            default:
                return 'bg-gray-200 text-gray-800'
        }
    }

    return (
        <div className="container m-2">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">{contestDetails.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center space-x-6 mb-6">
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <p className="text-lg">{contestDetails.date}</p>
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-2" />
                            <p className="text-lg">{contestDetails.duration}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {contestDetails.problems.map((problem) => (
                            <Card key={problem.id} className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold">{problem.title}</h2>
                                        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge className={getStatusColor(problem.status)}>{problem.status}</Badge>
                                        <Button onClick={() => router.push(`/contests/ongoing/problem/${problem.id}`)}>
                                            Solve
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}