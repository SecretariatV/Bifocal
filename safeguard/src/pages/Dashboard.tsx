import React, { useState } from 'react';
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translate(-30px, 20px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeInSlowly = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const backgroundWave = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
  overflow-x: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`

const TopDeck = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
`

const EmpathyStatement = styled.div`
  color: #94a3b8;
  font-size: 1.1rem;
  font-style: italic;
  margin-left: 2rem;
  opacity: 0;
  animation: ${fadeInSlowly} 2s ease-out forwards;
  animation-delay: 1s;
  font-family: 'Inter', sans-serif;
  
  span {
    color: #60a5fa;
    font-weight: 500;
  }
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  padding: 3rem;
  padding-left: ${props => props.sidebarOpen ? '290px' : '3rem'};
  padding-top: calc(3rem + 60px);
  background-color: #14161f;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 0;
  transition: padding-left 0.3s ease;
`

const Content = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  position: relative;
`

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin: 3rem auto;
  max-width: 1400px;
  padding: 0 4rem;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    gap: 2.5rem;
    padding: 0 3rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 2rem;
    gap: 2rem;
  }
`

const Tile = styled.div<{ index: number }>`
  background: ${props => 
    `linear-gradient(135deg, 
      rgba(255, 255, 255, ${props.index % 2 === 0 ? '0.08' : '0.06'}) 0%, 
      rgba(255, 255, 255, ${props.index % 2 === 0 ? '0.06' : '0.04'}) 100%)`
  };
  padding: 3.5rem;
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  min-height: 400px;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(96, 165, 250, 0.15) 0%, 
      rgba(59, 130, 246, 0.08) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(96, 165, 250, 0.3);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(96, 165, 250, 0.2);

    &:before {
      opacity: 1;
    }
  }
`

const TileIcon = styled.div<{ index: number }>`
  font-size: 4rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;

  ${Tile}:hover & {
    transform: scale(1.1) translateY(-5px);
  }
`

const TileTitle = styled.h3`
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.75rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
  line-height: 1.2;
`

const TileDescription = styled.p`
  color: #94a3b8;
  line-height: 1.8;
  font-size: 1.2rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
  margin-bottom: 2.5rem;
  flex-grow: 1;
`

const TileButton = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.15rem;
  position: relative;
  z-index: 1;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 12px rgba(59, 130, 246, 0.3),
      0 0 0 2px rgba(96, 165, 250, 0.3);
  }

  @media (max-width: 768px) {
    padding: 1.25rem 2rem;
  }
`

const MainTitle = styled.div`
  text-align: left;
  margin-top: 7rem;
  margin-bottom: 3rem;
  animation: ${slideInFromLeft} 1.5s ease-out;
`

const BifocalText = styled.h1`
  font-family: 'Space Grotesk', 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 8.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.03em;
  text-transform: lowercase;
`

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  color: #94a3b8;
  font-size: 1.25rem;
  margin-top: 1rem;
  opacity: 0.8;
`

const thoughtMessages = [
  "You don't have to face this alone — we're here to help",
  "Your voice matters. Let's listen together.",
  "Sometimes all it takes is a closer look.",
  "We're here to help you make sense of the patterns.",
  "You're not alone. Let's take a closer look together.",
  "We help connect the dots — safely and privately."
]

const tiles = [
  {
    icon: '🔊',
    title: "Analyze a Voice Message",
    description: "Share verbal interactions for our model to detect tone and trauma language using survivor-focused, DSM-aligned analysis.",
    cta: "Upload Audio",
    path: '/audio-upload'
  },
  {
    icon: '💬',
    title: "Describe Your Experience",
    description: "Share your story in your own words. Our system helps identify patterns of confusion, fear, and dissociation through a survivor-focused lens.",
    cta: "Start Conversation",
    path: '/conversation'
  },
  {
    icon: '📍',
    title: "Find Local Resources",
    description: "Connect with nearby support services and crisis centers. Get actionable help based on your specific situation and location.",
    cta: "Find Support",
    path: '/resources'
  },
  {
    icon: '📓',
    title: "Interactive Journal",
    description: "Track changes in symptoms like hypervigilance or isolation over time. Helps identify patterns and document your journey.",
    cta: "Start Writing",
    path: '/journal'
  }
];

const Dashboard = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [randomMessage] = useState(() => 
    thoughtMessages[Math.floor(Math.random() * thoughtMessages.length)]
  );

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <TopDeck>
        <EmpathyStatement>{randomMessage}</EmpathyStatement>
        <ProfileButton onClick={() => navigate('/profile')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Profile
        </ProfileButton>
      </TopDeck>

      <MainContent sidebarOpen={isSidebarOpen}>
        <Content>
          <MainTitle>
            <BifocalText>bifocal.</BifocalText>
            <Subtitle>Making the invisible visible, one message at a time</Subtitle>
          </MainTitle>

          <TileGrid>
            {tiles.map((tile, index) => (
              <Tile 
                key={index}
                index={index}
                onClick={() => navigate(tile.path)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(tile.path);
                  }
                }}
              >
                <TileIcon index={index}>{tile.icon}</TileIcon>
                <TileTitle>{tile.title}</TileTitle>
                <TileDescription>{tile.description}</TileDescription>
                <TileButton>{tile.cta}</TileButton>
              </Tile>
            ))}
          </TileGrid>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Dashboard 