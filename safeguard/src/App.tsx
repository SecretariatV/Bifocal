import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled from '@emotion/styled'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import ContactAnalysis from './pages/ContactAnalysis'
import PatternDetection from './pages/PatternDetection'
import Gaslighting from './pages/Gaslighting'
import Stalking from './pages/Stalking'
import Obsession from './pages/Obsession'
import VictimLens from './pages/VictimLens'
import EditProfile from './pages/EditProfile'
import UploadAudio from './pages/UploadAudio'
import ConversationExperience from './pages/ConversationExperience'
import Justification from './pages/Justification'
import BrowseSigns from './pages/BrowseSigns'
import AudioUpload from './pages/AudioUpload'
import Contacts from './pages/Contacts'

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
  color: #1a202c;
`

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/analysis" element={<VictimLens />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/contact/:id" element={<ContactAnalysis />} />
          <Route path="/patterns/:id" element={<PatternDetection />} />
          <Route path="/gaslighting/:id" element={<Gaslighting />} />
          <Route path="/stalking/:id" element={<Stalking />} />
          <Route path="/obsession/:id" element={<Obsession />} />
          <Route path="/victim-lens/:id" element={<VictimLens />} />
          <Route path="/upload" element={<UploadAudio />} />
          <Route path="/conversation" element={<ConversationExperience />} />
          <Route path="/justification" element={<Justification />} />
          <Route path="/browse-signs" element={<BrowseSigns />} />
          <Route path="/audio-upload" element={<AudioUpload />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App
