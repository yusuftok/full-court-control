'use client'

import { useState } from 'react'
import { 
  Building2, 
  Hammer, 
  FileText, 
  Calendar, 
  Users, 
  Package, 
  Wrench,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Move3D
} from 'lucide-react'
import { TreeHierarchy, TreeNode } from '@/components/ui/tree-hierarchy'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type ProjectItemType = 
  | 'building'
  | 'phase'
  | 'section' 
  | 'task'
  | 'resource'
  | 'document'
  | 'milestone'
  | 'team'

export interface ProjectTreeNode extends Omit<TreeNode, 'type'> {
  type: ProjectItemType
  metadata?: {
    description?: string
    count?: number
    status?: 'planned' | 'in-progress' | 'completed' | 'on-hold'
    priority?: 'low' | 'medium' | 'high' | 'critical'
    duration?: number // in days
    startDate?: string
    endDate?: string
    assignee?: string
    cost?: number
    unit?: string
  }
}

const PROJECT_ICONS = {
  building: Building2,
  phase: Calendar,
  section: Package,
  task: Hammer,
  resource: Wrench,
  document: FileText,
  milestone: Move3D,
  team: Users
} as const

const PROJECT_TYPE_LABELS = {
  building: 'Yapı',
  phase: 'Faz',
  section: 'Bölüm',
  task: 'Görev',
  resource: 'Kaynak',
  document: 'Belge',
  milestone: 'Kilometre Taşı',
  team: 'Takım'
} as const

const STATUS_LABELS = {
  planned: 'Planlanan',
  'in-progress': 'Devam Eden',
  completed: 'Tamamlanan',
  'on-hold': 'Beklemede'
} as const

const PRIORITY_LABELS = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  critical: 'Kritik'
} as const

interface ProjectTreeEditorProps {
  data: ProjectTreeNode[]
  selectedId?: string
  onSelect?: (node: ProjectTreeNode) => void
  onChange?: (data: ProjectTreeNode[]) => void
  readonly?: boolean
  className?: string
}

interface NodeFormData {
  label: string
  type: ProjectItemType
  description: string
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  duration: string
  assignee: string
  cost: string
  unit: string
}

