import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'

// Types for export data
interface ExportOptions {
  type: 'tasks' | 'users' | 'projects' | 'analytics'
  filters?: Record<string, any>
  columns?: string[]
  dateRange?: {
    start: string
    end: string
  }
  format?: 'csv' | 'xlsx'
}

interface Task {
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

interface User {
  id: string
  name: string
  email: string
  role: string
  tasksCompleted: number
  hoursWorked: number
  efficiency: number
  lastActive: Date
}

interface Project {
  id: string
  name: string
  description: string
  status: string
  completion: number
  budget: number
  startDate: Date
  endDate: Date
  teamSize: number
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as ExportOptions['type']
    const format = searchParams.get('format') as ExportOptions['format'] || 'csv'
    
    // Parse filters if provided
    let filters: Record<string, any> = {}
    const filtersParam = searchParams.get('filters')
    if (filtersParam) {
      try {
        filters = JSON.parse(decodeURIComponent(filtersParam))
      } catch (e) {
        return NextResponse.json({ error: 'Invalid filters format' }, { status: 400 })
      }
    }

    // Parse date range
    let dateRange: ExportOptions['dateRange'] | undefined
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      dateRange = { start: startDate, end: endDate }
    }

    // Parse columns
    let columns: string[] | undefined
    const columnsParam = searchParams.get('columns')
    if (columnsParam) {
      columns = columnsParam.split(',')
    }

    const options: ExportOptions = {
      type,
      filters,
      columns,
      dateRange,
      format,
    }

