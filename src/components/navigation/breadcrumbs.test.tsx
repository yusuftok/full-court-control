import { render, screen } from '@testing-library/react'
import { Breadcrumbs, generateBreadcrumbs, ResponsiveBreadcrumbs, BreadcrumbItem } from './breadcrumbs'

// Mock components
jest.mock('next/link', () => {
  return ({ children, href, className, ...rest }: any) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  )
})

// Mock icon for testing
const TestIcon = ({ className }: { className?: string }) => (
  <svg data-testid="test-icon" className={className} />
)

const HomeIcon = ({ className }: { className?: string }) => (
  <svg data-testid="home-icon" className={className} />
)

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ChevronRight: ({ className }: any) => <svg data-testid="chevron-right" className={className} />,
  Home: ({ className }: any) => <svg data-testid="home-icon" className={className} />,
}))

describe('Breadcrumbs Component', () => {
  const sampleItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Project Details' } // Last item without href
  ]

  describe('Basic Rendering', () => {
    it('renders all breadcrumb items', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('Project Details')).toBeInTheDocument()
    })

    it('renders proper semantic structure', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
      expect(nav).toBeInTheDocument()
      
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(4) // 3 original + 1 auto-added Dashboard
    })

    it('applies custom className', () => {
      render(<Breadcrumbs items={sampleItems} className="custom-breadcrumb" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-breadcrumb')
    })

    it('renders empty breadcrumbs', () => {
      render(<Breadcrumbs items={[]} homeIcon={false} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      const listItems = screen.queryAllByRole('listitem')
      expect(listItems).toHaveLength(0)
    })
  })

  describe('Link Behavior', () => {
    it('renders links for items with href', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')
      
      const projectsLink = screen.getByRole('link', { name: /projects/i })
      expect(projectsLink).toHaveAttribute('href', '/projects')
    })

    it('renders span for last item or items without href', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      // Last item should be a span, not a link
      const lastItem = screen.getByText('Project Details')
      expect(lastItem.tagName).toBe('SPAN')
      expect(lastItem).not.toHaveAttribute('href')
    })

    it('handles items without href as non-clickable', () => {
      const itemsWithoutHref: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Projects' }, // No href
        { label: 'Details' }
      ]

      render(<Breadcrumbs items={itemsWithoutHref} />)
      
      const projectsItem = screen.getByText('Projects')
      expect(projectsItem.tagName).toBe('SPAN')
    })
  })

  describe('Icons', () => {
    it('renders icons when provided', () => {
      const itemsWithIcons: BreadcrumbItem[] = [
        { label: 'Home', href: '/', icon: TestIcon },
        { label: 'Projects', href: '/projects', icon: TestIcon },
      ]

      render(<Breadcrumbs items={itemsWithIcons} />)
      
      const icons = screen.getAllByTestId('test-icon')
      expect(icons).toHaveLength(2)
      
      icons.forEach(icon => {
        expect(icon).toHaveClass('size-4', 'shrink-0')
      })
    })

    it('renders items without icons correctly', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })
  })

  describe('Separators', () => {
    it('renders default chevron separators between items', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      const separators = screen.getAllByTestId('chevron-right')
      expect(separators).toHaveLength(3) // Between 4 items (including Dashboard) = 3 separators
    })

    it('does not render separator before first item', () => {
      render(<Breadcrumbs items={[{ label: 'Single Item' }]} homeIcon={false} />)
      
      expect(screen.queryByTestId('chevron-right')).not.toBeInTheDocument()
    })

    it('uses custom separator when provided', () => {
      const customSeparator = <span data-testid="custom-separator">|</span>
      
      render(<Breadcrumbs items={sampleItems} separator={customSeparator} />)
      
      const customSeparators = screen.getAllByTestId('custom-separator')
      expect(customSeparators).toHaveLength(3) // 3 separators for 4 items
      
      expect(screen.queryByTestId('chevron-right')).not.toBeInTheDocument()
    })
  })

  describe('Home Icon Feature', () => {
    it('adds home item when homeIcon is true and not present', () => {
      const itemsWithoutHome: BreadcrumbItem[] = [
        { label: 'Projects', href: '/projects' },
        { label: 'Details' }
      ]

      render(<Breadcrumbs items={itemsWithoutHome} homeIcon={true} />)
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
      
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })

    it('does not add home item when homeIcon is false', () => {
      const itemsWithoutHome: BreadcrumbItem[] = [
        { label: 'Projects', href: '/projects' }
      ]

      render(<Breadcrumbs items={itemsWithoutHome} homeIcon={false} />)
      
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument()
    })

    it('does not add duplicate home item when Dashboard already present', () => {
      const itemsWithDashboard: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Projects' }
      ]

      render(<Breadcrumbs items={itemsWithDashboard} homeIcon={true} />)
      
      const dashboardItems = screen.getAllByText('Dashboard')
      expect(dashboardItems).toHaveLength(1)
    })
  })

  describe('Styling and Accessibility', () => {
    it('applies correct styling to active/last item', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      const lastItem = screen.getByText('Project Details')
      const lastItemContainer = lastItem.parentElement
      expect(lastItemContainer).toHaveClass('text-foreground', 'font-medium')
    })

    it('applies correct styling to non-active items', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveClass('text-muted-foreground', 'hover:text-foreground')
    })

    it('has proper focus styles', () => {
      render(<Breadcrumbs items={sampleItems} />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring')
      })
    })

    it('separators are marked as aria-hidden', () => {
      const { container } = render(<Breadcrumbs items={sampleItems} />)
      
      const separators = container.querySelectorAll('[aria-hidden="true"]')
      expect(separators).toHaveLength(3) // 3 separators for 4 items
    })

    it('truncates long labels', () => {
      const longLabel = 'This is a very long breadcrumb label that should be truncated'
      const itemsWithLongLabel: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: longLabel }
      ]

      render(<Breadcrumbs items={itemsWithLongLabel} />)
      
      const labelElement = screen.getByText(longLabel)
      expect(labelElement).toHaveClass('truncate')
    })
  })
})

