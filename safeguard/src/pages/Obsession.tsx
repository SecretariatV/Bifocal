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