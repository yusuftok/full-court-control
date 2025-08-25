import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar, MobileMenuButton } from './sidebar'

// Mock usePathname to control active states
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: () => mockUsePathname(),
}))

describe('Sidebar Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard')
  })

  describe('Desktop Sidebar', () => {
    it('renders desktop sidebar with all navigation items', () => {
      render(<Sidebar />)

      // Check brand section
      expect(screen.getByText('Full Court Control')).toBeInTheDocument()
      expect(screen.getByText('Pro')).toBeInTheDocument()

      // Check all navigation items
      const expectedItems = [
        'Dashboard',
        'Projects',
        'Division Templates',
        'Tasks',
        'Subcontractors',
        'Analytics',
        'Reports',
        'Settings',
      ]

      expectedItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })

      // Check footer
      expect(
        screen.getByText('© 2024 Full Court Control Pro')
      ).toBeInTheDocument()
    })

    it('applies correct active state styling', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('applies inactive state styling for non-active items', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar />)

      const projectsLink = screen.getByRole('link', { name: /projects/i })
      expect(projectsLink).toHaveClass('text-muted-foreground')
      expect(projectsLink).not.toHaveClass('bg-primary')
    })

    it('handles nested route active states', () => {
      mockUsePathname.mockReturnValue('/projects/123')
      render(<Sidebar />)

      const projectsLink = screen.getByRole('link', { name: /projects/i })
      expect(projectsLink).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders correct href attributes', () => {
      render(<Sidebar />)

      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
        'href',
        '/dashboard'
      )
      expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
        'href',
        '/projects'
      )
      expect(screen.getByRole('link', { name: /templates/i })).toHaveAttribute(
        'href',
        '/templates'
      )
    })
  })

  describe('Mobile Sidebar', () => {
    const mockOnClose = jest.fn()

    beforeEach(() => {
      mockOnClose.mockClear()
    })

    it('renders mobile sidebar when open', () => {
      render(<Sidebar isMobile={true} isOpen={true} onClose={mockOnClose} />)

      const mobileSidebar = screen
        .getByText('Full Court Control')
        .closest('div')
      expect(mobileSidebar).toHaveClass('translate-x-0')
    })

    it('hides mobile sidebar when closed', () => {
      render(<Sidebar isMobile={true} isOpen={false} onClose={mockOnClose} />)

      const mobileSidebar = screen
        .getByText('Full Court Control')
        .closest('div')?.parentElement
      expect(mobileSidebar).toHaveClass('-translate-x-full')
    })

    it('renders overlay when mobile sidebar is open', () => {
      render(<Sidebar isMobile={true} isOpen={true} onClose={mockOnClose} />)

      const overlay = document.querySelector(
        '.fixed.inset-0.z-40.bg-black\\/50'
      )
      expect(overlay).toBeInTheDocument()
    })

    it('does not render overlay when mobile sidebar is closed', () => {
      render(<Sidebar isMobile={true} isOpen={false} onClose={mockOnClose} />)

      const overlay = document.querySelector(
        '.fixed.inset-0.z-40.bg-black\\/50'
      )
      expect(overlay).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
      render(<Sidebar isMobile={true} isOpen={true} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when overlay is clicked', () => {
      render(<Sidebar isMobile={true} isOpen={true} onClose={mockOnClose} />)

      const overlay = document.querySelector(
        '.fixed.inset-0.z-40.bg-black\\/50'
      )
      fireEvent.click(overlay!)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when navigation link is clicked in mobile mode', () => {
      render(<Sidebar isMobile={true} isOpen={true} onClose={mockOnClose} />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      fireEvent.click(dashboardLink)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose for navigation links in desktop mode', () => {
      const mockOnClose = jest.fn()
      render(<Sidebar isMobile={false} onClose={mockOnClose} />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      fireEvent.click(dashboardLink)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Brand Section', () => {
    it('renders brand logo with correct styling', () => {
      render(<Sidebar />)

      const logoContainer = screen.getByTestId('building2').closest('div')
      expect(logoContainer).toHaveClass('size-8', 'bg-primary', 'rounded-lg')
    })

    it('renders brand text correctly', () => {
      render(<Sidebar />)

      expect(screen.getByText('Full Court Control')).toHaveClass(
        'font-semibold',
        'text-sm'
      )
      expect(screen.getByText('Pro')).toHaveClass(
        'text-xs',
        'text-muted-foreground'
      )
    })
  })

  describe('Navigation Items', () => {
    it('renders all navigation icons', () => {
      render(<Sidebar />)

      const expectedIcons = [
        'layoutdashboard',
        'building2',
        'foldertree',
        'listtodo',
        'users',
        'barchart3',
        'filetext',
        'settings',
      ]

      expectedIcons.forEach(icon => {
        expect(screen.getByTestId(icon)).toBeInTheDocument()
      })
    })

    it('applies hover states correctly', () => {
      render(<Sidebar />)

      const projectsLink = screen.getByRole('link', { name: /projects/i })
      expect(projectsLink).toHaveClass(
        'hover:bg-accent',
        'hover:text-accent-foreground'
      )
    })

    it('applies focus states correctly', () => {
      render(<Sidebar />)

      const projectsLink = screen.getByRole('link', { name: /projects/i })
      expect(projectsLink).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2'
      )
    })
  })

  describe('Responsive Behavior', () => {
    it('applies correct desktop classes', () => {
      render(<Sidebar />)

      const sidebar = screen
        .getByText('Full Court Control')
        .closest('div')?.parentElement
      expect(sidebar).toHaveClass('w-72', 'bg-background', 'border-r')
    })

    it('applies correct mobile classes when open', () => {
      render(<Sidebar isMobile={true} isOpen={true} onClose={jest.fn()} />)

      const sidebar = screen
        .getByText('Full Court Control')
        .closest('div')?.parentElement
      expect(sidebar).toHaveClass(
        'fixed',
        'inset-y-0',
        'left-0',
        'z-50',
        'w-72'
      )
    })

    it('applies transition classes for mobile', () => {
      render(<Sidebar isMobile={true} isOpen={false} onClose={jest.fn()} />)

      const sidebar = screen
        .getByText('Full Court Control')
        .closest('div')?.parentElement
      expect(sidebar).toHaveClass(
        'transition-transform',
        'duration-200',
        'ease-in-out'
      )
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className for desktop sidebar', () => {
      render(<Sidebar className="custom-class" />)

      const sidebar = screen
        .getByText('Full Court Control')
        .closest('div')?.parentElement
      expect(sidebar).toHaveClass('custom-class')
    })

    it('applies custom className for mobile sidebar', () => {
      render(
        <Sidebar
          isMobile={true}
          isOpen={true}
          onClose={jest.fn()}
          className="custom-mobile"
        />
      )

      const sidebar = screen
        .getByText('Full Court Control')
        .closest('div')?.parentElement
      expect(sidebar).toHaveClass('custom-mobile')
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<Sidebar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('navigation links have proper accessibility attributes', () => {
      render(<Sidebar />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Sidebar />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      const projectsLink = screen.getByRole('link', { name: /projects/i })

      await user.tab()
      if (document.activeElement === dashboardLink) {
        await user.tab()
        expect(document.activeElement).toBe(projectsLink)
      }
    })
  })
})

describe('MobileMenuButton Component', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders mobile menu button', () => {
    render(<MobileMenuButton onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<MobileMenuButton onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('applies mobile-only classes', () => {
    render(<MobileMenuButton onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toHaveClass('lg:hidden')
  })

  it('applies custom className', () => {
    render(
      <MobileMenuButton onClick={mockOnClick} className="custom-mobile-btn" />
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toHaveClass('custom-mobile-btn')
  })

  it('renders menu icon', () => {
    render(<MobileMenuButton onClick={mockOnClick} />)

    expect(screen.getByTestId('menu')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<MobileMenuButton onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toHaveAttribute('type', 'button')
  })
})
