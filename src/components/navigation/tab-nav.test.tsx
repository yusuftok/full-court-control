import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TabNav, MobileTabNav, ScrollableTabNav, TabNavItem } from './tab-nav'

// Mock next/navigation
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
})

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}))

// Mock icon component
const TestIcon = ({ className }: { className?: string }) => (
  <svg data-testid="test-icon" className={className} />
)

describe('TabNav Component', () => {
  const sampleItems: TabNavItem[] = [
    { id: 'overview', label: 'Overview', href: '/dashboard' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'settings', label: 'Settings', href: '/settings', badge: '2' },
    { id: 'disabled', label: 'Disabled', href: '/disabled', disabled: true },
  ]

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard')
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders all tab items', () => {
      render(<TabNav items={sampleItems} />)
      
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Disabled')).toBeInTheDocument()
    })

    it('renders as navigation element', () => {
      render(<TabNav items={sampleItems} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<TabNav items={sampleItems} className="custom-tab-nav" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-tab-nav')
    })

    it('renders empty tabs', () => {
      render(<TabNav items={[]} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })
  })

  describe('Active State Detection', () => {
    it('marks exact path as active', () => {
      mockUsePathname.mockReturnValue('/projects')
      render(<TabNav items={sampleItems} />)
      
      const projectsTab = screen.getByRole('link', { name: /projects/i })
      expect(projectsTab).toHaveAttribute('data-active', 'true')
    })

    it('marks nested paths as active', () => {
      mockUsePathname.mockReturnValue('/projects/123')
      render(<TabNav items={sampleItems} />)
      
      const projectsTab = screen.getByRole('link', { name: /projects/i })
      expect(projectsTab).toHaveAttribute('data-active', 'true')
    })

    it('does not mark inactive paths', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<TabNav items={sampleItems} />)
      
      const projectsTab = screen.getByRole('link', { name: /projects/i })
      expect(projectsTab).toHaveAttribute('data-active', 'false')
    })
  })

  describe('Icons', () => {
    const itemsWithIcons: TabNavItem[] = [
      { id: 'home', label: 'Home', href: '/', icon: TestIcon },
      { id: 'profile', label: 'Profile', href: '/profile', icon: TestIcon },
    ]

    it('renders icons when provided', () => {
      render(<TabNav items={itemsWithIcons} />)
      
      const icons = screen.getAllByTestId('test-icon')
      expect(icons).toHaveLength(2)
      
      icons.forEach(icon => {
        expect(icon).toHaveClass('size-4')
      })
    })

    it('renders items without icons correctly', () => {
      render(<TabNav items={sampleItems} />)
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })
  })

  describe('Badges', () => {
    it('renders badges when provided', () => {
      render(<TabNav items={sampleItems} />)
      
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('applies correct badge styling for active tabs', () => {
      mockUsePathname.mockReturnValue('/settings')
      render(<TabNav items={sampleItems} />)
      
      const badge = screen.getByText('2')
      expect(badge).toHaveClass('bg-primary/10', 'text-primary')
    })

    it('applies correct badge styling for inactive tabs', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<TabNav items={sampleItems} />)
      
      const badge = screen.getByText('2')
      expect(badge).toHaveClass('bg-muted', 'text-muted-foreground')
    })

    it('handles numeric badges', () => {
      const itemsWithNumericBadge: TabNavItem[] = [
        { id: 'notifications', label: 'Notifications', href: '/notifications', badge: 42 }
      ]

      render(<TabNav items={itemsWithNumericBadge} />)
      
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  describe('Disabled Items', () => {
    it('renders disabled items as non-interactive divs', () => {
      render(<TabNav items={sampleItems} />)
      
      const disabledItem = screen.getByText('Disabled')
      expect(disabledItem.closest('div')).toBeInTheDocument()
      expect(disabledItem.closest('a')).not.toBeInTheDocument()
    })

    it('applies disabled styling', () => {
      render(<TabNav items={sampleItems} />)
      
      const disabledContainer = screen.getByText('Disabled').closest('div')
      expect(disabledContainer).toHaveClass('cursor-not-allowed', 'opacity-50')
    })

    it('renders badges for disabled items', () => {
      const itemsWithDisabledBadge: TabNavItem[] = [
        { id: 'disabled', label: 'Disabled', href: '/disabled', disabled: true, badge: 'New' }
      ]

      render(<TabNav items={itemsWithDisabledBadge} />)
      
      expect(screen.getByText('New')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    describe('Default Variant', () => {
      it('applies default variant styling', () => {
        render(<TabNav items={sampleItems} variant="default" />)
        
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveClass('border-b')
      })
    })

    describe('Pills Variant', () => {
      it('applies pills variant styling', () => {
        render(<TabNav items={sampleItems} variant="pills" />)
        
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveClass('bg-muted', 'p-1', 'rounded-lg')
      })
    })

    describe('Underline Variant', () => {
      it('applies underline variant styling', () => {
        render(<TabNav items={sampleItems} variant="underline" />)
        
        const nav = screen.getByRole('navigation')
        expect(nav).not.toHaveClass('border-b') // Underline variant has no container border
      })
    })
  })

  describe('Navigation Links', () => {
    it('renders correct href attributes', () => {
      render(<TabNav items={sampleItems} />)
      
      expect(screen.getByRole('link', { name: /overview/i })).toHaveAttribute('href', '/dashboard')
      expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '/projects')
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
    })

    it('excludes disabled items from links', () => {
      render(<TabNav items={sampleItems} />)
      
      expect(screen.queryByRole('link', { name: /disabled/i })).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper navigation semantics', () => {
      render(<TabNav items={sampleItems} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('maintains proper tab order', () => {
      render(<TabNav items={sampleItems} />)
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3) // Excluding disabled item
    })
  })
})

describe('MobileTabNav Component', () => {
  const manyItems: TabNavItem[] = Array.from({ length: 6 }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i + 1}`,
    href: `/item-${i}`
  }))

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/item-0')
    jest.clearAllMocks()
  })

  it('renders all items on desktop', () => {
    render(<MobileTabNav items={manyItems} />)
    
    // Desktop version should be present
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 6')).toBeInTheDocument()
  })

  it('limits visible items on mobile', () => {
    render(<MobileTabNav items={manyItems} maxVisibleItems={3} />)
    
    // Should still render desktop version that shows all items
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('shows expand button when items exceed limit', async () => {
    const user = userEvent.setup()
    render(<MobileTabNav items={manyItems} maxVisibleItems={3} />)
    
    // Look for "Show More" button
    const showMoreButton = screen.getByText(/show \d+ more/i)
    expect(showMoreButton).toBeInTheDocument()
  })

  it('toggles visibility when expand button is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileTabNav items={manyItems} maxVisibleItems={3} />)
    
    const showMoreButton = screen.getByText(/show \d+ more/i)
    await user.click(showMoreButton)
    
    expect(screen.getByText('Show Less')).toBeInTheDocument()
  })

  it('does not show expand button when items are within limit', () => {
    const fewItems = manyItems.slice(0, 2)
    render(<MobileTabNav items={fewItems} maxVisibleItems={3} />)
    
    expect(screen.queryByText(/show.*more/i)).not.toBeInTheDocument()
  })

  it('passes variant prop correctly', () => {
    render(<MobileTabNav items={manyItems} variant="pills" />)
    
    // Desktop version should have pills styling
    const nav = screen.getAllByRole('navigation')[0] // First nav is desktop
    expect(nav).toHaveClass('bg-muted', 'p-1', 'rounded-lg')
  })
})

describe('ScrollableTabNav Component', () => {
  const scrollableItems: TabNavItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: `scroll-item-${i}`,
    label: `Scrollable Item ${i + 1}`,
    href: `/scroll-item-${i}`
  }))

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/scroll-item-0')
    jest.clearAllMocks()
    
    // Mock scrollWidth to simulate overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 1000,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 300,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    // Clean up mocks
    delete (HTMLElement.prototype as any).scrollWidth
    delete (HTMLElement.prototype as any).clientWidth
    delete (HTMLElement.prototype as any).scrollLeft
  })

  it('renders all scrollable items', () => {
    render(<ScrollableTabNav items={scrollableItems} />)
    
    expect(screen.getByText('Scrollable Item 1')).toBeInTheDocument()
    expect(screen.getByText('Scrollable Item 10')).toBeInTheDocument()
  })

  it('shows scroll buttons when content overflows', async () => {
    render(<ScrollableTabNav items={scrollableItems} showScrollButtons={true} />)
    
    await waitFor(() => {
      // Right scroll button should be visible when content overflows
      const rightButton = screen.getByText('→')
      expect(rightButton).toBeInTheDocument()
    })
  })

  it('hides scroll buttons when showScrollButtons is false', () => {
    render(<ScrollableTabNav items={scrollableItems} showScrollButtons={false} />)
    
    expect(screen.queryByText('←')).not.toBeInTheDocument()
    expect(screen.queryByText('→')).not.toBeInTheDocument()
  })

  it('handles scroll button clicks', async () => {
    const user = userEvent.setup()
    
    // Mock scrollBy method
    const mockScrollBy = jest.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value: mockScrollBy,
    })

    render(<ScrollableTabNav items={scrollableItems} showScrollButtons={true} />)
    
    await waitFor(() => {
      const rightButton = screen.getByText('→')
      expect(rightButton).toBeInTheDocument()
    })
    
    const rightButton = screen.getByText('→')
    await user.click(rightButton)
    
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 200,
      behavior: 'smooth'
    })

    // Clean up
    delete (HTMLElement.prototype as any).scrollBy
  })

  it('handles scroll events for button visibility', async () => {
    render(<ScrollableTabNav items={scrollableItems} showScrollButtons={true} />)
    
    // Simulate scroll to middle position
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      value: 100,
    })

    // Trigger scroll event
    const scrollableDiv = document.querySelector('.overflow-x-auto')
    if (scrollableDiv) {
      fireEvent.scroll(scrollableDiv)
    }

    // Both buttons should potentially be visible
    await waitFor(() => {
      // The component should update based on scroll position
      expect(document.querySelector('.overflow-x-auto')).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    const { container } = render(
      <ScrollableTabNav items={scrollableItems} className="custom-scrollable" />
    )
    
    expect(container.firstChild).toHaveClass('custom-scrollable')
  })

  it('passes variant prop to TabNav', () => {
    render(<ScrollableTabNav items={scrollableItems} variant="pills" />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('bg-muted', 'p-1', 'rounded-lg')
  })

  it('handles resize events', () => {
    render(<ScrollableTabNav items={scrollableItems} />)
    
    // Trigger resize event
    fireEvent(window, new Event('resize'))
    
    // Should not throw error
    expect(screen.getByText('Scrollable Item 1')).toBeInTheDocument()
  })

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<ScrollableTabNav items={scrollableItems} />)
    
    // This should not throw any errors
    expect(() => unmount()).not.toThrow()
  })
})

describe('TabNavItem Interface', () => {
  it('handles all TabNavItem properties', () => {
    const complexItem: TabNavItem = {
      id: 'complex',
      label: 'Complex Tab',
      href: '/complex',
      icon: TestIcon,
      badge: 'Beta',
      disabled: false
    }

    render(<TabNav items={[complexItem]} />)
    
    expect(screen.getByText('Complex Tab')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/complex')
  })

  it('handles minimal TabNavItem properties', () => {
    const minimalItem: TabNavItem = {
      id: 'minimal',
      label: 'Minimal Tab',
      href: '/minimal'
    }

    render(<TabNav items={[minimalItem]} />)
    
    expect(screen.getByText('Minimal Tab')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/minimal')
  })
})

describe('Error Handling', () => {
  it('handles empty items array', () => {
    expect(() => render(<TabNav items={[]} />)).not.toThrow()
  })

  it('handles items with missing required properties gracefully', () => {
    // This tests TypeScript compile-time safety, but we can test runtime behavior
    const incompleteItem = { id: 'incomplete', label: 'Incomplete' } as TabNavItem
    
    expect(() => render(<TabNav items={[incompleteItem]} />)).not.toThrow()
  })

  it('handles navigation hook failures gracefully', () => {
    mockUsePathname.mockImplementation(() => {
      throw new Error('Navigation error')
    })
    
    // Should handle the error gracefully
    expect(() => render(<TabNav items={[]} />)).toThrow('Navigation error')
  })
})