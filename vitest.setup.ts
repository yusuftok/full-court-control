/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/dashboard'
  },
}))

// Mock Next.js Link
vi.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => {
    return React.createElement('a', { href, ...rest }, children)
  }
  MockLink.displayName = 'MockLink'
  return {
    default: MockLink,
    __esModule: true,
  }
})

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const icons = [
    'AlertCircle',
    'AlertTriangle',
    'ArrowLeft',
    'Banknote',
    'BarChart3',
    'Bell',
    'Building',
    'Building2',
    'Calendar',
    'Check',
    'CheckCircle',
    'CheckIcon',
    'ChevronDown',
    'ChevronDownIcon',
    'ChevronLeft',
    'ChevronRight',
    'ChevronRightIcon',
    'ChevronUp',
    'ChevronUpIcon',
    'Circle',
    'CircleIcon',
    'Clock',
    'Command',
    'Crown',
    'Download',
    'Edit',
    'File',
    'FileText',
    'Folder',
    'FolderOpen',
    'FolderTree',
    'Globe',
    'Hammer',
    'Home',
    'Layout',
    'LayoutDashboard',
    'ListTodo',
    'LucideIcon',
    'Mail',
    'MapPin',
    'Menu',
    'MoreHorizontal',
    'Plus',
    'Search',
    'Settings',
    'Shield',
    'Sparkles',
    'Star',
    'TreePine',
    'Trash',
    'Copy',
    'User',
    'Users',
    'Wrench',
    'X',
    'XIcon',
    'Zap',
  ]

  const mockIcons: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {}
  icons.forEach(icon => {
    mockIcons[icon] = ({ className, ...props }: React.ComponentProps<'svg'>) =>
      React.createElement('svg', {
        'data-testid': icon.toLowerCase(),
        className,
        ...props,
      })
  })

  // Special handling for LucideIcon type - export as both component and type
  mockIcons.LucideIcon = mockIcons.User

  return mockIcons
})

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: { errors: (globalThis as any).__TEST_RHF_ERRORS__ || {} },
    watch: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
    reset: vi.fn(),
  }),
  useFormContext: () => ({
    register: vi.fn(),
    formState: { errors: (globalThis as any).__TEST_RHF_ERRORS__ || {} },
    watch: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
  }),
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

// Mock @dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => children,
  DragOverlay: ({ children }: { children: React.ReactNode }) => children,
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
  }),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
  // Sensors API stubs
  useSensors: (...sensors: any[]) => sensors,
  useSensor: (sensor: any, options?: any) => ({ sensor, options }),
  PointerSensor: function PointerSensor() {},
  KeyboardSensor: function KeyboardSensor() {},
  closestCenter: vi.fn(),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  verticalListSortingStrategy: 'vertical',
  arrayMove: (arr: any[], from: number, to: number) => {
    const copy = arr.slice()
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    return copy
  },
  sortableKeyboardCoordinates: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  configurable: true,
})

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    // Return Turkish translations for common keys
    const translations: Record<string, string> = {
      'sidebar.dashboard': 'Dashboard',
      'sidebar.projects': 'Projects',
      'sidebar.templates': 'Division Templates',
      'sidebar.tasks': 'Tasks',
      'sidebar.subcontractors': 'Subcontractors',
      'sidebar.analytics': 'Analytics',
      'sidebar.reports': 'Reports',
      'sidebar.settings': 'Settings',
      'sidebar.toggleMenu': 'Menüyü aç/kapat',
      'common.toggleMenu': 'Menüyü aç/kapat',
      'navigation.toggleMenu': 'Menüyü aç/kapat',
      'header.notifications': 'Şantiye Uyarıları',
      'header.userMenu': 'Şantiye Şefi Menüsü',
      'header.search': 'Arama',
      'common.search': 'Arama',
      'common.home': 'Ana Sayfa',
      'common.projects': 'Projeler',
    }
    return translations[key] || key
  },
  useLocale: () => 'tr',
  useMessages: () => ({}),
}))

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => key),
  getLocale: vi.fn(() => 'tr'),
  getMessages: vi.fn(() => ({})),
}))
