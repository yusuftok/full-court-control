'use client'

import React, { useState } from 'react'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { DivisionTree, DivisionNode } from '@/components/data/division-tree'
import { TaskManager, Task } from '@/components/data/task-manager'
import { AnalyticsDashboard } from '@/components/data/analytics-dashboard'
import { WhatsAppIntegration } from '@/components/integrations/whatsapp-integration'
import { VirtualTable } from '@/components/data/virtual-list'
import { Button } from '@/components/ui/button'
import { Download, Zap } from 'lucide-react'
import { toast } from 'sonner'

// Interface for virtual table data
interface VirtualTableItem {
  id: string
  name: string
  category: 'Alpha' | 'Beta' | 'Gamma' | 'Delta'
  value: number
  status: 'active' | 'inactive' | 'pending'
  date: string
}

// Mock data for demonstrations
const initialDivisions: DivisionNode[] = [
  {
    id: 'div-1',
    name: 'Yapı İnşaatı',
    description: 'Ana yapı inşaat işleri',
    type: 'division',
    isExpanded: true,
    children: [
      {
        id: 'subdiv-1',
        name: 'Temel İşleri',
        type: 'subdiv',
        isExpanded: false,
        children: [
          {
            id: 'task-1',
            name: 'Kazı İşleri',
            type: 'task',
            children: [],
          },
          {
            id: 'task-2',
            name: 'Beton Döküm',
            type: 'task',
            children: [],
          },
        ],
      },
      {
        id: 'subdiv-2',
        name: 'Kaba İnşaat',
        type: 'subdiv',
        isExpanded: false,
        children: [],
      },
    ],
  },
  {
    id: 'div-2',
    name: 'Mimari Finisaj',
    description: 'İç ve dış mimari finish işleri',
    type: 'division',
    isExpanded: true,
    children: [
      {
        id: 'subdiv-3',
        name: 'İç Mekan',
        type: 'subdiv',
        isExpanded: false,
        children: [],
      },
      {
        id: 'subdiv-4',
        name: 'Dış Cephe',
        type: 'subdiv',
        isExpanded: false,
        children: [],
      },
    ],
  },
]

