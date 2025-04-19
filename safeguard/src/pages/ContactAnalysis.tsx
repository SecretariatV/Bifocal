import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useRef, useState, useEffect } from 'react'

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
  min-width: 0; /* This prevents flex items from overflowing */
`

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`

const ContactPhoto = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e2e8f0;
  margin-right: 24px;
  flex-shrink: 0;
`

const ContactInfo = styled.div`
  h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }
`

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  width: 100%;
  margin-bottom: 32px;
  overflow: hidden;

  /* Make the chart responsive */
  .recharts-wrapper {
    width: 100% !important;
    height: auto !important;
    min-height: 400px;
    
    .recharts-surface {
      width: 100%;
      height: 100%;
    }
  }
`

const MessagesContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
`

const MessageBubble = styled.div<{ type: 'sent' | 'received' }>`
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  max-width: 70%;
  font-size: 14px;
  line-height: 1.5;
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
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  // Calculate chart width based on container width
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(800)

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth - 48 // subtract padding
        setChartWidth(width)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

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
        <NavItem 
          active={currentPath === '/settings'} 
          onClick={() => navigate('/settings')}
        >
          Settings
        </NavItem>
      </Sidebar>
      <MainContent>
        <Content>
          <Header>
            <ContactPhoto />
            <ContactInfo>
              <h1>Contact Analysis</h1>
              <p>ID: {id}</p>
            </ContactInfo>
          </Header>

          <ChartContainer ref={chartContainerRef}>
            <LineChart 
              width={chartWidth} 
              height={400} 
              data={mockTimelineData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="messages" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
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
      </MainContent>
    </Container>
  )
}

export default ContactAnalysis 