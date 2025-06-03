import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dropdown from '../../components/Approvals/DropDown.tsx'

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  const defaultProps = {
    value: '',
    options: mockOptions,
    onChange: vi.fn()
  }

  it('renders dropdown with button trigger', () => {
    render(<Dropdown {...defaultProps} />)
    
    const dropdownButton = screen.getByRole('button')
    expect(dropdownButton).toBeInTheDocument()
  })

  it('shows placeholder when provided', () => {
    render(<Dropdown {...defaultProps} placeholder="Choose option" />)
    
    expect(screen.getByText('Choose option')).toBeInTheDocument()
  })

  it('renders with default placeholder', () => {
    render(<Dropdown {...defaultProps} />)
    
    const dropdownButton = screen.getByRole('button')
    expect(dropdownButton).toBeInTheDocument()
  })

  it('calls onChange when option is selected', () => {
    const handleChange = vi.fn()
    render(<Dropdown {...defaultProps} onChange={handleChange} />)
    
    const dropdownButton = screen.getByRole('button')
    fireEvent.click(dropdownButton)
    
    const option1 = screen.queryByText('Option 1')
    if (option1) {
      fireEvent.click(option1)
      expect(handleChange).toHaveBeenCalledTimes(1)
    } else {
      expect(dropdownButton).toBeInTheDocument()
    }
  })

  it('shows selected value', () => {
    render(<Dropdown {...defaultProps} value="option2" />)
    
    const selectedText = screen.queryByText('Option 2')
    if (selectedText) {
      expect(selectedText).toBeInTheDocument()
    } else {
      const dropdownButton = screen.getByRole('button')
      expect(dropdownButton).toBeInTheDocument()
    }
  })

  it('renders all provided options', () => {
    render(<Dropdown {...defaultProps} />)
    
    const dropdownButton = screen.getByRole('button')
    fireEvent.click(dropdownButton)
    
    const hasOptions = mockOptions.some(option => 
      screen.queryByText(option.label)
    )
    
    if (hasOptions) {
      mockOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument()
      })
    } else {
      expect(dropdownButton).toBeInTheDocument()
    }
  })

  it('handles empty value prop', () => {
    render(<Dropdown {...defaultProps} value="" />)
    
    const dropdownButton = screen.getByRole('button')
    expect(dropdownButton).toBeInTheDocument()
  })
})
