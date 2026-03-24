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

// Advanced Control Flow Nodes
export const IfNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = GitBranch
  return (
    <div
      className="relative rounded-lg border-2 border-indigo-600 p-4 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-indigo-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-indigo-700 hover:scale-105"
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
        <span className="font-semibold text-sm">If</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ElseNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = GitBranch
  return (
    <div
      className="relative rounded-lg border-2 border-pink-600 p-4 bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/30 dark:to-pink-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-pink-700 hover:scale-105"
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
        <span className="font-semibold text-sm">Else</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const IfElseNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = GitBranch
  return (
    <div
      className="relative rounded-lg border-2 border-violet-600 p-4 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/30 dark:to-violet-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-violet-700 hover:scale-105"
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
        <span className="font-semibold text-sm">If-Else</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const SwitchNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = GitBranch
  return (
    <div
      className="relative rounded-lg border-2 border-cyan-600 p-4 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/30 dark:to-cyan-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-cyan-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="case1" />
      <Handle type="source" position={Position.Right} id="case2" />
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
        <span className="font-semibold text-sm">Switch</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ForLoopNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Clock
  return (
    <div
      className="relative rounded-lg border-2 border-red-600 p-4 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-red-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-red-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="loop" />
      <Handle type="source" position={Position.Right} id="next" />
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
        <span className="font-semibold text-sm">For Loop</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const WhileLoopNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const Icon = Clock
  return (
    <div
      className="relative rounded-lg border-2 border-rose-600 p-4 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-rose-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-rose-700 hover:scale-105"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="loop" />
      <Handle type="source" position={Position.Right} id="exit" />
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
        <span className="font-semibold text-sm">While Loop</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Web Automation Action Nodes
export const OpenBrowserNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div
      className="relative rounded-lg border-2 border-sky-600 p-4 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-sky-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-sky-700 hover:scale-105"
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
        <span className="text-lg">🌐</span>
        <span className="font-semibold text-sm">Open URL</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const FillInputNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div
      className="relative rounded-lg border-2 border-lime-600 p-4 bg-gradient-to-br from-lime-50 to-white dark:from-lime-950/30 dark:to-lime-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-lime-700 hover:scale-105"
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
        <span className="text-lg">✏️</span>
        <span className="font-semibold text-sm">Fill Input</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ClickElementNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div
      className="relative rounded-lg border-2 border-teal-600 p-4 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-teal-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-teal-700 hover:scale-105"
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
        <span className="text-lg">🖱️</span>
        <span className="font-semibold text-sm">Click Element</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ScreenshotNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div
      className="relative rounded-lg border-2 border-amber-600 p-4 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-amber-900/20 text-foreground shadow-md min-w-[220px] hover:shadow-xl transition-all hover:border-amber-700 hover:scale-105"
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
        <span className="text-lg">📸</span>
        <span className="font-semibold text-sm">Screenshot</span>
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
  if: IfNode,
  else: ElseNode,
  ifElse: IfElseNode,
  switch: SwitchNode,
  forLoop: ForLoopNode,
  whileLoop: WhileLoopNode,
  openBrowser: OpenBrowserNode,
  fillInput: FillInputNode,
  clickElement: ClickElementNode,
  screenshot: ScreenshotNode,
}
