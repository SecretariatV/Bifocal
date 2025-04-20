import React, { useState } from 'react';
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  padding: 40px;
  padding-left: ${props => props.sidebarOpen ? '290px' : '40px'};
  background-color: #14161f;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 0;
  transition: padding-left 0.3s ease;
`

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
  letter-spacing: 0.05em;
`

const ProfileSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 40px;
`

const Tile = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
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
  font-size: 1.5rem;
  color: #60a5fa;
  margin-bottom: 1rem;
`

const TileDescription = styled.p`
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

const TileButton = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
`

const ContactsContainer = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 8px;
  overflow: hidden;
`

const ContactsHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
`

const ContactsTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
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
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;

  &:first-of-type {
    border-top: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
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

const RiskIndicator = styled.div<{ risk: 'low' | 'medium' | 'high' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.risk === 'low' ? '#22c55e' : 
    props.risk === 'medium' ? '#eab308' : 
    '#ef4444'
  };
`

const tiles = [
  {
    icon: '🎙️',
    title: "Let's analyze what was said",
    description: "Upload a voice recording or voicemail. We'll transcribe and analyze it for behavioral patterns like manipulation, gaslighting, or obsessive speech.",
    cta: "Upload Audio",
    path: '/upload'
  },
  {
    icon: '💬',
    title: "Let's talk about you",
    description: "Not sure where to begin? Describe your experience in your own words and let our system help you uncover patterns and offer support resources.",
    cta: "Start Conversation",
    path: '/conversation'
  },
  {
    icon: '📚',
    title: "Understand the patterns",
    description: "Learn about signs of emotional abuse, obsessive messaging, and how our AI classifies severity levels using clinical indicators.",
    cta: "Browse Signs",
    path: '/learn'
  }
];

const mockContacts = [
  { id: 1, name: 'John', risk: 'high', relationship: 'Ex-partner' },
  { id: 2, name: 'Sally', risk: 'high', relationship: 'Colleague' },
  { id: 3, name: 'Matt', risk: 'low', relationship: 'Friend' },
  { id: 4, name: 'Rob', risk: 'low', relationship: 'Acquaintance' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
        <Content>
          <Title>DASHBOARD</Title>
          <ProfileSection>
            <ProfileCircle onClick={() => navigate('/profile')}>Profile</ProfileCircle>
          </ProfileSection>

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
              <ContactsTitle>Accessed Contacts</ContactsTitle>
              <RelationshipLabel>Relationship</RelationshipLabel>
              <RiskLabel>Risk</RiskLabel>
            </ContactsHeader>
            {mockContacts.map(contact => (
              <ContactRow key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)}>
                <ContactName>{contact.name}</ContactName>
                <RelationshipText>{contact.relationship}</RelationshipText>
                <RiskIndicator risk={contact.risk as 'low' | 'medium' | 'high'} />
              </ContactRow>
            ))}
          </ContactsContainer>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Dashboard 