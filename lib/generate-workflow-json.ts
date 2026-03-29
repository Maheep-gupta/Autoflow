interface WorkflowNode {
  id: string;
  type: string;
  parameters: Record<string, any>;
  next: string[];
}

interface WorkflowJSON {
  workflowName: string;
  nodes: WorkflowNode[];
}

interface ReactFlowNode {
  id: string;
  type: string;
  data: {
    parameters?: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

// Default parameters for each node type
// Extend this object to support more node types
const DEFAULT_PARAMETERS: Record<string, Record<string, any>> = {
  openBrowser: { url: "", headless: true },
  fillInput: { selector: "", text: "", index: 0 },
  clickButton: { selector: "", index: 0 },
  scrollPage: { direction: "down", amount: 100 },
  waitForNavigation: { timeout: 5000 },
  extractData: { selectors: {} },
  keyboardInput: { text: "", delay: 0 },
  mouseHover: { selector: "", delay: 0 },
  screenshot: { filename: "", fullPage: false },
  goToUrl: { url: "" },
  goBack: { steps: 1 },
  goForward: { steps: 1 },
  selectDropdown: { selector: "", option: "" },
  submitForm: { selector: "" },
};

function generateWorkflowJSON(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[]
): WorkflowJSON {
  // === VALIDATION ===
  if (!Array.isArray(nodes)) {
    console.warn("❌ Validation Error: nodes must be an array");
    return { workflowName: "Autoflow Workflow", nodes: [] };
  }

  if (!Array.isArray(edges)) {
    console.warn("❌ Validation Error: edges must be an array");
    return { workflowName: "Autoflow Workflow", nodes: [] };
  }

  if (nodes.length === 0) {
    console.warn("⚠️  Warning: No nodes provided");
  }

  // === BUILD EDGE MAP ===
  // Maps source node ID → array of target node IDs
  const edgeMap: Record<string, string[]> = {};

  edges.forEach((edge) => {
    if (!edge.source || !edge.target) {
      console.warn(
        `⚠️  Warning: Skipping invalid edge (missing source or target):`,
        edge
      );
      return;
    }

    if (!edgeMap[edge.source]) {
      edgeMap[edge.source] = [];
    }

    // Avoid duplicate target nodes
    if (!edgeMap[edge.source].includes(edge.target)) {
      edgeMap[edge.source].push(edge.target);
    }
  });

  // === PROCESS NODES ===
  const processedNodes: WorkflowNode[] = [];
  const processedNodeIds = new Set<string>();

  nodes.forEach((node) => {
    // Validate node ID
    if (!node.id) {
      console.warn(`⚠️  Warning: Skipping node with missing id:`, node);
      return;
    }

    // Check for duplicate IDs
    if (processedNodeIds.has(node.id)) {
      console.warn(
        `⚠️  Warning: Duplicate node id detected: "${node.id}". Skipping duplicate.`
      );
      return;
    }

    // Validate node type
    if (!node.type) {
      console.warn(
        `⚠️  Warning: Skipping node "${node.id}" with missing type`
      );
      return;
    }

    processedNodeIds.add(node.id);

    // === MERGE PARAMETERS ===
    // Get default parameters for this node type
    const defaultParams = DEFAULT_PARAMETERS[node.type]
      ? { ...DEFAULT_PARAMETERS[node.type] }
      : {};

    // Get user-provided parameters
    const userParams = node.data?.parameters || {};

    // Build merged parameters: defaults + user overrides
    const mergedParams: Record<string, any> = { ...defaultParams };

    // Process user parameters
    Object.entries(userParams).forEach(([key, value]) => {
      // For default parameters: override only if value is valid
      if (key in defaultParams) {
        if (value !== null && value !== undefined) {
          mergedParams[key] = value;
        }
        // else: keep the default value (never undefined/null)
      } else {
        // For custom fields: add only if value is valid
        if (value !== null && value !== undefined) {
          mergedParams[key] = value;
        }
      }
    });

    // === GET OUTGOING EDGES ===
    const nextNodeIds = edgeMap[node.id] || [];

    // Validate that all next node IDs exist
    const validNextNodes = nextNodeIds.filter((nextId) => {
      const nodeExists = nodes.some((n) => n.id === nextId);
      if (!nodeExists) {
        console.warn(
          `⚠️  Warning: Node "${node.id}" references non-existent next node "${nextId}"`
        );
      }
      return nodeExists;
    });

    // === BUILD PROCESSED NODE ===
    const processedNode: WorkflowNode = {
      id: node.id,
      type: node.type,
      parameters: mergedParams,
      next: validNextNodes,
    };

    processedNodes.push(processedNode);
  });

  // === SORT FOR DETERMINISTIC OUTPUT ===
  // Sort by node ID to ensure consistent ordering
  processedNodes.sort((a, b) => a.id.localeCompare(b.id));

  // === DETECT CIRCULAR REFERENCES ===
  function detectCircularReferences(): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function dfs(nodeId: string, path: string[]): boolean {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        const cycle = [...path.slice(cycleStart), nodeId].join(" → ");
        console.warn(`⚠️  Warning: Circular reference detected: ${cycle}`);
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      recursionStack.add(nodeId);
      const node = processedNodes.find((n) => n.id === nodeId);

      if (node) {
        for (const nextId of node.next) {
          if (dfs(nextId, [...path, nodeId])) {
            recursionStack.delete(nodeId);
            return true;
          }
        }
      }

      recursionStack.delete(nodeId);
      visited.add(nodeId);
      return false;
    }

    // Check all nodes for circular references
    processedNodes.forEach((node) => {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    });
  }

  detectCircularReferences();

  // === BUILD OUTPUT ===
  const output: WorkflowJSON = {
    workflowName: "Autoflow Workflow",
    nodes: processedNodes,
  };

  // === LOG FINAL OUTPUT ===
  console.log("✅ Workflow JSON generated successfully:");
  console.log(JSON.stringify(output, null, 2));

  return output;
}

export default generateWorkflowJSON;
