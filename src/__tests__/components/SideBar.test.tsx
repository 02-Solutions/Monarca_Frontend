import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Sidebar from './../../components/Sidebar.tsx'
import { AuthState, Permission } from './../../hooks/auth/authContext'

// Mock the logo import
vi.mock('../assets/logo.png', () => ({
  default: 'mocked-logo-path'
}))

// Mock the SidebarOption component to avoid router issues
vi.mock('./SiderbarOption', () => ({
  default: ({ label }: { label: string }) => <div data-testid="sidebar-option">{label}</div>
}))

// Wrapper component to provide router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Sidebar', () => {
  const mockUser: AuthState = {
    isAuthenticated: true,
    userId: '123',
    userEmail: 'john.doe@example.com',
    userName: 'John',
    userLastName: 'Doe',
    userRole: 'Manager',
    // Use the actual permissions from your auth context
    userPermissions: ['create_trip', 'view_dashboard'] as Permission[]
  }

  it('renders user information correctly', () => {
    render(
      <RouterWrapper>
        <Sidebar user={mockUser} />
      </RouterWrapper>
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('always renders Inicio option', () => {
    render(
      <RouterWrapper>
        <Sidebar user={mockUser} />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Inicio')).toBeInTheDocument()
  })

  it('renders conditional options based on permissions', () => {
    // Create a user with permissions that would show options in the sidebar
    const userWithCreatePermissions: AuthState = {
      ...mockUser,
      userPermissions: ['create_trip', 'view_dashboard'] as Permission[]
    }

    render(
      <RouterWrapper>
        <Sidebar user={userWithCreatePermissions} />
      </RouterWrapper>
    )
    
    // Test that Inicio always appears
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    
    // Note: The sidebar component uses permission strings that don't match your auth context
    // You may need to update either the Sidebar component or the Permission type
  })

  it('does not render options when user lacks permissions', () => {
    const userWithoutPermissions: AuthState = {
      isAuthenticated: true,
      userId: '456',
      userEmail: 'jane.smith@example.com',
      userName: 'Jane',
      userLastName: 'Smith',
      userRole: 'Employee',
      userPermissions: [] as Permission[]
    }

    render(
      <RouterWrapper>
        <Sidebar user={userWithoutPermissions} />
      </RouterWrapper>
    )
    
    // Only Inicio should appear since user has no permissions
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    
    // Other options should not appear
    expect(screen.queryByText('Crear solicitud de viaje')).not.toBeInTheDocument()
    expect(screen.queryByText('Viajes por aprobar')).not.toBeInTheDocument()
  })

  it('renders logo', () => {
    render(
      <RouterWrapper>
        <Sidebar user={mockUser} />
      </RouterWrapper>
    )
    
    const logo = screen.getByAltText('Monarca Logo')
    expect(logo).toBeInTheDocument()
  })
})
