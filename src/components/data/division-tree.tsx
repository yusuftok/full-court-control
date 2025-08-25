'use client'

import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

export interface DivisionNode {
  id: string
  name: string
  description?: string
  children: DivisionNode[]
  isExpanded?: boolean
  type: 'division' | 'subdiv' | 'task'
  properties?: Record<string, unknown>
}

interface SortableTreeNodeProps {
  node: DivisionNode
  depth: number
  onToggle: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onAddChild: (parentId: string) => void
  editingId: string | null
  setEditingId: (id: string | null) => void
}

function SortableTreeNode({
  node,
  depth,
  onToggle,
  onRename,
  onDelete,
  onAddChild,
  editingId,
  setEditingId,
}: SortableTreeNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [tempName, setTempName] = useState(node.name)
  const isEditing = editingId === node.id

  const handleStartEdit = useCallback(() => {
    setEditingId(node.id)
    setTempName(node.name)
  }, [node.id, node.name, setEditingId])

  const handleSaveEdit = useCallback(() => {
    onRename(node.id, tempName)
    setEditingId(null)
  }, [node.id, tempName, onRename, setEditingId])

  const handleCancelEdit = useCallback(() => {
    setTempName(node.name)
    setEditingId(null)
  }, [node.name, setEditingId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveEdit()
      } else if (e.key === 'Escape') {
        handleCancelEdit()
      }
    },
    [handleSaveEdit, handleCancelEdit]
  )

  const hasChildren = node.children.length > 0

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            'group flex items-center gap-2 p-2 rounded-lg border transition-all duration-200',
            'construction-hover hover:bg-muted/50 hover:border-primary/20',
            isDragging
              ? 'opacity-50'
              : '',
            'hover:shadow-sm'
          )}
          {...attributes}
          {...listeners}
        >
          <div
            style={{ marginLeft: `${depth * 20}px` }}
            className="flex items-center gap-2"
          >
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onToggle(node.id)}
              >
                {node.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Node Icon */}
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200 group-hover:scale-125',
                node.type === 'division'
                  ? 'bg-blue-500 group-hover:bg-blue-600'
                  : node.type === 'subdiv'
                    ? 'bg-green-500 group-hover:bg-green-600'
                    : 'bg-orange-500 group-hover:bg-orange-600'
              )}
            />

            {/* Editable Name */}
            {isEditing ? (
              <Input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="h-6 px-2 text-sm"
                autoFocus
              />
            ) : (
              <span
                className="text-sm font-medium cursor-pointer"
                onDoubleClick={handleStartEdit}
              >
                {node.name}
              </span>
            )}

            {/* Type Badge */}
            <span
              className={cn(
                'px-2 py-1 text-xs rounded-full transition-colors duration-200',
                node.type === 'division'
                  ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                  : node.type === 'subdiv'
                    ? 'bg-green-100 text-green-700 group-hover:bg-green-200'
                    : 'bg-orange-100 text-orange-700 group-hover:bg-orange-200'
              )}
            >
              {node.type === 'division'
                ? '🏢 Division'
                : node.type === 'subdiv'
                  ? '🔧 Subdiv'
                  : '🔨 Task'}
            </span>
          </div>

          {/* Actions */}
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onAddChild(node.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleStartEdit}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(node.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={() => onAddChild(node.id)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </ContextMenuItem>
        <ContextMenuItem onClick={handleStartEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onDelete(node.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

interface TreeProps {
  nodes: DivisionNode[]
  onNodesChange: (nodes: DivisionNode[]) => void
}

function Tree({ nodes, onNodesChange }: TreeProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const flattenTree = useCallback(
    (
      nodes: DivisionNode[],
      depth = 0
    ): Array<{ node: DivisionNode; depth: number }> => {
      const result: Array<{ node: DivisionNode; depth: number }> = []

      for (const node of nodes) {
        result.push({ node, depth })
        if (node.isExpanded && node.children.length > 0) {
          result.push(...flattenTree(node.children, depth + 1))
        }
      }

      return result
    },
    []
  )

  const updateNode = useCallback(
    (
      nodes: DivisionNode[],
      id: string,
      updates: Partial<DivisionNode>
    ): DivisionNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, ...updates }
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children, id, updates) }
        }
        return node
      })
    },
    []
  )

  const deleteNode = useCallback(
    (nodes: DivisionNode[], id: string): DivisionNode[] => {
      return nodes
        .filter(node => {
          if (node.id === id) {
            return false
          }
          if (node.children.length > 0) {
            return { ...node, children: deleteNode(node.children, id) }
          }
          return true
        })
        .map(node => ({
          ...node,
          children: deleteNode(node.children, id),
        }))
    },
    []
  )

  const addChildNode = useCallback(
    (nodes: DivisionNode[], parentId: string): DivisionNode[] => {
      const newNode: DivisionNode = {
        id: `node-${Date.now()}`,
        name: 'New Node',
        children: [],
        isExpanded: false,
        type: 'subdiv',
      }

      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...node.children, newNode],
            isExpanded: true,
          }
        }
        if (node.children.length > 0) {
          return { ...node, children: addChildNode(node.children, parentId) }
        }
        return node
      })
    },
    []
  )

  const handleToggle = useCallback(
    (id: string) => {
      const updatedNodes = updateNode(nodes, id, {})
      const targetNode = flattenTree(updatedNodes).find(
        ({ node }) => node.id === id
      )?.node
      if (targetNode) {
        const newNodes = updateNode(nodes, id, {
          isExpanded: !targetNode.isExpanded,
        })
        onNodesChange(newNodes)
      }
    },
    [nodes, onNodesChange, updateNode, flattenTree]
  )

  const handleRename = useCallback(
    (id: string, name: string) => {
      const newNodes = updateNode(nodes, id, { name })
      onNodesChange(newNodes)
    },
    [nodes, onNodesChange, updateNode]
  )

  const handleDelete = useCallback(
    (id: string) => {
      const newNodes = deleteNode(nodes, id)
      onNodesChange(newNodes)
    },
    [nodes, onNodesChange, deleteNode]
  )

  const handleAddChild = useCallback(
    (parentId: string) => {
      const newNodes = addChildNode(nodes, parentId)
      onNodesChange(newNodes)
    },
    [nodes, onNodesChange, addChildNode]
  )

  const flattenedNodes = flattenTree(nodes)

  return (
    <div className="space-y-1">
      {flattenedNodes.map(({ node, depth }) => (
        <SortableTreeNode
          key={node.id}
          node={node}
          depth={depth}
          onToggle={handleToggle}
          onRename={handleRename}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      ))}
    </div>
  )
}

