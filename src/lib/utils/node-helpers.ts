import {
  NodeType,
  NodeFlags,
  DivisionNode,
} from '@/components/templates/template-types'

// UUID generator with prefix for node IDs
export const generateNodeId = (type: NodeType): string => {
  const uuid = crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).substr(2, 9)
  return `${type}-${uuid}`
}

// Type detection from ID (cold path only - avoid in render cycle)
export const getNodeTypeFromId = (id: string): NodeType | null => {
  if (!id || !id.includes('-')) return null

  const prefix = id.split('-')[0]
  if (Object.values(NodeType).includes(prefix as NodeType)) {
    return prefix as NodeType
  }
  return null
}

// Extract original template ID from ghost ID
export const getOriginalTemplateId = (ghostId: string): string | null => {
  if (!ghostId.startsWith('ghost-')) return null
  return `template-${ghostId.replace('ghost-', '')}`
}

// Extract template part from ghost ID to create template ID
export const ghostToTemplateId = (ghostId: string): string => {
  return ghostId.replace('ghost-', 'template-')
}

// Flag computation for performance optimization
export const computeNodeFlags = (
  node: DivisionNode,
  treeEditMode: 'template' | 'division' = 'template'
): NodeFlags => {
  const isTemplateMode = treeEditMode === 'template'
  const nodeType = node.nodeType
  const isLeaf = !node.children || node.children.length === 0

  return {
    isTemplate: nodeType === NodeType.TEMPLATE,
    isInstance: nodeType === NodeType.INSTANCE,
    isGhost: nodeType === NodeType.GHOST,

    // Template mode'da herşey editable, division mode'da sadece instance
    // Ghost node'lar hiçbir zaman edit/delete yapılamaz
    canEdit: isTemplateMode || nodeType === NodeType.INSTANCE,
    canDelete: isTemplateMode || nodeType === NodeType.INSTANCE,

    // Template mode'da herkes, division mode'da sadece leaf ghost + instance
    canAddChild:
      isTemplateMode ||
      (nodeType === NodeType.GHOST && isLeaf) || // Sadece leaf ghost'lara +
      nodeType === NodeType.INSTANCE,

    // Template mode'da herkes, division mode'da sadece instance
    canDrag: isTemplateMode || nodeType === NodeType.INSTANCE,

    // Template mode'da herkes, division mode'da instance+ghost
    canDrop:
      isTemplateMode ||
      nodeType === NodeType.INSTANCE ||
      nodeType === NodeType.GHOST,
  }
}

// Helper to check node type quickly using flags (hot path)
export const isTemplateNode = (node: DivisionNode): boolean => {
  return node._flags?.isTemplate ?? node.nodeType === NodeType.TEMPLATE
}

export const isInstanceNode = (node: DivisionNode): boolean => {
  return node._flags?.isInstance ?? node.nodeType === NodeType.INSTANCE
}

export const isGhostNode = (node: DivisionNode): boolean => {
  return node._flags?.isGhost ?? node.nodeType === NodeType.GHOST
}

// Node creation helpers
export const createTemplateNode = (data: {
  name: string
  children?: DivisionNode[]
  description?: string
}): DivisionNode => {
  return {
    id: generateNodeId(NodeType.TEMPLATE),
    nodeType: NodeType.TEMPLATE,
    ...data,
    _flags: computeNodeFlags({ nodeType: NodeType.TEMPLATE } as DivisionNode),
  }
}

export const createInstanceNode = (data: {
  name: string
  originalTemplateId?: string
  children?: DivisionNode[]
  description?: string
}): DivisionNode => {
  return {
    id: generateNodeId(NodeType.INSTANCE),
    nodeType: NodeType.INSTANCE,
    ...data,
    _flags: computeNodeFlags(
      { nodeType: NodeType.INSTANCE } as DivisionNode,
      'division'
    ),
  }
}

export const createGhostNode = (
  templateNode: DivisionNode,
  instanceCount = 0
): DivisionNode => {
  const ghostId = `ghost-${templateNode.id.replace('template-', '')}`

  return {
    id: ghostId,
    nodeType: NodeType.GHOST,
    name: templateNode.name,
    originalTemplateId: templateNode.id,
    children: templateNode.children,
    description: templateNode.description,
    status: templateNode.status,
    instanceCount,
    _flags: computeNodeFlags(
      { nodeType: NodeType.GHOST } as DivisionNode,
      'division'
    ),
  }
}

// Ensure node has proper flags computed
export const ensureNodeFlags = (
  node: DivisionNode,
  treeEditMode: 'template' | 'division' = 'template'
): DivisionNode => {
  const flags = computeNodeFlags(node, treeEditMode)
  return {
    ...node,
    _flags: flags,
    children: node.children?.map(child => ensureNodeFlags(child, treeEditMode)),
  }
}

// Legacy support functions (for gradual migration)
export const addLegacyFlags = (node: DivisionNode): DivisionNode => {
  return {
    ...node,
    isInstance: node.nodeType === NodeType.INSTANCE,
    isGhost: node.nodeType === NodeType.GHOST,
  }
}

// Validation helpers
export const validateNodeId = (id: string): boolean => {
  if (!id) return false
  const nodeType = getNodeTypeFromId(id)
  return nodeType !== null
}

export const validateNode = (node: DivisionNode): string[] => {
  const errors: string[] = []

  if (!node.id) {
    errors.push('Node ID is required')
  } else if (!validateNodeId(node.id)) {
    errors.push('Invalid node ID format')
  }

  if (!node.name || node.name.trim().length === 0) {
    errors.push('Node name is required')
  }

  if (node.nodeType && !Object.values(NodeType).includes(node.nodeType)) {
    errors.push('Invalid node type')
  }

  return errors
}
