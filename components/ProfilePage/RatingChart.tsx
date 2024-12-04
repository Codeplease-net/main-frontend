"use client"

import { format } from "date-fns"
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useFormatter, useTranslations } from "next-intl"

function formatDateToLocalizedString(timestamp: number): string {
  const formatter = useFormatter();
  
  // Convert timestamp to a localized date string
  return formatter.dateTime(new Date(timestamp), {
      dateStyle: 'long', // Use 'short', 'medium', or 'full' for different styles
  });
}

// Example data structure
const data = [
  {"time": 1577836800000, "rating": 1024},
  {"time": 1590099200000, "rating": 1138},
  {"time": 1602361600000, "rating": 1210},
  {"time": 1614624000000, "rating": 1175},
  {"time": 1626886400000, "rating": 1340},
  {"time": 1639148800000, "rating": 1298},
  {"time": 1651411200000, "rating": 1456},
  {"time": 1663673600000, "rating": 1543},
  {"time": 1675936000000, "rating": 1421},
  {"time": 1688198400000, "rating": 1608},
]

const CustomTooltip = ({ active, payload, t }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className=" flex gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {t('Date')}
            </span>
            <span className="font-bold text-muted-foreground">
              {formatDateToLocalizedString(payload[0].payload.time)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {t('Rating')}
            </span>
            <span className="font-bold">
              {payload[0].payload.rating}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function RatingChart() {
  const t = useTranslations('Profile')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Rating Progress')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(220, 38, 38)" stopOpacity={0.2} />
                  <stop offset="20%" stopColor="rgb(234, 88, 12)" stopOpacity={0.2} />
                  <stop offset="40%" stopColor="rgb(234, 179, 8)" stopOpacity={0.2} />
                  <stop offset="60%" stopColor="rgb(22, 163, 74)" stopOpacity={0.2} />
                  <stop offset="80%" stopColor="rgb(59, 130, 246)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(unixTime: number) => format(unixTime, 'MMM yyyy')}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[1000, 2000]}
                ticks={[1000, 1200, 1400, 1600, 1900, 2000]}
              />
              <Tooltip content={<CustomTooltip t = {t}/>} />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="none"
                fill="url(#colorRating)"
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                  r: 4,
                }}
                activeDot={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}