import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
`

const Sidebar = styled.nav`
  width: 250px;
  min-width: 250px;
  background-color: rgba(20, 22, 31, 0.95);
  padding: 24px 16px;
  height: 100vh;
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
  grid-template-columns: 1fr auto;
`

const ContactsTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
`

const RiskLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  align-self: center;
`

const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  &:first-of-type {
    border-top: none;
  }
`

const ContactName = styled.div`
  font-size: 16px;
  color: #fff;
  font-weight: 500;
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.active ? '#7367f0' : 'rgba(255, 255, 255, 0.6)'};
  transition: all 0.2s ease;

  &:hover {
    color: #7367f0;
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

const mockContacts = [
  { id: 1, name: 'John', risk: 'high' },
  { id: 2, name: 'Sally', risk: 'high' },
  { id: 3, name: 'Matt', risk: 'low' },
  { id: 4, name: 'Rob', risk: 'low' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <Container>
      <Sidebar>
        <NavItem 
          active={currentPath === '/dashboard'} 
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </NavItem>
        <NavItem 
          active={currentPath === '/contacts'} 
          onClick={() => navigate('/contacts')}
        >
          Contacts
        </NavItem>
        <NavItem 
          active={currentPath === '/analysis'} 
          onClick={() => navigate('/analysis')}
        >
          Analysis
        </NavItem>
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
  )
}

export default Dashboard 