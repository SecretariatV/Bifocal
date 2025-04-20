import { useState } from 'react'
import styled from '@emotion/styled'
import { Global, css, keyframes } from '@emotion/react'
import { useParams } from 'react-router-dom'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background-color: #14161f;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`

const Panel = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: rgba(20, 22, 31, 0.95);
  color: #fff;
  &:first-of-type {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }

  h2 {
    color: #fff;
    margin-bottom: 1.5rem;
  }
`

const Message = styled.div<{ highlighted?: boolean }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background-color: ${(props: { highlighted?: boolean }) => props.highlighted ? 'rgba(115, 103, 240, 0.1)' : 'rgba(20, 22, 31, 0.95)'};
  border: 1px solid ${(props: { highlighted?: boolean }) => props.highlighted ? '#7367f0' : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
`

const Pattern = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background-color: rgba(20, 22, 31, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;

  h3 {
    color: #fff;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.5rem;
  }

  div {
    color: rgba(255, 255, 255, 0.6);
  }
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
        <Content>
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
        </Content>
        <RiskMeter />
      </Container>
    </>
  )
}

export default PatternDetection 