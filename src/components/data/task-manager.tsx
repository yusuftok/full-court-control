'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  CheckSquare,
  Square,
  Archive,
  Copy,
  Filter,
  Search,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VirtualTable } from './virtual-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface Task {
  id: string
  name: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  tags?: string[]
}

interface EditableFieldProps {
  value: string
  onSave: (value: string) => void
  onCancel: () => void
  className?: string
  multiline?: boolean
}

function EditableField({
  value,
  onSave,
  onCancel,
  className,
  multiline,
}: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ref = multiline ? textareaRef.current : inputRef.current
    if (ref) {
      ref.focus()
      ref.select()
    }
  }, [multiline])

  const handleSave = useCallback(() => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim())
    } else {
      onCancel()
    }
  }, [editValue, value, onSave, onCancel])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        onCancel()
      }
    },
    [handleSave, onCancel, multiline]
  )

  const InputComponent = multiline ? 'textarea' : 'input'
  const ref = multiline ? textareaRef : inputRef

  return (
    <div className="flex items-center gap-1">
      <InputComponent
        ref={ref as any}
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary',
          multiline && 'min-h-[60px] resize-none',
          className
        )}
        rows={multiline ? 3 : undefined}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={handleSave}
      >
        <Check className="h-3 w-3" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={onCancel}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

interface StatusBadgeProps {
  status: Task['status']
  onClick?: () => void
}

function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: '🕰️ On Deck',
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    },
    'in-progress': {
      label: '🔨 Hammering Away',
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    completed: {
      label: '✅ Built & Inspected',
      className: 'bg-green-100 text-green-700 hover:bg-green-200 celebration',
    },
    archived: {
      label: '📦 Stored Away',
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant="secondary"
      className={cn(config.className, onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  )
}

interface PriorityBadgeProps {
  priority: Task['priority']
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { label: '😴 When You Can', className: 'bg-gray-100 text-gray-700' },
    medium: {
      label: '🔋 Standard Job',
      className: 'bg-blue-100 text-blue-700',
    },
    high: {
      label: '⚡ Rush Order',
      className: 'bg-orange-100 text-orange-700',
    },
    urgent: {
      label: '🚨 All Hands On Deck',
      className: 'bg-red-100 text-red-700 animate-pulse',
    },
  }

  const config = priorityConfig[priority]

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}

export interface TaskManagerProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  containerHeight?: number
  className?: string
  onTaskClick?: (task: Task) => void
}

