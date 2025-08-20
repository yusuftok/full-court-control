import { render, screen } from '@testing-library/react'
import { StatCard, StatCardGrid, ProgressStatCard } from './stat-card'

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>{children}</div>
  ),
}))

// Mock icon for testing
const MockIcon = () => <svg data-testid="mock-icon" />

describe('StatCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders title and value', () => {
      render(<StatCard title="Total Users" value={1250} />)
      
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('1,250')).toBeInTheDocument()
    })

    it('renders string values as-is', () => {
      render(<StatCard title="Status" value="Active" />)
      
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders icon when provided', () => {
      render(<StatCard title="Users" value={100} icon={MockIcon} />)
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(<StatCard title="Users" value={100} description="Total registered users" />)
      
      expect(screen.getByText('Total registered users')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<StatCard title="Users" value={100} className="custom-stat-card" />)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-stat-card')
    })
  })

  describe('Value Formatting', () => {
    it('formats numbers with K suffix for thousands', () => {
      render(<StatCard title="Views" value={1500} />)
      
      expect(screen.getByText('1.5K')).toBeInTheDocument()
    })

    it('formats numbers with M suffix for millions', () => {
      render(<StatCard title="Views" value={2500000} />)
      
      expect(screen.getByText('2.5M')).toBeInTheDocument()
    })

    it('formats numbers with B suffix for billions', () => {
      render(<StatCard title="Revenue" value={1200000000} />)
      
      expect(screen.getByText('1.2B')).toBeInTheDocument()
    })

    it('formats numbers below 1000 with locale string', () => {
      render(<StatCard title="Small Number" value={123} />)
      
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('handles edge case of exactly 1000', () => {
      render(<StatCard title="Exactly Thousand" value={1000} />)
      
      expect(screen.getByText('1.0K')).toBeInTheDocument()
    })

    it('handles edge case of exactly 1 million', () => {
      render(<StatCard title="Exactly Million" value={1000000} />)
      
      expect(screen.getByText('1.0M')).toBeInTheDocument()
    })

    it('handles edge case of exactly 1 billion', () => {
      render(<StatCard title="Exactly Billion" value={1000000000} />)
      
      expect(screen.getByText('1.0B')).toBeInTheDocument()
    })

    it('handles zero value', () => {
      render(<StatCard title="Zero Value" value={0} />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('handles negative values', () => {
      render(<StatCard title="Negative" value={-500} />)
      
      expect(screen.getByText('-500')).toBeInTheDocument()
    })
  })

  describe('Change Indicator', () => {
    it('renders positive change with green color', () => {
      const change = { value: 12.5, type: 'increase' as const, period: 'last month' }
      render(<StatCard title="Users" value={100} change={change} />)
      
      const changeElement = screen.getByText('+12.5%')
      expect(changeElement).toHaveClass('text-green-600', 'dark:text-green-400')
      expect(screen.getByText('from last month')).toBeInTheDocument()
    })

    it('renders negative change with red color', () => {
      const change = { value: -8.3, type: 'decrease' as const, period: 'last week' }
      render(<StatCard title="Sales" value={50} change={change} />)
      
      const changeElement = screen.getByText('-8.3%')
      expect(changeElement).toHaveClass('text-red-600', 'dark:text-red-400')
      expect(screen.getByText('from last week')).toBeInTheDocument()
    })

    it('formats change values with one decimal place', () => {
      const change = { value: 15.678, type: 'increase' as const, period: 'yesterday' }
      render(<StatCard title="Revenue" value={1000} change={change} />)
      
      expect(screen.getByText('+15.7%')).toBeInTheDocument()
    })

    it('handles zero change', () => {
      const change = { value: 0, type: 'increase' as const, period: 'today' }
      render(<StatCard title="Stable" value={100} change={change} />)
      
      expect(screen.getByText('+0.0%')).toBeInTheDocument()
    })

    it('handles negative value but increase type (uses absolute value for display)', () => {
      const change = { value: -5, type: 'increase' as const, period: 'last hour' }
      render(<StatCard title="Weird Case" value={100} change={change} />)
      
      expect(screen.getByText('-5.0%')).toBeInTheDocument()
      expect(screen.getByText('-5.0%')).toHaveClass('text-green-600') // Still uses increase color
    })
  })

  describe('Layout and Styling', () => {
    it('has proper header structure', () => {
      render(<StatCard title="Test" value={100} icon={MockIcon} />)
      
      const header = screen.getByTestId('card-header')
      expect(header).toHaveClass('pb-2')
      
      expect(screen.getByText('Test')).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground')
      
      const icon = screen.getByTestId('mock-icon')
      expect(icon).toHaveClass('size-4', 'text-muted-foreground')
    })

    it('has proper content structure', () => {
      render(<StatCard title="Test" value={100} />)
      
      const content = screen.getByTestId('card-content')
      expect(content).toHaveClass('pt-0')
      
      expect(screen.getByText('100')).toHaveClass('text-2xl', 'font-bold')
    })

    it('renders without icon slot when no icon provided', () => {
      render(<StatCard title="No Icon" value={100} />)
      
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument()
    })

    it('description has proper styling', () => {
      render(<StatCard title="Test" value={100} description="Test description" />)
      
      const description = screen.getByText('Test description')
      expect(description).toHaveClass('text-xs', 'text-muted-foreground')
    })
  })

  describe('Edge Cases', () => {
    it('renders without change indicator when not provided', () => {
      render(<StatCard title="Simple" value={100} />)
      
      expect(screen.queryByText('%')).not.toBeInTheDocument()
      expect(screen.queryByText('from')).not.toBeInTheDocument()
    })

    it('renders without description when not provided', () => {
      render(<StatCard title="Simple" value={100} />)
      
      expect(screen.getByText('Simple')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
      // No description should be in the DOM
      const content = screen.getByTestId('card-content')
      expect(content.querySelectorAll('p')).toHaveLength(0)
    })
  })
})

describe('StatCardGrid Component', () => {
  describe('Grid Layout', () => {
    it('renders children correctly', () => {
      render(
        <StatCardGrid>
          <div data-testid="child-1">Card 1</div>
          <div data-testid="child-2">Card 2</div>
        </StatCardGrid>
      )
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('applies default 4-column grid classes', () => {
      render(<StatCardGrid data-testid="grid">Content</StatCardGrid>)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass(
        'grid', 
        'gap-4',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-4'
      )
    })

    it('applies 1-column grid classes', () => {
      render(<StatCardGrid columns={1} data-testid="grid">Content</StatCardGrid>)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).not.toHaveClass('md:grid-cols-2')
    })

    it('applies 2-column grid classes', () => {
      render(<StatCardGrid columns={2} data-testid="grid">Content</StatCardGrid>)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2')
      expect(grid).not.toHaveClass('lg:grid-cols-3')
    })

    it('applies 3-column grid classes', () => {
      render(<StatCardGrid columns={3} data-testid="grid">Content</StatCardGrid>)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass(
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3'
      )
    })

    it('applies custom className along with base classes', () => {
      render(<StatCardGrid className="custom-grid" data-testid="grid">Content</StatCardGrid>)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('custom-grid', 'grid', 'gap-4')
    })
  })

  describe('Responsive Behavior', () => {
    it('has base mobile-first approach', () => {
      render(<StatCardGrid data-testid="grid">Content</StatCardGrid>)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('grid-cols-1') // Mobile first
    })
  })
})

describe('ProgressStatCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders title, current, and target values', () => {
      render(<ProgressStatCard title="Sales Goal" current={75} target={100} />)
      
      expect(screen.getByText('Sales Goal')).toBeInTheDocument()
      expect(screen.getByText('75')).toBeInTheDocument()
      expect(screen.getByText('of 100')).toBeInTheDocument()
    })

    it('renders with unit suffix', () => {
      render(<ProgressStatCard title="Distance" current={25} target={50} unit="km" />)
      
      expect(screen.getByText('25km')).toBeInTheDocument()
      expect(screen.getByText('of 50km')).toBeInTheDocument()
    })

    it('renders icon when provided', () => {
      render(<ProgressStatCard title="Progress" current={10} target={20} icon={MockIcon} />)
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(
        <ProgressStatCard 
          title="Tasks" 
          current={8} 
          target={10} 
          description="Tasks completed this week"
        />
      )
      
      expect(screen.getByText('Tasks completed this week')).toBeInTheDocument()
    })
  })

  describe('Percentage Calculation', () => {
    it('calculates correct percentage', () => {
      render(<ProgressStatCard title="Progress" current={25} target={100} />)
      
      expect(screen.getByText('25%')).toBeInTheDocument()
    })

    it('rounds percentage to whole number', () => {
      render(<ProgressStatCard title="Progress" current={33} target={100} />)
      
      expect(screen.getByText('33%')).toBeInTheDocument()
    })

    it('handles percentage over 100%', () => {
      render(<ProgressStatCard title="Over Goal" current={120} target={100} />)
      
      expect(screen.getByText('120%')).toBeInTheDocument()
    })

    it('handles zero target gracefully', () => {
      render(<ProgressStatCard title="No Target" current={50} target={0} />)
      
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('handles zero current value', () => {
      render(<ProgressStatCard title="Not Started" current={0} target={100} />)
      
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('calculates decimal percentages correctly', () => {
      render(<ProgressStatCard title="Precise" current={1} target={3} />)
      
      expect(screen.getByText('33%')).toBeInTheDocument() // 33.333... rounded to 33
    })
  })

  describe('Progress Bar', () => {
    it('sets correct width for progress bar', () => {
      render(<ProgressStatCard title="Half Done" current={50} target={100} />)
      
      const progressBar = document.querySelector('.h-full.bg-primary')
      expect(progressBar).toHaveStyle('width: 50%')
    })

    it('caps progress bar width at 100%', () => {
      render(<ProgressStatCard title="Over Goal" current={150} target={100} />)
      
      const progressBar = document.querySelector('.h-full.bg-primary')
      expect(progressBar).toHaveStyle('width: 100%')
    })

    it('handles zero progress', () => {
      render(<ProgressStatCard title="Not Started" current={0} target={100} />)
      
      const progressBar = document.querySelector('.h-full.bg-primary')
      expect(progressBar).toHaveStyle('width: 0%')
    })

    it('has proper progress bar styling', () => {
      render(<ProgressStatCard title="Test" current={25} target={100} />)
      
      const progressBar = document.querySelector('.h-full.bg-primary')
      expect(progressBar).toHaveClass('h-full', 'bg-primary', 'transition-all', 'duration-300', 'ease-out')
      
      const progressContainer = progressBar?.parentElement
      expect(progressContainer).toHaveClass('h-2', 'bg-secondary', 'rounded-full', 'overflow-hidden')
    })
  })

  describe('Number Formatting', () => {
    it('formats large numbers with locale string', () => {
      render(<ProgressStatCard title="Big Numbers" current={1250} target={5000} />)
      
      expect(screen.getByText('1,250')).toBeInTheDocument()
      expect(screen.getByText('of 5,000')).toBeInTheDocument()
    })

    it('handles decimal numbers', () => {
      render(<ProgressStatCard title="Decimals" current={12.5} target={50.0} />)
      
      expect(screen.getByText('12.5')).toBeInTheDocument()
      expect(screen.getByText('of 50')).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('applies custom className', () => {
      render(<ProgressStatCard title="Test" current={10} target={20} className="custom-progress" />)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-progress')
    })

    it('has proper header structure', () => {
      render(<ProgressStatCard title="Test" current={10} target={20} icon={MockIcon} />)
      
      expect(screen.getByText('Test')).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground')
      
      const icon = screen.getByTestId('mock-icon')
      expect(icon).toHaveClass('size-4', 'text-muted-foreground')
    })

    it('has proper content structure with progress elements', () => {
      render(<ProgressStatCard title="Test" current={25} target={100} />)
      
      expect(screen.getByText('25')).toHaveClass('text-2xl', 'font-bold')
      expect(screen.getByText('of 100')).toHaveClass('text-sm', 'text-muted-foreground')
      expect(screen.getByText('Progress')).toHaveClass('text-muted-foreground')
      expect(screen.getByText('25%')).toHaveClass('font-medium')
    })
  })

  describe('Edge Cases', () => {
    it('renders without icon when not provided', () => {
      render(<ProgressStatCard title="No Icon" current={10} target={20} />)
      
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument()
    })

    it('renders without description when not provided', () => {
      render(<ProgressStatCard title="Simple Progress" current={10} target={20} />)
      
      const content = screen.getByTestId('card-content')
      expect(content.textContent).not.toContain('description')
    })

    it('handles negative current values', () => {
      render(<ProgressStatCard title="Negative" current={-10} target={100} />)
      
      expect(screen.getByText('-10')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument() // Negative progress shows as 0%
    })
  })
})