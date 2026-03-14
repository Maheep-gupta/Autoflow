export type WorkflowStatus = 'active' | 'inactive' | 'draft'
export type ExecutionStatus = 'success' | 'failed' | 'running' | 'pending'
export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'apiRequest'

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  createdAt: Date
  updatedAt: Date
  executions: number
  successRate: number
  lastRun?: Date
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: ExecutionStatus
  startedAt: Date
  completedAt?: Date
  duration: number // in milliseconds
  error?: string
}

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: string
  connected?: boolean
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  apps: string[]
  icon?: string
  category: string
  installs: number
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: Record<string, any>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
}

export interface DashboardStats {
  totalWorkflows: number
  activeWorkflows: number
  totalExecutions: number
  successRate: number
}
