import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #1a1f36, #121629);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
  background: transparent;
  padding: 32px;
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
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: -0.02em;
`

const Section = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(to bottom, #3b82f6, #2563eb);
    border-radius: 2px;
    margin-right: 8px;
  }
`

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 32px 0;
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  padding: 20px 24px;
  border-radius: 16px;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  ${props => props.type === 'sent' ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-bottom-right-radius: 4px;
    margin-left: auto;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      clip-path: polygon(0 0, 0% 100%, 100% 100%);
    }

    ${props.isSelected && `
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 8px 20px rgba(37, 99, 235, 0.4);
      transform: scale(1.02);

      &:before {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      }
    `}
  ` : `
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    color: #fff;
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      clip-path: polygon(0 100%, 100% 100%, 100% 0);
    }

    ${props.isSelected && `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3);
      transform: scale(1.02);

      &:before {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
      }
    `}
  `}

  &:hover {
    transform: translateY(-2px) scale(1.01);
    ${props => props.type === 'sent' 
      ? 'box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);'
      : 'box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);'
    }
  }

  &:active {
    transform: scale(0.98);
  }
`

const MessageTime = styled.div`
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
  padding: 0 8px;
  text-align: right;
  font-weight: 500;
`

const SeverityLevel = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0.5;
  }
  
  ${props => {
    switch (props.level) {
      case 'low':
        return `
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
        `;
      case 'medium':
        return `
          background: linear-gradient(135deg, rgba(255, 209, 102, 0.2) 0%, rgba(255, 209, 102, 0.1) 100%);
          color: #ffd166;
          border: 1px solid rgba(255, 209, 102, 0.2);
          box-shadow: 0 2px 8px rgba(255, 209, 102, 0.1);
        `;
      case 'high':
        return `
          background: linear-gradient(135deg, rgba(239, 71, 111, 0.2) 0%, rgba(239, 71, 111, 0.1) 100%);
          color: #ef476f;
          border: 1px solid rgba(239, 71, 111, 0.2);
          box-shadow: 0 2px 8px rgba(239, 71, 111, 0.1);
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
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

const SeverityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

const SeverityIndicator = styled.div<{ active?: boolean }>`
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`

const SeverityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`

const SeverityDescription = styled.p`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
`

const ExplanationText = styled.p`
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 16px;
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

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'low':
        return '🟢';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🔥';
      default:
        return '';
    }
  };

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
        ))}
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

          <Divider />

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