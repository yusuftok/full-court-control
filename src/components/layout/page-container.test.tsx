/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import {
  PageContainer,
  PageHeader,
  PageContent,
  AppLayout,
} from './page-container'

describe('PageContainer Component', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <PageContainer>
          <div data-testid="test-content">Test Content</div>
        </PageContainer>
      )

      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })

    it('applies default max-width (full)', () => {
      render(<PageContainer data-testid="container">Test</PageContainer>)

      const container = screen.getByTestId('container')
      expect(container).toHaveClass('max-w-none')
    })

    it('applies custom max-width classes', () => {
      const maxWidthVariants = ['sm', 'md', 'lg', 'xl', '2xl'] as const

      maxWidthVariants.forEach(maxWidth => {
        const { rerender } = render(
          <PageContainer
            maxWidth={maxWidth}
            data-testid={`container-${maxWidth}`}
          >
            Test
          </PageContainer>
        )

        const container = screen.getByTestId(`container-${maxWidth}`)
        expect(container).toHaveClass(`max-w-${maxWidth}`)

        rerender(<div />) // Clean up for next iteration
      })
    })

    it('applies base layout classes', () => {
      render(<PageContainer data-testid="container">Test</PageContainer>)

      const container = screen.getByTestId('container')
      expect(container).toHaveClass(
        'flex-1',
        'flex',
        'flex-col',
        'mx-auto',
        'w-full'
      )
    })

    it('merges custom className with base classes', () => {
      render(
        <PageContainer className="custom-class" data-testid="container">
          Test
        </PageContainer>
      )

      const container = screen.getByTestId('container')
      expect(container).toHaveClass(
        'flex-1',
        'flex',
        'flex-col',
        'custom-class'
      )
    })

    it('forwards additional props', () => {
      render(
        <PageContainer data-testid="container" id="custom-id" role="main">
          Test
        </PageContainer>
      )

      const container = screen.getByTestId('container')
      expect(container).toHaveAttribute('id', 'custom-id')
      expect(container).toHaveAttribute('role', 'main')
    })
  })

  describe('Max Width Variants', () => {
    it('handles full max-width correctly', () => {
      render(
        <PageContainer maxWidth="full" data-testid="container">
          Test
        </PageContainer>
      )

      const container = screen.getByTestId('container')
      expect(container).toHaveClass('max-w-none')
    })

    it('handles all max-width variants', () => {
      const maxWidthMapping = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-none',
      }

      Object.entries(maxWidthMapping).forEach(([variant, expectedClass]) => {
        const { rerender } = render(
          <PageContainer maxWidth={variant as any} data-testid="container">
            Test
          </PageContainer>
        )

        const container = screen.getByTestId('container')
        expect(container).toHaveClass(expectedClass)

        rerender(<div />)
      })
    })
  })
})

describe('PageHeader Component', () => {
  const defaultProps = {
    title: 'Test Page Title',
  }

  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      render(<PageHeader {...defaultProps} />)

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Test Page Title')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(<PageHeader {...defaultProps} description="Test description" />)

      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      render(<PageHeader {...defaultProps} />)

      const description = screen.queryByText('Test description')
      expect(description).not.toBeInTheDocument()
    })

    it('applies correct header styling', () => {
      render(<PageHeader {...defaultProps} data-testid="header" />)

      const header = screen.getByTestId('header')
      // Updated spacing and animation classes in component
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'gap-1',
        'pb-2',
        'border-b',
        'mb-2',
        'animate-build-up',
        'sm:flex-row',
        'sm:items-center',
        'sm:justify-between'
      )
    })
  })

  describe('Title Styling', () => {
    it('applies correct title classes', () => {
      render(<PageHeader {...defaultProps} />)

      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'tracking-tight')
    })
  })

  describe('Description Styling', () => {
    it('applies correct description classes', () => {
      render(<PageHeader {...defaultProps} description="Test description" />)

      const description = screen.getByText('Test description')
      expect(description).toHaveClass('text-muted-foreground')
    })
  })

  describe('Action Section', () => {
    it('renders action element when provided', () => {
      const action = <button data-testid="action-button">Action</button>
      render(<PageHeader {...defaultProps} action={action} />)

      expect(screen.getByTestId('action-button')).toBeInTheDocument()
    })

    it('does not render action section when not provided', () => {
      render(<PageHeader {...defaultProps} />)

      const actionButton = screen.queryByTestId('action-button')
      expect(actionButton).not.toBeInTheDocument()
    })

    it('wraps action in correct container', () => {
      const action = <button data-testid="action-button">Action</button>
      render(<PageHeader {...defaultProps} action={action} />)

      const button = screen.getByTestId('action-button')
      const actionContainer = button.parentElement
      expect(actionContainer).toHaveClass('flex', 'items-center', 'gap-2')
    })
  })

  describe('Children Content', () => {
    it('renders children when provided', () => {
      render(
        <PageHeader {...defaultProps}>
          <div data-testid="header-children">Header Children</div>
        </PageHeader>
      )

      expect(screen.getByTestId('header-children')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(
        <PageHeader
          {...defaultProps}
          className="custom-header"
          data-testid="header"
        />
      )

      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-header')
    })

    it('forwards additional props', () => {
      render(
        <PageHeader {...defaultProps} data-testid="header" id="custom-header" />
      )

      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('id', 'custom-header')
    })
  })
})

