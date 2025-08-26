'use client'

import * as React from 'react'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react'
import {
  DivisionNode,
  InteractiveDivisionTreeProps,
  TreeNodeState,
} from './template-types'

export function InteractiveDivisionTree({
  divisions,
  level = 0,
  onNodeSelect,
  onNodeEdit,
  onNodeAdd,
  onNodeDelete,
  onNodeMove,
  selectedNodeId,
  editingNodeId,
  onKeyboardNavigation,
  onEditingStateChange,
  // Global drag state props
  draggedNode: globalDraggedNode,
  dragOverNode: globalDragOverNode,
  dropPosition: globalDropPosition,
  onDragStateChange,
  // Synchronized expand/collapse state
  globalExpandedNodes,
  onNodeExpandToggle,
  // Drag & drop control
  isDragEnabled,
  isDropEnabled,
}: InteractiveDivisionTreeProps) {
  const [nodeStates, setNodeStates] = React.useState<
    Record<string, TreeNodeState>
  >({})
  const [editingText, setEditingText] = React.useState('')
  const lastEditingNodeRef = React.useRef<string | null>(null)

  // Use global drag state or local fallback
  const draggedNode = globalDraggedNode
  const dragOverNode = globalDragOverNode
  const dropPosition = globalDropPosition

  React.useEffect(() => {
    // Initialize node states with global expand state or default to true
    const initialStates: Record<string, TreeNodeState> = {}
    const initializeNode = (nodes: DivisionNode[]) => {
      nodes.forEach(node => {
        initialStates[node.id] = {
          expanded: globalExpandedNodes?.[node.id] ?? true,
          selected: false,
          editing: false,
        }
        if (node.children) {
          initializeNode(node.children)
        }
      })
    }
    initializeNode(divisions)
    setNodeStates(initialStates)
  }, [divisions, globalExpandedNodes])

  // Handle external editingNodeId changes (from parent)
  React.useEffect(() => {
    if (editingNodeId && lastEditingNodeRef.current !== editingNodeId) {
      lastEditingNodeRef.current = editingNodeId

      // Find the node to start editing
      const findNodeInDivisions = (
        nodes: DivisionNode[]
      ): DivisionNode | null => {
        for (const node of nodes) {
          if (node.id === editingNodeId) return node
          if (node.children) {
            const found = findNodeInDivisions(node.children)
            if (found) return found
          }
        }
        return null
      }

      const nodeToEdit = findNodeInDivisions(divisions)
      if (nodeToEdit) {
        // Set editing state directly without triggering callbacks
        setEditingText(nodeToEdit.name)
        onNodeSelect?.(editingNodeId)

        setNodeStates(prev => {
          const newStates = { ...prev }
          // Disable editing for all nodes first
          Object.keys(newStates).forEach(id => {
            if (newStates[id]) {
              newStates[id] = { ...newStates[id], editing: false }
            }
          })
          // Enable editing for current node
          newStates[editingNodeId] = {
            ...newStates[editingNodeId],
            editing: true,
          }
          return newStates
        })
      }
    } else if (!editingNodeId) {
      lastEditingNodeRef.current = null
    }
  }, [editingNodeId, divisions, onNodeSelect])

  const toggleExpanded = (nodeId: string) => {
    // Use global expand toggle if available, otherwise use local state
    if (onNodeExpandToggle) {
      onNodeExpandToggle(nodeId)
    } else {
      setNodeStates(prev => ({
        ...prev,
        [nodeId]: {
          ...prev[nodeId],
          expanded: !prev[nodeId]?.expanded,
        },
      }))
    }
  }

  const handleNodeClick = (nodeId: string) => {
    // Exit edit mode from any node when clicking on a different node
    const currentlyEditing = Object.keys(nodeStates).find(
      id => nodeStates[id]?.editing
    )
    if (currentlyEditing && currentlyEditing !== nodeId) {
      handleEditCancel()
    }
    onNodeSelect?.(nodeId)
  }

  const handleEditStart = (nodeId: string, currentName: string) => {
    // First cancel any other editing
    handleEditCancel()

    setEditingText(currentName)
    onNodeSelect?.(nodeId)

    // Enable editing mode for this specific node only
    setNodeStates(prev => {
      const newStates = { ...prev }
      // Disable editing for all nodes first
      Object.keys(newStates).forEach(id => {
        if (newStates[id]) {
          newStates[id] = { ...newStates[id], editing: false }
        }
      })
      // Enable editing for current node
      newStates[nodeId] = {
        ...newStates[nodeId],
        editing: true,
      }
      return newStates
    })

    // Only notify parent if this isn't triggered by external editingNodeId
    if (lastEditingNodeRef.current !== nodeId) {
      onEditingStateChange?.(nodeId, true)
    }
  }

  const handleEditSave = (nodeId: string) => {
    if (editingText.trim()) {
      onNodeEdit?.(nodeId, editingText.trim())
    }

    // Clear all edit states
    setEditingText('')
    setNodeStates(prev => {
      const newStates = { ...prev }
      Object.keys(newStates).forEach(id => {
        if (newStates[id]) {
          newStates[id] = { ...newStates[id], editing: false }
        }
      })
      return newStates
    })

    // Notify parent about editing state change
    onEditingStateChange?.(nodeId, false)
  }

  const handleEditCancel = (nodeId?: string) => {
    // Find the currently editing node
    const currentlyEditingId = Object.keys(nodeStates).find(
      id => nodeStates[id]?.editing
    )

    setEditingText('')

    // Always disable editing mode for ALL nodes to prevent conflicts
    setNodeStates(prev => {
      const newStates = { ...prev }
      Object.keys(newStates).forEach(id => {
        if (newStates[id]) {
          newStates[id] = { ...newStates[id], editing: false }
        }
      })
      return newStates
    })

    // Notify parent about editing state change if there was an editing node
    if (currentlyEditingId) {
      onEditingStateChange?.(currentlyEditingId, false)
    }
  }

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, nodeId: string) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        onNodeSelect?.(nodeId)
        break
      case 'F2':
        event.preventDefault()
        const node =
          divisions.find(d => d.id === nodeId) ||
          findNodeInTree(divisions, nodeId)
        if (node) {
          handleEditStart(nodeId, node.name)
        }
        break
      case 'Delete':
        event.preventDefault()
        onNodeDelete?.(nodeId)
        break
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault()
        const direction = event.key.replace('Arrow', '').toLowerCase() as
          | 'up'
          | 'down'
          | 'left'
          | 'right'
        onKeyboardNavigation?.(nodeId, direction)
        break
    }
  }

  // Helper function to find node in tree
  const findNodeInTree = (
    nodes: DivisionNode[],
    targetId: string
  ): DivisionNode | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node
      if (node.children) {
        const found = findNodeInTree(node.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  // Helper to check if drag is allowed
  const isDragAllowed = (draggedId: string, targetId: string): boolean => {
    if (draggedId === targetId) return false

    // Prevent dropping parent into its own child
    const draggedNode = findNodeInTree(divisions, draggedId)
    if (draggedNode) {
      const isTargetDescendant = findNodeInTree(
        draggedNode.children || [],
        targetId
      )
      if (isTargetDescendant) return false
    }

    return true
  }

  return (
    <div className={`${level > 0 ? 'ml-4' : ''} space-y-0 min-h-full relative`}>
      {divisions.map((division, index) => {
        const nodeState = nodeStates[division.id] || {
          expanded: globalExpandedNodes?.[division.id] ?? true,
          selected: false,
          editing: false,
        }
        const isSelected = selectedNodeId === division.id
        const isEditing = nodeState.editing || editingNodeId === division.id
        const hasChildren = division.children && division.children.length > 0
        const isDragged = draggedNode === division.id
        const isDragOver = dragOverNode === division.id
        const isLast = index === divisions.length - 1
        const isExpanded =
          globalExpandedNodes?.[division.id] ?? nodeState.expanded ?? true

        return (
          <div key={division.id} className="relative w-full">
            {/* Tree lines - hierarchy indicators */}
            {level > 0 && (
              <>
                {/* Horizontal line to node */}
                <div className="absolute left-[-16px] top-[12px] w-3 h-px bg-gray-300 dark:bg-gray-600" />
                {/* Vertical line from parent */}
                {!isLast && (
                  <div className="absolute left-[-16px] top-[12px] bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
                )}
                {/* Continue vertical line for siblings above */}
                <div className="absolute left-[-16px] top-0 h-3 w-px bg-gray-300 dark:bg-gray-600" />
              </>
            )}

            {/* Drop zone indicators - clean and minimal */}
            {isDragOver &&
              dropPosition === 'before' &&
              (isDropEnabled ? isDropEnabled(division.id) : true) && (
                <div className="absolute -top-1 left-0 right-0 z-50 pointer-events-none">
                  <div className="h-2 bg-blue-500 rounded-full animate-pulse shadow-lg opacity-90" />
                </div>
              )}
            {isDragOver &&
              dropPosition === 'after' &&
              (isDropEnabled ? isDropEnabled(division.id) : true) && (
                <div className="absolute -bottom-1 left-0 right-0 z-50 pointer-events-none">
                  <div className="h-2 bg-blue-500 rounded-full animate-pulse shadow-lg opacity-90" />
                </div>
              )}

            {/* Simplified node container */}
            <div
              className={`group relative p-1.5 mx-0.5 rounded border transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : isDragOver &&
                      dropPosition === 'inside' &&
                      (isDropEnabled ? isDropEnabled(division.id) : true)
                    ? 'bg-green-100 border-green-400 border-2 shadow-lg'
                    : division.isInstance
                      ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-50 border-gray-200 hover:border-gray-300 hover:bg-slate-100'
              } ${isDragged ? 'opacity-30' : ''}`}
              draggable={
                !isEditing &&
                (isDragEnabled ? isDragEnabled(division.id) : true)
              }
              onClick={() => handleNodeClick(division.id)}
              onDoubleClick={() => {
                // Only allow edit on user-created nodes
                if (division.isInstance) {
                  handleEditStart(division.id, division.name)
                }
              }}
              onDragStart={e => {
                onDragStateChange?.(division.id, null, null)
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', division.id)
                // Lower opacity during drag
                const element = e.currentTarget as HTMLElement
                element.style.opacity = '0.3'
              }}
              onDragEnd={e => {
                onDragStateChange?.(null, null, null)
                // Restore opacity after drag
                const element = e.currentTarget as HTMLElement
                element.style.opacity = '1'
              }}
              onDragOver={e => {
                e.preventDefault()
                if (!draggedNode || draggedNode === division.id) return

                // Check if this node can accept drops
                const canDrop = isDropEnabled
                  ? isDropEnabled(division.id)
                  : true
                if (!canDrop) {
                  e.dataTransfer.dropEffect = 'none'
                  return
                }

                const rect = e.currentTarget.getBoundingClientRect()
                const y = e.clientY - rect.top
                const position =
                  y < rect.height / 3
                    ? 'before'
                    : y > (rect.height * 2) / 3
                      ? 'after'
                      : 'inside'

                onDragStateChange?.(draggedNode, division.id, position)
                e.dataTransfer.dropEffect = 'move'
              }}
              onDrop={e => {
                e.preventDefault()

                // Check if this node can accept drops
                const canDrop = isDropEnabled
                  ? isDropEnabled(division.id)
                  : true
                if (!canDrop) {
                  onDragStateChange?.(null, null, null)
                  return
                }

                if (
                  draggedNode &&
                  dropPosition &&
                  draggedNode !== division.id
                ) {
                  onNodeMove?.(draggedNode, division.id, dropPosition)
                }

                onDragStateChange?.(null, null, null)
              }}
            >
              <div className="flex items-center gap-1.5">
                {/* Expand/Collapse Button with enhanced animation */}
                {hasChildren && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      toggleExpanded(division.id)
                    }}
                    className="size-4 flex items-center justify-center rounded hover:bg-primary/10 transition-all duration-200 group/expand"
                    aria-label={isExpanded ? 'Daralt' : 'Genişlet'}
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-3 text-muted-foreground group-hover/expand:text-primary transition-colors" />
                    ) : (
                      <ChevronRight className="size-3 text-muted-foreground group-hover/expand:text-primary transition-colors" />
                    )}
                  </button>
                )}
                {!hasChildren && (
                  <div className="w-4" /> // Space placeholder for alignment
                )}

                {/* Division Name */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleEditSave(division.id)
                          if (e.key === 'Escape') handleEditCancel()
                        }}
                        className="w-64 px-1.5 py-0.5 text-xs rounded border border-primary/40 focus:border-primary focus:outline-none"
                        maxLength={50}
                        autoFocus
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleEditSave(division.id)
                          }}
                          className="size-4 flex items-center justify-center rounded text-green-600 hover:bg-green-100 transition-all duration-200 hover:scale-110"
                          title="Kaydet ve bitir"
                        >
                          <Save className="size-2.5" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleEditCancel(division.id)
                          }}
                          className="size-4 flex items-center justify-center rounded text-red-600 hover:bg-red-100 transition-colors"
                          title="İptal et"
                        >
                          <X className="size-2.5" />
                        </button>
                        {/* Delete button only for leaf nodes */}
                        {!hasChildren && (
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              onNodeDelete?.(division.id)
                            }}
                            className="size-4 flex items-center justify-center rounded bg-red-100/20 hover:bg-red-500/10 text-red-600 hover:text-red-600 transition-all duration-200 hover:scale-110 border border-red-200/30"
                            title="Sil"
                          >
                            <Trash2 className="size-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center min-h-[18px] w-full">
                      <span
                        className="font-semibold text-xs text-foreground"
                        onDoubleClick={() => {
                          // Only allow edit on user-created nodes
                          if (division.isInstance) {
                            handleEditStart(division.id, division.name)
                          }
                        }}
                      >
                        {division.name}
                      </span>

                      {/* Instance Count Badge - Superscript Style (for template nodes) */}
                      {!division.isInstance &&
                        division.instanceCount !== undefined &&
                        division.instanceCount > 0 && (
                          <div className="ml-1 w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 -translate-y-1">
                            <span className="text-white text-[10px] font-bold leading-none">
                              {division.instanceCount}
                            </span>
                          </div>
                        )}

                      {/* Action Buttons - show based on node type and rules */}
                      <div className="flex items-center gap-2 min-w-[70px] flex-shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100 ml-3">
                        {/* Plus button: Show on template leaf nodes OR user-created nodes */}
                        {((!hasChildren && !division.isInstance) ||
                          division.isInstance) && (
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              onNodeAdd?.(division.id)
                            }}
                            className="size-4 flex items-center justify-center rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                            title="Alt bölüm ekle"
                          >
                            <Plus className="size-2.5" />
                          </button>
                        )}

                        {/* Edit button: Show only on user-created nodes (isInstance=true) */}
                        {division.isInstance && (
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handleEditStart(division.id, division.name)
                            }}
                            className="size-4 flex items-center justify-center rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-all duration-200 hover:scale-110"
                            title="Düzenle"
                          >
                            <Edit className="size-2.5" />
                          </button>
                        )}

                        {/* Delete button: Show only on user-created nodes (isInstance=true) */}
                        {division.isInstance && (
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              onNodeDelete?.(division.id)
                            }}
                            className="size-4 flex items-center justify-center rounded bg-red-100/20 hover:bg-red-500/10 text-red-600 hover:text-red-600 transition-all duration-200 hover:scale-110 border border-red-200/30"
                            title="Sil"
                          >
                            <Trash2 className="size-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Children - show only if expanded */}
            {hasChildren && isExpanded && (
              <div className="mt-0.5">
                <InteractiveDivisionTree
                  divisions={division.children!}
                  level={level + 1}
                  onNodeSelect={onNodeSelect}
                  onNodeEdit={onNodeEdit}
                  onNodeAdd={onNodeAdd}
                  onNodeDelete={onNodeDelete}
                  onNodeMove={onNodeMove}
                  selectedNodeId={selectedNodeId}
                  editingNodeId={editingNodeId}
                  onKeyboardNavigation={onKeyboardNavigation}
                  onEditingStateChange={onEditingStateChange}
                  // Pass global drag state down
                  draggedNode={draggedNode}
                  dragOverNode={dragOverNode}
                  dropPosition={dropPosition}
                  onDragStateChange={onDragStateChange}
                  // Pass global expand state down
                  globalExpandedNodes={globalExpandedNodes}
                  onNodeExpandToggle={onNodeExpandToggle}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Simple non-interactive tree for preview mode
export function DivisionTree({
  divisions,
  level = 0,
}: {
  divisions: DivisionNode[]
  level?: number
}) {
  return (
    <div className={level > 0 ? 'ml-4' : ''}>
      {divisions.map(division => (
        <div key={division.id} className="py-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{division.name}</span>
            </div>
          </div>
          {division.children && (
            <DivisionTree divisions={division.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  )
}
