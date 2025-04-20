import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
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
  background-color: rgba(20, 22, 31, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 16px;
  height: 100%;
  overflow-y: auto;
`

const MainContent = styled.main`
  flex: 1;
  background-color: #14161f;
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
  color: #fff;
  margin-bottom: 32px;
  text-align: center;
`

const Section = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
  padding: 0 16px;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 70%;
  
  &[data-type="received"] {
    align-self: flex-start;
  }
  
  &[data-type="sent"] {
    align-self: flex-end;
  }
`

const MessageBubble = styled.div<{ type: 'sent' | 'received'; isSelected?: boolean }>`
  padding: 16px 20px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  
  ${props => props.type === 'sent' ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-bottom-right-radius: 4px;
    margin-left: auto;
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      clip-path: polygon(0 0, 0% 100%, 100% 100%);
      transition: all 0.3s ease;
    }

    ${props.isSelected && `
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
      transform: scale(1.02);

      &:before {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      }
    `}
  ` : `
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #1e293b;
    border-bottom-left-radius: 4px;
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      clip-path: polygon(0 100%, 100% 100%, 100% 0);
      transition: all 0.3s ease;
    }

    ${props.isSelected && `
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.5);
      transform: scale(1.02);

      &:before {
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      }
    `}
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }

  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 22px;
    background: ${props => props.type === 'sent' ? 
      'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 
      'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'};
    opacity: 0;
    z-index: -1;
    transition: all 0.3s ease;
  }

  ${props => props.isSelected && `
    &::after {
      opacity: 0.5;
      animation: pulseHighlight 2s infinite;
    }
  `}

  @keyframes pulseHighlight {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
`

const MessageTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
  padding: 0 8px;
`

const SeverityLevel = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.level) {
      case 'low':
        return `
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
        `;
      case 'medium':
        return `
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        `;
      case 'high':
        return `
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }
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
  background-color: ${props => props.active ? 'rgba(115, 103, 240, 0.1)' : 'rgba(20, 22, 31, 0.95)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(115, 103, 240, 0.1);
  }
`

const SeverityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`

const SeverityDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
`

const ExplanationText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  color: ${props => props.active ? '#7367f0' : 'rgba(255, 255, 255, 0.6)'};
  background-color: ${props => props.active ? 'rgba(115, 103, 240, 0.1)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(115, 103, 240, 0.1);
    color: #7367f0;
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`

const mockUserMessages = {
  '1': [
    { id: 1, type: 'received', text: "I can't stop thinking about you.", severity: 'medium' },
    { id: 2, type: 'received', text: "You're the only one who understands me.", severity: 'low' },
    { id: 3, type: 'received', text: "I need to talk to you right now.", severity: 'medium' },
    { id: 4, type: 'received', text: "My life has no meaning without you.", severity: 'high' },
    { id: 5, type: 'received', text: "I'll do anything to be with you.", severity: 'high' }
  ],
  '2': [
    { id: 1, type: 'received', text: "I've been saving all your messages.", severity: 'medium' },
    { id: 2, type: 'received', text: "Nobody else matters but you.", severity: 'high' },
    { id: 3, type: 'received', text: "We're meant to be together forever.", severity: 'high' }
  ]
}

const severityLevels = [
  {
    level: 'low',
    title: 'Low Severity',
    description: 'Mild fixation or attachment, expressing strong interest but respecting boundaries.'
  },
  {
    level: 'medium',
    title: 'Medium Severity',
    description: 'Intense preoccupation, frequent contact attempts, some boundary crossing.'
  },
  {
    level: 'high',
    title: 'High Severity',
    description: 'Extreme fixation, possessive behavior, complete disregard for boundaries.'
  }
]

const Obsession = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)

  useEffect(() => {
    if (id && mockUserMessages[id as keyof typeof mockUserMessages]) {
      setUserMessages(mockUserMessages[id as keyof typeof mockUserMessages])
    }
  }, [id])

  const filteredMessages = selectedSeverity 
    ? userMessages.filter(msg => msg.severity === selectedSeverity)
    : userMessages

  const stats = {
    totalIncidents: userMessages.length,
    highSeverity: userMessages.filter(msg => msg.severity === 'high').length,
    averageSeverity: userMessages.length > 0 
      ? (userMessages.reduce((acc, msg) => {
          const severityScore = msg.severity === 'high' ? 3 : msg.severity === 'medium' ? 2 : 1
          return acc + severityScore
        }, 0) / userMessages.length).toFixed(1)
      : '0'
  }

  const handleMessageClick = (messageId: number) => {
    setSelectedMessageId(messageId === selectedMessageId ? null : messageId)
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
          active={currentPath === '/analysis'} 
          onClick={() => navigate('/analysis')}
        >
          Analysis
        </NavItem>
      </Sidebar>
      <MainContent>
        <Content>
          <Title>Obsession Analysis for Contact #{id}</Title>

          <Section>
            <SectionTitle>Key Statistics</SectionTitle>
            <StatsContainer>
              <StatCard>
                <StatValue>{stats.totalIncidents}</StatValue>
                <StatLabel>Total Incidents</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.highSeverity}</StatValue>
                <StatLabel>High Severity Incidents</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.averageSeverity}</StatValue>
                <StatLabel>Average Severity Score</StatLabel>
              </StatCard>
            </StatsContainer>
          </Section>

          <Section>
            <SectionTitle>Detected Obsessive Messages</SectionTitle>
            <MessageContainer>
              {filteredMessages.map(message => (
                <MessageWrapper key={message.id} data-type={message.type}>
                  <SeverityLevel level={message.severity}>
                    {message.severity.charAt(0).toUpperCase() + message.severity.slice(1)} Severity
                  </SeverityLevel>
                  <MessageBubble 
                    type={message.type as 'sent' | 'received'}
                    isSelected={selectedMessageId === message.id}
                    onClick={() => handleMessageClick(message.id)}
                  >
                    {message.text}
                  </MessageBubble>
                  <MessageTime>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </MessageTime>
                </MessageWrapper>
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
            <SectionTitle>What is Obsessive Behavior?</SectionTitle>
            <ExplanationText>
              Obsessive behavior in relationships manifests as an intense preoccupation with another person, characterized by persistent thoughts, excessive attention, and a strong desire for contact or control. This can include constant messaging, emotional dependency, and difficulty accepting boundaries or rejection.
            </ExplanationText>
          </Section>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Obsession 