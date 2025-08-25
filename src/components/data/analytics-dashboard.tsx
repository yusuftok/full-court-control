'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatCard, StatCardGrid } from './stat-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// Mock data interfaces
export interface AnalyticsData {
  overview: {
    totalTasks: number
    completedTasks: number
    activeUsers: number
    projectsInProgress: number
    completionRate: number
    averageCompletionTime: number
  }
  timeSeriesData: Array<{
    date: string
    tasks: number
    completions: number
    users: number
  }>
  tasksByStatus: Array<{
    status: string
    count: number
    color: string
  }>
  tasksByPriority: Array<{
    priority: string
    count: number
    color: string
  }>
  userActivity: Array<{
    user: string
    tasksCompleted: number
    hoursWorked: number
    efficiency: number
  }>
  projectProgress: Array<{
    project: string
    completion: number
    tasks: number
    dueDate: string
  }>
}

// Mock API function - in real app this would be actual API calls
const fetchAnalyticsData = async (
  timeRange: string
): Promise<AnalyticsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const now = new Date()
  const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90

  // Generate time series data
  const timeSeriesData = Array.from({ length: daysBack }, (_, i) => {
    const date = new Date(
      now.getTime() - (daysBack - 1 - i) * 24 * 60 * 60 * 1000
    )
    return {
      date: date.toISOString().split('T')[0],
      tasks: Math.floor(Math.random() * 50) + 10,
      completions: Math.floor(Math.random() * 30) + 5,
      users: Math.floor(Math.random() * 20) + 5,
    }
  })

  const totalTasks = timeSeriesData.reduce((sum, day) => sum + day.tasks, 0)
  const completedTasks = timeSeriesData.reduce(
    (sum, day) => sum + day.completions,
    0
  )

  return {
    overview: {
      totalTasks,
      completedTasks,
      activeUsers: 156,
      projectsInProgress: 23,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
      averageCompletionTime: 2.4,
    },
    timeSeriesData,
    tasksByStatus: [
      { status: 'Completed', count: completedTasks, color: '#10b981' },
      {
        status: 'In Progress',
        count: Math.floor(totalTasks * 0.4),
        color: '#3b82f6',
      },
      {
        status: 'Pending',
        count: Math.floor(totalTasks * 0.3),
        color: '#f59e0b',
      },
      {
        status: 'Blocked',
        count: Math.floor(totalTasks * 0.1),
        color: '#ef4444',
      },
    ],
    tasksByPriority: [
      {
        priority: 'High',
        count: Math.floor(totalTasks * 0.2),
        color: '#ef4444',
      },
      {
        priority: 'Medium',
        count: Math.floor(totalTasks * 0.5),
        color: '#f59e0b',
      },
      {
        priority: 'Low',
        count: Math.floor(totalTasks * 0.3),
        color: '#10b981',
      },
    ],
    userActivity: [
      {
        user: 'Ayşe Kaya',
        tasksCompleted: 23,
        hoursWorked: 38,
        efficiency: 95,
      },
      {
        user: 'Mehmet Yılmaz',
        tasksCompleted: 19,
        hoursWorked: 42,
        efficiency: 87,
      },
      {
        user: 'Fatma Demir',
        tasksCompleted: 17,
        hoursWorked: 35,
        efficiency: 92,
      },
      {
        user: 'Ali Çelik',
        tasksCompleted: 15,
        hoursWorked: 40,
        efficiency: 78,
      },
      {
        user: 'Zeynep Özkan',
        tasksCompleted: 21,
        hoursWorked: 36,
        efficiency: 89,
      },
    ],
    projectProgress: [
      {
        project: 'Site Yeniden Tasarım',
        completion: 78,
        tasks: 24,
        dueDate: '2024-02-15',
      },
      {
        project: 'Mobil Uygulama',
        completion: 45,
        tasks: 31,
        dueDate: '2024-03-01',
      },
      {
        project: 'API Entegrasyonu',
        completion: 92,
        tasks: 18,
        dueDate: '2024-01-30',
      },
      {
        project: 'Kullanıcı Testleri',
        completion: 23,
        tasks: 12,
        dueDate: '2024-02-28',
      },
    ],
  }
}

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  onExport?: () => void
}