export interface DivisionTreeProps {
  data: DivisionNode[]
  onChange: (data: DivisionNode[]) => void
  className?: string
}

export function DivisionTree({ data, onChange, className }: DivisionTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      // Find the active and over nodes
      const flattenTree = (nodes: DivisionNode[]): DivisionNode[] => {
        const result: DivisionNode[] = []
        for (const node of nodes) {
          result.push(node)
          if (node.children.length > 0) {
            result.push(...flattenTree(node.children))
          }
        }
        return result
      }

      const flatNodes = flattenTree(data)
      const oldIndex = flatNodes.findIndex(node => node.id === active.id)
      const newIndex = flatNodes.findIndex(node => node.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(flatNodes, oldIndex, newIndex)
        // This is a simplified reorder - in a real app you'd need more complex tree manipulation
        onChange(newOrder.filter((_, index) => index < data.length))
      }
    }

    setActiveId(null)
  }

  const addRootNode = () => {
    const newNode: DivisionNode = {
      id: `node-${Date.now()}`,
      name: 'New Division',
      children: [],
      isExpanded: false,
      type: 'division',
    }
    onChange([...data, newNode])
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 animate-build-up">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🗺️ Blueprint Structure
        </h3>
        <Button onClick={addRootNode} size="sm" className="group">
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
          Draft New Section
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map(node => node.id)}
          strategy={verticalListSortingStrategy}
        >
          <Tree nodes={data} onNodesChange={onChange} />
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="p-2 bg-background border rounded-lg shadow-lg">
              Dragging node...
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