const generateTasks = (count: number): Task[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i + 1}`,
    name: `Task ${i + 1}`,
    description: `This is the description for task number ${i + 1}. It contains various details about what needs to be accomplished.`,
    status: ['pending', 'in-progress', 'completed', 'archived'][
      Math.floor(Math.random() * 4)
    ] as Task['status'],
    priority: ['low', 'medium', 'high', 'urgent'][
      Math.floor(Math.random() * 4)
    ] as Task['priority'],
    assignedTo: `user-${Math.floor(Math.random() * 10) + 1}`,
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    tags: [`tag-${Math.floor(Math.random() * 5) + 1}`],
  }))
}

const generateVirtualTableData = (count: number): VirtualTableItem[] => {
  const categories: Array<'Alpha' | 'Beta' | 'Gamma' | 'Delta'> = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
  ]
  const statuses: Array<'active' | 'inactive' | 'pending'> = [
    'active',
    'inactive',
    'pending',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
    category: categories[Math.floor(Math.random() * 4)],
    value: Math.floor(Math.random() * 10000),
    status: statuses[Math.floor(Math.random() * 3)],
    date: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  }))
}

export default function AdvancedDemoPage() {
  const [activeTab, setActiveTab] = useState('division-tree')
  const [divisions, setDivisions] = useState<DivisionNode[]>(initialDivisions)
  const [tasks, setTasks] = useState<Task[]>(() => generateTasks(5000))
  const [virtualData] = useState(() => generateVirtualTableData(10000))

  const tabItems = [
    { id: 'division-tree', label: 'Division Tree', href: '#division-tree' },
    {
      id: 'task-management',
      label: 'Task Management',
      href: '#task-management',
    },
    {
      id: 'virtual-scrolling',
      label: 'Virtual Scrolling',
      href: '#virtual-scrolling',
    },
    { id: 'analytics', label: 'Analytics Dashboard', href: '#analytics' },
    { id: 'whatsapp', label: 'WhatsApp Integration', href: '#whatsapp' },
  ]

  const handleExportData = async (type: string) => {
    toast.promise(
      fetch(
        `/api/export/csv?type=${type}&format=csv&columns=id,name,status,priority,createdAt`
      ),
      {
        loading: `Exporting ${type} data...`,
        success: response => {
          if (response.ok) {
            // Trigger download
            const link = document.createElement('a')
            link.href = response.url
            link.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return `${type} data exported successfully!`
          }
          throw new Error('Export failed')
        },
        error: 'Failed to export data',
      }
    )
  }

  const virtualTableColumns = [
    {
      id: 'id',
      header: 'ID',
      width: '100px',
      render: (item: VirtualTableItem) => (
        <span className="font-mono text-xs">{item.id}</span>
      ),
    },
    {
      id: 'name',
      header: 'Name',
      width: '200px',
      render: (item: VirtualTableItem) => (
        <span className="font-medium">{item.name}</span>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      width: '120px',
      render: (item: VirtualTableItem) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            {
              Alpha: 'bg-blue-100 text-blue-700',
              Beta: 'bg-green-100 text-green-700',
              Gamma: 'bg-yellow-100 text-yellow-700',
              Delta: 'bg-purple-100 text-purple-700',
            }[item.category as string]
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      id: 'value',
      header: 'Value',
      width: '100px',
      render: (item: VirtualTableItem) => (
        <span className="font-mono">${item.value.toLocaleString()}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: '100px',
      render: (item: VirtualTableItem) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            {
              active: 'bg-green-100 text-green-700',
              inactive: 'bg-gray-100 text-gray-700',
              pending: 'bg-yellow-100 text-yellow-700',
            }[item.status as string]
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      width: '120px',
      render: (item: VirtualTableItem) => (
        <span className="text-sm">{item.date}</span>
      ),
    },
  ]

  return (
    <PageContainer maxWidth="full">
      <PageHeader
        title="Advanced Features Demo"
        description="Demonstration of complex components including drag-drop trees, virtual scrolling, real-time analytics, and integrations"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleExportData('tasks')}>
              <Download className="w-4 h-4 mr-2" />
              Export Tasks
            </Button>
            <Button
              onClick={() =>
                toast.success('All features are production ready!')
              }
            >
              <Zap className="w-4 h-4 mr-2" />
              Production Ready
            </Button>
          </div>
        }
      />

      <PageContent>
        <div className="space-y-6">
          <div className="border-b">
            <div className="flex space-x-8">
              {tabItems.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'division-tree' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Division Template Designer
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop to reorder divisions, right-click for context
                  menu, double-click to edit names inline. This tree supports
                  unlimited nesting and handles complex hierarchical structures
                  efficiently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Features Demonstrated:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drag-drop reordering with @dnd-kit</li>
                      <li>• Inline editing with validation</li>
                      <li>• Context menus for operations</li>
                      <li>• Expand/collapse functionality</li>
                      <li>• Keyboard navigation support</li>
                      <li>• Mobile touch interactions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Performance:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Handles 1000+ nodes efficiently</li>
                      <li>• Optimized re-renders</li>
                      <li>• Memory-efficient tree operations</li>
                      <li>• Smooth animations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <DivisionTree
                  data={divisions}
                  onChange={setDivisions}
                  className="max-w-4xl mx-auto"
                />
              </div>
            </div>
          )}

          {activeTab === 'task-management' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Task Management System</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete task management with inline editing, bulk operations,
                  filtering, and virtual scrolling. Currently displaying{' '}
                  {tasks.length.toLocaleString()} tasks with smooth performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Editing Features:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Click to edit task names</li>
                      <li>• Multiline description editing</li>
                      <li>• Status dropdown changes</li>
                      <li>• Auto-save functionality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Bulk Operations:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Multi-select with checkboxes</li>
                      <li>• Bulk delete/archive/duplicate</li>
                      <li>• Select all functionality</li>
                      <li>• Keyboard shortcuts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Performance:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Virtual scrolling enabled</li>
                      <li>• Real-time search/filter</li>
                      <li>• Handles 10,000+ tasks</li>
                      <li>• Optimized renders</li>
                    </ul>
                  </div>
                </div>
              </div>

              <TaskManager
                tasks={tasks}
                onTasksChange={setTasks}
                containerHeight={600}
                onTaskClick={task => toast.info(`Clicked task: ${task.name}`)}
                className="border rounded-lg"
              />
            </div>
          )}

          {activeTab === 'virtual-scrolling' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Virtual Scrolling Table</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Displaying {virtualData.length.toLocaleString()} rows using
                  virtual scrolling for optimal performance. Only visible rows
                  are rendered, making it possible to handle massive datasets
                  efficiently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Virtual Scrolling Benefits:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Renders only visible items</li>
                      <li>• Constant memory usage</li>
                      <li>• Smooth scrolling performance</li>
                      <li>• Configurable overscan buffer</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Technical Details:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 50px fixed row height</li>
                      <li>• 600px container height</li>
                      <li>• 5 item overscan buffer</li>
                      <li>• Sticky table headers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <VirtualTable
                items={virtualData}
                columns={virtualTableColumns}
                itemHeight={50}
                containerHeight={600}
                onRowClick={item => toast.info(`Clicked: ${item.name}`)}
                keyExtractor={item => item.id}
                className="border rounded-lg"
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Real-time Analytics Dashboard
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Live dashboard with auto-refresh, interactive charts, and
                  export capabilities. Data updates every 30 seconds using React
                  Query for optimal caching and background updates.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Real-time Features:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Auto-refresh every 30s</li>
                      <li>• Background data fetching</li>
                      <li>• Connection status monitoring</li>
                      <li>• Optimistic UI updates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Chart Types:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Time series area charts</li>
                      <li>• Pie charts for distribution</li>
                      <li>• Bar charts for comparison</li>
                      <li>• Progress indicators</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Export Options:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• CSV export for all charts</li>
                      <li>• Time range filtering</li>
                      <li>• Custom column selection</li>
                      <li>• Streaming large datasets</li>
                    </ul>
                  </div>
                </div>
              </div>

              <AnalyticsDashboard
                className="space-y-6"
                refreshInterval={30000}
              />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  WhatsApp Business Integration
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete WhatsApp integration for task management via
                  messaging. Supports command parsing, attachment handling, and
                  automated task creation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Message Features:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Real-time message sync</li>
                      <li>• Command parsing system</li>
                      <li>• Attachment support</li>
                      <li>• Message status tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Commands:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                      <li>• /task [description]</li>
                      <li>• /status [status] [id]</li>
                      <li>• /priority [level] [id]</li>
                      <li>• /list, /help</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Integration:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Webhook endpoint ready</li>
                      <li>• Automatic task creation</li>
                      <li>• Contact management</li>
                      <li>• Export conversations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <WhatsAppIntegration className="space-y-6" />
            </div>
          )}
        </div>
      </PageContent>
    </PageContainer>
  )
}
