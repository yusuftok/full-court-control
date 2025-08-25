'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  Plus,
  Copy,
  FileText,
  Save,
  GitBranch,
  FolderTree,
  Building2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Types
interface DivisionNode {
  id: string
  name: string
  children: DivisionNode[]
  isExpanded?: boolean
}

interface DivisionInstance {
  id: string
  nodeId: string
  name: string
  parentInstanceId?: string
  taskCount?: number
  progress?: number
}

interface ProjectDivisionStructure {
  projectId: string
  sourceType: 'template' | 'scratch' | 'copied'
  sourceId?: string
  sourceName?: string
  nodes: DivisionNode[]
  instances: DivisionInstance[]
  createdAt: string
  updatedAt: string
}

// Mock data
const mockProjects = [
  { id: '1', name: 'Şehir Merkezi Ofis Kompleksi' },
  { id: '2', name: 'Konut Kulesi A' },
  { id: '3', name: 'Alışveriş Merkezi Genişletme' },
]

const mockTemplates = [
  { id: '1', name: 'Yüksek Kat Konut Binası' },
  { id: '2', name: 'Ticari Ofis Kompleksi' },
  { id: '3', name: 'Altyapı Köprüsü' },
]

const mockDivisionStructures: Record<string, ProjectDivisionStructure> = {
  '1': {
    projectId: '1',
    sourceType: 'template',
    sourceId: '2',
    sourceName: 'Ticari Ofis Kompleksi',
    nodes: [
      {
        id: 'node-1',
        name: 'Saha Hazırlığı',
        isExpanded: true,
        children: [
          { id: 'node-1-1', name: 'Yıkım', children: [] },
          { id: 'node-1-2', name: 'Saha Temizliği', children: [] },
        ],
      },
      {
        id: 'node-2',
        name: 'Çekirdek & Kabuk',
        isExpanded: true,
        children: [
          { id: 'node-2-1', name: 'Temel', children: [] },
          { id: 'node-2-2', name: 'Yapısal İskelet', children: [] },
        ],
      },
    ],
    instances: [
      {
        id: 'inst-1',
        nodeId: 'node-1',
        name: 'Saha Hazırlığı',
        taskCount: 5,
        progress: 80,
      },
      {
        id: 'inst-1-1',
        nodeId: 'node-1-1',
        name: 'Yıkım İşleri',
        parentInstanceId: 'inst-1',
        taskCount: 2,
        progress: 100,
      },
      {
        id: 'inst-1-2',
        nodeId: 'node-1-2',
        name: 'Saha Temizliği',
        parentInstanceId: 'inst-1',
        taskCount: 3,
        progress: 60,
      },
      {
        id: 'inst-2',
        nodeId: 'node-2',
        name: 'Çekirdek & Kabuk',
        taskCount: 15,
        progress: 45,
      },
      {
        id: 'inst-2-1',
        nodeId: 'node-2-1',
        name: 'Temel Atma',
        parentInstanceId: 'inst-2',
        taskCount: 8,
        progress: 90,
      },
      {
        id: 'inst-2-2',
        nodeId: 'node-2-2',
        name: 'Yapısal İskelet',
        parentInstanceId: 'inst-2',
        taskCount: 7,
        progress: 20,
      },
    ],
    createdAt: '2024-08-15',
    updatedAt: '2024-08-19',
  },
}

// Division Tree Component
interface DivisionTreeProps {
  nodes: DivisionNode[]
  onNodeClick?: (node: DivisionNode) => void
  onAddChild?: (parentId: string) => void
  onEdit?: (node: DivisionNode) => void
  onDelete?: (nodeId: string) => void
  level?: number
}

