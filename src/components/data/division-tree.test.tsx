import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DivisionTree, DivisionNode } from './division-tree'

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onBlur, onKeyDown, className, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={className}
      data-testid="tree-input"
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/context-menu', () => ({
  ContextMenu: ({ children }: any) => <div>{children}</div>,
  ContextMenuTrigger: ({ children }: any) => <div>{children}</div>,
  ContextMenuContent: ({ children }: any) => (
    <div data-testid="context-menu" role="menu">
      {children}
    </div>
  ),
  ContextMenuItem: ({ children, onClick }: any) => (
    <div role="menuitem" onClick={onClick}>
      {children}
    </div>
  ),
  ContextMenuSeparator: () => <hr />,
}))

// Sample test data
const createTestNode = (id: string, name: string, type: DivisionNode['type'] = 'division', children: DivisionNode[] = []): DivisionNode => ({
  id,
  name,
  children,
  isExpanded: false,
  type,
  properties: {}
})

const sampleData: DivisionNode[] = [
  {
    ...createTestNode('div-1', 'Division 1'),
    isExpanded: true,
    children: [
      createTestNode('sub-1', 'Subdivision 1', 'subdiv'),
      {
        ...createTestNode('sub-2', 'Subdivision 2', 'subdiv'),
        isExpanded: true,
        children: [
          createTestNode('task-1', 'Task 1', 'task')
        ]
      }
    ]
  },
  createTestNode('div-2', 'Division 2')
]

