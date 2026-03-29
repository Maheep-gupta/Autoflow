'use client'

import { Button } from './button'
import { X } from 'lucide-react'

interface FilterChip {
  label: string
  value: string
  icon?: React.ReactNode
  count?: number
  id?: string
}

interface FilterChipsProps {
  chips: FilterChip[]
  selectedValue?: string
  selected?: string[]
  onSelect?: (value: string) => void
  onChange?: (values: string[]) => void
  className?: string
  multiple?: boolean
}

export function FilterChips({
  chips,
  selectedValue = 'all',
  selected = [],
  onSelect,
  onChange,
  className = '',
  multiple = false,
}: FilterChipsProps) {
  const handleClick = (value: string) => {
    if (multiple && onChange) {
      const newSelected = selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
      onChange(newSelected)
    } else if (onSelect) {
      onSelect(value)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => (
        <Button
          key={chip.value}
          variant={
            multiple
              ? selected.includes(chip.value) ? 'default' : 'outline'
              : selectedValue === chip.value ? 'default' : 'outline'
          }
          size="sm"
          onClick={() => handleClick(chip.value)}
          className="gap-2 transition-all duration-200"
        >
          {chip.icon}
          {chip.label}
          {chip.count !== undefined && (
            <span className="text-xs ml-1 opacity-70">({chip.count})</span>
          )}
        </Button>
      ))}
    </div>
  )
}
