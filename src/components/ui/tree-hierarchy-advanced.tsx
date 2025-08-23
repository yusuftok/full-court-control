'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight, Folder, FolderOpen, File, Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface AdvancedTreeNode {
  id: string
  label: string
  type: 'folder' | 'file' | 'section'
  children?: AdvancedTreeNode[]
  isExpanded?: boolean
  level?: number
  metadata?: {
    description?: string
    count?: number
    status?: 'active' | 'inactive' | 'draft'
    priority?: 'low' | 'medium' | 'high' | 'critical'
    color?: string
    icon?: React.ReactNode
  }
}

interface AdvancedTreeNodeProps {
  node: AdvancedTreeNode
  level: number
  isLast: boolean
  parentConnections: boolean[]
  onToggle: (nodeId: string) => void
  onSelect: (node: AdvancedTreeNode) => void
  selectedId?: string
  showActions?: boolean
  connectionStyle: 'lines' | 'dots' | 'minimal' | 'curved'
  draggable?: boolean
  onNodeMove?: (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => void
  draggedNodeId?: string | null
  dragOverNodeId?: string | null
  dropPosition?: 'before' | 'after' | 'inside' | null
}

const AdvancedTreeNodeComponent: React.FC<AdvancedTreeNodeProps> = ({
  node,
  level,
  isLast,
  parentConnections,
  onToggle,
  onSelect,
  selectedId,
  showActions = false,
  connectionStyle = 'lines',
  draggable = false,
  onNodeMove,
  draggedNodeId,
  dragOverNodeId,
  dropPosition
}) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = node.isExpanded || false
  const isSelected = selectedId === node.id
  const [isHovered, setIsHovered] = useState(false)
  
