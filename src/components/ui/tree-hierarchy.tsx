'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Folder, FolderOpen, File, Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface TreeNode {
  id: string
  label: string
  type: 'folder' | 'file' | 'section'
  children?: TreeNode[]
  isExpanded?: boolean
  level?: number
  metadata?: {
    description?: string
    count?: number
    status?: 'active' | 'inactive' | 'draft'
  }
}

interface TreeNodeProps {
  node: TreeNode
  level: number
  isLast: boolean
  parentIsLast: boolean[]
  onToggle: (nodeId: string) => void
  onSelect: (node: TreeNode) => void
  selectedId?: string
  showActions?: boolean
  draggable?: boolean
  onNodeMove?: (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => void
  draggedNodeId?: string | null
  dragOverNodeId?: string | null
  dropPosition?: 'before' | 'after' | 'inside' | null
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  isLast,
  parentIsLast,
  onToggle,
  onSelect,
  selectedId,
  showActions = false,
  draggable = false,
  onNodeMove,
  draggedNodeId,
  dragOverNodeId,
  dropPosition
}) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = node.isExpanded || false
  const isSelected = selectedId === node.id
  
  // Drag & drop states
  const isDragged = draggedNodeId === node.id
  const isDragOver = dragOverNodeId === node.id
  
  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || !onNodeMove) return
    
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', node.id)
    
    const element = e.currentTarget as HTMLElement
    element.style.opacity = '0.5'
  }
  
  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement
    element.style.opacity = '1'
  }
  
  const getDropPosition = (e: React.DragEvent, element: HTMLElement): 'before' | 'after' | 'inside' => {
    const rect = element.getBoundingClientRect()
    const y = e.clientY
    const relativeY = (y - rect.top) / rect.height
    
    if (relativeY < 0.25) return 'before'
    if (relativeY > 0.75) return 'after'
    return 'inside'
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (!draggable || !onNodeMove || !draggedNodeId || draggedNodeId === node.id) return
    
    const position = getDropPosition(e, e.currentTarget as HTMLElement)
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (!draggable || !onNodeMove || !draggedNodeId || !dropPosition || draggedNodeId === node.id) {
      return
    }
    
    onNodeMove(draggedNodeId, node.id, dropPosition)
  }

  // Generate connection lines for visual hierarchy
  const renderConnectionLines = () => {
    const lines = []
    
    // Parent connection lines
    for (let i = 0; i < level - 1; i++) {
      const isParentLast = parentIsLast[i]
      lines.push(
        <div
          key={`parent-${i}`}
          className={cn(
            "absolute top-0 bottom-0 w-px",
            "left-6",
            !isParentLast ? "bg-slate-300 dark:bg-slate-600" : "transparent"
          )}
          style={{ left: `${24 + (i * 24)}px` }}
        />
      )
    }

    // Current level connection
    if (level > 0) {
      lines.push(
        <div
          key="current-horizontal"
          className={cn(
            "absolute top-4 w-4 h-px",
            "bg-slate-300 dark:bg-slate-600"
          )}
          style={{ left: `${24 + ((level - 1) * 24)}px` }}
        />
      )

      if (!isLast) {
        lines.push(
          <div
            key="current-vertical"
            className={cn(
              "absolute top-4 bottom-0 w-px",
              "bg-slate-300 dark:bg-slate-600"
            )}
            style={{ left: `${24 + ((level - 1) * 24)}px` }}
          />
        )
      } else {
        lines.push(
          <div
            key="current-vertical-partial"
            className={cn(
              "absolute top-4 w-px h-4",
              "bg-slate-300 dark:bg-slate-600"
            )}
            style={{ left: `${24 + ((level - 1) * 24)}px` }}
          />
        )
      }
    }

    return lines
  }

  const getIcon = () => {
    if (node.type === 'folder') {
      return hasChildren && isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const getStatusColor = () => {
    switch (node.metadata?.status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
      case 'draft':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
    }
  }

  return (
    <div className="relative">
      {/* Connection Lines */}
      {renderConnectionLines()}
      
      {/* Drop indicators */}
      {isDragOver && dropPosition === 'before' && (
        <div className="absolute -top-1 left-0 right-0 z-40 pointer-events-none">
          <div className="h-0.5 bg-orange-400 rounded-full animate-pulse" />
        </div>
      )}
      {isDragOver && dropPosition === 'after' && (
        <div className="absolute -bottom-1 left-0 right-0 z-40 pointer-events-none">
          <div className="h-0.5 bg-orange-400 rounded-full animate-pulse" />
        </div>
      )}
      
      {/* Node Content */}
      <div
        className={cn(
          "relative flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200",
          "hover:bg-slate-50 dark:hover:bg-slate-800/50",
          "group cursor-pointer border border-transparent",
          isSelected && "bg-blue-50 border-blue-200 shadow-sm dark:bg-blue-900/20 dark:border-blue-800",
          isDragOver && dropPosition === 'inside' && "bg-green-50 border-green-400 ring-2 ring-green-300 dark:bg-green-900/20 dark:border-green-600 dark:ring-green-600",
          isDragged && "opacity-50",
          level === 0 && "font-medium"
        )}
        style={{ paddingLeft: `${20 + (level * 24)}px` }}
        onClick={() => onSelect(node)}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-6 h-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700",
              "flex items-center justify-center shrink-0"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </Button>
        )}
        
        {/* Icon */}
        <div className={cn(
          "flex items-center justify-center shrink-0",
          "w-6 h-6 rounded-md",
          node.type === 'folder' ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
        )}>
          {getIcon()}
        </div>
        
        {/* Label */}
        <span className={cn(
          "flex-1 text-sm",
          level === 0 && "font-medium text-slate-900 dark:text-slate-100",
          level > 0 && "text-slate-700 dark:text-slate-300"
        )}>
          {node.label}
        </span>
        
        {/* Metadata */}
        {node.metadata?.count !== undefined && (
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
            {node.metadata.count}
          </span>
        )}
        
        {/* Status Badge */}
        {node.metadata?.status && (
          <span className={cn(
            "text-xs px-2 py-1 rounded-full border text-center font-medium",
            getStatusColor()
          )}>
            {node.metadata.status === 'active' ? 'Aktif' : 
             node.metadata.status === 'draft' ? 'Taslak' : 
             node.metadata.status === 'inactive' ? 'Pasif' : node.metadata.status}
          </span>
        )}
        
        {/* Actions Menu */}
        {showActions && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation()
                // Handle actions menu
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Description */}
      {node.metadata?.description && isSelected && (
        <div 
          className="text-xs text-slate-600 dark:text-slate-400 mt-1 ml-2"
          style={{ paddingLeft: `${20 + (level * 24)}px` }}
        >
          {node.metadata.description}
        </div>
      )}
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children!.map((child, index) => {
            const childIsLast = index === node.children!.length - 1
            const newParentIsLast = [...parentIsLast, isLast]
            
            return (
              <TreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={childIsLast}
                parentIsLast={newParentIsLast}
                onToggle={onToggle}
                onSelect={onSelect}
                selectedId={selectedId}
                showActions={showActions}
                draggable={draggable}
                onNodeMove={onNodeMove}
                draggedNodeId={draggedNodeId}
                dragOverNodeId={dragOverNodeId}
                dropPosition={dropPosition}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

interface TreeHierarchyProps {
  data: TreeNode[]
  selectedId?: string
  onSelect?: (node: TreeNode) => void
  showActions?: boolean
  className?: string
  emptyStateMessage?: string
  draggable?: boolean
  onNodeMove?: (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => void
}

export const TreeHierarchy: React.FC<TreeHierarchyProps> = ({
  data,
  selectedId,
  onSelect = () => {},
  showActions = false,
  className,
  emptyStateMessage = "Henüz öğe bulunmuyor",
  draggable = false,
  onNodeMove
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  
  // Drag & drop state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null)
  
  // Node move handler with position detection
  const handleNodeMove = (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    if (onNodeMove) {
      onNodeMove(draggedId, targetId, position)
    }
    
    // Clear drag states
    setDraggedNodeId(null)
    setDragOverNodeId(null)
    setDropPosition(null)
  }

  const handleToggle = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const processNodes = (nodes: TreeNode[], level = 0): TreeNode[] => {
    return nodes.map(node => ({
      ...node,
      level,
      isExpanded: expandedNodes.has(node.id),
      children: node.children ? processNodes(node.children, level + 1) : undefined
    }))
  }

  const processedData = processNodes(data)

  if (data.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center py-12 text-slate-500 dark:text-slate-400",
        className
      )}>
        <div className="text-center">
          <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">{emptyStateMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      {processedData.map((node, index) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          isLast={index === processedData.length - 1}
          parentIsLast={[]}
          onToggle={handleToggle}
          onSelect={onSelect}
          selectedId={selectedId}
          showActions={showActions}
          draggable={draggable}
          onNodeMove={handleNodeMove}
          draggedNodeId={draggedNodeId}
          dragOverNodeId={dragOverNodeId}
          dropPosition={dropPosition}
        />
      )))
    </div>
  )
}