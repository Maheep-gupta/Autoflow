import React, { useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Zap,
  Shield,
  Clock,
  GitBranch,
  Webhook,
  Database,
  X,
} from 'lucide-react'

interface CustomNodeData {
  label: string
  type: string
  onDelete?: (nodeId: string) => void
}

interface ExtendedNodeProps extends NodeProps<CustomNodeData> {
  id: string
}

export const TriggerNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Zap
  return (
    <div
      className="relative rounded-lg border-2 border-green-600 p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-green-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-green-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {showDelete && (
        <button
          onClick={() => props.data.onDelete?.(props.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Trigger</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ActionNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Zap
  return (
    <div
      className="relative rounded-lg border-2 border-blue-600 p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-blue-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-blue-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {showDelete && (
        <button
          onClick={() => props.data.onDelete?.(props.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Action</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ConditionNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = GitBranch
  return (
    <div
      className="relative rounded-lg border-2 border-yellow-600 p-4 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/30 dark:to-yellow-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-yellow-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="true" />
      <Handle type="source" position={Position.Right} id="false" />
      {showDelete && (
        <button
          onClick={() => props.data.onDelete?.(props.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Condition</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const DelayNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Clock
  return (
    <div
      className="relative rounded-lg border-2 border-purple-600 p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-purple-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-purple-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {showDelete && (
        <button
          onClick={() => props.data.onDelete?.(props.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Delay</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const WebhookNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Webhook
  return (
    <div
      className="relative rounded-lg border-2 border-emerald-600 p-4 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-emerald-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-emerald-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {showDelete && (
        <button
          onClick={() => props.data.onDelete?.(props.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-sm">Webhook</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ApiRequestNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Database
  return (
    <div
      className="relative rounded-lg border-2 border-orange-600 p-4 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-orange-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-orange-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {showDelete && (
        <button
          onClick={() => props.data.onDelete?.(props.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
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