export function TaskManager({
  tasks,
  onTasksChange,
  containerHeight = 600,
  className,
  onTaskClick,
}: TaskManagerProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [editingCell, setEditingCell] = useState<{
    taskId: string
    field: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Task['status'][]>([
    'pending',
    'in-progress',
  ])
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'][]>([])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(task.status)
      const matchesPriority =
        priorityFilter.length === 0 || priorityFilter.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const selectedCount = selectedTasks.size

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
      onTasksChange(updatedTasks)
    },
    [tasks, onTasksChange]
  )

  const handleTaskEdit = useCallback(
    (taskId: string, field: string, value: string) => {
      updateTask(taskId, { [field]: value })
      setEditingCell(null)
      toast.success('Task updated successfully')
    },
    [updateTask]
  )

  const handleStatusChange = useCallback(
    (taskId: string, newStatus: Task['status']) => {
      updateTask(taskId, { status: newStatus })
      toast.success(`Task status updated to ${newStatus}`)
    },
    [updateTask]
  )

  const toggleTaskSelection = useCallback(
    (taskId: string) => {
      const newSelected = new Set(selectedTasks)
      if (newSelected.has(taskId)) {
        newSelected.delete(taskId)
      } else {
        newSelected.add(taskId)
      }
      setSelectedTasks(newSelected)
    },
    [selectedTasks]
  )

  const selectAllTasks = useCallback(() => {
    if (selectedCount === filteredTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)))
    }
  }, [selectedCount, filteredTasks])

  const deleteSelectedTasks = useCallback(() => {
    const remainingTasks = tasks.filter(task => !selectedTasks.has(task.id))
    onTasksChange(remainingTasks)
    setSelectedTasks(new Set())
    toast.success(
      `${selectedCount} task${selectedCount > 1 ? 's' : ''} deleted`
    )
  }, [tasks, selectedTasks, selectedCount, onTasksChange])

  const archiveSelectedTasks = useCallback(() => {
    const updatedTasks = tasks.map(task =>
      selectedTasks.has(task.id)
        ? { ...task, status: 'archived' as const, updatedAt: new Date() }
        : task
    )
    onTasksChange(updatedTasks)
    setSelectedTasks(new Set())
    toast.success(
      `${selectedCount} task${selectedCount > 1 ? 's' : ''} archived`
    )
  }, [tasks, selectedTasks, selectedCount, onTasksChange])

  const duplicateSelectedTasks = useCallback(() => {
    const tasksToAdd = tasks
      .filter(task => selectedTasks.has(task.id))
      .map(task => ({
        ...task,
        id: `task-${Date.now()}-${Math.random()}`,
        name: `${task.name} (Copy)`,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

    onTasksChange([...tasks, ...tasksToAdd])
    setSelectedTasks(new Set())
    toast.success(
      `${selectedCount} task${selectedCount > 1 ? 's' : ''} duplicated`
    )
  }, [tasks, selectedTasks, selectedCount, onTasksChange])

  const addNewTask = useCallback(() => {
    const constructionTasks = [
      'Frame the walls',
      'Pour foundation',
      'Install plumbing',
      'Wire electrical',
      'Hang drywall',
      'Paint interior',
      'Install flooring',
      'Mount fixtures',
      'Inspect work',
      'Final walkthrough',
    ]
    const randomTask =
      constructionTasks[Math.floor(Math.random() * constructionTasks.length)]

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: randomTask,
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    onTasksChange([...tasks, newTask])
    // Auto-edit the new task name
    setTimeout(() => {
      setEditingCell({ taskId: newTask.id, field: 'name' })
    }, 100)
    toast.success('New work order added to the queue! 🔨')
  }, [tasks, onTasksChange])

  const columns = [
    {
      id: 'select',
      header: (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={selectAllTasks}
        >
          {selectedCount === 0 ? (
            <Square className="h-4 w-4" />
          ) : selectedCount === filteredTasks.length ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4 bg-primary/20 border border-primary rounded-sm flex items-center justify-center">
              <div className="h-2 w-2 bg-primary rounded-sm" />
            </div>
          )}
        </Button>
      ),
      width: '60px',
      render: (task: Task) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => toggleTaskSelection(task.id)}
        >
          {selectedTasks.has(task.id) ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      id: 'name',
      header: 'Task Name',
      width: '300px',
      render: (task: Task) => {
        const isEditing =
          editingCell?.taskId === task.id && editingCell?.field === 'name'

        if (isEditing) {
          return (
            <EditableField
              value={task.name}
              onSave={value => handleTaskEdit(task.id, 'name', value)}
              onCancel={() => setEditingCell(null)}
            />
          )
        }

        return (
          <div
            className="cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1"
            onClick={() => setEditingCell({ taskId: task.id, field: 'name' })}
          >
            {task.name}
          </div>
        )
      },
    },
    {
      id: 'description',
      header: 'Description',
      width: '250px',
      render: (task: Task) => {
        const isEditing =
          editingCell?.taskId === task.id &&
          editingCell?.field === 'description'

        if (isEditing) {
          return (
            <EditableField
              value={task.description || ''}
              onSave={value => handleTaskEdit(task.id, 'description', value)}
              onCancel={() => setEditingCell(null)}
              multiline
            />
          )
        }

        return (
          <div
            className="cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 truncate"
            onClick={() =>
              setEditingCell({ taskId: task.id, field: 'description' })
            }
          >
            {task.description || (
              <span className="text-muted-foreground">Add description...</span>
            )}
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      width: '120px',
      render: (task: Task) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <StatusBadge status={task.status} onClick={() => {}} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleStatusChange(task.id, 'pending')}
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(task.id, 'in-progress')}
            >
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(task.id, 'completed')}
            >
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(task.id, 'archived')}
            >
              Archived
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: 'priority',
      header: 'Priority',
      width: '100px',
      render: (task: Task) => <PriorityBadge priority={task.priority} />,
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      width: '150px',
      render: (task: Task) => (
        <span className="text-sm">{task.assignedTo || '-'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      width: '80px',
      render: (task: Task) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setEditingCell({ taskId: task.id, field: 'name' })}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setEditingCell({ taskId: task.id, field: 'description' })
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Description
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const duplicated = {
                  ...task,
                  id: `task-${Date.now()}-${Math.random()}`,
                  name: `${task.name} (Copy)`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
                onTasksChange([...tasks, duplicated])
                toast.success('Task duplicated')
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const remainingTasks = tasks.filter(t => t.id !== task.id)
                onTasksChange(remainingTasks)
                toast.success('Task deleted')
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search work orders... 🔍"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 w-64 construction-hover"
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Status
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('pending')}
                onCheckedChange={checked => {
                  if (checked) {
                    setStatusFilter([...statusFilter, 'pending'])
                  } else {
                    setStatusFilter(statusFilter.filter(s => s !== 'pending'))
                  }
                }}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('in-progress')}
                onCheckedChange={checked => {
                  if (checked) {
                    setStatusFilter([...statusFilter, 'in-progress'])
                  } else {
                    setStatusFilter(
                      statusFilter.filter(s => s !== 'in-progress')
                    )
                  }
                }}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('completed')}
                onCheckedChange={checked => {
                  if (checked) {
                    setStatusFilter([...statusFilter, 'completed'])
                  } else {
                    setStatusFilter(statusFilter.filter(s => s !== 'completed'))
                  }
                }}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('archived')}
                onCheckedChange={checked => {
                  if (checked) {
                    setStatusFilter([...statusFilter, 'archived'])
                  } else {
                    setStatusFilter(statusFilter.filter(s => s !== 'archived'))
                  }
                }}
              >
                Archived
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={duplicateSelectedTasks}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={archiveSelectedTasks}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelectedTasks}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          <Button onClick={addNewTask} className="group construction-hover">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Issue Work Order 📋
          </Button>
        </div>
      </div>

      {/* Virtual Table */}
      <VirtualTable
        items={filteredTasks}
        columns={columns}
        itemHeight={50}
        containerHeight={containerHeight}
        onRowClick={onTaskClick}
        keyExtractor={task => task.id}
        className="border rounded-lg"
      />

      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground animate-build-up">
          <div className="mb-4 text-4xl">🏗️</div>
          {searchQuery || statusFilter.length > 0 || priorityFilter.length > 0
            ? 'No work orders match your search. Try adjusting those filters, chief!'
            : 'The job site is quiet for now. Ready to break ground on your first work order?'}
        </div>
      )}
    </div>
  )
}
