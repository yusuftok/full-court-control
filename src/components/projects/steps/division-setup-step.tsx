'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  Plus,
  Copy,
  Edit2,
  Trash2,
  Building2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// Removed dropdown menu imports - using inline buttons instead
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { InteractiveDivisionTree } from '@/components/templates/tree-components'
import { DivisionNode, NodeType } from '@/components/templates/template-types'
import { getNodeTypeFromId } from '@/lib/utils/node-helpers'
import { ProjectFormData, DivisionInstance } from '../types/project-types'
import { mockTemplates } from '@/components/templates/template-data'

interface DivisionSetupStepProps {
  formData: ProjectFormData
  updateFormData: (updates: Partial<ProjectFormData>) => void
}

interface MultipleInstanceFormData {
  count: number
  namingPattern: 'sequential' | 'prefix' | 'manual'
  prefix: string
  manualNames: string
}

export const DivisionSetupStep: React.FC<DivisionSetupStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [selectedTemplateNodeId, setSelectedTemplateNodeId] = useState<
    string | null
  >(null)
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  )
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(
    null
  )

  // Synchronized expand/collapse state for both trees
  const [globalExpandedNodes, setGlobalExpandedNodes] = useState<
    Record<string, boolean>
  >({})

  // Dialog states
  const [showMultipleInstanceDialog, setShowMultipleInstanceDialog] =
    useState(false)
  const [multipleInstanceForm, setMultipleInstanceForm] =
    useState<MultipleInstanceFormData>({
      count: 3,
      namingPattern: 'prefix',
      prefix: '',
      manualNames: '',
    })

  // Global drag state for instance tree
  const [globalDraggedNode, setGlobalDraggedNode] = useState<string | null>(
    null
  )
  const [globalDragOverNode, setGlobalDragOverNode] = useState<string | null>(
    null
  )
  const [globalDropPosition, setGlobalDropPosition] = useState<
    'inside' | 'before' | 'after' | null
  >(null)

  // Initialize all nodes as expanded on first load
  useEffect(() => {
    if (
      formData.divisions.length > 0 &&
      Object.keys(globalExpandedNodes).length === 0
    ) {
      const initializeExpandedState = (
        nodes: DivisionNode[]
      ): Record<string, boolean> => {
        const expanded: Record<string, boolean> = {}
        const traverse = (nodeList: DivisionNode[]) => {
          nodeList.forEach(node => {
            expanded[node.id] = true // Default to expanded
            if (node.children) {
              traverse(node.children)
            }
          })
        }
        traverse(nodes)
        return expanded
      }

      setGlobalExpandedNodes(initializeExpandedState(formData.divisions))
    }
  }, [formData.divisions, globalExpandedNodes])

  // Handle synchronized expand/collapse
  const handleNodeExpandToggle = (nodeId: string) => {
    setGlobalExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  const templateName = formData.templateId
    ? mockTemplates.find(t => t.id === formData.templateId)?.name ||
      'Bilinmeyen Şablon'
    : 'Boş Şablon'

  // Get direct instance count for a specific template node ID (only root-level instances, not nested ones)
  const getTemplateInstanceCount = (templateNodeId: string): number => {
    return formData.divisionInstances.filter(
      instance =>
        instance.nodeId === templateNodeId && !instance.parentInstanceId
    ).length
  }

  // Build hybrid tree: Always show template structure with instances merged in
  const buildInstanceTree = (instances: DivisionInstance[]): DivisionNode[] => {
    // Always start with template structure and merge instances into it
    return formData.divisions.map(templateNode =>
      convertTemplateToHybridNode(templateNode, instances)
    )
  }

  // Recursive helper to build instance hierarchy properly
  const buildInstanceChildren = (
    parentInstanceId: string,
    instances: DivisionInstance[]
  ): DivisionNode[] => {
    const childInstances = instances.filter(
      inst => inst.parentInstanceId === parentInstanceId
    )

    return childInstances.map(childInstance => ({
      id: childInstance.id,
      nodeType: NodeType.INSTANCE, // Child instance'lar da instance olarak işaretlenir
      name: childInstance.name,
      children: buildInstanceChildren(childInstance.id, instances), // Recursive for nested children
      description: childInstance.description,
      status: childInstance.status,
      isInstance: true, // Mark as instance for visual distinction
    }))
  }

  // Convert template node to hybrid display combining template structure with instances
  const convertTemplateToHybridNode = (
    templateNode: DivisionNode,
    instances: DivisionInstance[]
  ): DivisionNode => {
    // Only get top-level instances for this template node (no parentInstanceId)
    const nodeInstances = instances.filter(
      inst => inst.nodeId === templateNode.id && !inst.parentInstanceId
    )

    // Start with template's children (converted to hybrid)
    const templateChildren =
      templateNode.children?.map(child =>
        convertTemplateToHybridNode(child, instances)
      ) || []

    // Add actual instances as children (marked with isInstance flag for visual distinction)
    const instanceChildren = nodeInstances.map(instance => ({
      id: instance.id,
      nodeType: NodeType.INSTANCE, // Gerçek instance node'lar instance olarak işaretlenir
      name: instance.name,
      children: buildInstanceChildren(instance.id, instances), // Use recursive helper
      description: instance.description,
      status: instance.status,
      isInstance: true, // Mark as instance for visual distinction
    }))

    // Create ghost ID from template ID
    const ghostId = `ghost-${templateNode.id.replace('template-', '')}`

    return {
      id: ghostId, // Use proper ghost- prefix ID
      nodeType: NodeType.GHOST, // Template'ten gelen node'lar ghost olarak işaretlenir
      name: templateNode.name,
      children: [...templateChildren, ...instanceChildren],
      description: templateNode.description,
      status: templateNode.status,
      originalTemplateId: templateNode.id, // Store reference to original template
      instanceCount: nodeInstances.length,
    }
  }

  // Convert template node to display node with direct instance counts (only root-level instances)
  const convertTemplateToDisplayNode = (
    templateNode: DivisionNode,
    instances: DivisionInstance[]
  ): DivisionNode => {
    const nodeInstances = instances.filter(
      inst => inst.nodeId === templateNode.id && !inst.parentInstanceId
    )
    return {
      id: templateNode.id,
      name: templateNode.name,
      children:
        templateNode.children?.map(child =>
          convertTemplateToDisplayNode(child, instances)
        ) || [],
      description: templateNode.description,
      status: templateNode.status,
      instanceCount: nodeInstances.length, // Only count direct instances, not nested ones
    }
  }

  // Helper to find template node by ID
  const findTemplateNode = (
    nodes: DivisionNode[],
    nodeId: string
  ): DivisionNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node
      if (node.children) {
        const found = findTemplateNode(node.children, nodeId)
        if (found) return found
      }
    }
    return null
  }

  // Helper to get direct instance count for a template node (only root-level instances, not nested ones)
  const getInstanceCount = (templateNodeId: string): number => {
    return formData.divisionInstances.filter(
      instance =>
        instance.nodeId === templateNodeId && !instance.parentInstanceId
    ).length
  }

  // Create hierarchical instances recursively
  const createInstancesRecursively = (
    templateNode: DivisionNode,
    parentInstanceId?: string,
    namePrefix: string = ''
  ): DivisionInstance[] => {
    const instances: DivisionInstance[] = []

    const existingCount = getInstanceCount(templateNode.id)
    const instanceName =
      namePrefix ||
      (existingCount === 0
        ? templateNode.name
        : `${templateNode.name} ${existingCount + 1}`)

    // Create instance for current node
    const newInstance: DivisionInstance = {
      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nodeId: templateNode.id,
      name: instanceName,
      parentInstanceId,
      taskCount: 0,
      progress: 0,
      status: 'planned',
      createdAt: new Date().toISOString(),
    }

    instances.push(newInstance)

    // Create instances for children recursively
    if (templateNode.children && templateNode.children.length > 0) {
      for (const childNode of templateNode.children) {
        const childInstances = createInstancesRecursively(
          childNode,
          newInstance.id, // Parent is the current instance
          '' // No prefix for children, use template name
        )
        instances.push(...childInstances)
      }
    }

    return instances
  }

  // Create single instance as child of template node (not copy)
  const handleCreateInstance = (templateNodeId: string) => {
    const templateNode = findTemplateNode(formData.divisions, templateNodeId)
    if (!templateNode) return

    // Create a single instance that represents a child/implementation of the template node
    const existingCount = getInstanceCount(templateNodeId)
    const instanceName =
      existingCount === 0
        ? `${templateNode.name} - 1`
        : `${templateNode.name} - ${existingCount + 1}`

    const newInstance: DivisionInstance = {
      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nodeId: templateNodeId,
      name: instanceName,
      parentInstanceId: undefined, // Root level instance
      taskCount: 0,
      progress: 0,
      status: 'planned',
      createdAt: new Date().toISOString(),
    }

    updateFormData({
      divisionInstances: [...formData.divisionInstances, newInstance],
    })
  }

  // Handle multiple instance creation
  const handleCreateMultipleInstances = (templateNodeId: string) => {
    const templateNode = findTemplateNode(formData.divisions, templateNodeId)
    if (!templateNode) return

    setSelectedTemplateNodeId(templateNodeId)
    setMultipleInstanceForm({
      count: 3,
      namingPattern: 'prefix',
      prefix: templateNode.name,
      manualNames: '',
    })
    setShowMultipleInstanceDialog(true)
  }

  // Confirm multiple instance creation
  const handleConfirmMultipleInstances = () => {
    if (!selectedTemplateNodeId) return

    const templateNode = findTemplateNode(
      formData.divisions,
      selectedTemplateNodeId
    )
    if (!templateNode) return

    const allNewInstances: DivisionInstance[] = []
    const { count, namingPattern, prefix, manualNames } = multipleInstanceForm

    for (let i = 1; i <= count; i++) {
      let rootInstanceName = ''

      if (namingPattern === 'sequential') {
        rootInstanceName = `${templateNode.name} ${i}`
      } else if (namingPattern === 'prefix') {
        rootInstanceName = `${prefix} ${i}`
      } else if (namingPattern === 'manual') {
        const names = manualNames
          .split('\n')
          .map(n => n.trim())
          .filter(Boolean)
        rootInstanceName = names[i - 1] || `${templateNode.name} ${i}`
      }

      // Create hierarchical instances for this root instance
      const hierarchicalInstances = createInstancesRecursively(
        templateNode,
        undefined,
        rootInstanceName
      )
      allNewInstances.push(...hierarchicalInstances)
    }

    updateFormData({
      divisionInstances: [...formData.divisionInstances, ...allNewInstances],
    })

    setShowMultipleInstanceDialog(false)
    setSelectedTemplateNodeId(null)
  }

  // Handle instance editing
  const handleInstanceEdit = (instanceId: string, newName: string) => {
    const updatedInstances = formData.divisionInstances.map(instance =>
      instance.id === instanceId
        ? { ...instance, name: newName, updatedAt: new Date().toISOString() }
        : instance
    )

    updateFormData({ divisionInstances: updatedInstances })
    setEditingInstanceId(null)
  }

  // Handle instance deletion (recursively delete children)
  const handleInstanceDelete = (instanceId: string) => {
    const getChildInstanceIds = (parentId: string): string[] => {
      const directChildren = formData.divisionInstances
        .filter(instance => instance.parentInstanceId === parentId)
        .map(instance => instance.id)

      // Recursively get all descendants
      const allDescendants: string[] = []
      for (const childId of directChildren) {
        allDescendants.push(childId)
        allDescendants.push(...getChildInstanceIds(childId))
      }

      return allDescendants
    }

    const allIdsToDelete = [instanceId, ...getChildInstanceIds(instanceId)]
    const updatedInstances = formData.divisionInstances.filter(
      instance => !allIdsToDelete.includes(instance.id)
    )

    updateFormData({ divisionInstances: updatedInstances })
  }

  // Handle adding new instance as child of existing instance
  const handleInstanceAdd = (nodeId: string) => {
    const nodeType = getNodeTypeFromId(nodeId)
    
    if (nodeType === NodeType.GHOST) {
      // For ghost nodes, find the original template ID
      const findGhostNodeInTree = (nodes: DivisionNode[]): DivisionNode | null => {
        for (const node of nodes) {
          if (node.id === nodeId) return node
          if (node.children) {
            const found = findGhostNodeInTree(node.children)
            if (found) return found
          }
        }
        return null
      }
      
      const instanceTree = buildInstanceTree(formData.divisionInstances)
      const ghostNode = findGhostNodeInTree(instanceTree)
      
      if (ghostNode && ghostNode.originalTemplateId) {
        handleCreateInstance(ghostNode.originalTemplateId)
      }
    } else if (nodeType === NodeType.INSTANCE) {
      // For instance nodes, create child instance
      const parentInstance = formData.divisionInstances.find(
        inst => inst.id === nodeId
      )
      if (!parentInstance) return

      // Create child instance
      const newChildInstance: DivisionInstance = {
        id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nodeId: parentInstance.nodeId, // Same template node as parent
        name: `${parentInstance.name} - Alt Bölüm`,
        parentInstanceId: nodeId, // Parent is the clicked instance
        taskCount: 0,
        progress: 0,
        status: 'planned',
        createdAt: new Date().toISOString(),
      }

      updateFormData({
        divisionInstances: [...formData.divisionInstances, newChildInstance],
      })
    }
  }

  // Handle instance move (drag & drop)
  const handleInstanceMove = (
    draggedNodeId: string,
    targetNodeId: string,
    position: 'before' | 'after' | 'inside'
  ) => {
    // RULE 1: Only allow moving actual instances, never template nodes
    const draggedInstance = formData.divisionInstances.find(
      inst => inst.id === draggedNodeId
    )
    if (!draggedInstance) {
      console.log(
        'Cannot move template node - only instances can be moved to preserve template structure'
      )
      return
    }

    // RULE 2: Allow dropping on instances or leaf template nodes
    // Create new instances array with updated relationships
    const updatedInstances = [...formData.divisionInstances]

    // Remove dragged instance from current position
    const draggedIndex = updatedInstances.findIndex(
      inst => inst.id === draggedNodeId
    )
    if (draggedIndex === -1) return

    const [movedInstance] = updatedInstances.splice(draggedIndex, 1)

    const targetInstance = formData.divisionInstances.find(
      inst => inst.id === targetNodeId
    )

    if (!targetInstance) {
      // Check if target is a leaf template node
      const findNode = (nodes: DivisionNode[]): DivisionNode | null => {
        for (const node of nodes) {
          if (node.id === targetNodeId) return node
          if (node.children) {
            const found = findNode(node.children)
            if (found) return found
          }
        }
        return null
      }

      const templateNode = findNode(formData.divisions)
      if (
        !templateNode ||
        (templateNode.children && templateNode.children.length > 0)
      ) {
        console.log(
          'Cannot drop on non-leaf template node - only leaf template nodes or instances are valid drop targets'
        )
        return
      }

      // Handle drop on leaf template node
      movedInstance.nodeId = templateNode.id // Assign to template node
      movedInstance.parentInstanceId = undefined // Top-level under template
      updatedInstances.push(movedInstance) // Add at end

      updateFormData({
        divisionInstances: updatedInstances,
      })

      console.log('Instance moved to leaf template node:', {
        draggedNodeId,
        targetTemplateNode: templateNode.id,
        templateName: templateNode.name,
      })
      return
    }

    // RULE 3: Handle drop on instance nodes

    // Find target instance position
    const targetIndex = updatedInstances.findIndex(
      inst => inst.id === targetNodeId
    )
    if (targetIndex === -1) return

    // Helper function to update child instances when parent moves
    const updateChildInstancesNodeId = (
      parentId: string,
      newNodeId: string
    ) => {
      updatedInstances.forEach(inst => {
        if (inst.parentInstanceId === parentId) {
          inst.nodeId = newNodeId
          // Recursively update grandchildren
          updateChildInstancesNodeId(inst.id, newNodeId)
        }
      })
    }

    // Insert based on drop position - instances can move between different template nodes
    if (position === 'before') {
      // Insert before target instance (as sibling under target's template node)
      movedInstance.nodeId = targetInstance.nodeId // Adopt target's template parent
      movedInstance.parentInstanceId = targetInstance.parentInstanceId // Same instance hierarchy level
      updateChildInstancesNodeId(movedInstance.id, targetInstance.nodeId) // Update all children
      updatedInstances.splice(targetIndex, 0, movedInstance)
    } else if (position === 'after') {
      // Insert after target instance (as sibling under target's template node)
      movedInstance.nodeId = targetInstance.nodeId // Adopt target's template parent
      movedInstance.parentInstanceId = targetInstance.parentInstanceId // Same instance hierarchy level
      updateChildInstancesNodeId(movedInstance.id, targetInstance.nodeId) // Update all children
      updatedInstances.splice(targetIndex + 1, 0, movedInstance)
    } else if (position === 'inside') {
      // Make it a child of target instance (hierarchical relationship)
      movedInstance.parentInstanceId = targetInstance.id // Become child of target instance
      movedInstance.nodeId = targetInstance.nodeId // Keep same template reference as parent
      updateChildInstancesNodeId(movedInstance.id, targetInstance.nodeId) // Update all children
      updatedInstances.splice(targetIndex + 1, 0, movedInstance)
    }

    updateFormData({
      divisionInstances: updatedInstances,
    })

    console.log('Instance moved successfully - template counts will update:', {
      draggedNodeId,
      targetNodeId,
      position,
      fromTemplate: draggedInstance.nodeId,
      toTemplate: targetInstance ? targetInstance.nodeId : 'leaf-template',
      newInstanceParent: movedInstance.parentInstanceId,
      oldDirectCount_source: getInstanceCount(draggedInstance.nodeId),
      newDirectCount_target: targetInstance
        ? getInstanceCount(targetInstance.nodeId)
        : 'N/A',
    })
  }

  // Custom render for template tree nodes (read-only with action buttons only on leaf nodes)
  const renderTemplateNode = (
    node: DivisionNode,
    level: number = 0,
    isLast: boolean = false,
    siblings: DivisionNode[] = []
  ) => {
    const instanceCount = getInstanceCount(node.id)
    const isLeafNode = !node.children || node.children.length === 0
    const hasChildren = !isLeafNode
    const isExpanded = globalExpandedNodes[node.id] ?? true

    return (
      <div
        key={node.id}
        className={`${level > 0 ? 'ml-4' : ''} space-y-0 min-h-full relative`}
      >
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

        <div
          className={`group relative p-1.5 mx-0.5 rounded border transition-all ${
            selectedTemplateNodeId === node.id
              ? 'bg-primary/10 border-primary'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedTemplateNodeId(node.id)}
        >
          <div className="flex items-center gap-1.5">
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleNodeExpandToggle(node.id)
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

            <div className="flex-1">
              <div className="flex items-center min-h-[18px] w-full">
                <span className="font-semibold text-xs text-foreground">
                  {node.name}
                </span>
                {instanceCount > 0 && (
                  <div className="ml-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 -translate-y-1">
                    <span className="text-white text-[10px] font-bold leading-none">
                      {instanceCount}
                    </span>
                  </div>
                )}
                {/* Show creation buttons only for leaf nodes */}
                {isLeafNode && (
                  <div className="flex items-center gap-2 min-w-[70px] flex-shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100 ml-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-5 p-0 flex items-center justify-center rounded-md bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 border border-green-300 hover:border-green-400 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow"
                      onClick={e => {
                        e.stopPropagation()
                        handleCreateInstance(node.id)
                      }}
                      title="Bölüm oluştur"
                    >
                      <Plus className="size-3 font-bold" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-5 p-0 flex items-center justify-center rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 border border-blue-300 hover:border-blue-400 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow"
                      onClick={e => {
                        e.stopPropagation()
                        handleCreateMultipleInstances(node.id)
                      }}
                      title="Çoklu bölüm"
                    >
                      <Copy className="size-3 font-bold" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Children - only show if expanded */}
        {hasChildren &&
          isExpanded &&
          node.children &&
          node.children.map((child, index) =>
            renderTemplateNode(
              child,
              level + 1,
              index === node.children!.length - 1,
              node.children!
            )
          )}
      </div>
    )
  }

  const instanceTree = buildInstanceTree(formData.divisionInstances)

  // Debug: Check for duplicate IDs
  React.useEffect(() => {
    const instanceIds = formData.divisionInstances.map(inst => inst.id)
    const uniqueIds = new Set(instanceIds)
    if (instanceIds.length !== uniqueIds.size) {
      console.error('🚨 DUPLICATE INSTANCE IDs DETECTED:', {
        totalInstances: instanceIds.length,
        uniqueInstances: uniqueIds.size,
        duplicates: instanceIds.filter(
          (id, index) => instanceIds.indexOf(id) !== index
        ),
        allInstances: formData.divisionInstances.map(inst => ({
          id: inst.id,
          name: inst.name,
          nodeId: inst.nodeId,
        })),
      })
    }
  }, [formData.divisionInstances])

  return (
    <div className="space-y-4">
      {formData.divisions.length === 0 ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Şablon Seçimi Gerekli
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Bölüm yapısı oluşturmak için önce bir şablon seçmelisiniz.
                  Lütfen önceki adıma geri dönün ve bir şablon seçin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Template Tree (Read-Only) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Şablon Yapısı</CardTitle>
              </div>
              <CardDescription>
                {templateName} • {formData.divisions.length} ana bölüm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900/20 min-h-[300px]">
                {formData.divisions.map((node, index) =>
                  renderTemplateNode(
                    node,
                    0,
                    index === formData.divisions.length - 1,
                    formData.divisions
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Instance Tree (Interactive) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Proje Bölümleri</CardTitle>
              </div>
              <CardDescription className="flex items-center gap-2">
                <span>Toplam oluşturulan bölümler:</span>
                {formData.divisionInstances.length > 0 && (
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold leading-none">
                      {formData.divisionInstances.length}
                    </span>
                  </div>
                )}
                {formData.divisionInstances.length === 0 && (
                  <span className="text-muted-foreground">
                    Henüz bölüm oluşturulmamış
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {instanceTree.length > 0 ? (
                <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900/20 min-h-[300px]">
                  <InteractiveDivisionTree
                    divisions={instanceTree}
                    treeEditMode="division" // Enable division mode for ghost/instance node permissions
                    onNodeSelect={setSelectedInstanceId}
                    onNodeEdit={handleInstanceEdit}
                    onNodeAdd={handleInstanceAdd} // Enable + button functionality
                    onNodeDelete={handleInstanceDelete}
                    onNodeMove={handleInstanceMove}
                    selectedNodeId={selectedInstanceId ?? undefined}
                    editingNodeId={editingInstanceId ?? undefined}
                    draggedNode={globalDraggedNode}
                    dragOverNode={globalDragOverNode}
                    dropPosition={globalDropPosition}
                    onDragStateChange={(
                      draggedNode,
                      dragOverNode,
                      dropPosition
                    ) => {
                      setGlobalDraggedNode(draggedNode)
                      setGlobalDragOverNode(dragOverNode)
                      setGlobalDropPosition(dropPosition)
                    }}
                    globalExpandedNodes={globalExpandedNodes}
                    onNodeExpandToggle={handleNodeExpandToggle}
                    isDragEnabled={nodeId => {
                      // Only instances can be dragged (to preserve template structure)
                      return formData.divisionInstances.some(
                        inst => inst.id === nodeId
                      )
                    }}
                    isDropEnabled={nodeId => {
                      // Instances can be dropped on:
                      // 1. Other instances (for sibling/child relationships)
                      // 2. Leaf template nodes (to add instances under them)
                      const isInstance = formData.divisionInstances.some(
                        inst => inst.id === nodeId
                      )
                      if (isInstance) return true

                      // Check if it's a leaf template node (no children)
                      const findNode = (
                        nodes: DivisionNode[]
                      ): DivisionNode | null => {
                        for (const node of nodes) {
                          if (node.id === nodeId) return node
                          if (node.children) {
                            const found = findNode(node.children)
                            if (found) return found
                          }
                        }
                        return null
                      }

                      const templateNode = findNode(formData.divisions)
                      return !!(
                        templateNode &&
                        (!templateNode.children ||
                          templateNode.children.length === 0)
                      )
                    }}
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900/20 min-h-[300px]">
                  <InteractiveDivisionTree
                    divisions={instanceTree}
                    treeEditMode="division" // Enable division mode for ghost/instance node permissions
                    onNodeSelect={setSelectedInstanceId}
                    onNodeEdit={handleInstanceEdit}
                    onNodeAdd={handleInstanceAdd} // Enable + button functionality
                    onNodeDelete={handleInstanceDelete}
                    onNodeMove={handleInstanceMove}
                    selectedNodeId={selectedInstanceId ?? undefined}
                    editingNodeId={editingInstanceId ?? undefined}
                    draggedNode={globalDraggedNode}
                    dragOverNode={globalDragOverNode}
                    dropPosition={globalDropPosition}
                    onDragStateChange={(
                      draggedNode,
                      dragOverNode,
                      dropPosition
                    ) => {
                      setGlobalDraggedNode(draggedNode)
                      setGlobalDragOverNode(dragOverNode)
                      setGlobalDropPosition(dropPosition)
                    }}
                    globalExpandedNodes={globalExpandedNodes}
                    onNodeExpandToggle={handleNodeExpandToggle}
                    isDragEnabled={nodeId => {
                      // Only instances can be dragged (to preserve template structure)
                      return formData.divisionInstances.some(
                        inst => inst.id === nodeId
                      )
                    }}
                    isDropEnabled={nodeId => {
                      // Instances can be dropped on:
                      // 1. Other instances (for sibling/child relationships)
                      // 2. Leaf template nodes (to add instances under them)
                      const isInstance = formData.divisionInstances.some(
                        inst => inst.id === nodeId
                      )
                      if (isInstance) return true

                      // Check if it's a leaf template node (no children)
                      const findNode = (
                        nodes: DivisionNode[]
                      ): DivisionNode | null => {
                        for (const node of nodes) {
                          if (node.id === nodeId) return node
                          if (node.children) {
                            const found = findNode(node.children)
                            if (found) return found
                          }
                        }
                        return null
                      }

                      const templateNode = findNode(formData.divisions)
                      return !!(
                        templateNode &&
                        (!templateNode.children ||
                          templateNode.children.length === 0)
                      )
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Multiple Instance Creation Dialog */}
      <Dialog
        open={showMultipleInstanceDialog}
        onOpenChange={setShowMultipleInstanceDialog}
      >
        <DialogContent className="max-w-lg p-6">
          <DialogHeader className="space-y-3 mb-6">
            <DialogTitle className="text-lg">Çoklu Bölüm Oluştur</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedTemplateNodeId && (
                <>
                  Şablon:{' '}
                  <strong>
                    {
                      findTemplateNode(
                        formData.divisions,
                        selectedTemplateNodeId
                      )?.name
                    }
                  </strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="instance-count" className="text-sm font-medium">
                Adet
              </Label>
              <Input
                id="instance-count"
                type="number"
                min="1"
                max="20"
                value={multipleInstanceForm.count}
                onChange={e =>
                  setMultipleInstanceForm(prev => ({
                    ...prev,
                    count: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">İsimlendirme Türü</Label>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={
                      multipleInstanceForm.namingPattern === 'sequential'
                    }
                    onChange={() =>
                      setMultipleInstanceForm(prev => ({
                        ...prev,
                        namingPattern: 'sequential',
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    Sıralı (Örn: Kat 1, Kat 2, Kat 3)
                  </span>
                </label>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={multipleInstanceForm.namingPattern === 'prefix'}
                      onChange={() =>
                        setMultipleInstanceForm(prev => ({
                          ...prev,
                          namingPattern: 'prefix',
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Önek ile:</span>
                  </label>
                  {multipleInstanceForm.namingPattern === 'prefix' && (
                    <Input
                      placeholder="Örn: Blok"
                      value={multipleInstanceForm.prefix}
                      onChange={e =>
                        setMultipleInstanceForm(prev => ({
                          ...prev,
                          prefix: e.target.value,
                        }))
                      }
                      className="ml-7 w-full"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={multipleInstanceForm.namingPattern === 'manual'}
                      onChange={() =>
                        setMultipleInstanceForm(prev => ({
                          ...prev,
                          namingPattern: 'manual',
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Manuel:</span>
                  </label>
                  {multipleInstanceForm.namingPattern === 'manual' && (
                    <Textarea
                      placeholder="Her satıra bir isim yazın"
                      value={multipleInstanceForm.manualNames}
                      onChange={e =>
                        setMultipleInstanceForm(prev => ({
                          ...prev,
                          manualNames: e.target.value,
                        }))
                      }
                      className="ml-7 w-full"
                      rows={4}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-0 mt-0">
            <Button
              variant="outline"
              onClick={() => setShowMultipleInstanceDialog(false)}
              className="flex-1"
            >
              İptal
            </Button>
            <Button onClick={handleConfirmMultipleInstances} className="flex-1">
              Oluştur ({multipleInstanceForm.count} bölüm)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
