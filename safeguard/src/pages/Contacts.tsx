import styled from '@emotion/styled'
import { useState } from 'react'
import Navigation from '../components/Navigation'
import { useNavigate } from 'react-router-dom'
import useContactsStore from '../store/contactsStore'

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

const ContactsContainer = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 1rem;
  overflow: hidden;
  margin: 2rem 0;
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
  box-shadow: 0 0 8px ${props => 
    props.risk === 'low' ? 'rgba(34, 197, 94, 0.4)' : 
    props.risk === 'medium' ? 'rgba(234, 179, 8, 0.4)' : 
    'rgba(239, 68, 68, 0.4)'
  };
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
    box-shadow: 0 0 12px ${props => 
      props.risk === 'low' ? 'rgba(34, 197, 94, 0.6)' : 
      props.risk === 'medium' ? 'rgba(234, 179, 8, 0.6)' : 
      'rgba(239, 68, 68, 0.6)'
    };
  }
`

const Contacts = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const selectedContacts = useContactsStore(state => state.selectedContacts)

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
        <Content>
          <Title>Contacts</Title>
          <ContactsContainer>
            <ContactsHeader>
              <ContactsTitle>
                <ContactsMainTitle>Recently Reviewed Contacts</ContactsMainTitle>
                <ContactsSubtitle>Review and manage your contact relationships</ContactsSubtitle>
              </ContactsTitle>
              <RelationshipLabel>Relationship</RelationshipLabel>
              <RiskLabel>Risk Level</RiskLabel>
            </ContactsHeader>
            {selectedContacts.map(contact => (
              <ContactRow key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)}>
                <ContactName>{contact.name}</ContactName>
                <RelationshipText>
                  {contact.relationship || (contact.email || contact.phone)}
                </RelationshipText>
                <RiskIndicatorContainer data-risk={`${contact.risk.charAt(0).toUpperCase() + contact.risk.slice(1)} Risk`}>
                  <RiskIndicator risk={contact.risk} />
                </RiskIndicatorContainer>
              </ContactRow>
            ))}
          </ContactsContainer>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Contacts 