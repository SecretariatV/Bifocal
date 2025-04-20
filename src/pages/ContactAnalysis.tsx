import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { contacts, messages } from '../data/contacts'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: white;
`

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`

const ContactPhoto = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e2e8f0;
  margin-right: 1rem;
`

const MetricsPanel = styled.div`
  width: 300px;
  padding: 2rem;
  background-color: #f8fafc;
  border-left: 1px solid #e2e8f0;
`

const Metric = styled.div`
  margin-bottom: 1.5rem;
`

const MetricLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`

const MessageBubble = styled.div<{ type: 'sent' | 'received' }>`
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  max-width: 70%;
  ${(props: { type: 'sent' | 'received' }) => props.type === 'sent' ? `
    background-color: #3b82f6;
    color: white;
    margin-left: auto;
  ` : `
    background-color: #f1f5f9;
    color: #1e293b;
  `}
`

const mockTimelineData = [
  { date: '2024-01', messages: 45, risk: 0.2 },
  { date: '2024-02', messages: 62, risk: 0.3 },
  { date: '2024-03', messages: 58, risk: 0.4 },
  { date: '2024-04', messages: 75, risk: 0.6 },
]

const ContactAnalysis = () => {
  const { id } = useParams()
  const contactId = id ? parseInt(id) : 0
  const contact = contacts.find(c => c.id === contactId)
  const contactMessages = messages.filter(m => m.contactId === contactId)

  if (!contact) {
    return <div>Contact not found</div>
  }

  return (
    <Container>
      <MainContent>
        <Header>
          <ContactPhoto />
          <div>
            <h1>{contact.name}</h1>
            <p>ID: {contact.id}</p>
          </div>
        </Header>

        <LineChart width={800} height={300} data={mockTimelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="messages" stroke="#3b82f6" />
          <Line type="monotone" dataKey="risk" stroke="#ef4444" />
        </LineChart>

        <div style={{ marginTop: '2rem' }}>
          {contactMessages.map(message => (
            <MessageBubble key={message.id} type={message.type}>
              {message.text}
            </MessageBubble>
          ))}
        </div>
      </MainContent>

      <MetricsPanel>
        <Metric>
          <MetricLabel>Communication Frequency</MetricLabel>
          <MetricValue>{contactMessages.length} msgs</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Concerning Language</MetricLabel>
          <MetricValue>12%</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Risk Assessment</MetricLabel>
          <MetricValue>{contact.risk}</MetricValue>
        </Metric>
      </MetricsPanel>
    </Container>
  )
}

export default ContactAnalysis 