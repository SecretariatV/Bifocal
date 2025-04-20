import React, { useState, useRef, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Navigation from '../components/Navigation'
import { SafetyContext } from '../App'
import { processedMessages } from '../data/messages'
import type { Message as BaseMessage } from '../data/messages'
import { analyzeMessages, type IncidentAnalysis } from '../services/mlAnalysis'
import { parse } from 'papaparse'

interface Message extends BaseMessage {
  severity?: number;
  highlighted?: boolean;
}

interface CSVRow {
  [key: number]: string;
}

interface CSVMessage {
  time_stamp: string;
  user_name: string;
  narrative_entry: string;
  incident_type: string;
  user_emotional_state: string;
  severity_score: string;
  potential_crime: string;
}

interface IncidentMessage {
  text: string;
  timestamp: string;
  severity: number;
  emotionalState: string;
  confidence: number;
}

interface IncidentType {
  type: string;
  count: number;
  color: string;
  messages: IncidentMessage[];
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
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  padding-left: ${props => props.sidebarOpen ? '420px' : '120px'};
  padding-right: 120px;
  transition: padding-left 0.3s ease;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
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
  display: flex;
  gap: 48px;
  min-height: fit-content;
`

const MessageContainer = styled.div`
  width: 460px;
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
`

const MessageList = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
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

const IncidentSquaresContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
`

const IncidentTypeSquares = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`

const IncidentSquare = styled.div<{ color: string }>`
  width: 200px;
  height: 200px;
  background-color: ${props => props.color};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;

  h2 {
    font-size: 48px;
    margin: 0;
  }

  p {
    font-size: 24px;
    margin: 0;
  }
`

const DiagnosisTextBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;
  min-height: 200px;
  color: white;

  h2 {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding-left: 20px;
    position: relative;
    margin-bottom: 16px;
    line-height: 1.5;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
    }
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
  background: #1a1c25;
  border-radius: 16px;
  padding: 32px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const ModalTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: white;
  }
`

const MessageItem = styled.div<{ color: string }>`
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.color};
  margin-bottom: 16px;
`

const MessageText = styled.p`
  color: white;
  margin: 0 0 8px 0;
  font-size: 14px;
`

const MessageDetails = styled.div`
  display: flex;
  gap: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`

const SeverityBadge = styled.span<{ severity: number }>`
  padding: 4px 8px;
  border-radius: 12px;
  background: ${props => {
    if (props.severity >= 4) return 'rgba(239, 68, 68, 0.2)';
    if (props.severity >= 3) return 'rgba(234, 179, 8, 0.2)';
    return 'rgba(34, 197, 94, 0.2)';
  }};
  color: ${props => {
    if (props.severity >= 4) return '#ef4444';
    if (props.severity >= 3) return '#eab308';
    return '#22c55e';
  }};
`

const getColorForIncidentType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'emotional abuse':
      return '#ef4444';
    case 'stalking':
      return '#f97316';
    case 'gaslighting':
      return '#eab308';
    case 'emotional manipulation':
      return '#8b5cf6';
    case 'controlling':
      return '#ec4899';
    case 'friendly':
      return '#22c55e';
    case 'neutral':
      return '#64748b';
    default:
      return '#64748b';
  }
}

const getPotentialCrime = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'stalking':
      return 'Criminal Harassment - Stalking (Section 264 of the Criminal Code)';
    case 'gaslighting':
      return 'Psychological Abuse (Section 264.1 of the Criminal Code)';
    case 'verbal threats':
      return 'Uttering Threats (Section 264.1 of the Criminal Code)';
    default:
      return 'No specific criminal offense identified';
  }
}

const GraphContainer = styled.div`
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  width: 100%;
`

const GraphTitle = styled.h2`
  color: #fff;
  font-size: 18px;
  margin: 0 0 24px 0;
`

interface DataPoint {
  date: string;
  severity: number;
  message: string;
}

