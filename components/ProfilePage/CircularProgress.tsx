import React from 'react'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  progressColor?: string,
  t: any
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  backgroundColor = '#3e3e3e',
  progressColor = '#00b8a3',
  t
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="transition-all duration-300 ease-in-out"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-300 ease-in-out"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div 
        className="absolute inset-0 flex items-center justify-center flex-col text-foreground"
      >
        <span className="text-3xl font-bold">{percentage}%</span>
        <span className="text-sm">{t('Acceptance')}</span>
      </div>
    </div>
  )
}