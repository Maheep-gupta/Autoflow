import React, { useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Globe,
  RotateCcw,
  RefreshCw,
  MousePointer,
  Type,
  Trash2,
  List,
  CheckSquare,
  Square,
  Hand,
  Keyboard,
  Clock,
  Hourglass,
  Link2,
  Eye,
  Copy,
  Database,
  Settings,
  GitBranch,
  Repeat,
  AlertTriangle,
  Code,
  Network,
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

// Navigation Nodes
export const GoToUrlNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-blue-600 p-4 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-blue-900/20 text-foreground shadow-md min-w-55 transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-blue-500 ring-offset-2 scale-110 shadow-2xl shadow-blue-500/50 border-blue-700 border-4' 
          : 'hover:shadow-xl hover:border-blue-700 hover:scale-105 hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-1'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4" />
        <span className="font-semibold text-sm">Go To URL</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const GoBackNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-purple-600 p-4 bg-linear-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-purple-900/20 text-foreground shadow-md min-w-55 transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-purple-500 ring-offset-2 scale-110 shadow-2xl shadow-purple-500/50 border-purple-700 border-4' 
          : 'hover:shadow-xl hover:border-purple-700 hover:scale-105 hover:ring-2 hover:ring-purple-500/50 hover:ring-offset-1'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <RotateCcw className="h-4 w-4" />
        <span className="font-semibold text-sm">Go Back</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ReloadPageNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-cyan-600 p-4 bg-linear-to-br from-cyan-50 to-white dark:from-cyan-950/30 dark:to-cyan-900/20 text-foreground shadow-md min-w-55 transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-cyan-500 ring-offset-2 scale-110 shadow-2xl shadow-cyan-500/50 border-cyan-700 border-4' 
          : 'hover:shadow-xl hover:border-cyan-700 hover:scale-105 hover:ring-2 hover:ring-cyan-500/50 hover:ring-offset-1'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw className="h-4 w-4" />
        <span className="font-semibold text-sm">Reload Page</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Interaction Nodes
export const ClickNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-green-600 p-4 bg-linear-to-br from-green-50 to-white dark:from-green-950/30 dark:to-green-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-green-500 scale-105 shadow-2xl border-green-700 border-4' 
          : 'hover:shadow-xl hover:border-green-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <MousePointer className="h-4 w-4" />
        <span className="font-semibold text-sm">Click</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const TypeTextNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-emerald-600 p-4 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-emerald-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-emerald-500 scale-105 shadow-2xl border-emerald-700 border-4' 
          : 'hover:shadow-xl hover:border-emerald-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Type className="h-4 w-4" />
        <span className="font-semibold text-sm">Type Text</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ClearInputNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-red-600 p-4 bg-linear-to-br from-red-50 to-white dark:from-red-950/30 dark:to-red-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-red-500 scale-105 shadow-2xl border-red-700 border-4' 
          : 'hover:shadow-xl hover:border-red-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Trash2 className="h-4 w-4" />
        <span className="font-semibold text-sm">Clear Input</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const SelectOptionNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-orange-600 p-4 bg-linear-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-orange-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-orange-500 scale-105 shadow-2xl border-orange-700 border-4' 
          : 'hover:shadow-xl hover:border-orange-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <List className="h-4 w-4" />
        <span className="font-semibold text-sm">Select Option</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const CheckNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-yellow-600 p-4 bg-linear-to-br from-yellow-50 to-white dark:from-yellow-950/30 dark:to-yellow-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-yellow-500 scale-105 shadow-2xl border-yellow-700 border-4' 
          : 'hover:shadow-xl hover:border-yellow-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <CheckSquare className="h-4 w-4" />
        <span className="font-semibold text-sm">Check</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const UncheckNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-lime-600 p-4 bg-linear-to-br from-lime-50 to-white dark:from-lime-950/30 dark:to-lime-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-lime-500 scale-105 shadow-2xl border-lime-700 border-4' 
          : 'hover:shadow-xl hover:border-lime-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Square className="h-4 w-4" />
        <span className="font-semibold text-sm">Uncheck</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const HoverNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-pink-600 p-4 bg-linear-to-br from-pink-50 to-white dark:from-pink-950/30 dark:to-pink-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-pink-500 scale-105 shadow-2xl border-pink-700 border-4' 
          : 'hover:shadow-xl hover:border-pink-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Hand className="h-4 w-4" />
        <span className="font-semibold text-sm">Hover</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const PressKeyNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-indigo-600 p-4 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-indigo-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-2xl border-indigo-700 border-4' 
          : 'hover:shadow-xl hover:border-indigo-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Keyboard className="h-4 w-4" />
        <span className="font-semibold text-sm">Press Key</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Wait Nodes
export const WaitForElementNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-teal-600 p-4 bg-linear-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-teal-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-teal-500 scale-105 shadow-2xl border-teal-700 border-4' 
          : 'hover:shadow-xl hover:border-teal-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4" />
        <span className="font-semibold text-sm">Wait For Element</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const WaitForNavigationNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-sky-600 p-4 bg-linear-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-sky-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-sky-500 scale-105 shadow-2xl border-sky-700 border-4' 
          : 'hover:shadow-xl hover:border-sky-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Hourglass className="h-4 w-4" />
        <span className="font-semibold text-sm">Wait For Navigation</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const WaitForTimeoutNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-violet-600 p-4 bg-linear-to-br from-violet-50 to-white dark:from-violet-950/30 dark:to-violet-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-violet-500 scale-105 shadow-2xl border-violet-700 border-4' 
          : 'hover:shadow-xl hover:border-violet-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4" />
        <span className="font-semibold text-sm">Wait For Timeout</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const WaitForUrlNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-rose-600 p-4 bg-linear-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-rose-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-rose-500 scale-105 shadow-2xl border-rose-700 border-4' 
          : 'hover:shadow-xl hover:border-rose-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="h-4 w-4" />
        <span className="font-semibold text-sm">Wait For URL</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Data Nodes
export const GetTextNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-amber-600 p-4 bg-linear-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-amber-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-amber-500 scale-105 shadow-2xl border-amber-700 border-4' 
          : 'hover:shadow-xl hover:border-amber-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Eye className="h-4 w-4" />
        <span className="font-semibold text-sm">Get Text</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const GetAttributeNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-cyan-600 p-4 bg-linear-to-br from-cyan-50 to-white dark:from-cyan-950/30 dark:to-cyan-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-cyan-500 scale-105 shadow-2xl border-cyan-700 border-4' 
          : 'hover:shadow-xl hover:border-cyan-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Copy className="h-4 w-4" />
        <span className="font-semibold text-sm">Get Attribute</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const GetElementsNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-blue-600 p-4 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-blue-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-2xl border-blue-700 border-4' 
          : 'hover:shadow-xl hover:border-blue-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-4 w-4" />
        <span className="font-semibold text-sm">Get Elements</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const SetVariableNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-green-600 p-4 bg-linear-to-br from-green-50 to-white dark:from-green-950/30 dark:to-green-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-green-500 scale-105 shadow-2xl border-green-700 border-4' 
          : 'hover:shadow-xl hover:border-green-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Settings className="h-4 w-4" />
        <span className="font-semibold text-sm">Set Variable</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const GetVariableNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-purple-600 p-4 bg-linear-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-purple-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-purple-500 scale-105 shadow-2xl border-purple-700 border-4' 
          : 'hover:shadow-xl hover:border-purple-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-4 w-4" />
        <span className="font-semibold text-sm">Get Variable</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Control Nodes
export const IfNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-yellow-600 p-4 bg-linear-to-br from-yellow-50 to-white dark:from-yellow-950/30 dark:to-yellow-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-yellow-500 scale-105 shadow-2xl border-yellow-700 border-4' 
          : 'hover:shadow-xl hover:border-yellow-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="true" />
      <Handle type="source" position={Position.Right} id="false" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-4 w-4" />
        <span className="font-semibold text-sm">If</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ForEachNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-orange-600 p-4 bg-linear-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-orange-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-orange-500 scale-105 shadow-2xl border-orange-700 border-4' 
          : 'hover:shadow-xl hover:border-orange-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="loop" />
      <Handle type="source" position={Position.Right} id="next" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Repeat className="h-4 w-4" />
        <span className="font-semibold text-sm">For Each</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const TryNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-emerald-600 p-4 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-emerald-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-emerald-500 scale-105 shadow-2xl border-emerald-700 border-4' 
          : 'hover:shadow-xl hover:border-emerald-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-semibold text-sm">Try</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const CatchNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-red-600 p-4 bg-linear-to-br from-red-50 to-white dark:from-red-950/30 dark:to-red-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-red-500 scale-105 shadow-2xl border-red-700 border-4' 
          : 'hover:shadow-xl hover:border-red-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-semibold text-sm">Catch</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const RetryNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-indigo-600 p-4 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-indigo-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-2xl border-indigo-700 border-4' 
          : 'hover:shadow-xl hover:border-indigo-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Repeat className="h-4 w-4" />
        <span className="font-semibold text-sm">Retry</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Advanced Nodes
export const ExecuteScriptNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-pink-600 p-4 bg-linear-to-br from-pink-50 to-white dark:from-pink-950/30 dark:to-pink-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-pink-500 scale-105 shadow-2xl border-pink-700 border-4' 
          : 'hover:shadow-xl hover:border-pink-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Code className="h-4 w-4" />
        <span className="font-semibold text-sm">Execute Script</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const HttpRequestNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-lime-600 p-4 bg-linear-to-br from-lime-50 to-white dark:from-lime-950/30 dark:to-lime-900/20 text-foreground shadow-md min-w-55 transition-all ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-lime-500 scale-105 shadow-2xl border-lime-700 border-4' 
          : 'hover:shadow-xl hover:border-lime-700 hover:scale-105'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Network className="h-4 w-4" />
        <span className="font-semibold text-sm">HTTP Request</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

// Generic Workflow Nodes
export const TriggerNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-yellow-500 p-4 bg-linear-to-br from-yellow-50 to-white dark:from-yellow-950/30 dark:to-yellow-900/20 text-foreground shadow-md min-w-64 transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-yellow-500 ring-offset-2 scale-105 shadow-2xl shadow-yellow-500/50 border-yellow-600' 
          : 'hover:shadow-lg hover:border-yellow-600 hover:scale-102'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <span className="font-semibold text-sm">Trigger</span>
        <span className="ml-auto text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">Start</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ActionNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-green-500 p-4 bg-linear-to-br from-green-50 to-white dark:from-green-950/30 dark:to-green-900/20 text-foreground shadow-md min-w-64 transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-green-500 ring-offset-2 scale-105 shadow-2xl shadow-green-500/50 border-green-600' 
          : 'hover:shadow-lg hover:border-green-600 hover:scale-102'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-4 w-4 text-green-600" />
        <span className="font-semibold text-sm">Action</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const ConditionNode = (props: ExtendedNodeProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const isSelected = props.selected || false
  
  return (
    <div
      className={`relative rounded-lg border-2 border-blue-500 p-4 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-blue-900/20 text-foreground shadow-md min-w-64 transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-2xl shadow-blue-500/50 border-blue-600' 
          : 'hover:shadow-lg hover:border-blue-600 hover:scale-102'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
      {(showDelete || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            props.data.onDelete?.(props.id)
          }}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg z-50 transition-all hover:scale-110"
          title="Delete node"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-sm">Condition</span>
      </div>
      <p className="text-xs text-muted-foreground">{props.data.label}</p>
    </div>
  )
}

export const nodeTypes = {
  // Generic workflow nodes
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  // Navigation
  goToUrl: GoToUrlNode,
  goBack: GoBackNode,
  reloadPage: ReloadPageNode,
  // Interaction
  click: ClickNode,
  typeText: TypeTextNode,
  clearInput: ClearInputNode,
  selectOption: SelectOptionNode,
  check: CheckNode,
  uncheck: UncheckNode,
  hover: HoverNode,
  pressKey: PressKeyNode,
  // Wait
  waitForElement: WaitForElementNode,
  waitForNavigation: WaitForNavigationNode,
  waitForTimeout: WaitForTimeoutNode,
  waitForUrl: WaitForUrlNode,
  // Data
  getText: GetTextNode,
  getAttribute: GetAttributeNode,
  getElements: GetElementsNode,
  setVariable: SetVariableNode,
  getVariable: GetVariableNode,
  // Control
  if: IfNode,
  forEach: ForEachNode,
  try: TryNode,
  catch: CatchNode,
  retry: RetryNode,
  // Advanced
  executeScript: ExecuteScriptNode,
  httpRequest: HttpRequestNode,
}