function DivisionTree({
  nodes,
  onNodeClick,
  onAddChild,
  onEdit,
  onDelete,
  level = 0,
}: DivisionTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  return (
    <div className={level > 0 ? 'ml-6' : ''}>
      {nodes.map(node => (
        <div key={node.id} className="py-1">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 construction-hover group">
            <div className="flex items-center gap-1">
              {node.children.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-6 p-0"
                  onClick={() => toggleExpanded(node.id)}
                >
                  {expandedNodes.has(node.id) ? (
                    <ChevronDown className="size-3" />
                  ) : (
                    <ChevronRight className="size-3" />
                  )}
                </Button>
              ) : (
                <div className="size-6" />
              )}
              <GitBranch className="size-4 text-muted-foreground" />
              <span
                className="font-medium cursor-pointer"
                onClick={() => onNodeClick?.(node)}
              >
                {node.name}
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="size-6 p-0"
                onClick={() => onAddChild?.(node.id)}
              >
                <Plus className="size-3" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-6 p-0">
                    <MoreVertical className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(node)}>
                    <Edit2 className="size-3 mr-2" />
                    Düzenle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete?.(node.id)}
                  >
                    <Trash2 className="size-3 mr-2" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {node.children.length > 0 && expandedNodes.has(node.id) && (
            <DivisionTree
              nodes={node.children}
              onNodeClick={onNodeClick}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Division Instances Component
interface DivisionInstancesProps {
  instances: DivisionInstance[]
  onCreateInstance: (nodeId: string) => void
  onEditInstance: (instance: DivisionInstance) => void
  onDeleteInstance: (instanceId: string) => void
}

function DivisionInstances({
  instances,
  onCreateInstance,
  onEditInstance,
  onDeleteInstance,
}: DivisionInstancesProps) {
  const getRootInstances = () =>
    instances.filter(inst => !inst.parentInstanceId)
  const getChildInstances = (parentId: string) =>
    instances.filter(inst => inst.parentInstanceId === parentId)

  const renderInstance = (instance: DivisionInstance, level = 0) => {
    const children = getChildInstances(instance.id)

    return (
      <div key={instance.id} className={level > 0 ? 'ml-6' : ''}>
        <div className="flex items-center justify-between p-3 border rounded-lg mb-2 construction-hover">
          <div className="flex items-center gap-3">
            <Building2 className="size-4 text-blue-600" />
            <div>
              <div className="font-medium">{instance.name}</div>
              <div className="text-sm text-muted-foreground">
                {instance.taskCount} görev • {instance.progress}% tamamlandı
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${instance.progress}%` }}
              />
            </div>
            <Badge variant="secondary">{instance.progress}%</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="size-8 p-0">
                  <MoreVertical className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditInstance(instance)}>
                  <Edit2 className="size-3 mr-2" />
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onCreateInstance(instance.nodeId)}
                >
                  <Plus className="size-3 mr-2" />
                  Yeni Instance
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeleteInstance(instance.id)}
                >
                  <Trash2 className="size-3 mr-2" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {children.map(child => renderInstance(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {getRootInstances().map(instance => renderInstance(instance))}
    </div>
  )
}

export default function ProjectDivisionsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false)
  const [showEditNodeDialog, setShowEditNodeDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingNode, setEditingNode] = useState<DivisionNode | null>(null)
  const [addingParentId, setAddingParentId] = useState<string | null>(null)
  const [deletingNodeId, setDeletingNodeId] = useState<string | null>(null)
  const [nodeNameInput, setNodeNameInput] = useState('')
  const [currentStructure, setCurrentStructure] =
    useState<ProjectDivisionStructure | null>(null)

  const breadcrumbItems = [{ label: 'Proje Bölümleri', href: '/divisions' }]

  // Load structure when project changes
  React.useEffect(() => {
    if (selectedProject) {
      const structure = mockDivisionStructures[selectedProject]
      setCurrentStructure(structure || null)
    } else {
      setCurrentStructure(null)
    }
  }, [selectedProject])

  const handleStartFromTemplate = () => {
    setShowTemplateDialog(true)
  }

  const handleApplyTemplate = (templateId: string) => {
    // Create new structure from template
    const newStructure: ProjectDivisionStructure = {
      projectId: selectedProject,
      sourceType: 'template',
      sourceId: templateId,
      sourceName: mockTemplates.find(t => t.id === templateId)?.name,
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          name: 'Yapı İnşaatı',
          isExpanded: true,
          children: [
            {
              id: `node-${Date.now()}-1-1`,
              name: 'Temel İşleri',
              children: [],
            },
            { id: `node-${Date.now()}-1-2`, name: 'Kaba İnşaat', children: [] },
          ],
        },
        {
          id: `node-${Date.now()}-2`,
          name: 'Mimari Finisaj',
          isExpanded: true,
          children: [
            { id: `node-${Date.now()}-2-1`, name: 'İç Mekan', children: [] },
            { id: `node-${Date.now()}-2-2`, name: 'Dış Cephe', children: [] },
          ],
        },
      ],
      instances: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCurrentStructure(newStructure)
    setShowTemplateDialog(false)
    toast.success('Şablon uygulandı! Şimdi bölüm yapısını düzenleyebilirsiniz.')
  }

  const handleStartFromScratch = () => {
    // Create empty structure
    const newStructure: ProjectDivisionStructure = {
      projectId: selectedProject,
      sourceType: 'scratch',
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          name: 'Ana Bölüm',
          isExpanded: true,
          children: [],
        },
      ],
      instances: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCurrentStructure(newStructure)
    toast.success(
      'Boş yapı oluşturuldu! Bölümlerinizi eklemeye başlayabilirsiniz.'
    )
  }

  const handleCopyFromProject = () => {
    setShowCopyDialog(true)
  }

  const handleCopyFromSourceProject = (sourceProjectId: string) => {
    const sourceStructure = mockDivisionStructures[sourceProjectId]
    if (sourceStructure) {
      const newStructure: ProjectDivisionStructure = {
        ...sourceStructure,
        projectId: selectedProject,
        sourceType: 'copied',
        sourceId: sourceProjectId,
        sourceName: mockProjects.find(p => p.id === sourceProjectId)?.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setCurrentStructure(newStructure)
      setShowCopyDialog(false)
      toast.success('Proje yapısı kopyalandı!')
    }
  }

  const handleSaveAsTemplate = () => {
    setShowSaveTemplateDialog(true)
  }

  const handleCreateInstance = (nodeId: string) => {
    toast.success('Yeni instance oluşturuluyor...')
    // TODO: Create new instance
  }

  const handleEditInstance = (instance: DivisionInstance) => {
    toast.info(`${instance.name} düzenleniyor...`)
    // TODO: Open edit dialog
  }

  const handleDeleteInstance = (instanceId: string) => {
    toast.success('Instance silindi')
    // TODO: Delete instance
  }

  // Tree manipulation functions
  const handleAddChild = (parentId: string | null = null) => {
    setAddingParentId(parentId)
    setNodeNameInput('')
    setShowAddNodeDialog(true)
  }

  const handleEditNode = (node: DivisionNode) => {
    setEditingNode(node)
    setNodeNameInput(node.name)
    setShowEditNodeDialog(true)
  }

  const handleDeleteNode = (nodeId: string) => {
    setDeletingNodeId(nodeId)
    setShowDeleteDialog(true)
  }

  const confirmAddNode = () => {
    if (!nodeNameInput.trim() || !currentStructure) return

    const newNode: DivisionNode = {
      id: `node-${Date.now()}`,
      name: nodeNameInput.trim(),
      children: [],
      isExpanded: true,
    }

    const updateNodes = (nodes: DivisionNode[]): DivisionNode[] => {
      if (addingParentId === null) {
        // Adding to root level
        return [...nodes, newNode]
      }
      return nodes.map(node => {
        if (node.id === addingParentId) {
          return {
            ...node,
            children: [...node.children, newNode],
            isExpanded: true,
          }
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: updateNodes(node.children),
          }
        }
        return node
      })
    }

    setCurrentStructure({
      ...currentStructure,
      nodes: updateNodes(currentStructure.nodes),
      updatedAt: new Date().toISOString(),
    })

    setShowAddNodeDialog(false)
    setAddingParentId(null)
    setNodeNameInput('')
    toast.success('Yeni bölüm eklendi!')
  }

  const confirmEditNode = () => {
    if (!nodeNameInput.trim() || !editingNode || !currentStructure) return

    const updateNodes = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.map(node => {
        if (node.id === editingNode.id) {
          return {
            ...node,
            name: nodeNameInput.trim(),
          }
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: updateNodes(node.children),
          }
        }
        return node
      })
    }

    setCurrentStructure({
      ...currentStructure,
      nodes: updateNodes(currentStructure.nodes),
      updatedAt: new Date().toISOString(),
    })

    setShowEditNodeDialog(false)
    setEditingNode(null)
    setNodeNameInput('')
    toast.success('Bölüm adı güncellendi!')
  }

  const confirmDeleteNode = () => {
    if (!deletingNodeId || !currentStructure) return

    const removeNode = (nodes: DivisionNode[]): DivisionNode[] => {
      return nodes.filter(node => {
        if (node.id === deletingNodeId) {
          return false
        }
        if (node.children.length > 0) {
          node.children = removeNode(node.children)
        }
        return true
      })
    }

    setCurrentStructure({
      ...currentStructure,
      nodes: removeNode(currentStructure.nodes),
      updatedAt: new Date().toISOString(),
    })

    setShowDeleteDialog(false)
    setDeletingNodeId(null)
    toast.success('Bölüm silindi!')
  }

  if (!selectedProject) {
    return (
      <PageContainer>
        <PageContent>
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <PageHeader
            title="Proje Bölümleri"
            description="Proje için bölüm yapısını tanımlayın ve yönetin"
          />

          <Card className="glass-card modern-hover">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="size-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-float-tools">
                <GitBranch className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proje Seçin 🏗️</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Bölüm yapısını tanımlamak istediğiniz projeyi seçin.
              </p>

              <div className="w-full max-w-sm">
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Proje seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer maxWidth="full">
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <div className="flex items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Proje Bölümleri</h1>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {mockProjects.find(p => p.id === selectedProject)?.name}
              </span>
            </div>
          </div>
        </div>

        <PageHeader
          title="Bölüm Yönetimi"
          action={
            <div className="flex items-center gap-2">
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />

        {!currentStructure ? (
          <Card className="glass-card modern-hover">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="size-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-float-tools">
                <GitBranch className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                İnşaat Planı Hazır Değil 📋
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Bu proje için henüz bölüm yapısı tanımlanmamış. Nasıl başlamak
                istersiniz?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog
                  open={showTemplateDialog}
                  onOpenChange={setShowTemplateDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <FolderTree className="size-4 mr-2" />
                      Şablondan Başla
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Şablon Seç</DialogTitle>
                      <DialogDescription>
                        Kullanmak istediğiniz bölüm şablonunu seçin.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      {mockTemplates.map(template => (
                        <div
                          key={template.id}
                          onClick={() => handleApplyTemplate(template.id)}
                          className="flex items-center justify-between p-3 border rounded-lg construction-hover cursor-pointer"
                        >
                          <span>{template.name}</span>
                          <Button size="sm" onClick={e => e.stopPropagation()}>
                            Seç
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handleStartFromScratch}>
                  <Plus className="size-4 mr-2" />
                  Sıfırdan Başla
                </Button>

                <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Copy className="size-4 mr-2" />
                      Projeden Kopyala
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Proje Seç</DialogTitle>
                      <DialogDescription>
                        Bölüm yapısını kopyalamak istediğiniz projeyi seçin.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      {mockProjects
                        .filter(p => p.id !== selectedProject)
                        .map(project => (
                          <div
                            key={project.id}
                            className="flex items-center justify-between p-3 border rounded-lg construction-hover cursor-pointer"
                          >
                            <span>{project.name}</span>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleCopyFromSourceProject(project.id)
                              }
                            >
                              Kopyala
                            </Button>
                          </div>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Structure Editor */}
            <Card className="glass-card modern-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <div className="size-8 gradient-primary rounded-lg flex items-center justify-center">
                      <GitBranch className="size-4 text-white" />
                    </div>
                    İnşaat Bölüm Yapısı
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddChild(null)}
                      className="modern-button gradient-primary text-white border-0 hover:scale-105 group"
                    >
                      <Plus className="size-3 mr-1 group-hover:rotate-90 transition-transform" />
                      Ana Bölüm Ekle
                    </Button>
                  </div>
                </div>
                {currentStructure.sourceType !== 'scratch' && (
                  <div className="text-sm text-muted-foreground">
                    Kaynak: {currentStructure.sourceName}
                    <Badge variant="secondary" className="ml-2">
                      {currentStructure.sourceType === 'template'
                        ? 'Şablon'
                        : 'Kopya'}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <DivisionTree
                  nodes={currentStructure.nodes}
                  onNodeClick={node => console.log('Node clicked:', node)}
                  onAddChild={handleAddChild}
                  onEdit={handleEditNode}
                  onDelete={handleDeleteNode}
                />

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveAsTemplate}
                    className="modern-button group border-2 border-primary/20 hover:border-primary/40 hover:scale-105"
                  >
                    <Save className="size-3 mr-1 group-hover:scale-110 transition-transform" />
                    Şablon Kaydet
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="modern-button group border-2 border-primary/20 hover:border-primary/40 hover:scale-105"
                    onClick={() =>
                      alert(
                        '📊 Yapı Dışa Aktarma\n\n📋 CSV formatı\n📊 Excel raporu\n🖼️ Görsel hiyerarşi\n\n✅ Dışa aktarma özelliği yakında!'
                      )
                    }
                  >
                    <FileText className="size-3 mr-1 group-hover:scale-110 transition-transform" />
                    Yapıyı Dışa Aktar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Division Instances */}
            <Card className="glass-card modern-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="size-8 gradient-primary rounded-lg flex items-center justify-center">
                    <Building2 className="size-4 text-white" />
                  </div>
                  Aktif İnşaat Bölümleri
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Toplam {currentStructure.instances.length} bölüm instance'ı
                </div>
              </CardHeader>
              <CardContent>
                <DivisionInstances
                  instances={currentStructure.instances}
                  onCreateInstance={handleCreateInstance}
                  onEditInstance={handleEditInstance}
                  onDeleteInstance={handleDeleteInstance}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Node Dialog */}
        <Dialog open={showAddNodeDialog} onOpenChange={setShowAddNodeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Bölüm Ekle</DialogTitle>
              <DialogDescription>
                {addingParentId ? 'Alt bölüm' : 'Ana bölüm'} adını girin.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="node-name">Bölüm Adı</Label>
                <Input
                  id="node-name"
                  value={nodeNameInput}
                  onChange={e => setNodeNameInput(e.target.value)}
                  placeholder="Örn: Temel İşleri"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && nodeNameInput.trim()) {
                      confirmAddNode()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddNodeDialog(false)}
              >
                İptal
              </Button>
              <Button onClick={confirmAddNode} disabled={!nodeNameInput.trim()}>
                Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Node Dialog */}
        <Dialog open={showEditNodeDialog} onOpenChange={setShowEditNodeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bölümü Düzenle</DialogTitle>
              <DialogDescription>Bölüm adını güncelleyin.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-node-name">Bölüm Adı</Label>
                <Input
                  id="edit-node-name"
                  value={nodeNameInput}
                  onChange={e => setNodeNameInput(e.target.value)}
                  placeholder="Bölüm adı"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && nodeNameInput.trim()) {
                      confirmEditNode()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditNodeDialog(false)}
              >
                İptal
              </Button>
              <Button
                onClick={confirmEditNode}
                disabled={!nodeNameInput.trim()}
              >
                Güncelle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Node Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bölümü Sil</DialogTitle>
              <DialogDescription>
                Bu bölümü ve tüm alt bölümlerini silmek istediğinizden emin
                misiniz? Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                İptal
              </Button>
              <Button variant="destructive" onClick={confirmDeleteNode}>
                Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContent>
    </PageContainer>
  )
}
