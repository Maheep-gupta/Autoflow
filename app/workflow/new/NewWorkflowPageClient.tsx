'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function NewWorkflowPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  useEffect(() => {
    // Auto-generate workflow ID and go directly to builder
    const workflowId = `workflow-${Date.now()}`
    const url = projectId ? `/workflow/${workflowId}?projectId=${projectId}` : `/workflow/${workflowId}`
    router.push(url)
  }, [router, projectId])

  return null
}