import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: white;
`

const Panel = styled.div`
  flex: 1;
  padding: 2rem;
  &:first-of-type {
    border-right: 1px solid #e2e8f0;
  }
`

const Message = styled.div<{ highlighted?: boolean }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background-color: ${(props: { highlighted?: boolean }) => props.highlighted ? '#fef3c7' : '#f8fafc'};
  border: 1px solid ${(props: { highlighted?: boolean }) => props.highlighted ? '#fbbf24' : '#e2e8f0'};
`

const Pattern = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
`

const RiskMeter = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 65%;
    height: 100%;
    background: linear-gradient(to right, #22c55e, #eab308, #ef4444);
  }
`

const mockMessages = [
  {
    id: 1,
    text: "I need to know where you are right now.",
    highlighted: true,
    pattern: "Control/Surveillance"
  },
  {
    id: 2,
    text: "I'm just worried about you, that's all.",
    highlighted: true,
    pattern: "Emotional Manipulation"
  },
  {
    id: 3,
    text: "Can we meet up to talk?",
    highlighted: false
  }
]

const mockPatterns = [
  {
    id: 1,
    name: "Control/Surveillance",
    description: "Attempts to monitor or control location and activities",
    frequency: "High",
    severity: "Medium"
  },
  {
    id: 2,
    name: "Emotional Manipulation",
    description: "Using emotions to influence behavior",
    frequency: "Medium",
    severity: "High"
  }
]

const PatternDetection = () => {
  const { id } = useParams()

  return (
    <Container>
      <Panel>
        <h2>Recent Messages</h2>
        {mockMessages.map(message => (
          <Message key={message.id} highlighted={message.highlighted}>
            {message.text}
          </Message>
        ))}
      </Panel>

      <Panel>
        <h2>Detected Patterns</h2>
        {mockPatterns.map(pattern => (
          <Pattern key={pattern.id}>
            <h3>{pattern.name}</h3>
            <p>{pattern.description}</p>
            <div>Frequency: {pattern.frequency}</div>
            <div>Severity: {pattern.severity}</div>
          </Pattern>
        ))}
      </Panel>

      <RiskMeter />
    </Container>
  )
}

export default PatternDetection 