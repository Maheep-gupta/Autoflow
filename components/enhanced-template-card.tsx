'use client'

import { useState } from 'react'
import { WorkflowTemplate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Download, Eye, Star } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EnhancedTemplateCardProps {
  template: WorkflowTemplate
}

export function EnhancedTemplateCard({ template }: EnhancedTemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    setIsImporting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsImporting(false)
    toast.success(`Template "${template.name}" imported!`, {
      description: 'Redirecting to editor...',
    })
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-linear-to-br from-card to-card/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-transparent to-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Category Tag */}
        <div className="mb-3">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {template.category}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {template.description}
        </p>

        {/* Apps */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Connected apps:</p>
          <div className="flex flex-wrap gap-2">
            {template.apps.map((app) => (
              <span
                key={app}
                className="px-2.5 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs rounded-md border border-blue-500/20 font-medium"
              >
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Rating - optional */}
        {/* {template.rating && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(template.rating!) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preview Hover */}
        <div className="relative mb-4 h-12 bg-background/50 rounded border border-border/30 flex items-center justify-center overflow-hidden group">
          {showPreview ? (
            <div className="text-xs text-muted-foreground space-y-1 px-2 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
                <span>{template.apps[0]}</span>
              </div>
              <div className="text-muted-foreground/50">↓</div>
              <div className="flex items-center justify-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                <span>{template.apps[template.apps.length - 1]}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <Eye className="h-4 w-4 text-muted-foreground/50 mx-auto" />
              <p className="text-xs text-muted-foreground/50">Hover to preview</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Import
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 gap-2"
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  )
}
