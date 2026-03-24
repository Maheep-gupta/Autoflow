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
      screenshot: 'Screenshot',
    }
    const baseLabel = typeNames[type] || type
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
        {/* Node Library - Categorized */}
        <div className="flex-1 overflow-y-auto border-b border-border">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-xs">Basic</h3>
              <div className="space-y-2">
                <button
                  onClick={() => addNode('trigger')}
                  className="w-full p-3 bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-700 dark:from-green-600/20 dark:to-green-700/10 dark:text-green-300 text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-green-500/30 hover:border-green-500/60 cursor-pointer"
                  title="Start your workflow"
                >
                  🚀 Trigger
                </button>
                <button
                  onClick={() => addNode('action')}
                  className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-700 dark:from-blue-600/20 dark:to-blue-700/10 dark:text-blue-300 text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-blue-500/30 hover:border-blue-500/60 cursor-pointer"
                  title="Perform action on app"
                >
                  ⚡ Action
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">Control Flow</h3>
              <div className="space-y-2">
                <button
                  onClick={() => addNode('condition')}
                  className="w-full p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-700 dark:from-yellow-600/20 dark:to-yellow-700/10 dark:text-yellow-300 text-sm font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-yellow-500/30 hover:border-yellow-500/60 cursor-pointer"
                >
                  ❓ Condition
                </button>
                <button
                  onClick={() => addNode('if')}
                  className="w-full p-3 bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 text-indigo-700 dark:from-indigo-600/20 dark:to-indigo-700/10 dark:text-indigo-300 text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-indigo-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer"
                >
                  🔀 If Node
                </button>
                <button
                  onClick={() => addNode('ifElse')}
                  className="w-full p-3 bg-gradient-to-r from-violet-500/20 to-violet-600/10 text-violet-700 dark:from-violet-600/20 dark:to-violet-700/10 dark:text-violet-300 text-sm font-semibold rounded-lg hover:from-violet-600 hover:to-violet-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-violet-500/30 hover:border-violet-500/60 cursor-pointer"
                >
                  🔄 If-Else
                </button>
                <button
                  onClick={() => addNode('switch')}
                  className="w-full p-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 text-cyan-700 dark:from-cyan-600/20 dark:to-cyan-700/10 dark:text-cyan-300 text-sm font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-cyan-500/30 hover:border-cyan-500/60 cursor-pointer"
                >
                  🎯 Switch
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">Loops</h3>
              <div className="space-y-2">
                <button
                  onClick={() => addNode('forLoop')}
                  className="w-full p-3 bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-700 dark:from-red-600/20 dark:to-red-700/10 dark:text-red-300 text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-red-500/30 hover:border-red-500/60 cursor-pointer"
                >
                  🔁 For Loop
                </button>
                <button
                  onClick={() => addNode('whileLoop')}
                  className="w-full p-3 bg-gradient-to-r from-rose-500/20 to-rose-600/10 text-rose-700 dark:from-rose-600/20 dark:to-rose-700/10 dark:text-rose-300 text-sm font-semibold rounded-lg hover:from-rose-600 hover:to-rose-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-rose-500/30 hover:border-rose-500/60 cursor-pointer"
                >
                  ⏱️ While Loop
                </button>
                <button
                  onClick={() => addNode('delay')}
                  className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-700 dark:from-purple-600/20 dark:to-purple-700/10 dark:text-purple-300 text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 hover:text-white hover:shadow-lg transition-all duration-200 text-left border border-purple-500/30 hover:border-purple-500/60 cursor-pointer"
                >
                  ⏸️ Delay
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">Web Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => addNode('openBrowser')}
                  className="w-full p-3 bg-sky-500/10 text-sky-700 dark:text-sky-400 text-sm font-medium rounded-lg hover:bg-sky-500/20 transition text-left"
                >
                  🌐 Open URL
                </button>
                <button
                  onClick={() => addNode('fillInput')}
                  className="w-full p-3 bg-lime-500/10 text-lime-700 dark:text-lime-400 text-sm font-medium rounded-lg hover:bg-lime-500/20 transition text-left"
                >
                  ✏️ Fill Input
                </button>
                <button
                  onClick={() => addNode('clickElement')}
                  className="w-full p-3 bg-teal-500/10 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-lg hover:bg-teal-500/20 transition text-left"
                >
                  🖱️ Click Element
                </button>
                <button
                  onClick={() => addNode('screenshot')}
                  className="w-full p-3 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-lg hover:bg-amber-500/20 transition text-left"
                >
                  📸 Screenshot
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">Integration</h3>
              <div className="space-y-2">
                <button
                  onClick={() => addNode('webhook')}
                  className="w-full p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-lg hover:bg-emerald-500/20 transition text-left"
                >
                  🔗 Webhook
                </button>
                <button
                  onClick={() => addNode('apiRequest')}
                  className="w-full p-3 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm font-medium rounded-lg hover:bg-orange-500/20 transition text-left"
                >
                  🔌 API Request
                </button>
              </div>
            </div>
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
