import React, { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled from '@emotion/styled'
import SplashCursor from './components/ui/splash-cursor'
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
import Resources from './pages/Resources'
import Journal from './pages/Journal'
import Home from './pages/Home'
import EmotionalEvaluation from './pages/EmotionalEvaluation'

interface SafetyContextType {
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
}

export const SafetyContext = createContext<SafetyContextType>({
  isHidden: false,
  setIsHidden: () => {},
});

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
  color: #1a202c;
  position: relative;
`

const HideButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FF4D4D;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  opacity: ${props => props.hidden ? '0' : '1'};
  pointer-events: ${props => props.hidden ? 'none' : 'auto'};

  &:hover {
    transform: scale(1.1);
  }
`

const UnhideButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer !important;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
  padding-bottom: 4px;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.3);
  }
`

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 9999;
  display: ${props => props.isVisible ? 'block' : 'none'};
  cursor: none;
  isolation: isolate;
  overflow: hidden;

  * {
    cursor: none;
  }

  ${UnhideButton} {
    cursor: pointer !important;
  }
`

const SafetyOverlay = () => {
  const { isHidden, setIsHidden } = useContext(SafetyContext);

  return (
    <>
      <HideButton hidden={isHidden} onClick={() => setIsHidden(true)}>HIDE</HideButton>
      <Overlay isVisible={isHidden} aria-hidden={!isHidden}>
        {isHidden && (
          <SplashCursor 
            SPLAT_RADIUS={0.3}
            SPLAT_FORCE={8000}
            COLOR_UPDATE_SPEED={15}
            DENSITY_DISSIPATION={2.5}
            VELOCITY_DISSIPATION={1.5}
            PRESSURE={0.2}
            CURL={20}
            SHADING={true}
            TRANSPARENT={true}
            BACK_COLOR={{ r: 0, g: 0, b: 0 }}
          />
        )}
        <UnhideButton onClick={(e) => {
          e.stopPropagation();
          setIsHidden(false);
        }}>×</UnhideButton>
      </Overlay>
    </>
  )
}

function App() {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <SafetyContext.Provider value={{ isHidden, setIsHidden }}>
      <Router>
        <AppContainer>
          <SafetyOverlay />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="/resources" element={<Resources />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/emotional-evaluation" element={<EmotionalEvaluation />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppContainer>
      </Router>
    </SafetyContext.Provider>
  )
}

export default App
