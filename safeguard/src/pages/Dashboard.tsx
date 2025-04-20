import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
`

const Sidebar = styled.nav`
  width: 280px;
  min-width: 280px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 20px;
  height: 100%;
  overflow-y: auto;
`

const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  background-color: #14161f;
`

const PageTitle = styled.h1`
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

const NavIcon = styled.span`
  font-size: 18px;
  opacity: 0.8;
  transition: all 0.2s ease;
  
  ${NavItem}:hover & {
    opacity: 1;
    transform: scale(1.1);
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
`

const Contact = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ContactActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`

const mockContacts = [
  { id: 1, name: 'John', risk: 'high', relationship: 'Ex-partner' },
  { id: 2, name: 'Sally', risk: 'high', relationship: 'Colleague' },
  { id: 3, name: 'Matt', risk: 'low', relationship: 'Friend' },
  { id: 4, name: 'Rob', risk: 'low', relationship: 'Acquaintance' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const getNavIcon = (path: string) => {
    switch (path) {
      case '/dashboard':
        return '🏠';
      case '/contacts':
        return '👥';
      case '/analysis':
        return '📊';
      case '/settings':
        return '⚙️';
      default:
        return '';
    }
  };

  return (
    <Container>
      <Sidebar>
        {['/dashboard', '/contacts', '/analysis', '/settings'].map(path => (
          <NavItem 
            key={path}
            active={currentPath === path} 
            onClick={() => navigate(path)}
          >
            <NavIcon>{getNavIcon(path)}</NavIcon>
            {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
          </NavItem>
<<<<<<< Updated upstream
        ))}
      </Sidebar>
      <MainContent>
        <PageTitle>DASHBOARD</PageTitle>
        <ProfileSection>
          <ProfileCircle>
            Profile
          </ProfileCircle>
        </ProfileSection>
        <ContactsContainer>
          <ContactsHeader>
            <ContactsTitle>Accessed Contacts</ContactsTitle>
            <RiskLabel>Risk</RiskLabel>
          </ContactsHeader>
          {mockContacts.map(contact => (
            <ContactRow 
              key={contact.id}
              onClick={() => navigate(`/contact/${contact.id}`)}
            >
              <ContactName>{contact.name}</ContactName>
              <RiskIndicator risk={contact.risk as 'low' | 'medium' | 'high'} />
            </ContactRow>
          ))}
        </ContactsContainer>
      </MainContent>
    </Container>
=======
          <NavItem active={currentPath === '/profile'} onClick={() => navigate('/profile')}>
            Profile
          </NavItem>
          <NavItem active={currentPath === '/analysis'} onClick={() => navigate('/analysis')}>
            Analysis
          </NavItem>
        </Sidebar>
        <MainContent>
          <PageTitle>DASHBOARD</PageTitle>
          <ProfileSection>
            <ProfileCircle onClick={() => navigate('/profile')}>Profile</ProfileCircle>
          </ProfileSection>
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
        </MainContent>
      </Container>
    </>
>>>>>>> Stashed changes
  )
}

export default Dashboard 