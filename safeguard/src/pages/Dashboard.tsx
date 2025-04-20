import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Navigation from '../components/Navigation'
import { contacts } from '../data/contacts'
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  padding: 3rem;
  padding-left: ${props => props.sidebarOpen ? '290px' : '3rem'};
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

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
  letter-spacing: 0.05em;
`

const ProfileSection = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  z-index: 10;
`

const ProfileCircle = styled.div`
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 500;
`

const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin: 2rem 0 4rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

const Tile = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`

const TileIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`

const TileTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  color: #60a5fa;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`

const TileDescription = styled.p`
  color: #94a3b8;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`

const TileButton = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
`

const ContactsContainer = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 1rem;
  overflow: hidden;
  margin: 4rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

const ContactsHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.02);
`

const ContactsTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ContactsMainTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #fff;
`

const ContactsSubtitle = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
`

const RelationshipLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  align-self: center;
`

const RiskLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  align-self: center;
`

const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`

const ContactName = styled.div`
  font-size: 16px;
  color: #fff;
  font-weight: 500;
`

const RelationshipText = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`

const RiskIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:hover::after {
    content: attr(data-risk);
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    margin-right: 0.5rem;
    white-space: nowrap;
  }
`

const RiskIndicator = styled.div<{ risk: 'low' | 'medium' | 'high' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.risk === 'low' ? '#22c55e' : 
    props.risk === 'medium' ? '#eab308' : 
    '#ef4444'
  };
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: 3rem auto 2rem;
  position: relative;
`;

const CreatorMessage = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const FromCreators = styled.div`
  position: absolute;
  top: -0.8rem;
  left: 50%;
  transform: translateX(-50%);
  background: #14161f;
  padding: 0 1rem;
  color: #60a5fa;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const Message = styled.p`
  font-style: italic;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
`;

const tiles = [
  {
    icon: '🎙️',
    title: "Analyze a Voice Message",
    description: "Share a voice recording or voicemail. We'll help you identify patterns and behaviors that might be concerning.",
    cta: "Upload Audio",
    path: '/audio-upload'
  },
  {
    icon: '💬',
    title: "Describe your experience",
    description: "Tell us about what's happening in your own words. We're here to listen and help you understand the patterns.",
    cta: "Start Conversation",
    path: '/conversation'
  },
  {
    icon: '📚',
    title: "Explore Warning Signs",
    description: "Learn about different types of concerning behaviors and how to recognize them in your relationships.",
    cta: "Browse Signs",
    path: '/browse-signs'
  }
];

const mockData = [
  { name: 'Mon', frequency: 24 },
  { name: 'Tue', frequency: 18 },
  { name: 'Wed', frequency: 30 },
  { name: 'Thu', frequency: 15 },
  { name: 'Fri', frequency: 28 },
  { name: 'Sat', frequency: 12 },
  { name: 'Sun', frequency: 20 },
];

const MainTitle = styled.div`
  text-align: left;
  margin-bottom: 3rem;
  animation: ${slideInFromLeft} 1.5s ease-out;
`;

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
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  color: #94a3b8;
  font-size: 1.25rem;
  margin-top: 0.5rem;
  opacity: 0.8;
`;

const DashboardTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #f8fafc;
`;

const ThoughtBubble = styled.div<{ isVisible: boolean }>`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1.25rem 1.75rem;
  border-radius: 1rem;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 100;
  animation: ${props => props.isVisible ? slideInFromLeft : fadeOut} 0.8s ease-out;
  animation-fill-mode: forwards;
`;

const ThoughtText = styled.p`
  color: #f8fafc;
  font-size: 1.1rem;
  line-height: 1.6;
  font-style: italic;
  margin-right: 2rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #f8fafc;
  }
`;

const thoughtMessages = [
  "We're here to help you make sense of the patterns.",
  "You're not alone. Let's take a closer look together.",
  "Sometimes all it takes is a closer look.",
  "Patterns reveal more than we think.",
  "We help connect the dots — safely and privately.",
  "Your voice matters. Let's listen together."
];

const Dashboard = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showThought, setShowThought] = useState(true)
  const [currentThought, setCurrentThought] = useState(0)
  const [isThoughtVisible, setIsThoughtVisible] = useState(true)

  useEffect(() => {
    // Rotate through messages every 8 seconds
    const messageInterval = setInterval(() => {
      if (showThought) {
        setIsThoughtVisible(false)
        setTimeout(() => {
          setCurrentThought((prev) => (prev + 1) % thoughtMessages.length)
          setIsThoughtVisible(true)
        }, 800) // Wait for fade out before changing message
      }
    }, 8000)

    return () => clearInterval(messageInterval)
  }, [showThought])

  const handleCloseThought = () => {
    setIsThoughtVisible(false)
    setTimeout(() => setShowThought(false), 800)
  }

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
        <Content>
          <ProfileSection>
            <ProfileCircle onClick={() => navigate('/profile')}>Profile</ProfileCircle>
          </ProfileSection>
          
          <MainTitle>
            <BifocalText>bifocal.</BifocalText>
            <Subtitle>Making the invisible visible, one message at a time</Subtitle>
          </MainTitle>

          <TileGrid>
            {tiles.map((tile, index) => (
              <Tile 
                key={index}
                onClick={() => navigate(tile.path)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(tile.path);
                  }
                }}
              >
                <TileIcon>{tile.icon}</TileIcon>
                <TileTitle>{tile.title}</TileTitle>
                <TileDescription>{tile.description}</TileDescription>
                <TileButton>{tile.cta}</TileButton>
              </Tile>
            ))}
          </TileGrid>

          <ContactsContainer>
            <ContactsHeader>
              <ContactsTitle>
                <ContactsMainTitle>Recently Reviewed Contacts</ContactsMainTitle>
                <ContactsSubtitle>Your previously analyzed conversations and interactions</ContactsSubtitle>
              </ContactsTitle>
              <RelationshipLabel>Relationship</RelationshipLabel>
              <RiskLabel>Risk Level</RiskLabel>
            </ContactsHeader>
            {contacts.map(contact => (
              <ContactRow key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)}>
                <ContactName>{contact.name}</ContactName>
                <RelationshipText>{contact.email || contact.phone}</RelationshipText>
                <RiskIndicatorContainer data-risk={`${contact.risk.charAt(0).toUpperCase() + contact.risk.slice(1)} Risk`}>
                  <RiskIndicator risk={contact.risk} />
                </RiskIndicatorContainer>
              </ContactRow>
            ))}
          </ContactsContainer>

          {showThought && (
            <ThoughtBubble isVisible={isThoughtVisible}>
              <ThoughtText>{thoughtMessages[currentThought]}</ThoughtText>
              <CloseButton onClick={handleCloseThought}>&times;</CloseButton>
            </ThoughtBubble>
          )}

          <Footer>
            <CreatorMessage>
              <FromCreators>from the creators</FromCreators>
              <Message>
                you deserve clarity. with your permission, we help detect patterns over time, 
                so we can support your safety and peace of mind. you can opt out of anything, 
                whenever you choose.
              </Message>
            </CreatorMessage>
          </Footer>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Dashboard 