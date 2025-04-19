import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
`

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
`

const ContactPhoto = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e2e8f0;
  margin-right: 1rem;
`

const ChartContainer = styled.div`
  width: 100%;
  margin-bottom: 3rem;
`

const MessagesContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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

const mockMessages = [
  { id: 1, type: 'received', text: 'Hey, can we talk?' },
  { id: 2, type: 'sent', text: 'Sure, what\'s up?' },
  { id: 3, type: 'received', text: 'I need to discuss something important.' },
]

const ContactAnalysis = () => {
  const { id } = useParams()

  return (
    <Container>
      <Content>
        <Header>
          <ContactPhoto />
          <div>
            <h1>Contact Analysis</h1>
            <p>ID: {id}</p>
          </div>
        </Header>

        <ChartContainer>
          <LineChart width={1400} height={400} data={mockTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="messages" stroke="#3b82f6" />
            <Line type="monotone" dataKey="risk" stroke="#ef4444" />
          </LineChart>
        </ChartContainer>

        <MessagesContainer>
          {mockMessages.map(message => (
            <MessageBubble key={message.id} type={message.type as 'sent' | 'received'}>
              {message.text}
            </MessageBubble>
          ))}
        </MessagesContainer>
      </Content>
    </Container>
  )
}

export default ContactAnalysis 