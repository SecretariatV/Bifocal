import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Global, css, keyframes } from '@emotion/react'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
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
  background-color: rgba(20, 22, 31, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 16px;
  height: 100%;
  overflow-y: auto;
`

const MainContent = styled.main`
  flex: 1;
  background-color: #14161f;
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
  color: #fff;
  margin-bottom: 32px;
  text-align: center;
`

const Section = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
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

const ExplanationText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
`

const DSMContainer = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const DSMItem = styled.div`
  margin-bottom: 16px;
  padding-left: 20px;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #3b82f6;
  }
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  color: ${props => props.active ? '#7367f0' : 'rgba(255, 255, 255, 0.6)'};
  background-color: ${props => props.active ? 'rgba(115, 103, 240, 0.1)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(115, 103, 240, 0.1);
    color: #7367f0;
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
  background-color: ${props => props.active ? 'rgba(115, 103, 240, 0.1)' : 'rgba(20, 22, 31, 0.95)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(115, 103, 240, 0.1);
  }
`

const SeverityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`

const SeverityDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
`

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

/**************************************************
 * 1) ANIMATED BACKGROUND BLOBS → UNSHACKLE‑STYLE  *
 **************************************************/
const float1 = keyframes`
  0%   { transform: translate(-15%, -10%) scale(1); }
  50%  { transform: translate(20%,  15%) scale(1.15); }
  100% { transform: translate(-15%, -10%) scale(1); }
`
const float2 = keyframes`
  0%   { transform: translate(10%, 60%)  scale(1); }
  50%  { transform: translate(-25%, 50%) scale(1.25); }
  100% { transform: translate(10%, 60%)  scale(1); }
`
const float3 = keyframes`
  0%   { transform: translate(70%, -30%) scale(1); }
  50%  { transform: translate(50%, 10%)  scale(1.1); }
  100% { transform: translate(70%, -30%) scale(1); }
`

const Blob = styled.div<{
  size: number
  gradient: string
  animation: ReturnType<typeof keyframes>
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  background: ${p => p.gradient};
  opacity: 0.5;
  filter: blur(120px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: ${p => p.animation} 30s ease-in-out infinite;
`

const beam1Animation = keyframes`
  0% { transform: translate(-50%, -50%) rotate(45deg); opacity: 0; }
  20% { opacity: 0.3; }
  40% { opacity: 0; }
  100% { transform: translate(50%, 50%) rotate(45deg); opacity: 0; }
`

const beam2Animation = keyframes`
  0% { transform: translate(50%, -50%) rotate(-45deg); opacity: 0; }
  20% { opacity: 0.25; }
  40% { opacity: 0; }
  100% { transform: translate(-50%, 50%) rotate(-45deg); opacity: 0; }
`

const Beam = styled.div<{ delay: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(115, 103, 240, 0.08), rgba(115, 103, 240, 0));
    animation: ${beam1Animation} 20s infinite;
    animation-delay: ${props => props.delay};
    transform-origin: 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(-45deg, rgba(34, 211, 238, 0.08), rgba(34, 211, 238, 0));
    animation: ${beam2Animation} 20s infinite;
    animation-delay: ${props => props.delay};
    transform-origin: 100% 0;
  }
`

const GlobalStyles = () => (
  <Global
    styles={css`
      html, body, #root {
        height: 100%;
        background-color: #14161f;
        background-image: 
          radial-gradient(circle at 0% 0%, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0) 50%),
          radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0) 50%),
          radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.1) 0%, rgba(244, 114, 182, 0) 50%);
      }
    `}
  />
)

const Gaslighting = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would fetch messages for the specific user
    if (id && mockUserMessages[id as keyof typeof mockUserMessages]) {
      setUserMessages(mockUserMessages[id as keyof typeof mockUserMessages])
    }
  }, [id])

  const filteredMessages = selectedSeverity 
    ? userMessages.filter(msg => msg.severity === selectedSeverity)
    : userMessages

  return (
    <>
      <GlobalStyles />
      <Beam delay="0s" />
      <Beam delay="4s" />
      {/* Blobs behind everything */}
      <Blob
        size={700}
        gradient={
          'radial-gradient(circle at 30% 30%, #7367f0 0%, rgba(115,103,240,0) 70%)'
        }
        animation={float1}
        style={{ top: '-250px', left: '-200px' }}
      />
      <Blob
        size={800}
        gradient={
          'radial-gradient(circle at 70% 30%, #f472b6 0%, rgba(244,114,182,0) 75%)'
        }
        animation={float2}
        style={{ bottom: '-300px', left: '20%' }}
      />
      <Blob
        size={650}
        gradient={
          'radial-gradient(circle at 50% 50%, #22d3ee 0%, rgba(34,211,238,0) 70%)'
        }
        animation={float3}
        style={{ top: '-200px', right: '-200px' }}
      />

      <Container>
        <Sidebar>
          <NavItem 
            active={currentPath === '/dashboard'} 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
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
            <Title>Gaslighting Analysis for Contact #{id}</Title>

            <Section>
              <SectionTitle>Detected Gaslighting Messages</SectionTitle>
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
              <SectionTitle>What is Gaslighting?</SectionTitle>
              <ExplanationText>
                Gaslighting is a form of psychological manipulation where a person seeks to sow seeds of doubt in a targeted individual or in members of a targeted group, making them question their own memory, perception, or sanity. Using persistent denial, misdirection, contradiction, and lying, it attempts to destabilize the target and delegitimize the target's belief.
              </ExplanationText>
            </Section>
          </Content>
        </MainContent>
      </Container>
    </>
  )
}

export default Gaslighting 