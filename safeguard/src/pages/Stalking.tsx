import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Container,
  Sidebar,
  MainContent,
  Content,
  Title,
  Section,
  SectionTitle,
  MessageContainer,
  MessageWrapper,
  MessageBubble,
  MessageTime,
  SeverityLevel,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  SeverityContainer,
  SeverityIndicator,
  SeverityTitle,
  SeverityDescription,
  ExplanationText,
  NavItem,
  NavIcon,
  Divider
} from '../styles/theme'

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