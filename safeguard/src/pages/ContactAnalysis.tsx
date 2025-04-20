import React, { useState, useRef, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Navigation from '../components/Navigation'
import { SafetyContext } from '../App'
import { processedMessages } from '../data/messages'
import type { Message as BaseMessage } from '../data/messages'
import { analyzeMessages, type IncidentAnalysis } from '../services/mlAnalysis'

interface Message extends BaseMessage {
  severity?: number;
  highlighted?: boolean;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-left: ${props => props.sidebarOpen ? '420px' : '120px'};
  padding-right: 120px;
  transition: padding-left 0.3s ease;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  margin-top: 24px;
  background-color: rgba(20, 22, 31, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
`

const ContactPhoto = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  margin-right: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
`

const ContactInfo = styled.div`
  flex: 1;
  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  p {
    margin: 4px 0 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
  }
`

const TabContainer = styled.div`
  display: flex;
  padding: 12px 0;
  background: rgba(20, 22, 31, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.6)'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    color: ${props => props.active ? '#3b82f6' : '#fff'};
    background: ${props => props.active ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  }

  & + & {
    margin-left: 8px;
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px 0;
  background: rgba(20, 22, 31, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  height: 120px;

  &:hover .tooltip {
    opacity: 1;
    transform: translateY(0);
  }
`

const StatTitle = styled.h3`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 8px;
`

const StatValue = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`

const StatTooltip = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.2s ease;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  class: tooltip;
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 24px 0;
  gap: 48px;
`

const MessageContainer = styled.div`
  width: 360px;
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`

const Message = styled.div<{ isSent: boolean }>`
  max-width: 85%;
  align-self: ${props => props.isSent ? 'flex-end' : 'flex-start'};
  background: ${props => props.isSent ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  padding: 12px 16px;
  border-radius: ${props => props.isSent ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  font-size: 14px;
  line-height: 1.4;
  margin: 2px 0;
  transition: background-color 0.2s ease;
`

const MessageTime = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin: 16px 0 8px;
`

const AnalysisPanel = styled.div`
  flex: 1;
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`

const PatternItem = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`

const PatternTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
`

const PatternName = styled.h3`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
`

const ConfidenceScore = styled.span<{ score: number }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${props => {
    if (props.score >= 80) return 'rgba(239, 68, 68, 0.2)';
    if (props.score >= 50) return 'rgba(234, 179, 8, 0.2)';
    return 'rgba(34, 197, 94, 0.2)';
  }};
  color: ${props => {
    if (props.score >= 80) return '#ef4444';
    if (props.score >= 50) return '#eab308';
    return '#22c55e';
  }};
  font-weight: 500;
`

const PatternDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin: 0 0 12px;
  line-height: 1.5;
`

const ExampleMessage = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
  line-height: 1.4;
`

const EmotionalIndicators = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`

const EmotionalTag = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
`

const SeverityIndicator = styled.div<{ score: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px;
  border-radius: 6px;
  background: ${props => {
    if (props.score >= 4) return 'rgba(239, 68, 68, 0.1)';
    if (props.score >= 3) return 'rgba(234, 179, 8, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
  }};
`

const SeverityBar = styled.div<{ score: number }>`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => (props.score / 5) * 100}%;
    background: ${props => {
      if (props.score >= 4) return '#ef4444';
      if (props.score >= 3) return '#eab308';
      return '#22c55e';
    }};
    border-radius: 2px;
  }
`

const SeverityLabel = styled.span<{ score: number }>`
  font-size: 11px;
  color: ${props => {
    if (props.score >= 4) return '#ef4444';
    if (props.score >= 3) return '#eab308';
    return '#22c55e';
  }};
`

const DSMAnalysisPanel = styled.div`
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
  margin-top: 24px;
`

const DSMTraitTag = styled.span`
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
  font-weight: 500;
`

const RiskIndicator = styled.div<{ level: 'high' | 'medium' | 'low' }>`
  color: ${props => 
    props.level === 'high' ? '#ef4444' : 
    props.level === 'medium' ? '#eab308' : 
    '#22c55e'
  };
  font-size: 13px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: ${props => 
    props.level === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
    props.level === 'medium' ? 'rgba(234, 179, 8, 0.1)' : 
    'rgba(34, 197, 94, 0.1)'
  };
`

const DSMSectionTitle = styled.h3`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px;
`

const DSMSubTitle = styled.h4`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  margin: 24px 0 12px;
`

const PatternList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  
  li {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:before {
      content: "•";
      color: #3b82f6;
    }
  }
`

const MessagePreviewContainer = styled.div`
  width: 380px;
  height: 100%;
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
`;

const MessageListPreview = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const MessagePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageTimestamp = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
`;

const MessageBubble = styled.div`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  border-radius: 16px 16px 16px 4px;
  font-size: 14px;
  line-height: 1.5;
  max-width: 85%;
`;

const ContactAnalysis = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isHidden } = useContext(SafetyContext)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const getContactName = (id: string) => {
    switch (id) {
      case '1': return 'Mouni';
      case '2': return 'Shreya';
      case '3': return 'Sanya';
      default: return 'Contact';
    }
  }

  const contactName = getContactName(id || '')
  const messages = id ? processedMessages[getContactName(id).toLowerCase()] || [] : []
  const patterns = analyzeMessages(messages)

  return (
    <Container>
      {!isHidden && (
        <Navigation 
          isSidebarOpen={isSidebarOpen}
          onSidebarOpenChange={setIsSidebarOpen}
        />
      )}
      <MainContent sidebarOpen={!isHidden && isSidebarOpen}>
        <Header>
          <ContactPhoto>{contactName[0]}</ContactPhoto>
          <ContactInfo>
            <h1>{contactName}</h1>
            <p>Online</p>
          </ContactInfo>
        </Header>

        <ContentContainer>
          <MessageContainer>
            <MessageList>
              {messages
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((message, index, arr) => {
                  const showTimestamp = index === 0 || 
                    arr[index - 1].timestamp !== message.timestamp;
                  
                  return (
                    <React.Fragment key={index}>
                      {showTimestamp && (
                        <MessageTime>{message.timestamp}</MessageTime>
                      )}
                      <Message isSent={false}>
                        {message.text}
                      </Message>
                    </React.Fragment>
                  );
                })}
            </MessageList>
          </MessageContainer>
          <AnalysisPanel>
            {patterns.map((pattern, index) => (
              <PatternItem key={index}>
                <PatternTitle>
                  <PatternName>{pattern.type}</PatternName>
                  <ConfidenceScore score={pattern.confidence}>
                    {pattern.confidence}%
                  </ConfidenceScore>
                </PatternTitle>
                <PatternDescription>{pattern.description}</PatternDescription>
                
                <SeverityIndicator score={pattern.severity_score}>
                  <SeverityLabel score={pattern.severity_score}>
                    Severity Level {pattern.severity_score}/5
                  </SeverityLabel>
                  <SeverityBar score={pattern.severity_score} />
                </SeverityIndicator>

                {pattern.examples.map((example, i) => (
                  <ExampleMessage key={i}>"{example}"</ExampleMessage>
                ))}

                <EmotionalIndicators>
                  {pattern.emotional_indicators.map((indicator, i) => (
                    <EmotionalTag key={i}>{indicator}</EmotionalTag>
                  ))}
                </EmotionalIndicators>
              </PatternItem>
            ))}
          </AnalysisPanel>
        </ContentContainer>
      </MainContent>
    </Container>
  )
}

export default ContactAnalysis 