export const ProjectTreeEditor: React.FC<ProjectTreeEditorProps> = ({
  data,
  selectedId,
  onSelect,
  onChange,
  readonly = false,
  className
}) => {
  const [editingNode, setEditingNode] = useState<ProjectTreeNode | null>(null)
  const [isAddingNode, setIsAddingNode] = useState<{ parentId?: string } | null>(null)
  const [formData, setFormData] = useState<NodeFormData>({
    label: '',
    type: 'task',
    description: '',
    status: 'planned',
    priority: 'medium',
    duration: '',
    assignee: '',
    cost: '',
    unit: 'adet'
  })

  // Convert ProjectTreeNode to TreeNode for display
  const convertToTreeNode = (nodes: ProjectTreeNode[]): TreeNode[] => {
    return nodes.map(node => ({
      id: node.id,
      label: node.label,
      type: 'folder',
      children: node.children ? convertToTreeNode(node.children) : undefined,
      metadata: {
        ...node.metadata,
        description: node.metadata?.description,
        count: node.children?.length
      }
    }))
  }

  const handleAddNode = () => {
    if (!onChange) return

    const newNode: ProjectTreeNode = {
      id: `node_${Date.now()}`,
      label: formData.label,
      type: formData.type,
      children: [],
      metadata: {
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        assignee: formData.assignee || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        unit: formData.unit || undefined
      }
    }

    if (isAddingNode?.parentId) {
      // Add as child
      const addToParent = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => {
        return nodes.map(node => {
          if (node.id === isAddingNode.parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode]
            }
          }
          if (node.children) {
            return {
              ...node,
              children: addToParent(node.children)
            }
          }
          return node
        })
      }
      onChange(addToParent(data))
    } else {
      // Add at root level
      onChange([...data, newNode])
    }

    // Reset form
    setFormData({
      label: '',
      type: 'task',
      description: '',
      status: 'planned',
      priority: 'medium',
      duration: '',
      assignee: '',
      cost: '',
      unit: 'adet'
    })
    setIsAddingNode(null)
  }

  const handleEditNode = () => {
    if (!editingNode || !onChange) return

    const updateNode = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => {
      return nodes.map(node => {
        if (node.id === editingNode.id) {
          return {
            ...node,
            label: formData.label,
            type: formData.type,
            metadata: {
              ...node.metadata,
              description: formData.description || undefined,
              status: formData.status,
              priority: formData.priority,
              duration: formData.duration ? parseInt(formData.duration) : undefined,
              assignee: formData.assignee || undefined,
              cost: formData.cost ? parseFloat(formData.cost) : undefined,
              unit: formData.unit || undefined
            }
          }
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children)
          }
        }
        return node
      })
    }

    onChange(updateNode(data))
    setEditingNode(null)
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!onChange) return

    const deleteFromNodes = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          children: node.children ? deleteFromNodes(node.children) : undefined
        }))
    }

    onChange(deleteFromNodes(data))
  }
  
  // Drag & drop handler
  const handleNodeMove = (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => {
    if (!onChange || draggedNodeId === targetNodeId) return
    
    // 1. Dragged node'u bul ve çıkar
    let draggedNode: ProjectTreeNode | null = null
    const removeDraggedNode = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => {
      return nodes.filter(node => {
        if (node.id === draggedNodeId) {
          draggedNode = { ...node }
          return false
        }
        if (node.children) {
          node.children = removeDraggedNode(node.children)
        }
        return true
      })
    }
    
    // 2. Target'ı bul ve node'u ekle
    const insertNode = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => {
      const result: ProjectTreeNode[] = []
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        
        if (node.id === targetNodeId) {
          if (position === 'before') {
            result.push(draggedNode!)
            result.push(node)
          } else if (position === 'after') {
            result.push(node)
            result.push(draggedNode!)
          } else { // inside
            result.push({
              ...node,
              children: [...(node.children || []), draggedNode!]
            })
          }
        } else {
          const newNode = { ...node }
          if (node.children) {
            newNode.children = insertNode(node.children)
          }
          result.push(newNode)
        }
      }
      
      return result
    }
    
    // İşlemleri sırayla yap
    const nodesWithoutDragged = removeDraggedNode([...data])
    if (draggedNode) {
      const finalNodes = insertNode(nodesWithoutDragged)
      onChange(finalNodes)
    }
  }

  const openAddDialog = (parentId?: string) => {
    setIsAddingNode({ parentId })
    setFormData({
      label: '',
      type: 'task',
      description: '',
      status: 'planned',
      priority: 'medium',
      duration: '',
      assignee: '',
      cost: '',
      unit: 'adet'
    })
  }

  const openEditDialog = (node: ProjectTreeNode) => {
    setEditingNode(node)
    setFormData({
      label: node.label,
      type: node.type,
      description: node.metadata?.description || '',
      status: node.metadata?.status || 'planned',
      priority: node.metadata?.priority || 'medium',
      duration: node.metadata?.duration?.toString() || '',
      assignee: node.metadata?.assignee || '',
      cost: node.metadata?.cost?.toString() || '',
      unit: node.metadata?.unit || 'adet'
    })
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-900/20 dark:border-slate-700'
    }
  }

  const renderCustomNode = (node: TreeNode, originalNode: ProjectTreeNode) => {
    const Icon = PROJECT_ICONS[originalNode.type]
    const statusLabel = originalNode.metadata?.status ? STATUS_LABELS[originalNode.metadata.status] : null
    const priorityLabel = originalNode.metadata?.priority ? PRIORITY_LABELS[originalNode.metadata.priority] : null

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 shrink-0" />
          <span>{node.label}</span>
          {originalNode.metadata?.duration && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({originalNode.metadata.duration} gün)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {priorityLabel && (
            <span className={cn(
              "text-xs px-2 py-1 rounded-full border font-medium",
              getPriorityColor(originalNode.metadata?.priority)
            )}>
              {priorityLabel}
            </span>
          )}

          {statusLabel && (
            <span className={cn(
              "text-xs px-2 py-1 rounded-full border font-medium",
              originalNode.metadata?.status === 'completed' && "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
              originalNode.metadata?.status === 'in-progress' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
              originalNode.metadata?.status === 'on-hold' && "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
              originalNode.metadata?.status === 'planned' && "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-700"
            )}>
              {statusLabel}
            </span>
          )}

          {!readonly && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  openAddDialog(originalNode.id)
                }}
                title="Alt öğe ekle"
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  openEditDialog(originalNode)
                }}
                title="Düzenle"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-red-200 dark:hover:bg-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteNode(originalNode.id)
                }}
                title="Sil"
              >
                <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {!readonly && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Proje Yapısı
          </h3>
          <Button
            onClick={() => openAddDialog()}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Öğe Ekle
          </Button>
        </div>
      )}

      {/* Tree */}
      <TreeHierarchy
        data={convertToTreeNode(data)}
        selectedId={selectedId}
        onSelect={(node) => {
          const findOriginalNode = (nodes: ProjectTreeNode[], id: string): ProjectTreeNode | undefined => {
            for (const n of nodes) {
              if (n.id === id) return n
              if (n.children) {
                const found = findOriginalNode(n.children, id)
                if (found) return found
              }
            }
          }
          const originalNode = findOriginalNode(data, node.id)
          if (originalNode && onSelect) {
            onSelect(originalNode)
          }
        }}
        showActions={!readonly}
        emptyStateMessage="Henüz proje öğesi bulunmuyor. Başlamak için 'Öğe Ekle' düğmesine tıklayın."
        draggable={!readonly}
        onNodeMove={handleNodeMove}
      />

      {/* Add/Edit Dialog */}
      <Dialog 
        open={isAddingNode !== null || editingNode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingNode(null)
            setEditingNode(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingNode ? 'Öğeyi Düzenle' : 'Yeni Öğe Ekle'}
            </DialogTitle>
            <DialogDescription>
              {editingNode ? 'Mevcut öğeyi düzenleyin' : 'Proje yapısına yeni bir öğe ekleyin'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="label">Öğe Adı *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Örn: Temel kazısı"
              />
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type">Öğe Türü *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ProjectItemType) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <Label htmlFor="status">Durum</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <Label htmlFor="priority">Öncelik</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Duration */}
              <div>
                <Label htmlFor="duration">Süre (Gün)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                />
              </div>

              {/* Cost */}
              <div>
                <Label htmlFor="cost">Maliyet (TL)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="50000"
                />
              </div>

              {/* Unit */}
              <div>
                <Label htmlFor="unit">Birim</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="m²"
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <Label htmlFor="assignee">Sorumlu</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Ahmet Yılmaz"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Bu öğeyle ilgili detayları buraya yazabilirsiniz..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddingNode(null)
                setEditingNode(null)
              }}
            >
              İptal
            </Button>
            <Button
              type="button"
              onClick={editingNode ? handleEditNode : handleAddNode}
              disabled={!formData.label.trim()}
            >
              {editingNode ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}