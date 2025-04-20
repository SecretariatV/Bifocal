import { Message } from '../data/messages';

export interface MessageAnalysis {
  incidentType: string;
  emotionalState: string;
  severityScore: number;
  potentialCrime: boolean;
  timestamp: string;
  message: string;
}

export interface AnalysisSummary {
  totalMessages: number;
  averageSeverity: number;
  potentialCrimes: number;
  incidentTypes: { [key: string]: number };
  emotionalStates: { [key: string]: number };
  severityDistribution: { [key: number]: number };
  recentHighSeverityMessages: MessageAnalysis[];
}

export const analyzeMessages = (messages: Message[]): AnalysisSummary => {
  const summary: AnalysisSummary = {
    totalMessages: messages.length,
    averageSeverity: 0,
    potentialCrimes: 0,
    incidentTypes: {},
    emotionalStates: {},
    severityDistribution: {},
    recentHighSeverityMessages: []
  };

  let totalSeverity = 0;

  messages.forEach(msg => {
    // Count incident types
    if (!summary.incidentTypes[msg.incident_type]) {
      summary.incidentTypes[msg.incident_type] = 0;
    }
    summary.incidentTypes[msg.incident_type]++;

    // Count emotional states
    if (!summary.emotionalStates[msg.user_emotional_state]) {
      summary.emotionalStates[msg.user_emotional_state] = 0;
    }
    summary.emotionalStates[msg.user_emotional_state]++;

    // Track severity distribution
    if (!summary.severityDistribution[msg.severity_score]) {
      summary.severityDistribution[msg.severity_score] = 0;
    }
    summary.severityDistribution[msg.severity_score]++;

    // Track potential crimes
    if (msg.potential_crime === 'Y') {
      summary.potentialCrimes++;
    }

    // Calculate total severity for average
    totalSeverity += msg.severity_score;

    // Track high severity messages (severity >= 4)
    if (msg.severity_score >= 4) {
      summary.recentHighSeverityMessages.push({
        incidentType: msg.incident_type,
        emotionalState: msg.user_emotional_state,
        severityScore: msg.severity_score,
        potentialCrime: msg.potential_crime === 'Y',
        timestamp: msg.timestamp,
        message: msg.text
      });
    }
  });

  // Calculate average severity
  summary.averageSeverity = totalSeverity / messages.length;

  // Sort high severity messages by timestamp (most recent first)
  summary.recentHighSeverityMessages.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Limit to most recent 5 high severity messages
  summary.recentHighSeverityMessages = summary.recentHighSeverityMessages.slice(0, 5);

  return summary;
}; 