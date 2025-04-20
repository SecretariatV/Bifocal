import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import {
  Container,
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
  Divider
} from '../styles/theme'

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
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
        <Content>
          <Title>Gaslighting Analysis for Contact #{id}</Title>

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
            <SectionTitle>Detected Gaslighting Messages</SectionTitle>
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
            <SectionTitle>What is Gaslighting?</SectionTitle>
            <ExplanationText>
              Gaslighting is a form of psychological manipulation where a person or a group makes someone question their sanity, perception, or memories. Common tactics include denial, misdirection, trivializing, and countering. This can lead to confusion, self-doubt, and emotional distress in the victim.
            </ExplanationText>
          </Section>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Gaslighting 