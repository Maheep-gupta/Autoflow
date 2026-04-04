/**
 * Utility functions for consistent date/time formatting
 * These functions produce the same output on server and client
 */

// Helper to ensure we have a Date object
function ensureDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

export function formatTime(date: Date | string): string {
  const dateObj = ensureDate(date)
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatTimeWithSeconds(date: Date | string): string {
  const dateObj = ensureDate(date)
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function formatDateTime(date: Date | string): string {
  const dateObj = ensureDate(date)
  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = formatTime(dateObj)
  return `${dateStr} ${timeStr}`
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = ensureDate(date)
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
