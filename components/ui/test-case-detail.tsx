import { Check, X, Clock, MemoryStick, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslations } from "next-intl"

interface TestCase {
  index: number
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Memory Limit Exceeded" | "Compile Error"
  executionTime: number
  memoryUsage: number
  input?: string
  expectedOutput?: string
  actualOutput?: string
}

interface TestResultsProps {
  testCases: TestCase[]
}

export default function TestcaseDetail({ 
    testCases
}: TestResultsProps) {
  const t = useTranslations('Playground')
  const passedTests = testCases.filter(test => test.status === "Accepted").length
  const totalTests = testCases.length

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "Accepted":
        return "text-green-500"
      case "Wrong Answer":
        return "text-red-500"
      case "Time Limit Exceeded":
        return "text-yellow-500"
      case "Memory Limit Exceeded":
        return "text-orange-500"
      case "Compile Error":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "Accepted":
        return <Check className="h-4 w-4" />
      case "Time Limit Exceeded":
        return <Clock className="h-4 w-4" />
      case "Memory Limit Exceeded":
        return <MemoryStick className="h-4 w-4" />
      default:
        return <X className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">{t('Test Cases')}</CardTitle>
        <Badge 
          variant={passedTests === totalTests ? "default" : "secondary"}
          className="text-base px-3 py-1"
        >
          {passedTests}/{totalTests}
          {passedTests === totalTests ? (
            <Check className="ml-1 h-4 w-4" />
          ) : (
            <AlertTriangle className="ml-1 h-4 w-4" />
          )}
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t('Status')}</TableHead>
              <TableHead className="text-right">{t('Time')}</TableHead>
              <TableHead className="text-right">{t('Memory')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((testCase) => (
              <TableRow key={testCase.index}>
                <TableCell className="font-medium">{testCase.index}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={testCase.status === 'Accepted' ? "text-green-400" : "text-red-500"}>{t(testCase.status)}</div>
                    <span className={getStatusColor(testCase.status)}>
                      {getStatusIcon(testCase.status)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {testCase.executionTime.toFixed(2)}s
                </TableCell>
                <TableCell className="text-right">
                  {(testCase.memoryUsage / 1024).toFixed(2)}MB
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}