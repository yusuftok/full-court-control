import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { 
  DataTable, 
  DataTableSkeleton, 
  TableAction, 
  StatusBadge,
  Column,
  SortConfig 
} from './data-table'

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}))

// Sample data for tests
interface TestData {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
  createdAt: Date
}

const sampleData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', createdAt: new Date('2023-01-01') },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', createdAt: new Date('2023-01-02') },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', createdAt: new Date('2023-01-03') },
]

const sampleColumns: Column<TestData>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true },
  { id: 'status', header: 'Status', accessor: 'status' },
  { 
    id: 'actions', 
    header: 'Actions', 
    accessor: (row) => <TableAction onEdit={() => {}} onDelete={() => {}} />
  },
]

describe('DataTable Component', () => {
  describe('Basic Rendering', () => {
    it('renders table with data and columns', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} />)
      
      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
      
      // Check data
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('renders empty state when no data', () => {
      render(<DataTable data={[]} columns={sampleColumns} emptyMessage="No users found" />)
      
      expect(screen.getByText('No users found')).toBeInTheDocument()
    })

    it('uses default empty message', () => {
      render(<DataTable data={[]} columns={sampleColumns} />)
      
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} className="custom-table" />)
      
      const tableContainer = screen.getByRole('table').closest('.custom-table')
      expect(tableContainer).toBeInTheDocument()
    })
  })

  describe('Column Configuration', () => {
    it('applies column width when specified', () => {
      const columnsWithWidth: Column<TestData>[] = [
        { id: 'name', header: 'Name', accessor: 'name', width: '200px' },
        { id: 'email', header: 'Email', accessor: 'email', width: '300px' },
      ]

      render(<DataTable data={sampleData} columns={columnsWithWidth} />)
      
      const nameHeader = screen.getByText('Name').closest('th')
      const emailHeader = screen.getByText('Email').closest('th')
      
      expect(nameHeader).toHaveStyle('width: 200px')
      expect(emailHeader).toHaveStyle('width: 300px')
    })

    it('applies column className when specified', () => {
      const columnsWithClassName: Column<TestData>[] = [
        { id: 'name', header: 'Name', accessor: 'name', className: 'text-left' },
        { id: 'email', header: 'Email', accessor: 'email', className: 'text-right' },
      ]

      render(<DataTable data={columnsWithClassName} columns={columnsWithClassName} />)
      
      const nameHeader = screen.getByText('Name').closest('th')
      const emailHeader = screen.getByText('Email').closest('th')
      
      expect(nameHeader).toHaveClass('text-left')
      expect(emailHeader).toHaveClass('text-right')
    })

    it('handles function accessor correctly', () => {
      const columnsWithFunction: Column<TestData>[] = [
        { 
          id: 'fullInfo', 
          header: 'Full Info', 
          accessor: (row) => `${row.name} (${row.email})` 
        },
      ]

      render(<DataTable data={sampleData} columns={columnsWithFunction} />)
      
      expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument()
    })
  })

  describe('Sorting Functionality', () => {
    const mockOnSort = jest.fn()

    beforeEach(() => {
      mockOnSort.mockClear()
    })

    it('renders sort icons for sortable columns', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} onSort={mockOnSort} />)
      
      const nameHeader = screen.getByText('Name').closest('th')
      const statusHeader = screen.getByText('Status').closest('th')
      
      expect(nameHeader).toHaveClass('cursor-pointer')
      expect(statusHeader).not.toHaveClass('cursor-pointer')
    })

    it('calls onSort when sortable header is clicked', async () => {
      const user = userEvent.setup()
      render(<DataTable data={sampleData} columns={sampleColumns} onSort={mockOnSort} />)
      
      const nameHeader = screen.getByText('Name').closest('th')
      await user.click(nameHeader!)
      
      expect(mockOnSort).toHaveBeenCalledWith('name')
    })

    it('displays correct sort icon based on sort config', () => {
      const sortConfig: SortConfig = { key: 'name', direction: 'asc' }
      render(
        <DataTable 
          data={sampleData} 
          columns={sampleColumns} 
          sortConfig={sortConfig}
          onSort={mockOnSort}
        />
      )
      
      expect(screen.getByTestId('chevronup')).toBeInTheDocument()
    })

    it('displays descending sort icon', () => {
      const sortConfig: SortConfig = { key: 'name', direction: 'desc' }
      render(
        <DataTable 
          data={sampleData} 
          columns={sampleColumns} 
          sortConfig={sortConfig}
          onSort={mockOnSort}
        />
      )
      
      expect(screen.getByTestId('chevrondown')).toBeInTheDocument()
    })

    it('does not call onSort for non-sortable columns', async () => {
      const user = userEvent.setup()
      render(<DataTable data={sampleData} columns={sampleColumns} onSort={mockOnSort} />)
      
      const statusHeader = screen.getByText('Status').closest('th')
      await user.click(statusHeader!)
      
      expect(mockOnSort).not.toHaveBeenCalled()
    })
  })

  describe('Row Interaction', () => {
    const mockOnRowClick = jest.fn()

    beforeEach(() => {
      mockOnRowClick.mockClear()
    })

    it('calls onRowClick when row is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DataTable 
          data={sampleData} 
          columns={sampleColumns} 
          onRowClick={mockOnRowClick}
        />
      )
      
      const firstRow = screen.getByText('John Doe').closest('tr')
      await user.click(firstRow!)
      
      expect(mockOnRowClick).toHaveBeenCalledWith(sampleData[0], 0)
    })

    it('applies hover styling when onRowClick is provided', () => {
      render(
        <DataTable 
          data={sampleData} 
          columns={sampleColumns} 
          onRowClick={mockOnRowClick}
        />
      )
      
      const firstRow = screen.getByText('John Doe').closest('tr')
      expect(firstRow).toHaveClass('cursor-pointer', 'hover:bg-muted/50')
    })

    it('does not apply hover styling when onRowClick is not provided', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} />)
      
      const firstRow = screen.getByText('John Doe').closest('tr')
      expect(firstRow).not.toHaveClass('cursor-pointer')
    })
  })

  describe('Row Key Generation', () => {
    it('uses custom rowKey function', () => {
      const customRowKey = (row: TestData, index: number) => `user-${row.id}`
      render(
        <DataTable 
          data={sampleData} 
          columns={sampleColumns} 
          rowKey={customRowKey}
        />
      )
      
      // Check that rows are rendered (function is working)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('uses accessor property as rowKey', () => {
      render(
        <DataTable 
          data={sampleData} 
          columns={sampleColumns} 
          rowKey="id"
        />
      )
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('falls back to index when no rowKey specified', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('shows skeleton when loading', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} loading />)
      
      // Should show skeleton structure instead of data
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      // Skeleton should still show headers
      expect(screen.getByText('Name')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper table structure', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} />)
      
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getAllByRole('columnheader')).toHaveLength(sampleColumns.length)
      expect(screen.getAllByRole('row')).toHaveLength(sampleData.length + 1) // +1 for header
    })

    it('sortable headers have proper styling', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} onSort={jest.fn()} />)
      
      const nameHeader = screen.getByText('Name').closest('th')
      expect(nameHeader).toHaveClass('cursor-pointer', 'select-none', 'hover:text-foreground')
    })
  })
})

