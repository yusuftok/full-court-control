'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ProjectFormData, ProjectCategory } from '../types/project-types'
import { mockTemplates, getDefaultDivisions } from '@/components/templates/template-data'
import { DivisionTemplate, DivisionNode } from '@/components/templates/template-types'
import { TemplateSelector } from '../template-selector'
import { InteractiveDivisionTree } from '@/components/templates/tree-components'
import { ModificationChoiceDropdown } from '../modification-choice-dropdown'

interface TemplateSelectionStepProps {
  formData: ProjectFormData
  updateFormData: (updates: Partial<ProjectFormData>) => void
  onStepValidityChange?: (isValid: boolean) => void
  onModificationStateChange?: (hasModifications: boolean, modificationChoice: string | null) => void
}


export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  formData,
  updateFormData,
  onStepValidityChange,
  onModificationStateChange
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [hasModifications, setHasModifications] = useState(false)
  
  // Global drag state for cross-parent operations (like in templates page)
  const [globalDraggedNode, setGlobalDraggedNode] = useState<string | null>(null)
  const [globalDragOverNode, setGlobalDragOverNode] = useState<string | null>(null) 
  const [globalDropPosition, setGlobalDropPosition] = useState<'inside' | 'before' | 'after' | null>(null)


  const handleTemplateSelect = (templateId: string | null) => {
    // Reset modification states when selecting new template
    setHasModifications(false)
    
    if (templateId) {
      const template = mockTemplates.find(t => t.id === templateId)
      if (template) {
        updateFormData({
          templateId,
          divisions: template.divisions.map(division => ({
            id: division.id,
            name: division.name,
            children: division.children?.map(child => ({
              id: child.id,
              name: child.name
            }))
          }))
        })
      }
    } else {
      // Boş başlama seçildi
      const defaultDivisions = getDefaultDivisions(formData.category)
      updateFormData({
        templateId: null,
        divisions: defaultDivisions.map(division => ({
          id: division.id,
          name: division.name,
          children: division.children?.map(child => ({
            id: child.id,
            name: child.name
          }))
        }))
      })
    }
  }

  const handleNodeEdit = (nodeId: string, newName: string) => {
    // Update the division name in formData
    const updateDivisionName = (divisions: any[], targetId: string, newName: string): any[] => {
      return divisions.map(division => ({
        ...division,
        name: division.id === targetId ? newName : division.name,
        children: division.children ? updateDivisionName(division.children, targetId, newName) : division.children
      }))
    }
    
    updateFormData({
      divisions: updateDivisionName(formData.divisions, nodeId, newName)
    })
    
    // Mark as modified if we have a template selected
    if (formData.templateId) {
      setHasModifications(true)
    }
    
    setEditingNodeId(null)
  }


  // Add node handler
  const handleNodeAdd = (parentId: string | null, newName: string) => {
    const newNode: DivisionNode = {
      id: `division-${Date.now()}`,
      name: newName
    }

    const addToNodes = (nodes: any[]): any[] => {
      if (parentId === null) {
        // Add as root level
        return [...nodes, newNode]
      } else {
        // Add as child to specific parent
        return nodes.map(node => ({
          ...node,
          children: node.id === parentId 
            ? [...(node.children || []), newNode]
            : node.children ? addToNodes(node.children) : node.children
        }))
      }
    }

    updateFormData({
      divisions: addToNodes(formData.divisions)
    })
    
    if (formData.templateId) {
      setHasModifications(true)
    }
  }

  // Delete node handler
  const handleNodeDelete = (nodeId: string) => {
    const deleteFromNodes = (nodes: any[]): any[] => {
      return nodes.filter(node => node.id !== nodeId).map(node => ({
        ...node,
        children: node.children ? deleteFromNodes(node.children) : node.children
      }))
    }

    updateFormData({
      divisions: deleteFromNodes(formData.divisions)
    })
    
    if (formData.templateId) {
      setHasModifications(true)
    }
  }

  // Drag & drop handler
  const handleNodeMove = (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => {
    let draggedNode: DivisionNode | null = null

    // 1. Extract dragged node
    const extractNode = (nodes: any[]): any[] => {
      return nodes.reduce((acc, node) => {
        if (node.id === draggedNodeId) {
          draggedNode = node
          return acc // Skip this node
        }
        
        const updatedNode = { ...node }
        if (node.children && node.children.length > 0) {
          updatedNode.children = extractNode(node.children)
        }
        acc.push(updatedNode)
        return acc
      }, [] as any[])
    }
    
    // 2. Insert node at target position
    const insertNodeAtTarget = (nodes: any[]): any[] => {
      return nodes.map(node => {
        let updatedNode = { ...node }
        if (node.children && node.children.length > 0) {
          updatedNode.children = insertNodeAtTarget(node.children)
        }
        
        if (node.id === targetNodeId && position === 'inside') {
          return {
            ...updatedNode,
            children: [...(updatedNode.children || []), draggedNode!]
          }
        }
        
        if (updatedNode.children && updatedNode.children.length > 0) {
          const targetChildIndex = updatedNode.children.findIndex((child: any) => child.id === targetNodeId)
          
          if (targetChildIndex !== -1) {
            const newChildren = [...updatedNode.children]
            
            if (position === 'before') {
              newChildren.splice(targetChildIndex, 0, draggedNode!)
            } else if (position === 'after') {
              newChildren.splice(targetChildIndex + 1, 0, draggedNode!)
            }
            
            return {
              ...updatedNode,
              children: newChildren
            }
          }
        }
        
        return updatedNode
      })
    }

    // 3. Handle root level
    const insertAtRootLevel = (nodes: any[]): any[] => {
      const targetIndex = nodes.findIndex((node: any) => node.id === targetNodeId)
      
      if (targetIndex !== -1) {
        const newNodes = [...nodes]
        
        if (position === 'before') {
          newNodes.splice(targetIndex, 0, draggedNode!)
        } else if (position === 'after') {
          newNodes.splice(targetIndex + 1, 0, draggedNode!)
        } else if (position === 'inside') {
          newNodes[targetIndex] = {
            ...newNodes[targetIndex],
            children: [...(newNodes[targetIndex].children || []), draggedNode!]
          }
        }
        
        return newNodes
      }
      
      return insertNodeAtTarget(nodes)
    }

    // Execute the move
    const nodesWithoutDragged = extractNode([...formData.divisions])
    
    if (draggedNode) {
      const finalNodes = insertAtRootLevel(nodesWithoutDragged)
      
      updateFormData({
        divisions: finalNodes
      })
      
      if (formData.templateId) {
        setHasModifications(true)
      }
    }
  }

  // Check if step is complete (can proceed) - this is now handled by the main page
  const isStepComplete = formData.divisions.length > 0

  // Notify parent about step validity changes
  useEffect(() => {
    onStepValidityChange?.(isStepComplete)
  }, [isStepComplete, onStepValidityChange])

  // Notify parent about modification state changes (only about hasModifications)
  useEffect(() => {
    onModificationStateChange?.(hasModifications, null)
  }, [hasModifications, onModificationStateChange])



  return (
    <div className="space-y-4">
      <Card className="overflow-visible">        
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4">
            <Label className="text-base font-medium whitespace-nowrap">
              Proje Şablonu *
            </Label>
            
            <div className="flex-1 relative">
              <TemplateSelector
                value={formData.templateId}
                onChange={handleTemplateSelect}
                placeholder="Boş başlayın veya hazır şablon seçin..."
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Şablon İçeriği - Düzenlenebilir */}
      {formData.divisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {formData.templateId && mockTemplates.find(t => t.id === formData.templateId)
                ? `Şablon: ${mockTemplates.find(t => t.id === formData.templateId)?.name}` 
                : 'Boş Şablon'}
            </CardTitle>
            <CardDescription>
              Bölüm yapısını düzenleyin, ekleyip çıkarabilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto">
              <InteractiveDivisionTree
                divisions={formData.divisions as DivisionNode[]}
                onNodeSelect={setSelectedNodeId}
                onNodeEdit={handleNodeEdit}
                onNodeAdd={handleNodeAdd}
                onNodeDelete={handleNodeDelete}
                onNodeMove={handleNodeMove}
                selectedNodeId={selectedNodeId}
                editingNodeId={editingNodeId}
                draggedNode={globalDraggedNode}
                dragOverNode={globalDragOverNode}
                dropPosition={globalDropPosition}
                onDragStateChange={(draggedNode, dragOverNode, dropPosition) => {
                  setGlobalDraggedNode(draggedNode)
                  setGlobalDragOverNode(dragOverNode)
                  setGlobalDropPosition(dropPosition)
                }}
              />
            </div>
            
          </CardContent>
        </Card>
      )}

    </div>
  )
}

// Export the dropdown for use in button areas
export { ModificationChoiceDropdown }