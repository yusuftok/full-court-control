export interface DivisionNode {
  id: string
  name: string
  children?: DivisionNode[]
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
