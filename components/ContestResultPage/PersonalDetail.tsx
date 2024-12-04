import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, CheckCircle, XCircle } from "lucide-react"

interface UserParticipation {
    name: string;
    avatar: string;
    rank: number;
    totalScore: number;
    problem: { status: string }[];
}

export default function PersonalDetail({ userParticipation }: { userParticipation: UserParticipation }) {
    const totalProblems = userParticipation.problem.length
    const solvedProblems = userParticipation.problem.filter(p => p.status === 'Accepted').length
    const progressPercentage = (solvedProblems / totalProblems) * 100

    return(
        <Card className="bg-background text-primary w-full md:w-80 m-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Your Participation</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-primary-foreground">
                <AvatarImage src={userParticipation.avatar} alt={userParticipation.name} />
                <AvatarFallback>{userParticipation.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">{userParticipation.name}</p>
                <div className="flex items-center mt-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  <p>Rank: {userParticipation.rank}</p>
                </div>
                <div className="flex items-center mt-1">
                  <Target className="w-4 h-4 mr-1" />
                  <p>Score: {userParticipation.totalScore}</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Progress</h3>
              <Progress value={progressPercentage} className="h-2 mb-2" />
              <p className="text-sm text-center">{solvedProblems} of {totalProblems} problems solved</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Submissions</h3>
              <ul className="space-y-2">
                {userParticipation.problem.map((problem, index) => (
                  <li key={index} className="flex justify-between items-center bg-primary-foreground/10 rounded-md p-2">
                    <span className="text-sm">Problem {index + 1}</span>
                    <Badge 
                      variant={problem.status === 'Accepted' ? 'default' : 'destructive'}
                      className="flex items-center"
                    >
                      {problem.status === 'Accepted' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {problem.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
    )
}