  // Drag & drop states
  const isDragged = draggedNodeId === node.id
  const isDragOver = dragOverNodeId === node.id
  
  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || !onNodeMove) return
    
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', node.id)
    
    // Sürüklenen öğeyi yarı şeffaf yap
    const element = e.currentTarget as HTMLElement
    element.style.opacity = '0.5'
  }
  
  const handleDragEnd = (e: React.DragEvent) => {
    // Opacity'yi normal yap
    const element = e.currentTarget as HTMLElement
    element.style.opacity = '1'
  }
  
  const getDropPosition = (e: React.DragEvent, element: HTMLElement): 'before' | 'after' | 'inside' => {
    const rect = element.getBoundingClientRect()
    const y = e.clientY
    const relativeY = (y - rect.top) / rect.height
    
    // Üst %25 = before, Alt %25 = after, Orta %50 = inside
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

  // Enhanced connection line rendering with different styles
  const renderConnectionLines = () => {
    if (connectionStyle === 'minimal') return null
    
    const lines = []
    const lineColor = "bg-slate-300 dark:bg-slate-600"
    const activeLineColor = "bg-blue-500 dark:bg-blue-400"
    
    // Parent connection lines with enhanced styling
    for (let i = 0; i < level - 1; i++) {
      const hasParentConnection = parentConnections[i]
      const leftPosition = 20 + (i * 28)
      
      if (connectionStyle === 'curved') {
        lines.push(
          <div
            key={`parent-curved-${i}`}
            className={cn(
              "absolute top-0 bottom-0 w-0.5 rounded-full",
              hasParentConnection ? lineColor : "transparent",
              isSelected && "shadow-sm"
            )}
            style={{ left: `${leftPosition}px` }}
          />
        )
      } else if (connectionStyle === 'dots') {
        // Dotted connection style
        lines.push(
          <div
            key={`parent-dots-${i}`}
            className={cn(
              "absolute top-0 bottom-0 w-0.5",
              hasParentConnection ? "border-l-2 border-dotted border-slate-300 dark:border-slate-600" : "transparent"
            )}
            style={{ left: `${leftPosition}px` }}
          />
        )
      } else {
        // Standard line style
        lines.push(
          <div
            key={`parent-${i}`}
            className={cn(
              "absolute top-0 bottom-0 w-0.5",
              hasParentConnection ? lineColor : "transparent",
              isHovered && hasParentConnection && "bg-blue-400 dark:bg-blue-500"
            )}
            style={{ left: `${leftPosition}px` }}
          />
        )
      }
    }

    // Current level connection with enhanced visual feedback
    if (level > 0) {
      const leftPosition = 20 + ((level - 1) * 28)
      
      if (connectionStyle === 'curved') {
        // Curved connection with smooth borders
        lines.push(
          <svg
            key="curved-connection"
            className="absolute pointer-events-none"
            style={{ 
              left: `${leftPosition - 14}px`, 
              top: '16px',
              width: '28px',
              height: '20px'
            }}
          >
            <path
              d="M 0 0 Q 14 0 14 16 L 28 16"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className={cn(
                "text-slate-300 dark:text-slate-600",
                isHovered && "text-blue-400 dark:text-blue-500"
              )}
            />
          </svg>
        )
      } else {
        // Horizontal connection
        lines.push(
          <div
            key="horizontal"
            className={cn(
              "absolute top-5 h-0.5 rounded-full",
              lineColor,
              isHovered && "bg-blue-400 dark:bg-blue-500"
            )}
            style={{ 
              left: `${leftPosition}px`, 
              width: '16px'
            }}
          />
        )

        // Vertical connection
        if (!isLast) {
          lines.push(
            <div
              key="vertical"
              className={cn(
                "absolute top-5 bottom-0 w-0.5 rounded-full",
                lineColor,
                isHovered && "bg-blue-400 dark:bg-blue-500"
              )}
              style={{ left: `${leftPosition}px` }}
            />
          )
        } else {
          lines.push(
            <div
              key="vertical-partial"
              className={cn(
                "absolute top-5 w-0.5 h-4 rounded-full",
                lineColor,
                isHovered && "bg-blue-400 dark:bg-blue-500"
              )}
              style={{ left: `${leftPosition}px` }}
            />
          )
        }
      }
    }

    return lines
  }

  const getIcon = () => {
    if (node.metadata?.icon) {
      return node.metadata.icon
    }
    
    if (node.type === 'folder') {
      return hasChildren && isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const getStatusColor = () => {
    if (node.metadata?.color) {
      return `bg-${node.metadata.color}-100 text-${node.metadata.color}-700 border-${node.metadata.color}-200`
    }
    
    switch (node.metadata?.status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
      case 'inactive':
        return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700'
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
    }
  }

  const getPriorityIndicator = () => {
    if (!node.metadata?.priority) return null
    
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    
    return (
      <div 
        className={cn(
          "w-1 h-8 rounded-full absolute left-0 top-1",
          colors[node.metadata.priority]
        )}
      />
    )
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection Lines */}
      {renderConnectionLines()}
      
      {/* Priority Indicator */}
      {getPriorityIndicator()}
      
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
          "relative flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300",
          "hover:bg-slate-50 dark:hover:bg-slate-800/50",
          "group cursor-pointer border border-transparent",
          "transform hover:scale-[1.02] hover:shadow-md",
          isSelected && cn(
            "bg-blue-50 border-blue-200 shadow-lg shadow-blue-100/50",
            "dark:bg-blue-900/20 dark:border-blue-800 dark:shadow-blue-900/20"
          ),
          isDragOver && dropPosition === 'inside' && "bg-green-50 border-green-400 ring-2 ring-green-300 dark:bg-green-900/20 dark:border-green-600 dark:ring-green-600",
          isDragged && "opacity-50",
          level === 0 && "font-semibold bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900",
          node.metadata?.priority === 'critical' && "border-l-4 border-l-red-500",
          node.metadata?.priority === 'high' && "border-l-4 border-l-orange-500"
        )}
        style={{ 
          paddingLeft: `${24 + (level * 28)}px`,
          marginLeft: node.metadata?.priority ? '4px' : '0'
        }}
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
              "w-7 h-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700",
              "flex items-center justify-center shrink-0 rounded-lg",
              "transition-all duration-200 hover:scale-110"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            <div className={cn(
              "transition-transform duration-200",
              isExpanded && "rotate-0",
              !isExpanded && "-rotate-90"
            )}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </Button>
        )}
        
        {/* Icon with Enhanced Styling */}
        <div className={cn(
          "flex items-center justify-center shrink-0 transition-all duration-200",
          "w-8 h-8 rounded-lg backdrop-blur-sm",
          node.type === 'folder' ? cn(
            "text-blue-600 dark:text-blue-400",
            "bg-blue-100/50 dark:bg-blue-900/30"
          ) : cn(
            "text-slate-600 dark:text-slate-400",
            "bg-slate-100/50 dark:bg-slate-800/30"
          ),
          isHovered && "scale-110 shadow-md"
        )}>
          {getIcon()}
        </div>
        
        {/* Label with Enhanced Typography */}
        <div className="flex-1 min-w-0">
          <span className={cn(
            "block text-sm font-medium truncate",
            level === 0 && "text-slate-900 dark:text-slate-100 text-base",
            level > 0 && "text-slate-700 dark:text-slate-300",
            isSelected && "text-blue-900 dark:text-blue-100"
          )}>
            {node.label}
          </span>
          
          {/* Description on hover/selection */}
          {node.metadata?.description && (isHovered || isSelected) && (
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {node.metadata.description}
            </span>
          )}
        </div>
        
        {/* Enhanced Metadata Display */}
        <div className="flex items-center gap-2">
          {/* Count Badge */}
          {node.metadata?.count !== undefined && (
            <span className={cn(
              "text-xs text-slate-500 dark:text-slate-400",
              "bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full",
              "font-medium transition-colors duration-200",
              isHovered && "bg-slate-200 dark:bg-slate-600"
            )}>
              {node.metadata.count}
            </span>
          )}
          
          {/* Status Badge */}
          {node.metadata?.status && (
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-semibold",
              "uppercase tracking-wider transition-all duration-200",
              getStatusColor(),
              isHovered && "scale-105 shadow-sm"
            )}>
              {node.metadata.status === 'active' ? 'Aktif' : 
               node.metadata.status === 'draft' ? 'Taslak' : 
               node.metadata.status === 'inactive' ? 'Pasif' : node.metadata.status}
            </span>
          )}
          
          {/* Priority Badge */}
          {node.metadata?.priority && (
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              node.metadata.priority === 'critical' && "bg-red-500 shadow-red-200 shadow-lg",
              node.metadata.priority === 'high' && "bg-orange-500 shadow-orange-200 shadow-lg",
              node.metadata.priority === 'medium' && "bg-yellow-500 shadow-yellow-200 shadow-lg",
              node.metadata.priority === 'low' && "bg-green-500 shadow-green-200 shadow-lg",
              isHovered && "scale-150 shadow-xl"
            )}
          />
        )}
        
        {/* Enhanced Actions Menu */}
        {showActions && (
          <div className={cn(
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "transform translate-x-2 group-hover:translate-x-0"
          )}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-7 h-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700",
                "rounded-lg transition-all duration-200 hover:scale-110"
              )}
              onClick={(e) => {
                e.stopPropagation()
                // Handle actions menu
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Children with Enhanced Animation */}
      {hasChildren && isExpanded && (
        <div className={cn(
          "mt-1 ml-2 transition-all duration-300",
          "animate-in fade-in-0 slide-in-from-top-2"
        )}>
          {node.children!.map((child, index) => {
            const childIsLast = index === node.children!.length - 1
            const newParentConnections = [...parentConnections, !isLast]
            
            return (
              <AdvancedTreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={childIsLast}
                parentConnections={newParentConnections}
                onToggle={onToggle}
                onSelect={onSelect}
                selectedId={selectedId}
                showActions={showActions}
                connectionStyle={connectionStyle}
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

interface AdvancedTreeHierarchyProps {
  data: AdvancedTreeNode[]
  selectedId?: string
  onSelect?: (node: AdvancedTreeNode) => void
  showActions?: boolean
  connectionStyle?: 'lines' | 'dots' | 'minimal' | 'curved'
  className?: string
  emptyStateMessage?: string
  searchQuery?: string
  draggable?: boolean
  onNodeMove?: (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => void
}

export const AdvancedTreeHierarchy: React.FC<AdvancedTreeHierarchyProps> = ({
  data,
  selectedId,
  onSelect = () => {},
  showActions = false,
  connectionStyle = 'lines',
  className,
  emptyStateMessage = "Henüz öğe bulunmuyor",
  searchQuery = '',
  draggable = false,
  onNodeMove
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  
  // Drag & drop state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null)
  
  // Enhanced node move handler with position detection
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

  // Advanced search functionality
  const filterNodes = (nodes: AdvancedTreeNode[], query: string): AdvancedTreeNode[] => {
    if (!query.trim()) return nodes
    
    const lowercaseQuery = query.toLowerCase()
    
    return nodes.reduce((filtered, node) => {
      const matchesQuery = node.label.toLowerCase().includes(lowercaseQuery) ||
                          node.metadata?.description?.toLowerCase().includes(lowercaseQuery)
      
      const filteredChildren = node.children ? filterNodes(node.children, query) : []
      
      if (matchesQuery || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
          isExpanded: filteredChildren.length > 0 ? true : expandedNodes.has(node.id)
        })
        
        // Auto-expand parent nodes when children match
        if (filteredChildren.length > 0) {
          setExpandedNodes(prev => new Set([...prev, node.id]))
        }
      }
      
      return filtered
    }, [] as AdvancedTreeNode[])
  }

  const processNodes = (nodes: AdvancedTreeNode[], level = 0): AdvancedTreeNode[] => {
    return nodes.map(node => ({
      ...node,
      level,
      isExpanded: expandedNodes.has(node.id),
      children: node.children ? processNodes(node.children, level + 1) : undefined
    }))
  }

  const filteredData = searchQuery ? filterNodes(data, searchQuery) : data
  const processedData = processNodes(filteredData)

  if (filteredData.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center py-16 text-slate-500 dark:text-slate-400",
        className
      )}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Folder className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {searchQuery ? 'Sonuç bulunamadı' : 'Liste boş'}
          </h3>
          <p className="text-sm">
            {searchQuery ? 
              `"${searchQuery}" araması için sonuç bulunamadı` : 
              emptyStateMessage
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1 relative", className)}>
      {/* Background Pattern (Optional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg pointer-events-none" />
      
      <div className="relative z-10">
        {processedData.map((node, index) => (
          <AdvancedTreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            isLast={index === processedData.length - 1}
            parentConnections={[]}
            onToggle={handleToggle}
            onSelect={onSelect}
            selectedId={selectedId}
            showActions={showActions}
            connectionStyle={connectionStyle}
            draggable={draggable}
            onNodeMove={handleNodeMove}
            draggedNodeId={draggedNodeId}
            dragOverNodeId={dragOverNodeId}
            dropPosition={dropPosition}
          />
        )))
      </div>
    </div>
  )
}