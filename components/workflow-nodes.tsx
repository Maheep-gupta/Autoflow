import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Zap,
  Shield,
  Clock,
  GitBranch,
  Webhook,
  Database,
} from 'lucide-react'

const nodeStyles = {
  base: 'rounded-lg border-2 p-4 bg-card text-foreground shadow-md min-w-[180px]',
  trigger: 'border-primary',
  action: 'border-blue-500',
  condition: 'border-yellow-500',
  delay: 'border-purple-500',
  webhook: 'border-green-500',
  api: 'border-orange-500',
}

const iconMap = {
  trigger: Zap,
  action: Zap,
  condition: GitBranch,
  delay: Clock,
  webhook: Webhook,
  apiRequest: Database,
}

interface CustomNodeData {
  label: string
  type: string
}

export const TriggerNode = (props: NodeProps<CustomNodeData>) => {
  const Icon = Zap
  return (
    <div className={`${nodeStyles.base} ${nodeStyles.trigger}`}>
      <Handle type="output" position={Position.Bottom} />
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Trigger</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ActionNode = (props: NodeProps<CustomNodeData>) => {
  const Icon = Zap
  return (
    <div className={`${nodeStyles.base} ${nodeStyles.action}`}>
      <Handle type="input" position={Position.Top} />
      <Handle type="output" position={Position.Bottom} />
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Action</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ConditionNode = (props: NodeProps<CustomNodeData>) => {
  const Icon = GitBranch
  return (
    <div className={`${nodeStyles.base} ${nodeStyles.condition}`}>
      <Handle type="input" position={Position.Top} />
      <Handle type="output" position={Position.Bottom} id="true" />
      <Handle type="output" position={Position.Right} id="false" />
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Condition</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const DelayNode = (props: NodeProps<CustomNodeData>) => {
  const Icon = Clock
  return (
    <div className={`${nodeStyles.base} ${nodeStyles.delay}`}>
      <Handle type="input" position={Position.Top} />
      <Handle type="output" position={Position.Bottom} />
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Delay</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const WebhookNode = (props: NodeProps<CustomNodeData>) => {
  const Icon = Webhook
  return (
    <div className={`${nodeStyles.base} ${nodeStyles.webhook}`}>
      <Handle type="input" position={Position.Top} />
      <Handle type="output" position={Position.Bottom} />
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Webhook</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ApiRequestNode = (props: NodeProps<CustomNodeData>) => {
  const Icon = Database
  return (
    <div className={`${nodeStyles.base} ${nodeStyles.api}`}>
      <Handle type="input" position={Position.Top} />
      <Handle type="output" position={Position.Bottom} />
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">API Request</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  webhook: WebhookNode,
  apiRequest: ApiRequestNode,
}