    if (!type) {
      return NextResponse.json({ error: 'Export type is required' }, { status: 400 })
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${type}-export-${timestamp}.${format}`

    // Create streaming response
    const stream = await createExportStream(options)

    return new Response(stream, {
      headers: {
        'Content-Type': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'errors.exportFailed' }, { status: 500 })
  }
}

async function createExportStream(options: ExportOptions): Promise<ReadableStream> {
  const { type, filters, columns, dateRange, format } = options

  return new ReadableStream({
    async start(controller) {
      try {
        // Get data based on type
        const data = await fetchDataForExport(type, filters, dateRange)
        
        if (format === 'csv') {
          await streamCSV(controller, data, columns, type)
        } else {
          // For XLSX format, you'd use a library like exceljs
          await streamCSV(controller, data, columns, type) // Fallback to CSV for now
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

async function streamCSV(
  controller: ReadableStreamDefaultController,
  data: any[],
  columns?: string[],
  dataType?: string
) {
  const encoder = new TextEncoder()

  if (data.length === 0) {
    controller.enqueue(encoder.encode('No data available\n'))
    return
  }

  // Determine columns to export
  const allColumns = Object.keys(data[0])
  const exportColumns = columns || allColumns

  // Write header
  const header = exportColumns.join(',') + '\n'
  controller.enqueue(encoder.encode(header))

  // Stream data in chunks to handle large datasets
  const CHUNK_SIZE = 1000
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE)
    
    const csvChunk = chunk
      .map(row => 
        exportColumns.map(col => {
          const value = row[col]
          if (value === null || value === undefined) return ''
          
          // Handle different data types
          if (value instanceof Date) {
            return value.toISOString()
          }
          
          // Escape CSV special characters
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          
          return stringValue
        }).join(',')
      )
      .join('\n') + '\n'

    controller.enqueue(encoder.encode(csvChunk))

    // Add a small delay to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

async function fetchDataForExport(
  type: ExportOptions['type'],
  filters?: Record<string, any>,
  dateRange?: ExportOptions['dateRange']
): Promise<any[]> {
  // In a real application, this would query your database
  // For demo purposes, we'll generate mock data

  switch (type) {
    case 'tasks':
      return await fetchTasksData(filters, dateRange)
    case 'users':
      return await fetchUsersData(filters, dateRange)
    case 'projects':
      return await fetchProjectsData(filters, dateRange)
    case 'analytics':
      return await fetchAnalyticsData(filters, dateRange)
    default:
      throw new Error(`Unsupported export type: ${type}`)
  }
}

async function fetchTasksData(filters?: Record<string, any>, dateRange?: ExportOptions['dateRange']): Promise<Task[]> {
  // Mock task data generation
  const tasks: Task[] = []
  const count = 10000 // Large dataset to demonstrate streaming

  for (let i = 1; i <= count; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    tasks.push({
      id: `task-${i}`,
      name: `Task ${i}`,
      description: `This is task number ${i} with some description`,
      status: ['pending', 'in-progress', 'completed', 'archived'][Math.floor(Math.random() * 4)] as any,
      priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
      assignedTo: `user-${Math.floor(Math.random() * 10) + 1}`,
      dueDate: new Date(createdAt.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000),
      createdAt,
      updatedAt: createdAt,
      tags: [`tag-${Math.floor(Math.random() * 5) + 1}`, `category-${Math.floor(Math.random() * 3) + 1}`],
    })
  }

  // Apply filters
  let filteredTasks = tasks

  if (filters) {
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => 
        Array.isArray(filters.status) 
          ? filters.status.includes(task.status)
          : task.status === filters.status
      )
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => 
        Array.isArray(filters.priority)
          ? filters.priority.includes(task.priority)
          : task.priority === filters.priority
      )
    }

    if (filters.assignedTo) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === filters.assignedTo)
    }
  }

  // Apply date range
  if (dateRange) {
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    
    filteredTasks = filteredTasks.filter(task => 
      task.createdAt >= startDate && task.createdAt <= endDate
    )
  }

  return filteredTasks
}

async function fetchUsersData(filters?: Record<string, any>, dateRange?: ExportOptions['dateRange']): Promise<User[]> {
  // Mock user data
  const users: User[] = []
  const count = 500

  for (let i = 1; i <= count; i++) {
    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: ['admin', 'manager', 'member', 'viewer'][Math.floor(Math.random() * 4)],
      tasksCompleted: Math.floor(Math.random() * 100),
      hoursWorked: Math.floor(Math.random() * 160),
      efficiency: Math.floor(Math.random() * 100),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    })
  }

  return users
}

async function fetchProjectsData(filters?: Record<string, any>, dateRange?: ExportOptions['dateRange']): Promise<Project[]> {
  // Mock project data
  const projects: Project[] = []
  const count = 100

  for (let i = 1; i <= count; i++) {
    const startDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    
    projects.push({
      id: `project-${i}`,
      name: `Project ${i}`,
      description: `This is project number ${i}`,
      status: ['active', 'completed', 'on-hold', 'cancelled'][Math.floor(Math.random() * 4)],
      completion: Math.floor(Math.random() * 100),
      budget: Math.floor(Math.random() * 1000000),
      startDate,
      endDate: new Date(startDate.getTime() + Math.random() * 120 * 24 * 60 * 60 * 1000),
      teamSize: Math.floor(Math.random() * 20) + 1,
    })
  }

  return projects
}

async function fetchAnalyticsData(filters?: Record<string, any>, dateRange?: ExportOptions['dateRange']) {
  // Mock analytics data
  const analytics = []
  const days = 90

  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    
    analytics.push({
      date: date.toISOString().split('T')[0],
      tasksCreated: Math.floor(Math.random() * 50) + 10,
      tasksCompleted: Math.floor(Math.random() * 40) + 5,
      activeUsers: Math.floor(Math.random() * 100) + 20,
      hoursWorked: Math.floor(Math.random() * 500) + 100,
      efficiency: Math.floor(Math.random() * 100),
    })
  }

  return analytics.reverse()
}

// POST endpoint for triggering exports with complex options
export async function POST(request: NextRequest) {
  try {
    const options: ExportOptions = await request.json()

    if (!options.type) {
      return NextResponse.json({ error: 'Export type is required' }, { status: 400 })
    }

    // For POST, we could queue the export job and return a job ID
    const jobId = `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // In a real app, you'd queue this with a job processor like Bull or similar
    // await queueExportJob(jobId, options)

    return NextResponse.json({
      jobId,
      message: 'Export job queued successfully',
      estimatedTime: '2-5 minutes',
      downloadUrl: `/api/export/csv?type=${options.type}&jobId=${jobId}`
    })

  } catch (error) {
    console.error('Export queue error:', error)
    return NextResponse.json({ error: 'errors.exportQueueFailed' }, { status: 500 })
  }
}