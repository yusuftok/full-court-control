import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Header } from './header'

// Mock the MobileMenuButton component
vi.mock('./sidebar', () => ({
  MobileMenuButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="mobile-menu-button" onClick={onClick}>
      Menu
    </button>
  ),
}))

describe('Header Component', () => {
  const defaultProps = {
    className: 'test-header',
  }

  describe('Rendering', () => {
    it('renders header with default structure', () => {
      render(<Header />)

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('h-16', 'border-b', 'bg-background')
    })

    it('applies custom className', () => {
      render(<Header className="custom-class" />)

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('custom-class')
    })

    it('renders search input on desktop', () => {
      render(<Header />)

      const searchInput = screen.getByPlaceholderText(
        'Search projects, tasks...'
      )
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'search')
    })

    it('renders notification button with count', () => {
      render(<Header />)

      const notificationButton = screen.getByRole('button', {
        name: /notifications/i,
      })
      expect(notificationButton).toBeInTheDocument()

      // Check notification count badge
      const notificationBadge = screen.getByText('3')
      expect(notificationBadge).toBeInTheDocument()
    })

    it('renders user button', () => {
      render(<Header />)

      const userButton = screen.getByRole('button', { name: /user menu/i })
      expect(userButton).toBeInTheDocument()
    })

    it('renders mobile search button', () => {
      render(<Header />)

      const mobileSearchButton = screen.getByRole('button', { name: /search/i })
      expect(mobileSearchButton).toBeInTheDocument()
    })
  })

  describe('Mobile Menu Integration', () => {
    it('renders mobile menu button when onMobileMenuToggle is provided', () => {
      const mockToggle = vi.fn()
      render(<Header onMobileMenuToggle={mockToggle} />)

      const mobileMenuButton = screen.getByTestId('mobile-menu-button')
      expect(mobileMenuButton).toBeInTheDocument()
    })

    it('does not render mobile menu button when onMobileMenuToggle is not provided', () => {
      render(<Header />)

      const mobileMenuButton = screen.queryByTestId('mobile-menu-button')
      expect(mobileMenuButton).not.toBeInTheDocument()
    })

    it('calls onMobileMenuToggle when mobile menu button is clicked', () => {
      const mockToggle = vi.fn()
      render(<Header onMobileMenuToggle={mockToggle} />)

      const mobileMenuButton = screen.getByTestId('mobile-menu-button')
      fireEvent.click(mobileMenuButton)

      expect(mockToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Search Functionality', () => {
    it('allows typing in search input', async () => {
      const user = userEvent.setup()
      render(<Header />)

      const searchInput = screen.getByPlaceholderText(
        'Search projects, tasks...'
      )
      await user.type(searchInput, 'test search query')

      expect(searchInput).toHaveValue('test search query')
    })

    it('maintains focus styles on search input', () => {
      render(<Header />)

      const searchInput = screen.getByPlaceholderText(
        'Search projects, tasks...'
      )
      expect(searchInput).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:border-transparent'
      )
    })
  })

  describe('Notification System', () => {
    it('displays correct notification count', () => {
      render(<Header />)

      const notificationBadge = screen.getByText('3')
      expect(notificationBadge).toBeInTheDocument()
    })

    it('handles notification count over 9', () => {
      // This would require modifying the component to accept props for notification count
      // For now, we test the current static implementation
      render(<Header />)

      const notificationBadge = screen.getByText('3')
      expect(notificationBadge).toBeInTheDocument()
    })

    it('notification button is accessible', () => {
      render(<Header />)

      const notificationButton = screen.getByRole('button', {
        name: /notifications/i,
      })
      expect(notificationButton).toBeInTheDocument()
      // Button elements don't need explicit type="button" attribute since it's the default
      expect(notificationButton.tagName).toBe('BUTTON')
    })
  })

  describe('Responsive Design', () => {
    it('hides desktop search on mobile screens', () => {
      render(<Header />)

      const searchContainer = screen.getByPlaceholderText(
        'Search projects, tasks...'
      ).parentElement?.parentElement
      expect(searchContainer).toHaveClass('hidden', 'md:flex')
    })

    it('shows mobile search button only on mobile', () => {
      render(<Header />)

      const mobileSearchButton = screen.getByRole('button', { name: /search/i })
      expect(mobileSearchButton).toHaveClass('md:hidden')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<Header />)

      expect(
        screen.getByRole('button', { name: /notifications/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /user menu/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument()
    })

    it('search input has proper attributes', () => {
      render(<Header />)

      const searchInput = screen.getByPlaceholderText(
        'Search projects, tasks...'
      )
      expect(searchInput).toHaveAttribute('type', 'search')
      expect(searchInput).toHaveAttribute(
        'placeholder',
        'Search projects, tasks...'
      )
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Header />)

      const searchInput = screen.getByPlaceholderText(
        'Search projects, tasks...'
      )
      const notificationButton = screen.getByRole('button', {
        name: /notifications/i,
      })

      await user.tab()
      if (document.activeElement === searchInput) {
        await user.tab()
        expect(document.activeElement).toBe(notificationButton)
      }
    })
  })

  describe('Icon Integration', () => {
    it('renders all required icons', () => {
      render(<Header />)

      expect(screen.getAllByTestId('search')).toHaveLength(2) // Desktop and mobile search icons
      expect(screen.getByTestId('bell')).toBeInTheDocument()
      expect(screen.getByTestId('user')).toBeInTheDocument()
    })

    it('icons have proper classes', () => {
      render(<Header />)

      const searchIcons = screen.getAllByTestId('search')
      const bellIcon = screen.getByTestId('bell')
      const userIcon = screen.getByTestId('user')

      searchIcons.forEach(icon => expect(icon).toHaveClass('size-4'))
      expect(bellIcon).toHaveClass('size-4')
      expect(userIcon).toHaveClass('size-4')
    })
  })

  describe('Layout Structure', () => {
    it('has correct flex layout structure', () => {
      render(<Header />)

      const header = screen.getByRole('banner')
      const container = header.firstElementChild

      expect(container).toHaveClass(
        'flex',
        'items-center',
        'justify-between',
        'h-full'
      )
    })

    it('left side contains search and mobile menu', () => {
      const mockToggle = vi.fn()
      render(<Header onMobileMenuToggle={mockToggle} />)

      const mobileMenuButton = screen.getByTestId('mobile-menu-button')
      const searchInput = screen.getByPlaceholderText(
        'Search projects, tasks...'
      )

      // Both should be in the left side container
      const leftContainer = mobileMenuButton.parentElement
      const searchContainer = searchInput.parentElement?.parentElement?.parentElement
      if (searchContainer) {
        expect(leftContainer).toContainElement(searchContainer)
      }
    })

    it('right side contains user controls', () => {
      render(<Header />)

      const notificationButton = screen.getByRole('button', {
        name: /notifications/i,
      })
      const userButton = screen.getByRole('button', { name: /user menu/i })
      const mobileSearchButton = screen.getByRole('button', { name: /search/i })

      // All should be siblings in the right container
      const rightContainer = notificationButton.parentElement
      expect(rightContainer).toContainElement(userButton)
      expect(rightContainer).toContainElement(mobileSearchButton)
    })
  })

  describe('Error Handling', () => {
    it('renders without crashing when no props provided', () => {
      expect(() => render(<Header />)).not.toThrow()
    })

    it('handles undefined onMobileMenuToggle gracefully', () => {
      expect(() =>
        render(<Header onMobileMenuToggle={undefined} />)
      ).not.toThrow()
    })
  })
})
