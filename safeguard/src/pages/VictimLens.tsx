import styled from '@emotion/styled'
import { useState, useEffect, useMemo } from 'react'
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
  overflow: hidden;
`

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
  letter-spacing: 0.05em;
`

const Section = styled.div`
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 8px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
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
  gap: 12px;
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
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
  padding: 20px;
  border-radius: 12px;
  background-color: ${props => props.active ? 'rgba(115, 103, 240, 0.1)' : 'rgba(20, 22, 31, 0.95)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgba(115, 103, 240, 0.1);
    transform: translateY(-2px);
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

const EmotionalResponseSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const ResponseButton = styled.button<{ selected?: boolean; intensity: 'low' | 'medium' | 'high' }>`
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: ${props => props.selected ? 
    props.intensity === 'low' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' :
    props.intensity === 'medium' ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' :
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.selected ? '#fff' : 
    props.intensity === 'low' ? '#22c55e' :
    props.intensity === 'medium' ? '#eab308' :
    '#ef4444'
  };
  border: 1px solid ${props =>
    props.intensity === 'low' ? 'rgba(34, 197, 94, 0.2)' :
    props.intensity === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
    'rgba(239, 68, 68, 0.2)'
  };
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.selected ?
      props.intensity === 'low' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' :
      props.intensity === 'medium' ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' :
      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
      'rgba(255, 255, 255, 0.1)'
    };
  }
`

const ResponseTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const TypeButton = styled.button<{ selected?: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: ${props => props.selected ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.selected ? '#fff' : '#3b82f6'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.selected ? 
      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 
      'rgba(255, 255, 255, 0.1)'
    };
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
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<any[]>([])
  const [messageResponses, setMessageResponses] = useState<Record<number, { intensity: string; type: string }>>({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Read messages and emotions from localStorage
    const storedEmotions = localStorage.getItem('conversationEmotions')
    const storedMessages = localStorage.getItem('conversationMessages')
    
    if (storedEmotions && storedMessages) {
      const emotions = JSON.parse(storedEmotions)
      const messages = JSON.parse(storedMessages)
      
      // Combine messages with their emotional responses
      const messagesWithEmotions = messages.map((msg: any) => ({
        ...msg,
        emotionalResponse: emotions[msg.id] || {}
      }))
      
      setUserMessages(messagesWithEmotions)
      setMessageResponses(emotions)
    } else {
      // Fallback to mock data if no stored data exists
      const allMessages = Object.values(mockUserMessages).flat()
      setUserMessages(allMessages)
    }
  }, [])

  const handleResponseSelect = (messageId: number, intensity: string, type: string) => {
    setMessageResponses(prev => ({
      ...prev,
      [messageId]: { intensity, type }
    }))
  }

  const filteredMessages = useMemo(() => {
    return userMessages.filter((message) => {
      if (!selectedResponse) return true
      const messageResponse = message.emotionalResponse || {}
      return messageResponse.intensity === selectedResponse || messageResponse.type === selectedResponse
    })
  }, [userMessages, selectedResponse])

  const getEmotionalPatterns = () => {
    const patterns: Record<string, number> = {}
    userMessages.forEach((message) => {
      const response = message.emotionalResponse
      if (response?.type) {
        patterns[response.type] = (patterns[response.type] || 0) + 1
      }
    })
    return patterns
  }

  const getIntensityDistribution = () => {
    const distribution: Record<string, number> = {}
    userMessages.forEach((message) => {
      const response = message.emotionalResponse
      if (response?.intensity) {
        distribution[response.intensity] = (distribution[response.intensity] || 0) + 1
      }
    })
    return distribution
  }

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
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