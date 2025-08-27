// Node types for the flag system
export enum NodeType {
  TEMPLATE = 'template',
  INSTANCE = 'instance',
  GHOST = 'ghost'
}

// Pre-computed flags for performance
export interface NodeFlags {
  isTemplate: boolean
  isInstance: boolean
  isGhost: boolean
  canEdit: boolean
  canDelete: boolean
  canAddChild: boolean
  canDrag: boolean
  canDrop: boolean
}

export interface DivisionNode {
  id: string
  name: string
  nodeType?: NodeType // Make optional temporarily to fix template-data.ts
  children?: DivisionNode[]
  description?: string
  status?: string
  instanceCount?: number // For showing instance counts in templates
  originalTemplateId?: string // For ghost and instance nodes
  
  // Pre-computed flags for performance
  _flags?: NodeFlags
  
  // Legacy support (deprecated - use _flags instead)
  isInstance?: boolean // For marking actual instances vs template nodes
  isGhost?: boolean // Mark if this is a ghost node
}

export interface DivisionTemplate {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
  divisions: DivisionNode[]
}

export interface TreeNodeState {
  expanded: boolean
  selected: boolean
  editing: boolean
}

export interface InteractiveDivisionTreeProps {
  divisions: DivisionNode[]
  level?: number
  treeEditMode?: 'template' | 'division' // Controls button visibility and permissions
  onNodeSelect?: (nodeId: string) => void
  onNodeEdit?: (nodeId: string, newName: string) => void
  onNodeAdd?: (parentId: string) => void
  onNodeDelete?: (nodeId: string) => void
  onNodeMove?: (
    draggedNodeId: string,
    targetNodeId: string,
    position: 'inside' | 'before' | 'after'
  ) => void
  selectedNodeId?: string
  editingNodeId?: string
  onKeyboardNavigation?: (
    nodeId: string,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => void
  // Global drag state
  draggedNode?: string | null
  dragOverNode?: string | null
  dropPosition?: 'inside' | 'before' | 'after' | null
  onDragStateChange?: (
    draggedNode: string | null,
    dragOverNode: string | null,
    dropPosition: 'inside' | 'before' | 'after' | null
  ) => void
  // Synchronized expand/collapse state
  globalExpandedNodes?: Record<string, boolean>
  onNodeExpandToggle?: (nodeId: string) => void
  // Drag & drop control
  isDragEnabled?: (nodeId: string) => boolean
  isDropEnabled?: (nodeId: string) => boolean
}

export interface TemplateFormData {
  name: string
  description: string
  category: 'residential' | 'commercial' | 'infrastructure' | 'renovation'
}

export interface ProjectData {
  id: string
  name: string
  status: string
  progress: number
}
