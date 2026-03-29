'use client'

import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface EnhancedStatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative'
  sparklineData?: number[]
}

export function EnhancedStatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'positive',
  sparklineData = [],
}: EnhancedStatCardProps) {
  // Generate SVG sparkline
  const generateSparkline = (data: number[]) => {
    if (data.length < 2) return null
    
    const max = Math.max(...data)
    const min = Math.min(...data)
    const step = 80 / (data.length - 1)
    
    const points = data
      .map((value, index) => {
        const x = index * step
        const y = 40 - ((value - min) / (max - min)) * 40
        return `${x},${y}`
      })
      .join(' ')

    const areaBottom = `${data.length - 1 * step},40 40,40`
    
    return (
      <svg className="w-16 h-8" viewBox="0 0 80 40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={changeType === 'positive' ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={changeType === 'positive' ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline 
          points={points} 
          fill="none" 
          stroke={changeType === 'positive' ? '#10b981' : '#ef4444'}
          strokeWidth="2"
        />
        <polygon 
          points={`${points} ${areaBottom}`} 
          fill="url(#sparkGradient)"
        />
      </svg>
    )
  }

  return (
    <div className="group relative overflow-hidden bg-linear-to-br from-card to-card/80 rounded-xl border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-transparent to-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-4xl font-bold text-foreground">{value}</p>
          </div>
          
          <div className="h-12 w-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Change indicator */}
        {change && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-1">
              {changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p
                className={`text-xs font-semibold ${
                  changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change}
              </p>
            </div>
            <span className="text-xs text-muted-foreground/60 ml-auto">vs last week</span>
          </div>
        )}

        {/* Sparkline Chart */}
        {sparklineData.length > 0 && (
          <div className="mt-6 flex items-end gap-1 h-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            {generateSparkline(sparklineData)}
          </div>
        )}
      </div>
    </div>
  )
}
