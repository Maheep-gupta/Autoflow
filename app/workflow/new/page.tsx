'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewWorkflowPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-generate workflow ID and go directly to builder
    const workflowId = `workflow-${Date.now()}`
    router.push(`/workflow/${workflowId}`)
  }, [router])

  return null
}
