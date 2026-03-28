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
import { Plus, Trash2 } from 'lucide-react'

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
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false)

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
    event.stopPropagation()
    setSelectedNode(node)
  }, [])

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

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

  const addNode = (type: string) => {
    const sameTypeNodes = nodes.filter((n) => n.type === type).length + 1
    const baseLabel = typeNames[type] || type
    const label = `${baseLabel} ${sameTypeNodes}`

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: 250 + Math.random() * 100,
        y: 250 + Math.random() * 100,
      },
      data: { label, description: '' },
    }
    setNodes((nds) => [...nds, newNode])
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

  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, onDelete: deleteNode }
      }))
    )
  }, [setNodes])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open add node modal
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsAddNodeOpen(true)
      }
      // Delete or Backspace to delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode && e.target === document.body) {
        e.preventDefault()
        deleteSelectedNode()
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedNode(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode])

  return (
    <div className="flex w-full h-full gap-5 bg-background text-foreground p-5 relative">
      {/* Canvas - Primary Focus */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 border border-border/60 rounded-xl overflow-hidden bg-gradient-to-br from-background/80 via-muted/10 to-background shadow-sm hover:shadow-md transition-shadow duration-300 z-0">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-background/40 to-muted/20 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <div className="text-6xl opacity-30 animate-bounce">📋</div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Ready to build?</h3>
                  <p className="text-sm text-muted-foreground/80 max-w-xs">Click the <span className="font-semibold text-primary">➕ Add Node</span> button or press <span className="font-semibold">Cmd+K</span> to start</p>
                </div>
                <div className="pt-2 text-xs text-muted-foreground/60">💡 Connect nodes to create your automation flow</div>
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

        {/* Floating Add Node Button */}
        <button
          onClick={() => setIsAddNodeOpen(true)}
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          title="Add node (Cmd+K)"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Node</span>
        </button>
      </div>

      {/* Sidebar - Config Only */}
      <div className="w-80 border border-border/60 rounded-xl flex flex-col bg-card shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            {selectedNode ? '⚙️ Node Settings' : '← Select Node'}
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
              <div className="text-4xl">👇</div>
              <div>
                <p className="font-semibold text-foreground mb-1">No node selected</p>
                <p className="text-xs opacity-70 leading-relaxed">Click on a node in the canvas or add a new one using the <span className="font-semibold">➕ Add Node</span> button to start configuring</p>
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