function ChartCard({
  title,
  description,
  children,
  className,
  onExport,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {onExport && (
          <Button variant="ghost" size="sm" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface AnalyticsDashboardProps {
  className?: string
  refreshInterval?: number
}

export function AnalyticsDashboard({
  className,
  refreshInterval = 30000,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const queryClient = useQueryClient()

  // Fetch analytics data with React Query
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => fetchAnalyticsData(timeRange),
    refetchInterval: isAutoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: true,
    staleTime: 5000, // Consider data fresh for 5 seconds
  })

  const handleExportCSV = (dataType: string, chartData: any[]) => {
    if (!chartData.length) return

    const headers = Object.keys(chartData[0]).join(',')
    const rows = chartData.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${dataType}-${timeRange}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(`${dataType} data exported successfully`)
  }

  const handleManualRefresh = () => {
    refetch()
    toast.success('Dashboard refreshed')
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load analytics data
          </p>
          <Button onClick={handleManualRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const lastUpdated = new Date(dataUpdatedAt).toLocaleTimeString()

  return (
    <div className={className}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
            {isAutoRefresh && (
              <Badge variant="secondary" className="ml-2">
                Auto-refresh: {refreshInterval / 1000}s
              </Badge>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            <Activity
              className={`w-4 h-4 mr-2 ${isAutoRefresh ? 'text-green-500' : ''}`}
            />
            Auto-refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <StatCardGrid columns={4}>
            <StatCard
              title="Total Tasks"
              value={data.overview.totalTasks}
              icon={CheckCircle}
            />
            <StatCard
              title="Completion Rate"
              value={`${data.overview.completionRate}%`}
              change={{
                value: data.overview.completionRate > 75 ? 5 : -2,
                type:
                  data.overview.completionRate > 75 ? 'increase' : 'decrease',
                period: 'geçen aya göre',
              }}
              icon={TrendingUp}
            />
            <StatCard
              title="Aktif Kullanıcılar"
              value={data.overview.activeUsers}
              change={{
                value: 12,
                type: 'increase',
                period: 'geçen aya göre',
              }}
              icon={Users}
            />
            <StatCard
              title="Ort. Tamamlama Süresi"
              value={`${data.overview.averageCompletionTime}d`}
              change={{
                value: -0.3,
                type: 'decrease',
                period: 'geçen aya göre',
              }}
              icon={Clock}
            />
          </StatCardGrid>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Completion Trend */}
            <ChartCard
              title="Task Completion Trend"
              description="Daily task creation and completion"
              onExport={() =>
                handleExportCSV('task-trend', data.timeSeriesData)
              }
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={value =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={value =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Tasks Created"
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                    name="Tasks Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Task Status Distribution */}
            <ChartCard
              title="Task Status Distribution"
              onExport={() =>
                handleExportCSV('task-status', data.tasksByStatus)
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.tasksByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {data.tasksByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Priority Distribution */}
            <ChartCard
              title="Task Priority Distribution"
              onExport={() =>
                handleExportCSV('task-priority', data.tasksByPriority)
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.tasksByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {data.tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* User Activity Table */}
          <ChartCard
            title="Top Performers"
            description="Most active users this period"
            onExport={() => handleExportCSV('user-activity', data.userActivity)}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">User</th>
                    <th className="text-left p-2 font-medium">
                      Tasks Completed
                    </th>
                    <th className="text-left p-2 font-medium">Hours Worked</th>
                    <th className="text-left p-2 font-medium">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {data.userActivity.map((user, index) => (
                    <tr key={user.user} className="border-b">
                      <td className="p-2 font-medium">{user.user}</td>
                      <td className="p-2">{user.tasksCompleted}</td>
                      <td className="p-2">{user.hoursWorked}h</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${user.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm">{user.efficiency}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Project Progress */}
          <ChartCard
            title="Project Progress"
            description="Current project completion status"
          >
            <div className="space-y-4">
              {data.projectProgress.map(project => (
                <div
                  key={project.project}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{project.project}</span>
                      <span className="text-sm text-muted-foreground">
                        {project.completion}% ({project.tasks} tasks)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          project.completion >= 75
                            ? 'bg-green-500'
                            : project.completion >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      )}
    </div>
  )
}
