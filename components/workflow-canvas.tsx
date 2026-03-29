'use client'

import React, { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './workflow-nodes'
import { ConfigPanel } from './config-panel'
import { AddNodeModal } from './add-node-modal'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Zap, GitBranch } from 'lucide-react'
import { toast } from 'sonner'

const initialNodes: Node[] = []

const initialEdges: Edge[] = []

interface WorkflowCanvasProps {
  isNew?: boolean
  workflowName?: string
}

// Node categories for the left sidebar
const nodeCategories = [
  {
    name: 'Trigger',
    icon: Zap,
    description: 'Start your workflow',
    types: ['trigger'],
    color: 'text-yellow-500',
    examples: ['Gmail', 'Webhook', 'Schedule'],
  },
  {
    name: 'Action',
    icon: GitBranch,
    description: 'Do something',
    types: ['action', 'openBrowser', 'fillInput', 'clickElement', 'selectDropdown', 'getText'],
    color: 'text-green-500',
    examples: ['Send Email', 'Slack Message', 'Notion'],
  },
  {
    name: 'Condition',
    icon: GitBranch,
    description: 'Add logic',
    types: ['condition', 'if', 'else', 'ifElse', 'switch'],
    color: 'text-blue-500',
    examples: ['If...Then', 'Switch', 'Delay'],
  },
]

const typeNames: { [key: string]: string } = {
  trigger: 'Trigger',
  action: 'Action',
  condition: 'Condition',
  delay: 'Delay',
  webhook: 'Webhook',
  apiRequest: 'API Request',
  if: 'If',
  else: 'Else',
  ifElse: 'If-Else',
  switch: 'Switch',
  forLoop: 'For Loop',
  whileLoop: 'While Loop',
  openBrowser: 'Open URL',
  fillInput: 'Fill Input',
  clickElement: 'Click Element',
  selectDropdown: 'Select Dropdown',
  getText: 'Get Text',
  checkExists: 'Check Exists',
  screenshot: 'Screenshot',
}

