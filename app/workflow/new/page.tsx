import { Suspense } from 'react'
import NewWorkflowPageClient from './NewWorkflowPageClient'

export default function NewWorkflowPage() {
  return (
    <Suspense fallback={null}>
      <NewWorkflowPageClient />
    </Suspense>
  )
}
