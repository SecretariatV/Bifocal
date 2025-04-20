import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
  gap: 24px;
  margin-bottom: 24px;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 70%;
  
  &[data-type="received"] {
    align-self: flex-start;
  }
  
  &[data-type="sent"] {
    align-self: flex-end;
  }
`

const MessageBubble = styled.div<{ type: 'sent' | 'received' }>`
  padding: 16px 20px;
  border-radius: 16px;
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

const EmotionalResponse = styled.div<{ intensity: 'low' | 'medium' | 'high' }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
  background-color: ${props => 
    props.intensity === 'low' ? 'rgba(34, 197, 94, 0.1)' : 
    props.intensity === 'medium' ? 'rgba(234, 179, 8, 0.1)' : 
    'rgba(239, 68, 68, 0.1)'
  };
  color: ${props => 
    props.intensity === 'low' ? '#22c55e' : 
    props.intensity === 'medium' ? '#eab308' : 
    '#ef4444'
  };
`

const ResponseContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`

const ResponseIndicator = styled.div<{ active?: boolean }>`
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

const ResponseTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`

const ResponseDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
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

const EmotionalResponseSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const ResponseButton = styled.button<{ selected?: boolean; intensity: 'low' | 'medium' | 'high' }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: ${props => 
    props.selected ? 
      props.intensity === 'low' ? 'rgba(34, 197, 94, 0.2)' : 
      props.intensity === 'medium' ? 'rgba(234, 179, 8, 0.2)' : 
      'rgba(239, 68, 68, 0.2)' : 
    'transparent'
  };
  color: ${props => 
    props.intensity === 'low' ? '#22c55e' : 
    props.intensity === 'medium' ? '#eab308' : 
    '#ef4444'
  };
  border: 1px solid ${props => 
    props.intensity === 'low' ? '#22c55e' : 
    props.intensity === 'medium' ? '#eab308' : 
    '#ef4444'
  };

  &:hover {
    background-color: ${props => 
      props.intensity === 'low' ? 'rgba(34, 197, 94, 0.1)' : 
      props.intensity === 'medium' ? 'rgba(234, 179, 8, 0.1)' : 
      'rgba(239, 68, 68, 0.1)'
    };
  }
`

const ResponseTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const TypeButton = styled.button<{ selected?: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #3b82f6;
  background-color: ${props => props.selected ? 'rgba(59, 130, 246, 0.2)' : 'transparent'};
  color: #3b82f6;

  &:hover {
    background-color: rgba(59, 130, 246, 0.1);
  }
`

const mockUserMessages = {
  '1': [
    { 
      id: 1, 
      type: 'received', 
      text: "I can't stop thinking about you.",
      timestamp: "2024-04-20T10:00:00Z"
    },
    { 
      id: 2, 
      type: 'sent', 
      text: "I need some space right now.",
      timestamp: "2024-04-20T10:05:00Z"
    },
    { 
      id: 3, 
      type: 'received', 
      text: "You're the only one who understands me.",
      timestamp: "2024-04-20T10:10:00Z"
    }
  ]
}

const emotionalIntensities = [
  { level: 'low', label: 'Mild' },
  { level: 'medium', label: 'Moderate' },
  { level: 'high', label: 'Intense' }
]

const emotionalTypes = [
  { type: 'fear', label: 'Fear/Anxiety' },
  { type: 'boundary-setting', label: 'Boundary Setting' },
  { type: 'pressure', label: 'Emotional Pressure' },
  { type: 'confusion', label: 'Confusion' },
  { type: 'frustration', label: 'Frustration' }
]

const VictimLens = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])
  const [messageResponses, setMessageResponses] = useState<Record<number, { intensity: string; type: string }>>({})

  useEffect(() => {
    const allMessages = Object.values(mockUserMessages).flat()
    setUserMessages(allMessages)
  }, [])

  const handleResponseSelect = (messageId: number, intensity: string, type: string) => {
    setMessageResponses(prev => ({
      ...prev,
      [messageId]: { intensity, type }
    }))
  }

  const filteredMessages = selectedResponse 
    ? userMessages.filter(msg => messageResponses[msg.id]?.type === selectedResponse)
    : userMessages

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
          active={currentPath === '/analysis'} 
          onClick={() => navigate('/analysis')}
        >
          Analysis
        </NavItem>
      </Sidebar>
      <MainContent>
        <Content>
          <Title>Your Emotional Patterns</Title>

          <Section>
            <SectionTitle>How did these messages make you feel?</SectionTitle>
            <MessageContainer>
              {filteredMessages.map(message => (
                <MessageWrapper key={message.id} data-type={message.type}>
                  <MessageBubble type={message.type as 'sent' | 'received'}>
                    {message.text}
                  </MessageBubble>
                  <EmotionalResponseSelector>
                    {emotionalIntensities.map(intensity => (
                      <ResponseButton
                        key={intensity.level}
                        intensity={intensity.level as 'low' | 'medium' | 'high'}
                        selected={messageResponses[message.id]?.intensity === intensity.level}
                        onClick={() => handleResponseSelect(message.id, intensity.level, messageResponses[message.id]?.type || '')}
                      >
                        {intensity.label}
                      </ResponseButton>
                    ))}
                  </EmotionalResponseSelector>
                  <ResponseTypeSelector>
                    {emotionalTypes.map(type => (
                      <TypeButton
                        key={type.type}
                        selected={messageResponses[message.id]?.type === type.type}
                        onClick={() => handleResponseSelect(message.id, messageResponses[message.id]?.intensity || '', type.type)}
                      >
                        {type.label}
                      </TypeButton>
                    ))}
                  </ResponseTypeSelector>
                </MessageWrapper>
              ))}
            </MessageContainer>
          </Section>

          <Section>
            <SectionTitle>Filter by Response Type</SectionTitle>
            <ResponseContainer>
              {emotionalTypes.map(type => (
                <ResponseIndicator 
                  key={type.type}
                  active={selectedResponse === type.type}
                  onClick={() => setSelectedResponse(
                    selectedResponse === type.type ? null : type.type
                  )}
                >
                  <ResponseTitle>{type.label}</ResponseTitle>
                </ResponseIndicator>
              ))}
            </ResponseContainer>
          </Section>

          <Section>
            <SectionTitle>Your Communication Evolution</SectionTitle>
            <ResponseDescription>
              Based on your selected responses, we can see:
              <ul>
                <li>How you're feeling about different types of messages</li>
                <li>Patterns in your emotional responses</li>
                <li>Your boundary-setting attempts</li>
                <li>Areas where you might need more support</li>
              </ul>
            </ResponseDescription>
          </Section>
        </Content>
      </MainContent>
    </Container>
  )
}

export default VictimLens 