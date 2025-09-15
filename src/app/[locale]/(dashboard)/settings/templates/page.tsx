'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  FolderTree,
  Copy,
  Edit,
  Trash2,
  ChevronRight,
  Save,
  X,
  Sparkles,
  CheckCircle,
  Construction,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

// Import refactored components
import {
  DivisionTemplate,
  DivisionNode,
  TemplateFormData,
} from '@/components/templates/template-types'
import {
  mockTemplates,
  mockProjects,
  getDefaultDivisions,
  countNodes,
} from '@/components/templates/template-data'
import { InteractiveDivisionTree } from '@/components/templates/tree-components'
import {
  CreateTemplateModal,
  ApplyToProjectModal,
  DuplicateTemplateModal,
  DeleteTemplateModal,
} from '@/components/templates/template-modals'

export default function DivisionTemplatesPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<DivisionTemplate | null>(null)
  const [showSearchResults, setShowSearchResults] = React.useState(false)

  // Template state - using local state instead of mock data
  const [templates, setTemplates] =
    React.useState<DivisionTemplate[]>(mockTemplates)

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isApplyToProjectOpen, setIsApplyToProjectOpen] = React.useState(false)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = React.useState(false)
  const [templateToDuplicate, setTemplateToDuplicate] =
    React.useState<DivisionTemplate | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [templateToDelete, setTemplateToDelete] =
    React.useState<DivisionTemplate | null>(null)

  // Tree editor state
  const [editingTemplate, setEditingTemplate] =
    React.useState<DivisionTemplate | null>(null)
  const [selectedNodeId, setSelectedNodeId] = React.useState<
    string | undefined
  >(undefined)
  const [editingNodeId, setEditingNodeId] = React.useState<string | undefined>(
    undefined
  )

  // Global drag state for cross-parent operations
  const [globalDraggedNode, setGlobalDraggedNode] = React.useState<
    string | null
  >(null)
  const [globalDragOverNode, setGlobalDragOverNode] = React.useState<
    string | null
  >(null)
  const [globalDropPosition, setGlobalDropPosition] = React.useState<
    'inside' | 'before' | 'after' | null
  >(null)

  // Template form state
  const [templateForm, setTemplateForm] = React.useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'residential',
  })

  const breadcrumbItems = [
    { label: 'Ayarlar', href: '/settings' },
    { label: 'Şablonlar', href: '/settings/templates' },
  ]

  const filteredTemplates = React.useMemo(() => {
    if (!searchTerm) return templates

    return templates.filter(
      template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, templates])

  const handleCreateTemplate = () => {
    setTemplateForm({ name: '', description: '', category: 'residential' })
    setIsCreateModalOpen(true)
  }

  const handleCreateTemplateSubmit = () => {
    if (!templateForm.name.trim() || !templateForm.description.trim()) {
      // No native alerts
      return
    }

    // Create new template with basic structure
    const newTemplate: DivisionTemplate = {
      id: Date.now().toString(),
      name: templateForm.name,
      description: templateForm.description,
      createdBy: 'Siz',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      divisions: getDefaultDivisions(templateForm.category),
    }

    // Show celebration message with construction theme
    const categoryMessages = {
      residential: '🏠 Harika! Yeni konut şablonunuz temel atıldı!',
      commercial: '🏢 Mükemmel! İş dünyası için şablonunuz hazır!',
      infrastructure: '🌉 Süper! Altyapı şablonunuz inşaat alanında!',
      renovation: '🔨 Bravo! Renovasyon şablonunuz hazır durumda!',
    }

    // No native alerts

    // Add to templates list and set for editing
    setTemplates(prev => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)
    setEditingTemplate(newTemplate)
    setSelectedNodeId(undefined)
    setEditingNodeId(undefined)
    setIsCreateModalOpen(false)
  }

  const handleEditTemplate = (template: DivisionTemplate) => {
    setSelectedTemplate(template)
    setEditingTemplate({ ...template })
    setSelectedNodeId(undefined)
    setEditingNodeId(undefined)
  }

  const handleSaveTemplate = () => {
    if (!editingTemplate) return

    // Calculate template completeness for encouragement
    const totalNodes = countNodes(editingTemplate.divisions)
    const completenessMessage =
      totalNodes >= 10
        ? `🏆 Harika! ${totalNodes} bölümle çok detaylı bir şablon!`
        : totalNodes >= 5
          ? `👍 Güzel! ${totalNodes} bölümle dengeli bir şablon!`
          : `💪 Başlangıç için harika! ${totalNodes} bölümle temel atıldı!`

    // In real app, this would save to backend
    // No native alerts

    // Update the selected template with changes
    setSelectedTemplate(editingTemplate)
    setEditingTemplate(null)
  }

  // Enhanced tree editing handlers
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(selectedNodeId === nodeId ? undefined : nodeId)
  }

  const handleKeyboardNavigation = (
    nodeId: string,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    // Keyboard navigation implementation
    // This would require flattening the tree structure to navigate between nodes
    console.log(`Navigating ${direction} from node ${nodeId}`)
    // Implementation details would go here for a full keyboard navigation system
  }

  // Global drag state handler
  const handleDragStateChange = (
    draggedNode: string | null,
    dragOverNode: string | null,
    dropPosition: 'inside' | 'before' | 'after' | null
  ) => {
    setGlobalDraggedNode(draggedNode)
    setGlobalDragOverNode(dragOverNode)
    setGlobalDropPosition(dropPosition)
  }

  // Clean cross-parent node move handler
  const handleNodeMove = (
    draggedNodeId: string,
    targetNodeId: string,
    position: 'inside' | 'before' | 'after'
  ) => {
    if (!editingTemplate) return
    if (draggedNodeId === targetNodeId) return

    let draggedNode: DivisionNode | null = null

    // Special handling for root target
    if (targetNodeId === 'root') {
      // Extract node
      const extractNode = (nodes: DivisionNode[]): DivisionNode[] => {
        return nodes.reduce((acc, node) => {
          if (node.id === draggedNodeId) {
            draggedNode = { ...node }
            return acc
          }

          const updatedNode = { ...node }
          if (node.children && node.children.length > 0) {
            updatedNode.children = extractNode(node.children)
          }
          acc.push(updatedNode)
          return acc
        }, [] as DivisionNode[])
      }

      const nodesWithoutDragged = extractNode([...editingTemplate.divisions])

      if (draggedNode) {
        const finalNodes = [...nodesWithoutDragged, draggedNode]

        setEditingTemplate({
          ...editingTemplate,
          divisions: finalNodes,
        })
      }
      return
    }

    // 1. Dragged node'u bul ve çıkar
    const extractNode = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.reduce((acc, node) => {
        if (node.id === draggedNodeId) {
          draggedNode = { ...node }
          return acc // Skip this node
        }

        const updatedNode = { ...node }
        if (node.children && node.children.length > 0) {
          updatedNode.children = extractNode(node.children)
        }
        acc.push(updatedNode)
        return acc
      }, [] as DivisionNode[])
    }

    // 2. Target node'a göre insert et
    const insertNodeAtTarget = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.map(node => {
        // Recursively check deeper levels first
        const updatedNode = { ...node }
        if (node.children && node.children.length > 0) {
          updatedNode.children = insertNodeAtTarget(node.children)
        }

        // Eğer bu node target node ise
        if (node.id === targetNodeId) {
          if (position === 'inside') {
            // Target node'un içine ekle - child olarak
            return {
              ...updatedNode,
              children: [...(updatedNode.children || []), draggedNode!],
            }
          }
        }

        // Eğer bu node'un children'ından biri target ise
        if (updatedNode.children && updatedNode.children.length > 0) {
          const targetChildIndex = updatedNode.children.findIndex(
            child => child.id === targetNodeId
          )

          if (targetChildIndex !== -1) {
            // Target child bulundu
            const newChildren = [...updatedNode.children]

            if (position === 'before') {
              newChildren.splice(targetChildIndex, 0, draggedNode!)
            } else if (position === 'after') {
              newChildren.splice(targetChildIndex + 1, 0, draggedNode!)
            }

            return {
              ...updatedNode,
              children: newChildren,
            }
          }
        }

        return updatedNode
      })
    }

    // 3. Root level target check
    const insertAtRootLevel = (nodes: DivisionNode[]): DivisionNode[] => {
      const targetIndex = nodes.findIndex(node => node.id === targetNodeId)

      if (targetIndex !== -1) {
        const newNodes = [...nodes]

        if (position === 'before') {
          newNodes.splice(targetIndex, 0, draggedNode!)
        } else if (position === 'after') {
          newNodes.splice(targetIndex + 1, 0, draggedNode!)
        } else if (position === 'inside') {
          // Target root node'un içine ekle
          newNodes[targetIndex] = {
            ...newNodes[targetIndex],
            children: [...(newNodes[targetIndex].children || []), draggedNode!],
          }
        }

        return newNodes
      }

      // Target root'ta bulunamadı, nested levels'a bak
      return insertNodeAtTarget(nodes)
    }

    // İşlemi gerçekleştir
    const nodesWithoutDragged = extractNode([...editingTemplate.divisions])

    if (draggedNode) {
      const finalNodes = insertAtRootLevel(nodesWithoutDragged)

      setEditingTemplate({
        ...editingTemplate,
        divisions: finalNodes,
      })
    }
  }

  // Helper function to check if nodes have same parent - Fixed version
  const findParentOfNode = (
    nodes: DivisionNode[],
    targetNodeId: string,
    draggedNodeId: string
  ): boolean => {
    for (const node of nodes) {
      if (node.children) {
        const childIds = node.children.map(child => child.id)
        const hasTarget = childIds.includes(targetNodeId)
        const hasDragged = childIds.includes(draggedNodeId)

        if (hasTarget && hasDragged) {
          return true // Same parent found
        }

        // Recursively check in children - but avoid infinite recursion
        if (
          node.children.length > 0 &&
          findParentOfNode(node.children, targetNodeId, draggedNodeId)
        ) {
          return true
        }
      }
    }
    return false
  }

  const handleNodeEdit = (nodeId: string, newName: string) => {
    if (!editingTemplate) return

    const updateNode = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, name: newName }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }

    setEditingTemplate({
      ...editingTemplate,
      divisions: updateNode(editingTemplate.divisions),
    })
    setEditingNodeId(undefined)

    // Show subtle success feedback only for meaningful changes
    if (newName.trim().length > 0 && newName !== 'Yeni Bölüm') {
      // Create a temporary success indicator without disrupting flow
      const successElement = document.createElement('div')
      successElement.innerHTML = '✓ Kaydedildi'
      successElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
      `
      document.body.appendChild(successElement)

      requestAnimationFrame(() => {
        successElement.style.opacity = '1'
        successElement.style.transform = 'translateY(0)'
      })

      setTimeout(() => {
        successElement.style.opacity = '0'
        successElement.style.transform = 'translateY(-10px)'
        setTimeout(() => document.body.removeChild(successElement), 300)
      }, 2000)
    }
  }

  const handleNodeAdd = (parentId: string) => {
    if (!editingTemplate) return

    const newNode: DivisionNode = {
      id: `new-${Date.now()}`,
      name: 'Yeni Bölüm',
    }

    const addNode = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          }
        }
        if (node.children) {
          return { ...node, children: addNode(node.children) }
        }
        return node
      })
    }

    setEditingTemplate({
      ...editingTemplate,
      divisions: addNode(editingTemplate.divisions),
    })

    // Auto-select and edit the new node
    setSelectedNodeId(newNode.id)
    setEditingNodeId(newNode.id)
  }

  const handleNodeDelete = (nodeId: string) => {
    if (!editingTemplate) return

    const deleteNode = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) return false
        if (node.children) {
          node.children = deleteNode(node.children)
        }
        return true
      })
    }

    setEditingTemplate({
      ...editingTemplate,
      divisions: deleteNode(editingTemplate.divisions),
    })

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(undefined)
    }
  }

  const handleDuplicateTemplate = (template: DivisionTemplate) => {
    setTemplateToDuplicate(template)
    setIsDuplicateModalOpen(true)
  }

  const handleConfirmDuplicate = (newName: string) => {
    if (!templateToDuplicate) return

    const duplicatedTemplate: DivisionTemplate = {
      ...templateToDuplicate,
      id: Date.now().toString(),
      name: newName,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    }

    console.log('🔥 Creating duplicate template:', duplicatedTemplate)
    console.log('🔥 Current templates count:', templates.length)

    // Add to templates list at the beginning for visibility
    setTemplates(prev => {
      const newTemplates = [duplicatedTemplate, ...prev]
      console.log('🔥 New templates count:', newTemplates.length)
      console.log('🔥 First template name:', newTemplates[0]?.name)
      return newTemplates
    })

    // Reset states and open duplicated template for editing
    setTemplateToDuplicate(null)
    setSelectedTemplate(duplicatedTemplate)
    setEditingTemplate(duplicatedTemplate)
    setSelectedNodeId(undefined)
    setEditingNodeId(undefined)
  }

  const handleApplyToProject = (template: DivisionTemplate) => {
    setSelectedTemplate(template)
    setIsApplyToProjectOpen(true)
  }

  const handleConfirmApplyToProject = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId)
    if (!project || !selectedTemplate) return

    // Calculate the impact for more meaningful feedback
    const totalNodes = countNodes(selectedTemplate.divisions)
    const impactMessage =
      project.progress < 30
        ? '🚀 Mükemmel zamanlama! Proje başlangıcına ideal!'
        : project.progress < 70
          ? '⚡ Tam zamanında! Planlamayı güçlendirecek!'
          : '🎯 İyi düşünülmüş! Son aşama organizasyonu!'

    // No native alerts

    setIsApplyToProjectOpen(false)
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = (template: DivisionTemplate) => {
    setTemplateToDelete(template)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      // Remove template from state
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id))

      // If we're currently editing the deleted template, clear editor
      if (editingTemplate?.id === templateToDelete.id) {
        setEditingTemplate(null)
        setSelectedNodeId(undefined)
      }
    }
    setTemplateToDelete(null)
  }

  return (
    <PageContainer>
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        {/* Custom header with inline description */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Bölüm Şablonları
            </h1>
            <span className="text-sm text-muted-foreground">
              Projeleriniz için yeniden kullanılabilir bölüm hiyerarşileri
              oluşturun ve yönetin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Search moved to header */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Şablon ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-72 h-9"
              />
            </div>
            <Button
              onClick={handleCreateTemplate}
              className="modern-button gradient-primary border-0 text-white hover:scale-105 group hover:shadow-lg"
            >
              <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="group-hover:scale-105 transition-transform duration-200">
                Yeni Şablon
              </span>
              <Sparkles className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>

        {/* Template Cards - Simplified */}
        {!selectedTemplate && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filteredTemplates.map((template, index) => {
              if (index === 0)
                console.log('🔥 Rendering first template:', template.name)
              return (
                <Card
                  key={template.id}
                  className="flex flex-col glass-card !p-2 modern-hover group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-white/10 hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                          {template.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                          className="size-7"
                        >
                          <Edit className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateTemplate(template)}
                          className="size-7"
                        >
                          <Copy className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTemplate(template)}
                          className="size-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      {/* Template Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {template.createdBy} tarafından oluşturuldu
                        </span>
                        <span className="text-muted-foreground">
                          {template.usageCount} kez kullanıldı
                        </span>
                      </div>

                      {/* Template Quick Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{template.divisions.length} ana bölüm</span>
                        <span>
                          Son güncelleme:{' '}
                          {new Date(template.updatedAt).toLocaleDateString(
                            'tr-TR'
                          )}
                        </span>
                      </div>

                      {/* Single Action Button */}
                      <Button
                        className="w-full modern-button group bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:scale-105 hover:shadow-lg"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setEditingTemplate({ ...template })
                          setSelectedNodeId(undefined)
                          setEditingNodeId(undefined)
                        }}
                      >
                        <Edit className="size-4 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="group-hover:tracking-wide transition-all duration-200">
                          Şablonu Düzenle
                        </span>
                        <ChevronRight className="size-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Template Editor Area */}
        {selectedTemplate && (
          <div className="space-y-4">
            {/* Editor Header */}
            <Card className="glass-card !p-0">
              <CardContent className="py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(null)
                        setEditingTemplate(null)
                      }}
                      className="modern-button group border-2 border-muted/40 hover:border-primary/40 flex items-center gap-2"
                    >
                      <X className="size-4 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:tracking-wide transition-all duration-200">
                        Geri Dön
                      </span>
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <div>
                      <h2 className="text-lg font-semibold">
                        {selectedTemplate.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedTemplate.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(selectedTemplate)}
                      className="modern-button group border-2 border-muted/40 hover:border-primary/40"
                    >
                      <Copy className="size-4 mr-2 group-hover:scale-110 transition-transform" />
                      Kopyala
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApplyToProject(selectedTemplate)}
                      className="modern-button group border-2 border-green-500/20 hover:border-green-500/40"
                    >
                      <FolderTree className="size-4 mr-2 group-hover:scale-110 transition-transform" />
                      Projeye Uygula
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveTemplate}
                      className="gradient-primary text-white hover:shadow-lg group"
                    >
                      <Save className="size-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:tracking-wide transition-all duration-200">
                        Kaydet
                      </span>
                      <CheckCircle className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Tree Editor with enhanced features */}
            <Card className="glass-card !p-0">
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="size-4 text-primary" />
                    <h3 className="font-medium text-sm">Bölüm Hiyerarşisi</h3>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {selectedTemplate.divisions.length} ana bölüm
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-2 min-h-[100px]">
                  <InteractiveDivisionTree
                    divisions={
                      editingTemplate?.divisions || selectedTemplate.divisions
                    }
                    onNodeSelect={handleNodeSelect}
                    onNodeEdit={handleNodeEdit}
                    onNodeAdd={handleNodeAdd}
                    onNodeDelete={handleNodeDelete}
                    onNodeMove={handleNodeMove}
                    selectedNodeId={selectedNodeId}
                    editingNodeId={editingNodeId}
                    onKeyboardNavigation={handleKeyboardNavigation}
                    // Global drag state
                    draggedNode={globalDraggedNode}
                    dragOverNode={globalDragOverNode}
                    dropPosition={globalDropPosition}
                    onDragStateChange={handleDragStateChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedTemplate && filteredTemplates.length === 0 && (
          <Card className="glass-card !p-4 modern-hover">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="size-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-float-tools hover:animate-pulse">
                <FolderTree className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Şablon Deposu Boş 📋
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchTerm
                  ? 'Aradığınızı bulmak için arama kriterlerinizi ayarlamayı deneyin.'
                  : 'Proje planlamaya başlamak için ilk bölüm şablonunuzu oluşturun.'}
              </p>
              <Button
                onClick={handleCreateTemplate}
                className="modern-button gradient-primary border-0 text-white hover:scale-105 group hover:shadow-xl"
              >
                <Construction className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-200">
                  İlk Şablonunu Oluştur
                </span>
                <Sparkles className="size-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Template Modal */}
        <CreateTemplateModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          templateForm={templateForm}
          onTemplateFormChange={setTemplateForm}
          onSubmit={handleCreateTemplateSubmit}
        />

        {/* Apply to Project Modal */}
        <ApplyToProjectModal
          isOpen={isApplyToProjectOpen}
          onOpenChange={open => {
            setIsApplyToProjectOpen(open)
            if (!open) setSelectedTemplate(null)
          }}
          selectedTemplate={selectedTemplate}
          onConfirmApply={handleConfirmApplyToProject}
        />

        {/* Duplicate Template Modal */}
        <DuplicateTemplateModal
          isOpen={isDuplicateModalOpen}
          onOpenChange={setIsDuplicateModalOpen}
          template={templateToDuplicate}
          onConfirm={handleConfirmDuplicate}
        />

        <DeleteTemplateModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          template={templateToDelete}
          onConfirm={handleConfirmDelete}
        />
      </PageContent>
    </PageContainer>
  )
}
