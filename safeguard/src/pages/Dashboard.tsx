import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'
<<<<<<< Updated upstream
import { contacts } from '../data/contacts'
import type { Contact } from '../data/contacts'
=======
import { Global, css, keyframes } from '@emotion/react'
>>>>>>> Stashed changes

/**************************************************
 * 1) ANIMATED BACKGROUND BLOBS → UNSHACKLE‑STYLE  *
 **************************************************/
const float1 = keyframes`
  0%   { transform: translate(-15%, -10%) scale(1); }
  50%  { transform: translate(20%,  15%) scale(1.15); }
  100% { transform: translate(-15%, -10%) scale(1); }
`
const float2 = keyframes`
  0%   { transform: translate(10%, 60%)  scale(1); }
  50%  { transform: translate(-25%, 50%) scale(1.25); }
  100% { transform: translate(10%, 60%)  scale(1); }
`
const float3 = keyframes`
  0%   { transform: translate(70%, -30%) scale(1); }
  50%  { transform: translate(50%, 10%)  scale(1.1); }
  100% { transform: translate(70%, -30%) scale(1); }
`

const Blob = styled.div<{
  size: number
  gradient: string
  animation: ReturnType<typeof keyframes>
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  background: ${p => p.gradient};
  opacity: 0.35;
  filter: blur(180px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0; /* stays behind actual UI */
  animation: ${p => p.animation} 45s ease-in-out infinite;
`

const beam1Animation = keyframes`
  0% { transform: translate(-50%, -50%) rotate(45deg); opacity: 0; }
  20% { opacity: 0.2; }
  40% { opacity: 0; }
  100% { transform: translate(50%, 50%) rotate(45deg); opacity: 0; }
`

const beam2Animation = keyframes`
  0% { transform: translate(50%, -50%) rotate(-45deg); opacity: 0; }
  20% { opacity: 0.15; }
  40% { opacity: 0; }
  100% { transform: translate(-50%, 50%) rotate(-45deg); opacity: 0; }
`

const Beam = styled.div<{ delay: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(115, 103, 240, 0.05), rgba(115, 103, 240, 0));
    animation: ${beam1Animation} 30s infinite;
    animation-delay: ${props => props.delay};
    transform-origin: 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(-45deg, rgba(34, 211, 238, 0.05), rgba(34, 211, 238, 0));
    animation: ${beam2Animation} 30s infinite;
    animation-delay: ${props => props.delay};
    transform-origin: 100% 0;
  }
`

const GlobalStyles = () => (
  <Global
    styles={css`
      html, body, #root {
        height: 100%;
        background-color: #14161f;
        background-image: 
          radial-gradient(circle at 0% 0%, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0) 50%),
          radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0) 50%),
          radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.1) 0%, rgba(244, 114, 182, 0) 50%);
      }
    `}
  />
)

/******************************
 * 2) EXISTING DASHBOARD STYLES
 ******************************/
const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: transparent;
  backdrop-filter: blur(100px);
  z-index: 1;
`

const Sidebar = styled.nav`
  width: 250px;
  min-width: 250px;
  background-color: rgba(20, 22, 31, 0.95);
  padding: 24px 16px;
  height: 100vh;
  z-index: 2;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`

const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  background-color: transparent; /* let background show through */
  z-index: 2;
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
  color: ${props => (props.active ? '#7367f0' : 'rgba(255, 255, 255, 0.6)')};
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
    props.risk === 'low'
      ? '#22c55e'
      : props.risk === 'medium'
      ? '#eab308'
      : '#ef4444'};
`

/******************************
 * 3) MOCK DATA
 ******************************/
const mockContacts = [
  { id: 1, name: 'John', risk: 'high' },
  { id: 2, name: 'Sally', risk: 'high' },
  { id: 3, name: 'Matt', risk: 'low' },
  { id: 4, name: 'Rob', risk: 'low' },
]

/******************************
 * 4) MAIN COMPONENT
 ******************************/
const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  return (
<<<<<<< Updated upstream
    <Container>
      <Sidebar>
        <NavItem 
          active={currentPath === '/dashboard'} 
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
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
          {contacts.map((contact: Contact) => (
            <ContactRow 
              key={contact.id}
              onClick={() => navigate(`/contact/${contact.id}`)}
            >
              <ContactName>{contact.name}</ContactName>
              <RiskIndicator risk={contact.risk} />
            </ContactRow>
          ))}
        </ContactsContainer>
      </MainContent>
    </Container>
=======
    <>
      <GlobalStyles />
      <Beam delay="0s" />
      <Beam delay="4s" />
      {/* Blobs behind everything */}
      <Blob
        size={700}
        gradient={
          'radial-gradient(circle at 30% 30%, #7367f0 0%, rgba(115,103,240,0) 70%)'
        }
        animation={float1}
        style={{ top: '-250px', left: '-200px' }}
      />
      <Blob
        size={800}
        gradient={
          'radial-gradient(circle at 70% 30%, #f472b6 0%, rgba(244,114,182,0) 75%)'
        }
        animation={float2}
        style={{ bottom: '-300px', left: '20%' }}
      />
      <Blob
        size={650}
        gradient={
          'radial-gradient(circle at 50% 50%, #22d3ee 0%, rgba(34,211,238,0) 70%)'
        }
        animation={float3}
        style={{ top: '-200px', right: '-200px' }}
      />

      {/* FOREGROUND UI */}
      <Container>
        <Sidebar>
          <NavItem active={currentPath === '/dashboard'} onClick={() => navigate('/dashboard')}>
            Dashboard
          </NavItem>
          <NavItem active={currentPath === '/analysis'} onClick={() => navigate('/analysis')}>
            Analysis
          </NavItem>
        </Sidebar>
        <MainContent>
          <PageTitle>DASHBOARD</PageTitle>
          <ProfileSection>
            <ProfileCircle>Profile</ProfileCircle>
          </ProfileSection>
          <ContactsContainer>
            <ContactsHeader>
              <ContactsTitle>Accessed Contacts</ContactsTitle>
              <RiskLabel>Risk</RiskLabel>
            </ContactsHeader>
            {mockContacts.map(contact => (
              <ContactRow key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)}>
                <ContactName>{contact.name}</ContactName>
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

export default Dashboard;
