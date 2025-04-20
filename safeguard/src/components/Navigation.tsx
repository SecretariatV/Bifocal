import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const HamburgerButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1000;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  &:hover span {
    background-color: #fff;
  }
`

const HamburgerLine = styled.span`
  display: block;
  width: 24px;
  height: 2px;
  background-color: #94a3b8;
  transition: all 0.3s ease;
`

const Sidebar = styled.nav<{ isOpen: boolean }>`
  width: 250px;
  min-width: 250px;
  background-color: rgb(24, 26, 31);
  padding: 24px 16px;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: ${props => props.isOpen ? '0' : '-250px'};
  top: 0;
  transition: left 0.3s ease;
  z-index: 999;
  padding-top: 80px;
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.active ? '#fff' : '#94a3b8'};
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(to bottom, #3b82f6, #2563eb);
    border-radius: 0 2px 2px 0;
    transition: all 0.2s ease;
    opacity: ${props => props.active ? 1 : 0};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    
    &:before {
      height: 70%;
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    gap: 8px;
    padding: 10px 12px;
    font-size: 14px;
  }
`

interface NavigationProps {
  onSidebarOpenChange: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
}

const Navigation = ({ onSidebarOpenChange, isSidebarOpen }: NavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const handleNavigation = (path: string) => {
    navigate(path)
    onSidebarOpenChange(false)
  }

  return (
    <>
      <HamburgerButton onClick={() => onSidebarOpenChange(!isSidebarOpen)}>
        <HamburgerLine />
        <HamburgerLine />
        <HamburgerLine />
      </HamburgerButton>
      
      <Sidebar isOpen={isSidebarOpen}>
        <NavItem 
          active={currentPath === '/dashboard'} 
          onClick={() => handleNavigation('/dashboard')}
        >
          <span role="img" aria-label="home">🏠</span>
          Dashboard
        </NavItem>
        <NavItem 
          active={currentPath === '/contacts'} 
          onClick={() => handleNavigation('/contacts')}
        >
          <span role="img" aria-label="contacts">👥</span>
          Contacts
        </NavItem>
        <NavItem 
          active={currentPath === '/analysis'} 
          onClick={() => handleNavigation('/analysis')}
        >
          <span role="img" aria-label="analysis">📊</span>
          Analysis
        </NavItem>
        <NavItem 
          active={currentPath === '/emotional-evaluation'} 
          onClick={() => handleNavigation('/emotional-evaluation')}
        >
          <span role="img" aria-label="emotional-evaluation">🤗</span>
          Emotional Evaluation
        </NavItem>
      </Sidebar>
    </>
  )
}

export default Navigation 