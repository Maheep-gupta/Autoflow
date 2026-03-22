'use client'

import React, { useCallback, useState } from 'react'
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

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 5 },
    data: { label: 'On New Email' },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 100, y: 150 },
    data: { label: 'Send Slack Message' },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: 400, y: 150 },
    data: { label: 'Save to Notion' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-a1', source: 'trigger-1', target: 'action-1' },
  { id: 'e1-a2', source: 'trigger-1', target: 'action-2' },
]

interface WorkflowCanvasProps {
  isNew?: boolean
}

export function WorkflowCanvas({ isNew = false }: WorkflowCanvasProps) {
  const emptyNodes: Node[] = []
  const emptyEdges: Edge[] = []
  
  const [nodes, setNodes, onNodesChange] = useNodesState(isNew ? emptyNodes : initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(isNew ? emptyEdges : initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `e-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const addNode = (type: string) => {
    // Generate unique label based on node type count
    const sameTypeNodes = nodes.filter((n) => n.type === type).length + 1
    const typeNames = {
      trigger: 'Trigger',
      action: 'Action',
      condition: 'Condition',
      delay: 'Delay',
      webhook: 'Webhook',
      apiRequest: 'API Request',
    }
    const baseLabel = typeNames[type as keyof typeof typeNames] || type
    const label = `${baseLabel} ${sameTypeNodes}`

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label, description: '' },
    }
    setNodes((nds) => [...nds, newNode])
    // Auto-select the new node
    setSelectedNode(newNode)
  }

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      )
    )
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }

  const deleteSelectedNode = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id)
    }
  }

  // Update nodes with delete handler when they change
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, onDelete: deleteNode }
      }))
    )
  }, [setNodes])

  return (
    <div className="flex w-full h-full gap-4 bg-background text-foreground p-4">
      {/* Canvas */}
      <div className="flex-1 border border-border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20 relative">
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-4xl mb-3 opacity-20">📋</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No nodes yet</h3>
              <p className="text-sm text-muted-foreground">Add your first node from the panel to get started</p>
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
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <div className="w-72 border border-border rounded-lg flex flex-col bg-card overflow-hidden">
        {/* Node Library */}
        <div className="flex-none p-4 border-b border-border">
          <h3 className="font-semibold mb-4 text-foreground">Add Nodes</h3>
          <div className="space-y-2">
            <button
              onClick={() => addNode('trigger')}
              className="w-full p-3 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded hover:bg-green-500/20 transition group relative"
              title="Start point of workflow - e.g., New Email"
            >
              Trigger
              <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-foreground text-background text-xs rounded p-2 whitespace-nowrap z-50">
                Start point - e.g., New Email
              </span>
            </button>
            <button
              onClick={() => addNode('action')}
              className="w-full p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium rounded hover:bg-blue-500/20 transition group relative"
              title="Perform an action - e.g., Send Message"
            >
              Action
              <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-foreground text-background text-xs rounded p-2 whitespace-nowrap z-50">
                Perform action - e.g., Send Message
              </span>
            </button>
            <button
              onClick={() => addNode('condition')}
              className="w-full p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-medium rounded hover:bg-yellow-500/20 transition group relative"
              title="Branch logic - true/false paths"
            >
              Condition
              <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-foreground text-background text-xs rounded p-2 whitespace-nowrap z-50">
                Branch logic - yes/no paths
              </span>
            </button>
            <button
              onClick={() => addNode('delay')}
              className="w-full p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium rounded hover:bg-purple-500/20 transition group relative"
              title="Wait before next action"
            >
              Delay
              <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-foreground text-background text-xs rounded p-2 whitespace-nowrap z-50">
                Wait time - e.g., 5 minutes
              </span>
            </button>
            <button
              onClick={() => addNode('webhook')}
              className="w-full p-3 bg-green-600/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded hover:bg-green-600/20 transition group relative"
              title="Receive external events"
            >
              Webhook
              <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-foreground text-background text-xs rounded p-2 whitespace-nowrap z-50">
                Receive events from apps
              </span>
            </button>
            <button
              onClick={() => addNode('apiRequest')}
              className="w-full p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium rounded hover:bg-orange-500/20 transition group relative"
              title="Make API calls"
            >
              API Request
              <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-foreground text-background text-xs rounded p-2 whitespace-nowrap z-50">
                Call external APIs
              </span>
            </button>
          </div>
        </div>

        {/* Config Panel */}
        <div className="flex-1 overflow-y-auto bg-card">
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
            <div className="p-4 text-sm text-muted-foreground">
              Select a node to configure it
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