describe('generateBreadcrumbs Function', () => {
  it('generates breadcrumbs from simple pathname', () => {
    const result = generateBreadcrumbs({ pathname: '/projects/123' })
    
    expect(result).toEqual([
      { label: 'Projects', href: '/projects' },
      { label: '123', href: undefined }
    ])
  })

  it('handles custom labels', () => {
    const customLabels = { 'projects': 'My Projects', '123': 'Project Alpha' }
    const result = generateBreadcrumbs({
      pathname: '/projects/123',
      customLabels
    })
    
    expect(result).toEqual([
      { label: 'My Projects', href: '/projects' },
      { label: 'Project Alpha', href: undefined }
    ])
  })

  it('handles dynamic segments with params', () => {
    const result = generateBreadcrumbs({
      pathname: '/projects/[id]',
      params: { id: 'project-alpha' }
    })
    
    expect(result).toEqual([
      { label: 'Projects', href: '/projects' },
      { label: 'Project alpha', href: undefined } // The function capitalizes and formats the label
    ])
  })

  it('formats labels by replacing dashes and capitalizing', () => {
    const result = generateBreadcrumbs({ pathname: '/user-settings/account-details' })
    
    expect(result).toEqual([
      { label: 'User settings', href: '/user-settings' },
      { label: 'Account details', href: undefined }
    ])
  })

  it('handles root path', () => {
    const result = generateBreadcrumbs({ pathname: '/' })
    
    expect(result).toEqual([])
  })

  it('handles empty pathname', () => {
    const result = generateBreadcrumbs({ pathname: '' })
    
    expect(result).toEqual([])
  })

  it('builds correct href paths for intermediate items', () => {
    const result = generateBreadcrumbs({ pathname: '/projects/123/settings' })
    
    expect(result).toEqual([
      { label: 'Projects', href: '/projects' },
      { label: '123', href: '/projects/123' },
      { label: 'Settings', href: undefined }
    ])
  })
})

describe('ResponsiveBreadcrumbs Component', () => {
  it('renders all items when count is within limit', () => {
    const shortItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' }
    ]

    render(<ResponsiveBreadcrumbs items={shortItems} maxItems={3} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.queryByText('...')).not.toBeInTheDocument()
  })

  it('collapses items when count exceeds limit', () => {
    const longItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Project 1', href: '/projects/1' },
      { label: 'Settings', href: '/projects/1/settings' },
      { label: 'Details' }
    ]

    render(<ResponsiveBreadcrumbs items={longItems} maxItems={3} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument() // First item
    expect(screen.getByText('...')).toBeInTheDocument() // Ellipsis
    expect(screen.getByText('Settings')).toBeInTheDocument() // Last items
    expect(screen.getByText('Details')).toBeInTheDocument()
    
    // Middle items should be hidden
    expect(screen.queryByText('Projects')).not.toBeInTheDocument()
    expect(screen.queryByText('Project 1')).not.toBeInTheDocument()
  })

  it('shows correct number of last items', () => {
    const longItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'A', href: '/a' },
      { label: 'B', href: '/a/b' },
      { label: 'C', href: '/a/b/c' },
      { label: 'D' }
    ]

    render(<ResponsiveBreadcrumbs items={longItems} maxItems={3} />)
    
    // Should show: Home, ..., C, D
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('...')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    
    expect(screen.queryByText('A')).not.toBeInTheDocument()
    expect(screen.queryByText('B')).not.toBeInTheDocument()
  })

  it('passes through other props correctly', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Current' }
    ]

    render(
      <ResponsiveBreadcrumbs 
        items={items} 
        maxItems={3}
        className="custom-responsive"
        homeIcon={false}
      />
    )
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('custom-responsive')
    expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument()
  })

  it('handles edge case with exactly maxItems count', () => {
    const exactItems: BreadcrumbItem[] = [
      { label: 'A', href: '/a' },
      { label: 'B', href: '/a/b' },
      { label: 'C' }
    ]

    render(<ResponsiveBreadcrumbs items={exactItems} maxItems={3} />)
    
    // Should not collapse when exactly at limit
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.queryByText('...')).not.toBeInTheDocument()
  })
})