describe('DataTableSkeleton Component', () => {
  const skeletonColumns: Column<any>[] = [
    { id: 'name', header: 'Name', accessor: 'name' },
    { id: 'email', header: 'Email', accessor: 'email' },
  ]

  it('renders skeleton with correct number of columns', () => {
    render(<DataTableSkeleton columns={skeletonColumns} />)
    
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders default number of skeleton rows', () => {
    render(<DataTableSkeleton columns={skeletonColumns} />)
    
    const skeletonRows = screen.getAllByRole('row').slice(1) // Exclude header
    expect(skeletonRows).toHaveLength(5) // Default is 5
  })

  it('renders custom number of skeleton rows', () => {
    render(<DataTableSkeleton columns={skeletonColumns} rows={3} />)
    
    const skeletonRows = screen.getAllByRole('row').slice(1)
    expect(skeletonRows).toHaveLength(3)
  })

  it('skeleton cells have animation class', () => {
    render(<DataTableSkeleton columns={skeletonColumns} />)
    
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})

describe('TableAction Component', () => {
  const mockHandlers = {
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    Object.values(mockHandlers).forEach(mock => mock.mockClear())
  })

  it('renders all action buttons when handlers provided', () => {
    render(<TableAction {...mockHandlers} />)
    
    expect(screen.getByText('View')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByTestId('morehorizontal')).toBeInTheDocument()
  })

  it('only renders buttons for provided handlers', () => {
    render(<TableAction onEdit={mockHandlers.onEdit} />)
    
    expect(screen.queryByText('View')).not.toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('calls handlers when buttons are clicked', async () => {
    const user = userEvent.setup()
    render(<TableAction {...mockHandlers} />)
    
    await user.click(screen.getByText('View'))
    expect(mockHandlers.onView).toHaveBeenCalledTimes(1)
    
    await user.click(screen.getByText('Edit'))
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1)
    
    await user.click(screen.getByText('Delete'))
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<TableAction className="custom-actions" data-testid="table-action" onEdit={jest.fn()} />)
    
    const container = screen.getByTestId('table-action')
    expect(container).toHaveClass('custom-actions')
  })

  it('delete button has destructive styling', () => {
    render(<TableAction onDelete={mockHandlers.onDelete} />)
    
    const deleteButton = screen.getByText('Delete')
    expect(deleteButton).toHaveClass('text-destructive', 'hover:text-destructive')
  })
})

describe('StatusBadge Component', () => {
  const statuses = ['active', 'inactive', 'pending', 'completed', 'cancelled'] as const

  statuses.forEach(status => {
    it(`renders ${status} status correctly`, () => {
      render(<StatusBadge status={status} />)
      
      const badge = screen.getByText(status.charAt(0).toUpperCase() + status.slice(1))
      expect(badge).toBeInTheDocument()
    })
  })

  it('applies correct styling for active status', () => {
    render(<StatusBadge status="active" />)
    
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('applies correct styling for inactive status', () => {
    render(<StatusBadge status="inactive" />)
    
    const badge = screen.getByText('Inactive')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('applies correct styling for pending status', () => {
    render(<StatusBadge status="pending" />)
    
    const badge = screen.getByText('Pending')
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('applies correct styling for completed status', () => {
    render(<StatusBadge status="completed" />)
    
    const badge = screen.getByText('Completed')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('applies correct styling for cancelled status', () => {
    render(<StatusBadge status="cancelled" />)
    
    const badge = screen.getByText('Cancelled')
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('applies custom className', () => {
    render(<StatusBadge status="active" className="custom-badge" />)
    
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('custom-badge')
  })

  it('has proper badge structure', () => {
    render(<StatusBadge status="active" />)
    
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass(
      'inline-flex', 'items-center', 'px-2.5', 'py-0.5', 
      'rounded-full', 'text-xs', 'font-medium'
    )
  })

  it('handles dark mode classes', () => {
    render(<StatusBadge status="active" />)
    
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('dark:bg-green-900/30', 'dark:text-green-400')
  })
})