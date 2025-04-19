import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
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

  h1 {
    margin: 0 0 24px 0;
    font-size: 32px;
    font-weight: 600;
    color: #1e293b;
  }

  h2 {
    margin: 32px 0 16px 0;
    font-size: 24px;
    font-weight: 500;
    color: #1e293b;
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

const Contact = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

const RiskIndicator = styled.div<{ risk: 'low' | 'medium' | 'high' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: ${props => 
    props.risk === 'low' ? '#22c55e' : 
    props.risk === 'medium' ? '#eab308' : 
    '#ef4444'
  };
`

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  width: 100%;
  overflow: hidden;

  /* Make the chart responsive */
  .recharts-wrapper {
    width: 100% !important;
    height: auto !important;
    min-height: 300px;
    
    .recharts-surface {
      width: 100%;
      height: 100%;
    }
  }
`

const mockData = [
  { date: '2024-01', risk: 0.45 },
  { date: '2024-02', risk: 0.62 },
  { date: '2024-03', risk: 0.58 },
  { date: '2024-04', risk: 0.75 },
]

const mockContacts = [
  { id: 1, name: 'John Doe', risk: 'low' },
  { id: 2, name: 'Jane Smith', risk: 'medium' },
  { id: 3, name: 'Alice Johnson', risk: 'high' },
]

const Dashboard = () => {
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
          <h1>Risk Analysis</h1>
          <ChartContainer ref={chartContainerRef}>
            <BarChart 
              width={chartWidth} 
              height={300} 
              data={mockData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis 
                stroke="#64748b" 
                domain={[0, 1]} 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Risk Level']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="risk" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                name="Risk Level"
              />
            </BarChart>
          </ChartContainer>
          
          <h2>Contacts</h2>
          {mockContacts.map(contact => (
            <Contact 
              key={contact.id} 
              onClick={() => navigate(`/contact/${contact.id}`)}
            >
              <RiskIndicator risk={contact.risk as 'low' | 'medium' | 'high'} />
              {contact.name}
            </Contact>
          ))}
        </Content>
      </MainContent>
    </Container>
  )
}

export default Dashboard 