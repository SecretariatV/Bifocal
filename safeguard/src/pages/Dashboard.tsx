import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`

const Sidebar = styled.nav`
  width: 250px;
  min-width: 250px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;
  height: 100%;
  overflow-y: auto;
`

const MainContent = styled.main`
  flex: 1;
  background-color: white;
  padding: 24px 32px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 0;
`

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 32px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Special Elite', cursive;
`

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`

const ProfileImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 16px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    .upload-overlay {
      opacity: 1;
    }
  }
`

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 14px;
`

const ContactsSection = styled.div`
  margin-top: 32px;
`

const ContactsTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 16px;
  font-family: 'Special Elite', cursive;
`

const ContactsTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`

const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }
`

const ContactName = styled.div`
  font-size: 16px;
  color: #1e293b;
  font-family: 'Special Elite', cursive;
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  font-family: 'Special Elite', cursive;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  background-color: ${props => props.active ? '#f1f5f9' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #3b82f6;
  }
`

const RiskIndicator = styled.div<{ risk: 'low' | 'medium' | 'high' }>`
  width: 24px;
  height: 24px;
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
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
        <NavItem 
          active={currentPath === '/settings'} 
          onClick={() => navigate('/settings')}
        >
          Settings
        </NavItem>
      </Sidebar>
      <MainContent>
        <PageTitle>Dashboard</PageTitle>
        
        <ProfileSection>
          <ProfileImageContainer>
            <ProfileImage src={profileImage || '/default-avatar.png'} alt="Profile" />
            <UploadOverlay className="upload-overlay">
              <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
                Upload Photo
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </UploadOverlay>
          </ProfileImageContainer>
        </ProfileSection>

        <ContactsSection>
          <ContactsTitle>Accessed Contacts</ContactsTitle>
          <ContactsTable>
            {mockContacts.map(contact => (
              <ContactRow 
                key={contact.id}
                onClick={() => navigate(`/contact/${contact.id}`)}
              >
                <ContactName>{contact.name}</ContactName>
                <RiskIndicator risk={contact.risk as 'low' | 'medium' | 'high'} />
              </ContactRow>
            ))}
          </ContactsTable>
        </ContactsSection>
      </MainContent>
    </Container>
  )
}

export default Dashboard 