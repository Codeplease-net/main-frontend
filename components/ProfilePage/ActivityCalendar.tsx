"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslations } from 'next-intl'

interface ActivityData {
  date: string
  count: number
}

interface ActivityCalendarProps {
  data: ActivityData[]
  year: number
}

const getColor = (count: number, maxCount: number) => {
  if (count === 0) return 'bg-muted'
  const intensity = Math.min(count / maxCount, 1)
  return `bg-gradient-to-t from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 opacity-${Math.round(intensity * 100)}`
}

const getDayOfWeek = (date: Date, t: any) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return t(days[date.getDay()])
}

const getMonthName = (month: number, t: any) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return t(months[month])
}

export default function ActivityCalendar({ data, year }: ActivityCalendarProps) {
  const t = useTranslations('Profile')
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 12, 31)
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const activityMap = new Map(data.map(item => [item.date, item.count]))
  const maxCount = Math.max(...data.map(item => item.count))

  const calendar = Array.from({ length: totalDays }, (_, index) => {
    const currentDate = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000)
    const dateString = currentDate.toISOString().split('T')[0]
    return {
      date: dateString,
      count: activityMap.get(dateString) || 0
    }
  })

  return (
    <Card className="w-fulll">
      <CardHeader>
        <CardTitle className='text-primary'>{t('Activity Calendar', {year})}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-end space-x-2 text-sm text-muted-foreground">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ width: 'calc(100% / 12)' }} className="text-center">
                {getMonthName(i, t)}
              </div>
            ))}
          </div>
          <div className="flex">
            <div className="flex-grow grid grid-cols-53 gap-1">
              {calendar.map((day) => (
                <TooltipProvider key={day.date}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-4 h-4 rounded-sm ${getColor(day.count, maxCount)}`}
                        onMouseEnter={() => setHoveredDate(day.date)}
                        onMouseLeave={() => setHoveredDate(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getDayOfWeek(new Date(day.date), t)}, {day.date}</p>
                      <p>{t('activites', {number: day.count})}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}