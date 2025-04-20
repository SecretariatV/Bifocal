import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

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

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
`

const Section = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const MessageBubble = styled.div<{ type: 'sent' | 'received' }>`
  padding: 16px 20px;
  border-radius: 16px;
  max-width: 70%;
  font-size: 16px;
  line-height: 1.5;
  position: relative;
  animation: fadeIn 0.5s ease-in-out;
  
  ${props => props.type === 'sent' ? `
    background-color: #3b82f6;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  ` : `
    background-color: #f1f5f9;
    color: #1e293b;
    border-bottom-left-radius: 4px;
  `}

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const ExplanationText = styled.p`
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
`

const DSMContainer = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
`

const DSMItem = styled.div`
  margin-bottom: 16px;
  padding-left: 20px;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #3b82f6;
  }
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  background-color: ${props => props.active ? '#f1f5f9' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #3b82f6;
  }
`

const SeverityLevel = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 16px;
  background-color: ${props => 
    props.level === 'low' ? '#dcfce7' : 
    props.level === 'medium' ? '#fef3c7' : 
    '#fee2e2'
  };
  color: ${props => 
    props.level === 'low' ? '#166534' : 
    props.level === 'medium' ? '#92400e' : 
    '#991b1b'
  };
`

const SeverityContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`

const SeverityIndicator = styled.div<{ active?: boolean }>`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: ${props => props.active ? '#f1f5f9' : 'white'};
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
  }
`

const SeverityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`

const SeverityDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
`

const mockUserMessages = {
  '1': [
    { id: 1, type: 'received', text: "You're overreacting. That never happened.", severity: 'high' },
    { id: 2, type: 'sent', text: "But I remember it clearly...", severity: 'low' },
    { id: 3, type: 'received', text: "You must be imagining things. You're too sensitive.", severity: 'high' },
    { id: 4, type: 'sent', text: "I know what I saw...", severity: 'low' },
    { id: 5, type: 'received', text: "You're just being paranoid. I would never do that.", severity: 'medium' }
  ],
  '2': [
    { id: 1, type: 'received', text: "I was just joking, can't you take a joke?", severity: 'medium' },
    { id: 2, type: 'sent', text: "That didn't feel like a joke...", severity: 'low' },
    { id: 3, type: 'received', text: "You're too sensitive about everything.", severity: 'high' }
  ]
}

const severityLevels = [
  {
    level: 'low',
    title: 'Low Severity',
    description: 'Occasional gaslighting attempts, may be unintentional or isolated incidents.'
  },
  {
    level: 'medium',
    title: 'Medium Severity',
    description: 'Regular gaslighting behavior, causing moderate distress and confusion.'
  },
  {
    level: 'high',
    title: 'High Severity',
    description: 'Frequent and intense gaslighting, causing significant psychological distress.'
  }
]

const Gaslighting = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would fetch messages for the specific user
    if (id && mockUserMessages[id as keyof typeof mockUserMessages]) {
      setUserMessages(mockUserMessages[id as keyof typeof mockUserMessages])
    }
  }, [id])

  const filteredMessages = selectedSeverity 
    ? userMessages.filter(msg => msg.severity === selectedSeverity)
    : userMessages

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
        <Content>
          <Title>Gaslighting Analysis for Contact #{id}</Title>

          <Section>
            <SectionTitle>Detected Gaslighting Messages</SectionTitle>
            <MessageContainer>
              {filteredMessages.map(message => (
                <div key={message.id}>
                  <SeverityLevel level={message.severity}>
                    {message.severity.charAt(0).toUpperCase() + message.severity.slice(1)} Severity
                  </SeverityLevel>
                  <MessageBubble type={message.type as 'sent' | 'received'}>
                    {message.text}
                  </MessageBubble>
                </div>
              ))}
            </MessageContainer>
          </Section>

          <Section>
            <SectionTitle>Severity Levels</SectionTitle>
            <SeverityContainer>
              {severityLevels.map(level => (
                <SeverityIndicator 
                  key={level.level}
                  active={selectedSeverity === level.level}
                  onClick={() => setSelectedSeverity(
                    selectedSeverity === level.level ? null : level.level
                  )}
                >
                  <SeverityTitle>{level.title}</SeverityTitle>
                  <SeverityDescription>{level.description}</SeverityDescription>
                </SeverityIndicator>
              ))}
            </SeverityContainer>
          </Section>

          <Section>
            <SectionTitle>What is Gaslighting?</SectionTitle>
            <ExplanationText>
              Gaslighting is a form of psychological manipulation where a person seeks to sow seeds of doubt in a targeted individual or in members of a targeted group, making them question their own memory, perception, or sanity. Using persistent denial, misdirection, contradiction, and lying, it attempts to destabilize the target and delegitimize the target's belief.
            </ExplanationText>
          </Section>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Gaslighting 