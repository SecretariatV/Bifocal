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

const ExplanationText = styled.p`
  color: #64748b;
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
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  background-color: ${props => props.active ? '#f1f5f9' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #3b82f6;
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748b;
`

const mockUserMessages = {
  '1': [
    { id: 1, type: 'received', text: "I saw you at the coffee shop today.", severity: 'medium' },
    { id: 2, type: 'received', text: "Why aren't you answering my calls? I know you're home.", severity: 'high' },
    { id: 3, type: 'sent', text: "Please stop following me.", severity: 'high' },
    { id: 4, type: 'received', text: "I just want to talk. I'll wait outside your house.", severity: 'high' },
    { id: 5, type: 'received', text: "That new person you're seeing isn't right for you.", severity: 'medium' }
  ],
  '2': [
    { id: 1, type: 'received', text: "Nice profile picture update.", severity: 'low' },
    { id: 2, type: 'received', text: "I know your daily schedule by heart now.", severity: 'high' },
    { id: 3, type: 'received', text: "Why did you block me? I'll find other ways to contact you.", severity: 'high' }
  ]
}

const severityLevels = [
  {
    level: 'low',
    title: 'Low Severity',
    description: 'Occasional unwanted contact or attention, minimal impact on daily life.'
  },
  {
    level: 'medium',
    title: 'Medium Severity',
    description: 'Regular monitoring or following, causing discomfort and anxiety.'
  },
  {
    level: 'high',
    title: 'High Severity',
    description: 'Intense pursuit, threats, or physical following, severe impact on safety.'
  }
]

const Stalking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])

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
          <Title>Stalking Analysis for Contact #{id}</Title>

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
            <SectionTitle>Detected Stalking Messages</SectionTitle>
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
            <SectionTitle>What is Stalking?</SectionTitle>
            <ExplanationText>
              Stalking is a pattern of repeated and unwanted attention, harassment, contact, or any other behavior directed at a specific person that would cause a reasonable person to feel fear or substantial emotional distress. This can include physical following, monitoring online activity, unwanted communications, and threats.
            </ExplanationText>
          </Section>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Stalking 