const ContactAnalysis = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isHidden } = useContext(SafetyContext)
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null)
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([])
  const [graphData, setGraphData] = useState<DataPoint[]>([])

  const getContactName = (id: string) => {
    switch (id) {
      case '1': return 'Mouni';
      case '2': return 'Shreya';
      case '3': return 'Sanya';
      default: return 'Contact';
    }
  }

  const getDiagnosisText = (contactName: string) => {
    switch (contactName) {
      case 'Mouni':
        return `<h2>**Antisocial Personality Disorder or Narcissistic Personality Disorder**</h2>
<ul>
<li>Traits like emotional abuse, gaslighting, and manipulation suggest high Antagonism, often seen in Cluster B disorders.</li>

<li>These behaviors align with Antisocial PD (manipulativeness, hostility) or Narcissistic PD (control, grandiosity).</li>

<li>A formal diagnosis requires more context and must be made by a licensed mental health professional.</li>
</ul>`;

      case 'Sanya':
        return `<h2>**No diagnosable disorder based on available traits**</h2>
<ul>
<li>The trait "friendly" does not correspond with any personality disorder described in the DSM.</li>

<li>It contrasts with disorders like Schizotypal PD, which involve social withdrawal or odd behaviors.</li>

<li>Diagnosing based on a single positive trait is not clinically valid and lacks sufficient criteria.</li>
</ul>`;

      case 'Shreya':
        return `<h2>**Antisocial Personality Disorder**</h2>
<ul>
<li>Traits like stalking, controlling behavior, and manipulation indicate disregard for others' safety and autonomy.</li>

<li>These align more strongly with Antisocial PD, though some overlap with Narcissistic PD exists.</li>

<li>Diagnosis requires a comprehensive clinical evaluation, not just behavior-based observation.</li>
</ul>`;

      default:
        return '';
    }
  };

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch('/text_messages_to_v_analyzed.csv');
        const csvText = await response.text();
        const parseResult = parse<CSVRow>(csvText, {
          header: false,
          skipEmptyLines: true
        });

        const contactName = getContactName(id || '');
        const contactMessages = parseResult.data
          .map(row => ({
            time_stamp: row[0],
            user_name: row[1],
            narrative_entry: row[2],
            incident_type: row[3],
            user_emotional_state: row[4],
            severity_score: row[5],
            potential_crime: row[6]
          }))
          .filter(msg => msg.user_name === contactName);

        // Process data for the graph
        const graphPoints = contactMessages.map(msg => ({
          date: msg.time_stamp,
          severity: parseInt(msg.severity_score),
          message: msg.narrative_entry
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setGraphData(graphPoints);

        // Group messages by incident type
        const groupedMessages = contactMessages.reduce<Record<string, IncidentMessage[]>>((acc, msg) => {
          if (!acc[msg.incident_type]) {
            acc[msg.incident_type] = [];
          }
          acc[msg.incident_type].push({
            text: msg.narrative_entry,
            timestamp: msg.time_stamp,
            severity: parseInt(msg.severity_score),
            emotionalState: msg.user_emotional_state,
            confidence: 100
          });
          return acc;
        }, {});

        // Convert to array and sort by count
        let processedIncidents: IncidentType[] = Object.entries(groupedMessages)
          .map(([type, messages]) => ({
            type,
            count: messages.length,
            color: getColorForIncidentType(type),
            messages
          }))
          .sort((a, b) => b.count - a.count);

        // Only filter out friendly/neutral for non-Sanya contacts
        if (contactName !== 'Sanya') {
          processedIncidents = processedIncidents
            .filter(incident => incident.type.toLowerCase() !== 'neutral' && incident.type.toLowerCase() !== 'friendly');
        }

        setIncidentTypes(processedIncidents.slice(0, 3)); // Take top 3 after filtering
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };

    loadCSVData();
  }, [id]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>{payload[0].payload.message}</p>
          <p style={{ margin: '0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Severity: {payload[0].value}/5
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            {new Date(payload[0].payload.date).toLocaleDateString()}
          </p>
        </div>
      );
    }
    return null;
  };

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
          <ContactPhoto>{getContactName(id || '')[0]}</ContactPhoto>
          <ContactInfo>
            <h1>{getContactName(id || '')}</h1>
            <p>ID: {id}</p>
          </ContactInfo>
        </Header>

        <DiagnosisTextBox 
          dangerouslySetInnerHTML={{ 
            __html: getDiagnosisText(getContactName(id || '')) 
          }} 
        />

        <GraphContainer>
          <GraphTitle>Message Severity Over Time</GraphTitle>
          <LineChart
            width={1000}
            height={200}
            data={graphData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis 
              domain={[0, 5]} 
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="severity"
              stroke="#3b82f6"
              dot={{
                stroke: '#3b82f6',
                strokeWidth: 2,
                r: 4,
                fill: '#1a1c25'
              }}
              activeDot={{
                stroke: '#3b82f6',
                strokeWidth: 2,
                r: 6,
                fill: '#1a1c25'
              }}
            />
          </LineChart>
        </GraphContainer>

        <ContentContainer>
          <MessageContainer>
            <MessageList>
              {processedMessages[getContactName(id || '').toLowerCase()]?.map((message, index, arr) => {
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

          <IncidentSquaresContainer>
            {incidentTypes.map((incident, index) => (
              <IncidentSquare 
                key={index}
                color={incident.color}
                onClick={() => setSelectedIncident(incident)}
              >
                <h2>{incident.count}</h2>
                <p>{incident.type}</p>
              </IncidentSquare>
            ))}
          </IncidentSquaresContainer>
        </ContentContainer>

        {selectedIncident && (
          <ModalOverlay onClick={() => setSelectedIncident(null)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>{selectedIncident.type} Incidents</ModalTitle>
                <CloseButton onClick={() => setSelectedIncident(null)}>×</CloseButton>
              </ModalHeader>
              
              {selectedIncident.messages.map((message, index) => (
                <MessageItem key={index} color={selectedIncident.color}>
                  <MessageText>{message.text}</MessageText>
                  <MessageDetails>
                    <span>{message.timestamp}</span>
                    <SeverityBadge severity={message.severity}>
                      Severity: {message.severity}/5
                    </SeverityBadge>
                    <span>Emotional State: {message.emotionalState}</span>
                  </MessageDetails>
                </MessageItem>
              ))}
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </Container>
  );
};

export default ContactAnalysis 