export function WorkflowCanvas({ isNew = false, workflowName = 'Untitled Workflow' }: WorkflowCanvasProps) {
  const emptyNodes: Node[] = []
  const emptyEdges: Edge[] = []

  const [nodes, setNodes, onNodesChange] = useNodesState(isNew ? emptyNodes : initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(isNew ? emptyEdges : initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

const isPositionOccupied = (nds: Node[], x: number, y: number) => {
  return nds.some(
    (n) =>
      Math.abs(n.position.x - x) < 120 &&
      Math.abs(n.position.y - y) < 100
  )
}

const getSmartPosition = (
  nds: Node[],
  eds: Edge[],
  referenceNode?: Node
) => {
  if (!referenceNode) return { x: 200, y: 50 }

  const children = eds.filter(e => e.source === referenceNode.id)

  const spacingX = 180
  const spacingY = 140

  let x =
    referenceNode.position.x -
    ((children.length * spacingX) / 2) +
    children.length * spacingX

  let y = referenceNode.position.y + spacingY

  // 🔥 avoid collision
  while (isPositionOccupied(nds, x, y)) {
    y += spacingY
  }

  return { x, y }
}


  // Delete node and clean up edges
  const deleteNode = useCallback((nodeId: string) => {
  setEdges((eds) => {
    const getDescendants = (id: string): string[] => {
      const children = eds
        .filter(e => e.source === id)
        .map(e => e.target)

      return children.flatMap(child => [child, ...getDescendants(child)])
    }

    const descendants = getDescendants(nodeId)
    const idsToDelete = new Set([nodeId, ...descendants])

    // remove nodes
    setNodes((nds) => nds.filter(n => !idsToDelete.has(n.id)))

    // remove edges
    return eds.filter(
      e => !idsToDelete.has(e.source) && !idsToDelete.has(e.target)
    )
  })

  setSelectedNode(null)
}, [setNodes, setEdges])

  // Add node with auto-positioning and validation
const addNode = useCallback((type: string) => {
  setNodes((nds) => {
    const hasTrigger = nds.some((n) => n.type === 'trigger')

    if (type !== 'trigger' && !hasTrigger) {
      toast.error('Add a trigger first')
      return nds
    }

    if (type === 'trigger' && hasTrigger) {
      toast.error('Only one trigger allowed')
      return nds
    }

    const sameTypeNodes = nds.filter((n) => n.type === type).length + 1
    const label = `${typeNames[type] || type} ${sameTypeNodes}`

    const referenceNode =
      selectedNode
        ? nds.find((n) => n.id === selectedNode.id)
        : nds[nds.length - 1]

    const children = edges.filter(e => e.source === referenceNode?.id)

    const spacingX = 180
    const spacingY = 140

    let x =
      referenceNode
        ? referenceNode.position.x -
          ((children.length * spacingX) / 2) +
          children.length * spacingX
        : 200

    let y = referenceNode ? referenceNode.position.y + spacingY : 50

    // ✅ collision avoidance
    while (
      nds.some(
        (n) =>
          Math.abs(n.position.x - x) < 120 &&
          Math.abs(n.position.y - y) < 100
      )
    ) {
      y += spacingY
    }

    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position: { x, y },
      data: { label, description: '', onDelete: deleteNode },
    }

    // ✅ add edge safely
    if (referenceNode) {
      setEdges((eds) => {
        const exists = eds.some(
          (e) =>
            e.source === referenceNode.id &&
            e.target === newNode.id
        )

        if (exists) return eds

        return [
          ...eds,
          {
            id: `${referenceNode.id}-${newNode.id}`,
            source: referenceNode.id,
            target: newNode.id,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          },
        ]
      })
    }

    return [...nds, newNode]
  })

  setIsAddNodeOpen(false)
}, [selectedNode, edges, setNodes, setEdges, deleteNode])

const onConnect = useCallback((connection: Connection) => {
  setEdges((eds) => {
    const exists = eds.some(
      (e) =>
        e.source === connection.source &&
        e.target === connection.target
    )

    if (exists) return eds

    return addEdge(
      {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      eds
    )
  })
}, [setEdges])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation()
    setSelectedNode(node)
  }, [])

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const deleteSelectedNode = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsAddNodeOpen(true)
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode && e.target === document.body) {
        e.preventDefault()
        deleteSelectedNode()
      }
      if (e.key === 'Escape') {
        setSelectedNode(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode])

  return (
    <div className="flex w-full h-full gap-0 bg-background text-foreground relative">
      {/* Left Sidebar - Node Categories */}
      <div className="w-64 border-r border-border/50 bg-card/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-4 bg-linear-to-b from-card to-card/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Nodes</h3>
          <p className="text-xs text-muted-foreground/70">Select to add</p>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {nodeCategories.map((category) => {
            const Icon = category.icon
            const isOpen = selectedCategory === category.name
            const hasTrigger = nodes.some((n) => n.type === 'trigger')
            const isDisabled = category.name !== 'Trigger' && !hasTrigger
            const hasTriggerAlready = category.name === 'Trigger' && hasTrigger

            return (
              <div key={category.name}>
                <button
                  onClick={() => {
                    if (!isDisabled && !hasTriggerAlready) {
                      setSelectedCategory(isOpen ? null : category.name)
                    }
                  }}
                  disabled={isDisabled || hasTriggerAlready}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-left group ${isDisabled || hasTriggerAlready
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-accent/20'
                    }`}
                >
                  <Icon className={`h-4 w-4 ${category.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground/60 truncate">
                      {hasTriggerAlready && category.name === 'Trigger' ? 'Already added' : category.description}
                    </p>
                  </div>
                </button>

                {/* Show unlock message */}
                {isDisabled && (
                  <div className="ml-2 mt-1.5 text-xs text-yellow-600/70 italic">
                    ⚡ Add a trigger first
                  </div>
                )}

                {/* Expanded category - Show examples */}
                {isOpen && !isDisabled && !hasTriggerAlready && (
                  <div className="ml-2 mt-2 space-y-1.5 border-l-2 border-primary/30 pl-3">
                    {category.examples.map((example) => (
                      <button
                        key={example}
                        onClick={() => {
                          addNode(category.types[0])
                          setSelectedCategory(null)
                        }}
                        className="w-full text-left text-xs px-2 py-2 rounded text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                      >
                        + {example}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer - Help text */}
        <div className="border-t border-border/50 px-4 py-3 bg-muted/10 text-xs text-muted-foreground/60 text-center">
          � Drag from nodes to connect
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 relative flex flex-col">
        <div className="absolute inset-0 border-r border-border/50 bg-linear-to-br from-background/80 via-muted/5 to-background/80 overflow-hidden">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-linear-to-br from-background/40 to-muted/20 backdrop-blur-sm">
              <div className="text-center space-y-6 px-8">
                <div className="space-y-2">
                  <div className="text-5xl opacity-40">⚙️</div>
                  <h3 className="text-2xl font-bold text-foreground">Start by adding a trigger</h3>
                  <p className="text-sm text-muted-foreground/80 max-w-sm">
                    A trigger is the event that starts your workflow. Like Gmail, Webhook, or Schedule.
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => {
                      addNode('trigger')
                      setIsAddNodeOpen(false)
                    }}
                    className="gap-2 bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white shadow-lg"
                  >
                    <Zap className="h-4 w-4" />
                    Add Trigger
                  </Button>
                </div>

                <div className="pt-4 text-xs text-muted-foreground/60 space-y-1">
                  <p>💡 Or press <span className="font-semibold">Cmd+K</span> to search</p>
                  <p>Use the left panel to browse all available nodes</p>
                </div>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="rgba(200, 200, 200, 0.1)" gap={16} size={0.5} />
            <Controls />
          </ReactFlow>
        </div>

        {/* Floating Add Node Button - Only show if nodes exist */}
        {nodes.length > 0 && (
          <button
            onClick={() => setIsAddNodeOpen(true)}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            title="Add node (Cmd+K)"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Node</span>
          </button>
        )}
      </div>

      {/* Right Sidebar - Config Panel */}
      <div className="w-80 border-l border-border/50 bg-card/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/50 px-5 py-4 bg-linear-to-b from-card to-card/50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {selectedNode ? '⚙️ Settings' : '← Select'}
          </h3>
          {selectedNode && (
            <button
              onClick={deleteSelectedNode}
              className="p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors"
              title="Delete node (Delete)"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-card/50">
          {selectedNode ? (
            <ConfigPanel
              node={selectedNode}
              onDelete={deleteSelectedNode}
              onChange={(updatedNode) => {
                setNodes((nds) =>
                  nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
                )
              }}
            />
          ) : (
            <div className="p-5 text-sm text-muted-foreground text-center space-y-3 h-full flex flex-col items-center justify-center">
              <div className="text-4xl">👆</div>
              <div>
                <p className="font-semibold text-foreground mb-1">No node selected</p>
                <p className="text-xs opacity-70 leading-relaxed">Click on a node in the canvas to configure it</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Node Modal */}
      <AddNodeModal
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        onNodeSelect={addNode}
      />
    </div>
  )
}
