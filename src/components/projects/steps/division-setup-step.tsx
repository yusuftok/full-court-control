'use client'

import { useState } from 'react'
import { TreePine, Plus, Settings, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TreeHierarchy, TreeNode } from '@/components/ui/tree-hierarchy'
import { ProjectFormData, DivisionNode } from '../types/project-types'

interface DivisionSetupStepProps {
  formData: ProjectFormData
  updateFormData: (updates: Partial<ProjectFormData>) => void
}

export const DivisionSetupStep: React.FC<DivisionSetupStepProps> = ({
  formData,
  updateFormData
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Convert ProjectFormData divisions to TreeNode format
  const convertToTreeNodes = (divisions: DivisionNode[]): TreeNode[] => {
    return divisions.map(division => ({
      id: division.id,
      label: division.name,
      type: 'folder',
      children: division.children ? convertToTreeNodes(division.children) : undefined,
      metadata: {
        description: division.description,
        count: division.children?.length,
        status: division.status === 'completed' ? 'active' : 
                division.status === 'in-progress' ? 'active' :
                division.status === 'on-hold' ? 'inactive' : 'draft'
      }
    }))
  }

  // Convert TreeNode back to DivisionNode
  const convertToDivisionNodes = (treeNodes: TreeNode[]): DivisionNode[] => {
    return treeNodes.map(node => ({
      id: node.id,
      name: node.label,
      children: node.children ? convertToDivisionNodes(node.children) : undefined,
      description: node.metadata?.description,
      status: node.metadata?.status === 'active' ? 'in-progress' :
              node.metadata?.status === 'inactive' ? 'on-hold' : 'planned'
    }))
  }

  const handleAddRootDivision = () => {
    const newDivision: DivisionNode = {
      id: `division-${Date.now()}`,
      name: 'Yeni Bölüm',
      children: [],
      status: 'planned'
    }

    updateFormData({
      divisions: [...formData.divisions, newDivision]
    })
  }

  const handleNodeMove = (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => {
    // This would be a complex implementation to handle drag & drop
    // For MVP, we'll show a simple message
    console.log('Node move:', { draggedNodeId, targetNodeId, position })
  }

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNodeId(node.id)
  }

  const treeData = convertToTreeNodes(formData.divisions)
  const totalDivisions = formData.divisions.reduce((count, div) => {
    return count + 1 + (div.children ? div.children.length : 0)
  }, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-green-600" />
            <CardTitle>Proje Bölüm Yapısı</CardTitle>
          </div>
          <CardDescription>
            Projenizin bölümlerini düzenleyin. Drag & drop ile sıralama yapabilir, 
            alt bölümler ekleyebilir ve her bölüme taşeron atayabilirsiniz.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <strong>{totalDivisions}</strong> toplam bölüm
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <strong>{formData.divisions.length}</strong> ana bölüm
              </div>
            </div>
            
            <Button
              onClick={handleAddRootDivision}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Ana Bölüm Ekle
            </Button>
          </div>

          {/* Tree Hierarchy */}
          {treeData.length > 0 ? (
            <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900/20">
              <TreeHierarchy
                data={treeData}
                selectedId={selectedNodeId || undefined}
                onSelect={handleNodeSelect}
                showActions={true}
                draggable={true}
                onNodeMove={handleNodeMove}
                emptyStateMessage="Henüz bölüm bulunmuyor"
              />
            </div>
          ) : (
            <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TreePine className="w-16 h-16 text-slate-400 mb-4" />
                <h3 className="font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Henüz bölüm yapısı oluşturulmamış
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 text-center mb-4">
                  Projenizin bölümlerini oluşturmak için bir şablon seçin veya manuel olarak ekleyin
                </p>
                <Button
                  onClick={handleAddRootDivision}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  İlk Bölümü Ekle
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Bölüm Düzenleme Paneli */}
      {selectedNodeId && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <CardTitle>Bölüm Detayları</CardTitle>
            </div>
            <CardDescription>
              Seçili bölümün özelliklerini düzenleyin
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Seçili bölüm: <strong>{selectedNodeId}</strong>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Bu özellik geliştirilme aşamasında. Şimdilik bölümleri görüntüleyebilirsiniz.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Bilgilendirme ve Uyarılar */}
      <div className="space-y-4">
        {treeData.length === 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Bölüm Yapısı Gerekli
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Proje oluşturmak için en az bir bölüm tanımlamanız gerekiyor. 
                    Önceki adımda bir şablon seçmediniz, lütfen manuel olarak bölümler ekleyin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {treeData.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <TreePine className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Proje Yapısı Hazır
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>• Bölümler arasında drag & drop ile sıralama yapabilirsiniz</p>
                    <p>• Her bölüme farklı taşeronlar atayabilirsiniz</p>
                    <p>• Alt bölümler ekleyerek detaylandırabilirsiniz</p>
                    <p>• Proje oluşturulduktan sonra da düzenlemeler yapabilirsiniz</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}