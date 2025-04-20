import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { contacts } from '../data/contacts'
import { useState } from 'react'
import Navigation from '../../safeguard/src/components/Navigation'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #14161f;
`

const Sidebar = styled.nav`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  padding: 2rem;
`

interface MainContentProps {
  sidebarOpen: boolean;
}

interface RiskIndicatorProps {
  risk: 'low' | 'medium' | 'high';
}

const MainContent = styled.main<MainContentProps>`
  flex: 1;
  padding: 40px;
  padding-left: ${(props: MainContentProps) => props.sidebarOpen ? '290px' : '40px'};
  transition: padding-left 0.3s ease;
`

const NavItem = styled.div`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #64748b;

  &:hover {
    background-color: #f1f5f9;
    color: #3b82f6;
  }
`

const ContactList = styled.div`
  margin-top: 2rem;
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

const RiskIndicator = styled.div<RiskIndicatorProps>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props: RiskIndicatorProps) => 
    props.risk === 'low' ? '#22c55e' : 
    props.risk === 'medium' ? '#eab308' : 
    '#ef4444'
  };
`

const mockData = [
  { name: 'Mon', frequency: 24 },
  { name: 'Tue', frequency: 18 },
  { name: 'Wed', frequency: 30 },
  { name: 'Thu', frequency: 15 },
  { name: 'Fri', frequency: 28 },
  { name: 'Sat', frequency: 12 },
  { name: 'Sun', frequency: 20 },
];

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

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const ProfileCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const Tile = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const TileIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const TileTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
`;

const TileDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const TileButton = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                onKeyPress={(e: React.KeyboardEvent) => {
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
            {contacts.map(contact => (
              <ContactRow key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)}>
                <ContactName>{contact.name}</ContactName>
                <RelationshipText>{contact.relationship}</RelationshipText>
                <RiskIndicator risk={contact.riskLevel} />
              </ContactRow>
            ))}
          </ContactsContainer>
        </Content>
      </MainContent>
    </Container>
  );
};

export default Dashboard;