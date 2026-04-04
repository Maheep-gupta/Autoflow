import { ensureNodeParams, TYPE_LABELS } from '@/lib/node-schema'

interface WorkflowNode {
  id: string
  type: string
  label: string
  params: Record<string, any>
  next: string[]
}

interface WorkflowJSON {
  workflowName: string
  nodes: WorkflowNode[]
}

interface ReactFlowNode {
  id: string
  type: string
  data: {
    params?: Record<string, any>
    label?: string
    [key: string]: any
  }
  [key: string]: any
}

interface ReactFlowEdge {
  id: string
  source: string
  target: string
  [key: string]: any
}

function generateWorkflowJSON(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[]
): WorkflowJSON {
  if (!Array.isArray(nodes)) {
    console.warn('❌ Validation Error: nodes must be an array')
    return { workflowName: 'Autoflow Workflow', nodes: [] }
  }

  if (!Array.isArray(edges)) {
    console.warn('❌ Validation Error: edges must be an array')
    return { workflowName: 'Autoflow Workflow', nodes: [] }
  }

  if (nodes.length === 0) {
    console.warn('⚠️  Warning: No nodes provided')
  }

  const edgeMap: Record<string, string[]> = {}

  edges.forEach((edge) => {
    if (!edge.source || !edge.target) {
      console.warn(
        `⚠️  Warning: Skipping invalid edge (missing source or target):`,
        edge
      )
      return
    }

    if (!edgeMap[edge.source]) {
      edgeMap[edge.source] = []
    }

    if (!edgeMap[edge.source].includes(edge.target)) {
      edgeMap[edge.source].push(edge.target)
    }
  })

  const processedNodes: WorkflowNode[] = []
  const processedNodeIds = new Set<string>()

  nodes.forEach((node) => {
    if (!node.id) {
      console.warn(`⚠️  Warning: Skipping node with missing id:`, node)
      return
    }

    if (processedNodeIds.has(node.id)) {
      console.warn(
        `⚠️  Warning: Duplicate node id detected: "${node.id}". Skipping duplicate.`
      )
      return
    }

    if (!node.type) {
      console.warn(`⚠️  Warning: Skipping node "${node.id}" with missing type`) 
      return
    }

    processedNodeIds.add(node.id)

    const userParams = node.data?.params || {}
    const mergedParams = ensureNodeParams(node.type, userParams)
    const label = node.data?.label?.trim() || TYPE_LABELS[node.type] || node.type

    const nextNodeIds = edgeMap[node.id] || []

    const validNextNodes = nextNodeIds.filter((nextId) => {
      const nodeExists = nodes.some((n) => n.id === nextId)
      if (!nodeExists) {
        console.warn(
          `⚠️  Warning: Node "${node.id}" references non-existent next node "${nextId}"`
        )
      }
      return nodeExists
    })

    processedNodes.push({
      id: node.id,
      type: node.type,
      label,
      params: mergedParams,
      next: validNextNodes,
    })
  })

  processedNodes.sort((a, b) => a.id.localeCompare(b.id))

  function detectCircularReferences(): void {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    function dfs(nodeId: string, path: string[]): boolean {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId)
        const cycle = [...path.slice(cycleStart), nodeId].join(' → ')
        console.warn(`⚠️  Warning: Circular reference detected: ${cycle}`)
        return true
      }

      if (visited.has(nodeId)) {
        return false
      }

      recursionStack.add(nodeId)
      const node = processedNodes.find((n) => n.id === nodeId)

      if (node) {
        for (const nextId of node.next) {
          if (dfs(nextId, [...path, nodeId])) {
            recursionStack.delete(nodeId)
            return true
          }
        }
      }

      recursionStack.delete(nodeId)
      visited.add(nodeId)
      return false
    }

    processedNodes.forEach((node) => {
      if (!visited.has(node.id)) {
        dfs(node.id, [])
      }
    })
  }

  detectCircularReferences()

  const output: WorkflowJSON = {
    workflowName: 'Autoflow Workflow',
    nodes: processedNodes,
  }

  console.log('✅ Workflow JSON generated successfully:')
  console.log(JSON.stringify(output, null, 2))

  return output
}

export default generateWorkflowJSON
