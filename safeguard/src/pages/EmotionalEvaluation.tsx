import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Navigation from '../components/Navigation';
import { SafetyContext } from '../App';
import { processedMessages } from '../data/messages';
import type { Message as BaseMessage } from '../data/messages';
import { analyzeMessages, type IncidentAnalysis } from '../services/mlAnalysis';

interface Message {
  time_stamp: string;
  user_name: string;
  narrative_entry: string;
  user_emotional_state: string;
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
  padding-left: ${props => props.sidebarOpen ? '280px' : '120px'};
  padding-right: 40px;
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

  h1 {
    color: #fff;
    font-size: 2.5rem;
    font-weight: 600;
    margin: 0;
  }
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
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .value {
    font-size: 2rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
  }

  .description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
  }
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
`;

const Content = styled.div`
  flex: 1;
  padding: 24px 0;
  color: #fff;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const EmotionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const EmotionCard = styled.div<{ isSelected: boolean }>`
  background: ${props => props.isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.5);
  }

  h4 {
    margin: 0;
    color: ${props => props.isSelected ? '#3b82f6' : '#fff'};
    font-size: 1.1rem;
  }

  p {
    margin: 8px 0 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
  }
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 24px;
  font-weight: 500;
`;

const MessageSection = styled.div`
  margin-top: 24px;
  background: rgba(26, 27, 38, 0.6);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
  backdrop-filter: blur(10px);
`;

const MessageHeader = styled.div`
  position: sticky;
  top: 0;
  background: rgba(26, 27, 38, 0.95);
  z-index: 10;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  margin-top: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const MessageCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  .message {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;

    .emotion {
      color: #60a5fa;
      font-weight: 500;
      padding: 4px 10px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 6px;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
  }
`;

const EmotionFilter = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ isSelected: boolean }>`
  background: ${props => props.isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.isSelected ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)'};
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  letter-spacing: 0.2px;

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.isSelected ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
    background: ${props => props.isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SupportiveText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 8px 0 16px;
  max-width: 800px;
`;

const EmotionalEvaluation: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    // Fetch and parse the CSV data
    fetch('/text_messages_to_v_analyzed.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n');
        const parsedMessages = rows.slice(1, -1).map(row => {
          const [time_stamp, user_name, narrative_entry, _, user_emotional_state] = row.split(',');
          return {
            time_stamp,
            user_name,
            narrative_entry: narrative_entry.replace(/"/g, ''),
            user_emotional_state
          };
        });
        setMessages(parsedMessages);
      })
      .catch(error => console.error('Error loading messages:', error));
  }, []);

  // Get unique emotional states from the messages
  const uniqueEmotions = Array.from(new Set(messages.map(m => m.user_emotional_state))).sort();
  const filteredMessages = selectedFilter === 'all' 
    ? messages 
    : messages.filter(m => m.user_emotional_state === selectedFilter);

  const emotions = [
    'Distressed',
    'Neutral',
    'Fearful',
    'Manipulated',
    'Happy',
    'Anxious',
    'On edge',
    'Concerned',
    'Powerless'
  ];

  return (
    <Container>
      <Navigation 
        onSidebarOpenChange={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <MainContent sidebarOpen={isSidebarOpen}>
        <Header>
          <h1>Emotional Evaluation</h1>
        </Header>
        <Content>
          <StatsGrid>
            <StatCard>
              <h3>Most Common Emotion</h3>
              <div className="value">
                {messages.length > 0 
                  ? Object.entries(
                      messages.reduce((acc, msg) => {
                        acc[msg.user_emotional_state] = (acc[msg.user_emotional_state] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[1] - a[1])[0][0]
                  : 'Loading...'}
              </div>
              <div className="description">Based on message analysis</div>
            </StatCard>
            <StatCard>
              <h3>Total Messages</h3>
              <div className="value">{messages.length}</div>
              <div className="description">Number of analyzed messages</div>
            </StatCard>
            <StatCard>
              <h3>Unique Emotions</h3>
              <div className="value">{uniqueEmotions.length}</div>
              <div className="description">Different emotional states detected</div>
            </StatCard>
          </StatsGrid>

          <MessageSection>
            <MessageHeader>
              <SectionTitle>Message Analysis</SectionTitle>
              <SupportiveText>
                Your emotions are completely justified! Below are messages that may have triggered these feelings - it's important to recognize these patterns and understand you're not alone in experiencing these emotions.
              </SupportiveText>
              <EmotionFilter>
                <FilterButton 
                  isSelected={selectedFilter === 'all'}
                  onClick={() => setSelectedFilter('all')}
                >
                  All Messages
                </FilterButton>
                {emotions.map(emotion => (
                  <FilterButton
                    key={emotion}
                    isSelected={selectedFilter === emotion}
                    onClick={() => setSelectedFilter(emotion)}
                  >
                    {emotion}
                  </FilterButton>
                ))}
              </EmotionFilter>
            </MessageHeader>
            <MessagesContainer>
              {filteredMessages.map((message, index) => (
                <MessageCard key={index}>
                  <div className="message">{message.narrative_entry}</div>
                  <div className="meta">
                    <span>{message.user_name} • {new Date(message.time_stamp).toLocaleDateString()}</span>
                    <span className="emotion">{message.user_emotional_state}</span>
                  </div>
                </MessageCard>
              ))}
            </MessagesContainer>
          </MessageSection>
        </Content>
      </MainContent>
    </Container>
  );
}

export default EmotionalEvaluation; 