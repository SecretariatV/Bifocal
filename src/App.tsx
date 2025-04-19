import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ContactAnalysis from './pages/ContactAnalysis'
import PatternDetection from './pages/PatternDetection'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1a202c;
`

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact/:id" element={<ContactAnalysis />} />
          <Route path="/patterns/:id" element={<PatternDetection />} />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App 