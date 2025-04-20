import React from 'react';
import styled from 'styled-components';
import { Message } from '../data/messages';
import { analyzeMessages, AnalysisSummary } from '../services/analysisService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Panel = styled.div`
  width: 420px;
  height: 100%;
  background: #FFFFFF;
  border-left: 1px solid #E5E7EB;
  padding: 24px;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.div`
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
`;

const ListItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ListItemTitle = styled.div`
  font-weight: 500;
  color: #111827;
`;

const ListItemSubtitle = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

const Badge = styled.span<{ severity?: number }>`
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    if (props.severity >= 4) return '#FEE2E2';
    if (props.severity >= 3) return '#FEF3C7';
    return '#DBEAFE';
  }};
  color: ${props => {
    if (props.severity >= 4) return '#991B1B';
    if (props.severity >= 3) return '#92400E';
    return '#1E40AF';
  }};
`;

interface Props {
  messages: Message[];
}

export const AnalysisPanel: React.FC<Props> = ({ messages }) => {
  const analysis = analyzeMessages(messages);

  const severityData = Object.entries(analysis.severityDistribution).map(([score, count]) => ({
    score: Number(score),
    count
  })).sort((a, b) => a.score - b.score);

  return (
    <Panel>
      <Section>
        <SectionTitle>Overview</SectionTitle>
        <StatGrid>
          <StatCard>
            <StatLabel>Total Messages</StatLabel>
            <StatValue>{analysis.totalMessages}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Average Severity</StatLabel>
            <StatValue>{analysis.averageSeverity.toFixed(1)}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Potential Crimes</StatLabel>
            <StatValue>{analysis.potentialCrimes}</StatValue>
          </StatCard>
        </StatGrid>
      </Section>

      <Section>
        <SectionTitle>Severity Distribution</SectionTitle>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section>
        <SectionTitle>High Severity Messages</SectionTitle>
        <List>
          {analysis.recentHighSeverityMessages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemHeader>
                <Badge severity={msg.severityScore}>Severity {msg.severityScore}</Badge>
                {msg.potentialCrime && (
                  <Badge severity={5}>Potential Crime</Badge>
                )}
              </ListItemHeader>
              <ListItemTitle>{msg.incidentType}</ListItemTitle>
              <ListItemSubtitle>{msg.emotionalState}</ListItemSubtitle>
              <ListItemSubtitle>{msg.message}</ListItemSubtitle>
            </ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Incident Types</SectionTitle>
        <List>
          {Object.entries(analysis.incidentTypes).map(([type, count], index) => (
            <ListItem key={index}>
              <ListItemTitle>{type}</ListItemTitle>
              <ListItemSubtitle>{count} messages</ListItemSubtitle>
            </ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Emotional States</SectionTitle>
        <List>
          {Object.entries(analysis.emotionalStates).map(([state, count], index) => (
            <ListItem key={index}>
              <ListItemTitle>{state}</ListItemTitle>
              <ListItemSubtitle>{count} messages</ListItemSubtitle>
            </ListItem>
          ))}
        </List>
      </Section>
    </Panel>
  );
}; 