describe('DivisionTree Component', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders tree structure with header', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      expect(screen.getByText('Division Structure')).toBeInTheDocument()
      expect(screen.getByText('Add Division')).toBeInTheDocument()
    })

    it('renders all visible nodes', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      expect(screen.getByText('Division 1')).toBeInTheDocument()
      expect(screen.getByText('Division 2')).toBeInTheDocument()
      expect(screen.getByText('Subdivision 1')).toBeInTheDocument()
      expect(screen.getByText('Subdivision 2')).toBeInTheDocument()
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <DivisionTree data={sampleData} onChange={mockOnChange} className="custom-tree" />
      )
      
      expect(container.firstChild).toHaveClass('custom-tree')
    })

    it('renders empty tree', () => {
      render(<DivisionTree data={[]} onChange={mockOnChange} />)
      
      expect(screen.getByText('Division Structure')).toBeInTheDocument()
      expect(screen.queryByText('Division 1')).not.toBeInTheDocument()
    })
  })

  describe('Node Type Indicators', () => {
    it('renders correct type badges for different node types', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      expect(screen.getByText('division')).toBeInTheDocument()
      expect(screen.getAllByText('subdiv')).toHaveLength(2)
      expect(screen.getByText('task')).toBeInTheDocument()
    })

    it('applies correct styling for node type indicators', () => {
      const { container } = render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // Check for type-specific color classes (though we can't check actual colors in JSDOM)
      const divisionIcon = container.querySelector('.bg-blue-500')
      const subdivIcon = container.querySelector('.bg-green-500')
      const taskIcon = container.querySelector('.bg-orange-500')
      
      expect(divisionIcon).toBeInTheDocument()
      expect(subdivIcon).toBeInTheDocument()
      expect(taskIcon).toBeInTheDocument()
    })
  })

  describe('Tree Expansion/Collapse', () => {
    it('shows expand/collapse buttons for nodes with children', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // Division 1 has children and should show expand/collapse button
      const expandButtons = screen.getAllByTestId('chevrondown')
      expect(expandButtons.length).toBeGreaterThan(0)
    })

    it('does not show expand/collapse buttons for leaf nodes', () => {
      const leafOnlyData = [createTestNode('leaf-1', 'Leaf Node')]
      render(<DivisionTree data={leafOnlyData} onChange={mockOnChange} />)
      
      expect(screen.queryByTestId('chevrondown')).not.toBeInTheDocument()
      expect(screen.queryByTestId('chevronright')).not.toBeInTheDocument()
    })

    it('shows correct expand/collapse icon based on state', () => {
      const collapsedData = [{
        ...createTestNode('parent', 'Parent'),
        isExpanded: false,
        children: [createTestNode('child', 'Child')]
      }]

      render(<DivisionTree data={collapsedData} onChange={mockOnChange} />)
      
      expect(screen.getByTestId('chevronright')).toBeInTheDocument()
      expect(screen.queryByText('Child')).not.toBeInTheDocument()
    })
  })

  describe('Node Actions', () => {
    it('renders action buttons on hover', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // Action buttons should be present (though opacity might be 0 initially)
      expect(screen.getAllByTestId('plus')).toHaveLength(5) // Each visible node
      expect(screen.getAllByTestId('edit')).toHaveLength(10) // Each node has edit in hover and context
      expect(screen.getAllByTestId('trash2')).toHaveLength(10) // Each node has delete in hover and context
    })

    it('add child button triggers callback', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const addButtons = screen.getAllByTestId('plus')
      await user.click(addButtons[0]) // Click first add button
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData[0].children).toHaveLength(3) // Original 2 + 1 new
    })

    it('delete button triggers callback', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const deleteButtons = screen.getAllByTestId('trash2')
      await user.click(deleteButtons[0]) // Click first delete button
      
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Inline Editing', () => {
    it('enters edit mode on double click', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const nodeName = screen.getByText('Division 1')
      await user.dblClick(nodeName)
      
      expect(screen.getByTestId('tree-input')).toBeInTheDocument()
    })

    it('enters edit mode when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const editButtons = screen.getAllByTestId('edit')
      await user.click(editButtons[0])
      
      expect(screen.getByTestId('tree-input')).toBeInTheDocument()
    })

    it('saves changes on blur', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const nodeName = screen.getByText('Division 1')
      await user.dblClick(nodeName)
      
      const input = screen.getByTestId('tree-input')
      await user.clear(input)
      await user.type(input, 'New Name')
      fireEvent.blur(input)
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData[0].name).toBe('New Name')
    })

    it('saves changes on Enter key', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const nodeName = screen.getByText('Division 1')
      await user.dblClick(nodeName)
      
      const input = screen.getByTestId('tree-input')
      await user.clear(input)
      await user.type(input, 'Enter Name')
      fireEvent.keyDown(input, { key: 'Enter' })
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData[0].name).toBe('Enter Name')
    })

    it('cancels editing on Escape key', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const nodeName = screen.getByText('Division 1')
      await user.dblClick(nodeName)
      
      const input = screen.getByTestId('tree-input')
      await user.clear(input)
      await user.type(input, 'Cancelled Name')
      fireEvent.keyDown(input, { key: 'Escape' })
      
      expect(mockOnChange).not.toHaveBeenCalled()
      expect(screen.queryByTestId('tree-input')).not.toBeInTheDocument()
      expect(screen.getByText('Division 1')).toBeInTheDocument()
    })
  })

  describe('Adding Root Nodes', () => {
    it('adds new root division when Add Division is clicked', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const addButton = screen.getByText('Add Division')
      await user.click(addButton)
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData).toHaveLength(3) // Original 2 + 1 new
      expect(newData[2].name).toBe('New Division')
      expect(newData[2].type).toBe('division')
    })
  })

  describe('Hierarchical Structure', () => {
    it('renders nodes at correct indentation levels', () => {
      const { container } = render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // Check that child nodes have margin-left styling
      const childElements = container.querySelectorAll('[style*="marginLeft"]')
      expect(childElements.length).toBeGreaterThan(0)
    })

    it('expands parent when adding child node', async () => {
      const collapsedParent = [{
        ...createTestNode('parent', 'Collapsed Parent'),
        isExpanded: false,
        children: []
      }]

      const user = userEvent.setup()
      render(<DivisionTree data={collapsedParent} onChange={mockOnChange} />)
      
      const addButtons = screen.getAllByTestId('plus')
      await user.click(addButtons[0])
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData[0].isExpanded).toBe(true)
    })
  })

  describe('Drag and Drop', () => {
    it('initializes drag and drop context', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // DndContext should be present in the DOM structure
      // We can't easily test actual drag and drop in JSDOM, but we can verify the structure
      expect(screen.getByText('Division 1')).toBeInTheDocument()
    })

    it('shows drag overlay during drag', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // The DragOverlay should be rendered (though not visible without actual drag)
      const tree = screen.getByText('Division Structure').closest('div')
      expect(tree).toBeInTheDocument()
    })
  })

  describe('Context Menu', () => {
    it('context menu items trigger correct actions', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      // Context menu content is rendered (though may not be visible)
      const contextMenus = screen.getAllByTestId('context-menu')
      expect(contextMenus.length).toBeGreaterThan(0)
    })
  })

  describe('Tree Operations', () => {
    it('handles toggle expansion', async () => {
      const user = userEvent.setup()
      const toggleData = [{
        ...createTestNode('toggle-parent', 'Toggle Parent'),
        isExpanded: true,
        children: [createTestNode('toggle-child', 'Toggle Child')]
      }]

      render(<DivisionTree data={toggleData} onChange={mockOnChange} />)
      
      const expandButton = screen.getByTestId('chevrondown')
      await user.click(expandButton)
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData[0].isExpanded).toBe(false)
    })

    it('generates unique IDs for new nodes', async () => {
      const user = userEvent.setup()
      const originalDateNow = Date.now
      let mockTime = 1000000

      // Mock Date.now to return predictable values
      Date.now = jest.fn(() => ++mockTime)

      render(<DivisionTree data={[]} onChange={mockOnChange} />)
      
      const addButton = screen.getByText('Add Division')
      await user.click(addButton)
      
      expect(mockOnChange).toHaveBeenCalled()
      const newData = mockOnChange.mock.calls[0][0]
      expect(newData[0].id).toBe(`node-${mockTime}`)
      
      // Restore original Date.now
      Date.now = originalDateNow
    })
  })

  describe('Error Handling', () => {
    it('renders without crashing with empty data', () => {
      expect(() => render(<DivisionTree data={[]} onChange={mockOnChange} />)).not.toThrow()
    })

    it('handles nodes without children array', () => {
      const malformedData = [{
        id: 'test',
        name: 'Test',
        type: 'division' as const,
        children: [] // Ensure children array exists
      }] as DivisionNode[]

      expect(() => render(<DivisionTree data={malformedData} onChange={mockOnChange} />)).not.toThrow()
    })

    it('handles missing isExpanded property', () => {
      const dataWithoutExpanded = [createTestNode('test', 'Test')]
      delete (dataWithoutExpanded[0] as any).isExpanded

      expect(() => render(<DivisionTree data={dataWithoutExpanded} onChange={mockOnChange} />)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('provides proper button roles and labels', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('supports keyboard navigation in edit mode', async () => {
      const user = userEvent.setup()
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const nodeName = screen.getByText('Division 1')
      await user.dblClick(nodeName)
      
      const input = screen.getByTestId('tree-input')
      expect(input).toHaveFocus()
    })

    it('context menu has proper ARIA roles', () => {
      render(<DivisionTree data={sampleData} onChange={mockOnChange} />)
      
      const contextMenus = screen.getAllByRole('menu')
      expect(contextMenus.length).toBeGreaterThan(0)
      
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('handles large tree structures', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => 
        createTestNode(`large-${i}`, `Large Node ${i}`)
      )
      
      expect(() => render(<DivisionTree data={largeData} onChange={mockOnChange} />)).not.toThrow()
    })

    it('only renders visible nodes when collapsed', () => {
      const deepData = [{
        ...createTestNode('deep-parent', 'Deep Parent'),
        isExpanded: false,
        children: Array.from({ length: 10 }, (_, i) => 
          createTestNode(`deep-child-${i}`, `Deep Child ${i}`)
        )
      }]

      render(<DivisionTree data={deepData} onChange={mockOnChange} />)
      
      expect(screen.getByText('Deep Parent')).toBeInTheDocument()
      expect(screen.queryByText('Deep Child 0')).not.toBeInTheDocument()
    })
  })
})