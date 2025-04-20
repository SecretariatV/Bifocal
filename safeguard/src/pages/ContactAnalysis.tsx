import styled from '@emotion/styled'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useState, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  padding: 40px;
  padding-left: ${props => props.sidebarOpen ? '290px' : '40px'};
  background-color: #14161f;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 0;
  transition: padding-left 0.3s ease;
`

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const ContactPhoto = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 24px;
  flex-shrink: 0;
`

const ContactInfo = styled.div`
  h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`

const ChartContainer = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 32px;
`

const PatternCard = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background-color: rgba(30, 32, 41, 0.95);
    border-color: rgba(255, 255, 255, 0.2);
  }
`

const PatternTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
`

const PatternDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.6;
`

const mockTimelineData = [
  { date: '2024-01', risk: 0.45 },
  { date: '2024-02', risk: 0.62 },
  { date: '2024-03', risk: 0.58 },
  { date: '2024-04', risk: 0.75 },
]

const patterns = [
  {
    id: 'obsession',
    title: 'Obsession',
    description: 'Analyze patterns of obsessive behavior and excessive attention.'
  },
  {
    id: 'stalking',
    title: 'Stalking',
    description: 'Identify potential stalking behavior and monitoring patterns.'
  },
  {
    id: 'gaslighting',
    title: 'Gaslighting',
    description: 'Detect manipulative behavior and psychological manipulation attempts.'
  }
]

const ContactAnalysis = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Calculate chart width based on container width
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(800)

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth - 48
        setChartWidth(width)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handlePatternClick = (patternId: string) => {
    navigate(`/${patternId}/${id}`)
  }

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
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
              margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255, 255, 255, 0.6)" 
                tick={{ fill: '#FFFFFF' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.6)"
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                tick={{ fill: '#FFFFFF' }}
                label={{ 
                  value: 'Risk Level', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 0, 
                  fill: '#FFFFFF',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Risk Level']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(20, 22, 31, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
                itemStyle={{ color: '#FFFFFF' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Risk Level"
              />
            </LineChart>
          </ChartContainer>

          <PatternGrid>
            {patterns.map(pattern => (
              <PatternCard 
                key={pattern.id}
                onClick={() => handlePatternClick(pattern.id)}
              >
                <PatternTitle>{pattern.title}</PatternTitle>
                <PatternDescription>{pattern.description}</PatternDescription>
              </PatternCard>
            ))}
          </PatternGrid>
        </Content>
      </MainContent>
    </Container>
  )
}

export default ContactAnalysis 