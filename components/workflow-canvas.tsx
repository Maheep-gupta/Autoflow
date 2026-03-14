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
  MiniMap,
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

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: { label: `New ${type}` },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const deleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      )
      setSelectedNode(null)
    }
  }

  return (
    <div className="flex h-screen gap-6 bg-background">
      {/* Canvas */}
      <div className="flex-1 border border-border rounded-lg overflow-hidden">
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
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-border flex flex-col bg-card">
        {/* Node Library */}
        <div className="flex-1 overflow-y-auto p-4 border-b border-border">
          <h3 className="font-semibold mb-4">Add Nodes</h3>
          <div className="space-y-2">
            <button
              onClick={() => addNode('trigger')}
              className="w-full p-3 bg-primary/10 text-primary text-sm font-medium rounded hover:bg-primary/20 transition"
            >
              Trigger
            </button>
            <button
              onClick={() => addNode('action')}
              className="w-full p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium rounded hover:bg-blue-500/20 transition"
            >
              Action
            </button>
            <button
              onClick={() => addNode('condition')}
              className="w-full p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-medium rounded hover:bg-yellow-500/20 transition"
            >
              Condition
            </button>
            <button
              onClick={() => addNode('delay')}
              className="w-full p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium rounded hover:bg-purple-500/20 transition"
            >
              Delay
            </button>
            <button
              onClick={() => addNode('webhook')}
              className="w-full p-3 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded hover:bg-green-500/20 transition"
            >
              Webhook
            </button>
            <button
              onClick={() => addNode('apiRequest')}
              className="w-full p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium rounded hover:bg-orange-500/20 transition"
            >
              API Request
            </button>
          </div>
        </div>

        {/* Config Panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedNode ? (
            <ConfigPanel
              node={selectedNode}
              onDelete={deleteNode}
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