describe('PageContent Component', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <PageContent>
          <div data-testid="content-child">Test Content</div>
        </PageContent>
      )

      expect(screen.getByTestId('content-child')).toBeInTheDocument()
    })

    it('renders as main element', () => {
      render(<PageContent>Test</PageContent>)

      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('applies default styling', () => {
      render(<PageContent data-testid="content">Test</PageContent>)

      const content = screen.getByTestId('content')
      expect(content).toHaveClass('flex-1', 'p-6')
    })

    it('merges custom className', () => {
      render(
        <PageContent className="custom-content" data-testid="content">
          Test
        </PageContent>
      )

      const content = screen.getByTestId('content')
      expect(content).toHaveClass('flex-1', 'p-6', 'custom-content')
    })

    it('forwards additional props', () => {
      render(
        <PageContent data-testid="content" id="main-content">
          Test
        </PageContent>
      )

      const content = screen.getByTestId('content')
      expect(content).toHaveAttribute('id', 'main-content')
    })
  })
})

describe('AppLayout Component', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <AppLayout>
          <div data-testid="layout-child">Layout Content</div>
        </AppLayout>
      )

      expect(screen.getByTestId('layout-child')).toBeInTheDocument()
    })

    it('applies default layout styling', () => {
      const { container } = render(<AppLayout>Test</AppLayout>)
      const layout = container.firstChild as HTMLElement
      expect(layout).toHaveClass('min-h-screen', 'bg-background')
    })

    it('merges custom className', () => {
      const { container } = render(
        <AppLayout className="custom-layout">Test</AppLayout>
      )
      const layout = container.firstChild as HTMLElement
      expect(layout).toHaveClass(
        'min-h-screen',
        'bg-background',
        'custom-layout'
      )
    })
  })

  describe('Full Screen Layout', () => {
    it('provides full screen height', () => {
      const { container } = render(<AppLayout>Test</AppLayout>)
      const layout = container.firstChild as HTMLElement
      expect(layout).toHaveClass('min-h-screen')
    })
  })
})

describe('Layout Components Integration', () => {
  it('can be composed together correctly', () => {
    render(
      <AppLayout>
        <PageContainer>
          <PageHeader title="Test Page" description="Test Description">
            <button data-testid="header-action">Action</button>
          </PageHeader>
          <PageContent>
            <div data-testid="page-content">Main Content</div>
          </PageContent>
        </PageContainer>
      </AppLayout>
    )

    expect(
      screen.getByRole('heading', { name: 'Test Page' })
    ).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByTestId('header-action')).toBeInTheDocument()
    expect(screen.getByTestId('page-content')).toBeInTheDocument()
  })

  it('maintains proper semantic structure', () => {
    render(
      <AppLayout>
        <PageContainer>
          <PageHeader title="Test Page" />
          <PageContent>
            <div>Main Content</div>
          </PageContent>
        </PageContainer>
      </AppLayout>
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
