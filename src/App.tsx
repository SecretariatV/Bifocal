import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'

const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
`

const Header = styled.header`
  padding: 20px;
  background: #1a1a1a;
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Logo = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
`

const NavToggle = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
  padding: 10px;
`

const NavLine = styled.div`
  width: 25px;
  height: 2px;
  background: white;
  margin: 5px 0;
  transition: all 0.3s ease;
`

const NavMenu = styled(motion.nav)`
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background: #1a1a1a;
  padding: 80px 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
`

const NavLink = styled.a`
  display: block;
  padding: 15px 0;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    color: #666;
    transition: color 0.2s ease;
  }
`

const Content = styled.div`
  padding: 100px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
`

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const toggleNav = () => setIsOpen(!isOpen)

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <h1>Welcome to Comet Orbit</h1>
            <p>Your gateway to academic planning and course discovery at UT Dallas</p>
          </div>
        )
      case 'flowchart':
        return (
          <div>
            <h1>Degree Flowchart</h1>
            <p>Visualize your academic journey</p>
          </div>
        )
      case 'course-finder':
        return (
          <div>
            <h1>Course Finder</h1>
            <p>Find and explore courses at UTD</p>
          </div>
        )
      default:
        return <h1>Welcome to Comet Orbit</h1>
    }
  }

  return (
    <Container>
      <Header>
        <Logo>Comet Orbit</Logo>
      </Header>

      <NavToggle onClick={toggleNav}>
        <NavLine />
        <NavLine />
        <NavLine />
      </NavToggle>

      <AnimatePresence>
        {isOpen && (
          <NavMenu
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <NavLink onClick={() => { setCurrentPage('home'); setIsOpen(false) }}>
              Home
            </NavLink>
            <NavLink onClick={() => { setCurrentPage('flowchart'); setIsOpen(false) }}>
              Flowchart
            </NavLink>
            <NavLink onClick={() => { setCurrentPage('course-finder'); setIsOpen(false) }}>
              Course Finder
            </NavLink>
          </NavMenu>
        )}
      </AnimatePresence>

      <Content>
        {renderContent()}
      </Content>
    </Container>
  )
}

export default App
