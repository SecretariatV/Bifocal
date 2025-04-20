import type { Message } from '../data/messages';

export interface IncidentAnalysis {
  type: string;
  confidence: number;
  description: string;
  examples: string[];
  severity_score: number;
  emotional_indicators: string[];
}

// This will be replaced with actual ML model predictions
// For now, we'll use a simple mapping based on keyword matching
const INCIDENT_DESCRIPTIONS: { [key: string]: string } = {
  'Coercive Control': 'Attempts to monitor or direct actions and decisions',
  'Gaslighting': 'Distorts reality to create doubt and confusion',
  'Digital Harassment': 'Uses online platforms to intimidate or monitor',
  'Verbal Threats': 'Uses threatening language or implied harm',
  'Emotional Manipulation': 'Uses emotional appeals to influence behavior',
  'Isolation': 'Attempts to separate from support systems',
  'Surveillance': 'Monitors activities and movements'
};

const EMOTIONAL_INDICATORS: { [key: string]: string[] } = {
  'Coercive Control': ['on edge', 'anxious', 'fearful'],
  'Gaslighting': ['confused', 'self-doubt', 'hopeless'],
  'Digital Harassment': ['violated', 'exposed', 'unsafe'],
  'Verbal Threats': ['threatened', 'intimidated', 'scared'],
  'Emotional Manipulation': ['guilty', 'obligated', 'trapped'],
  'Isolation': ['lonely', 'dependent', 'helpless'],
  'Surveillance': ['watched', 'paranoid', 'restricted']
};

// Analyze text for severity indicators
function analyzeSeverity(text: string): number {
  const severityIndicators = {
    high: ['never', 'always', 'must', 'have to', 'threatening', 'scared', 'afraid'],
    medium: ['should', 'need to', 'why did you', 'what were you'],
    low: ['please', 'could you', 'would you', 'maybe']
  };

  const textLower = text.toLowerCase();
  let severityScore = 3; // Default medium severity

  // Check for high severity indicators
  if (severityIndicators.high.some(indicator => textLower.includes(indicator))) {
    severityScore = 5;
  }
  // Check for low severity indicators
  else if (severityIndicators.low.some(indicator => textLower.includes(indicator))) {
    severityScore = 2;
  }

  return severityScore;
}

function getConfidenceScore(frequency: number, severity: number): number {
  // Combine frequency and severity for confidence score
  const baseScore = Math.min(95, Math.max(60, frequency * 20 + 60));
  const severityAdjustment = (severity - 3) * 5; // Adjust confidence based on severity
  return Math.min(95, Math.max(60, baseScore + severityAdjustment));
}

export function analyzeMessages(messages: Message[]): IncidentAnalysis[] {
  const incidentCounts: { 
    [key: string]: { 
      count: number; 
      examples: string[]; 
      totalSeverity: number;
    } 
  } = {};
  
  messages.forEach(message => {
    const text = message.text.toLowerCase();
    const severity = analyzeSeverity(message.text);
    
    // Coercive Control
    if (text.includes('should') || text.includes('need to') || text.includes('have to') || 
        text.includes('must') || text.includes('listening')) {
      if (!incidentCounts['Coercive Control']) {
        incidentCounts['Coercive Control'] = { count: 0, examples: [], totalSeverity: 0 };
      }
      incidentCounts['Coercive Control'].count++;
      incidentCounts['Coercive Control'].examples.push(message.text);
      incidentCounts['Coercive Control'].totalSeverity += severity;
    }
    
    // Gaslighting
    if (text.includes('imagining') || text.includes('overreacting') || 
        text.includes('too sensitive') || text.includes('never happened')) {
      if (!incidentCounts['Gaslighting']) {
        incidentCounts['Gaslighting'] = { count: 0, examples: [], totalSeverity: 0 };
      }
      incidentCounts['Gaslighting'].count++;
      incidentCounts['Gaslighting'].examples.push(message.text);
      incidentCounts['Gaslighting'].totalSeverity += severity;
    }
    
    // Digital Harassment
    if (text.includes('posted') || text.includes('online') || 
        text.includes('status') || text.includes('social media')) {
      if (!incidentCounts['Digital Harassment']) {
        incidentCounts['Digital Harassment'] = { count: 0, examples: [], totalSeverity: 0 };
      }
      incidentCounts['Digital Harassment'].count++;
      incidentCounts['Digital Harassment'].examples.push(message.text);
      incidentCounts['Digital Harassment'].totalSeverity += severity;
    }
    
    // Verbal Threats
    if (text.includes('regret') || text.includes('threat') || 
        text.includes('warning') || text.includes('careful')) {
      if (!incidentCounts['Verbal Threats']) {
        incidentCounts['Verbal Threats'] = { count: 0, examples: [], totalSeverity: 0 };
      }
      incidentCounts['Verbal Threats'].count++;
      incidentCounts['Verbal Threats'].examples.push(message.text);
      incidentCounts['Verbal Threats'].totalSeverity += severity;
    }
    
    // Surveillance
    if (text.includes('saw you') || text.includes('watching') || 
        text.includes('noticed') || text.includes('been outside')) {
      if (!incidentCounts['Surveillance']) {
        incidentCounts['Surveillance'] = { count: 0, examples: [], totalSeverity: 0 };
      }
      incidentCounts['Surveillance'].count++;
      incidentCounts['Surveillance'].examples.push(message.text);
      incidentCounts['Surveillance'].totalSeverity += severity;
    }
  });

  // Convert counts to analysis results
  const totalMessages = messages.length;
  return Object.entries(incidentCounts)
    .map(([type, data]) => {
      const frequency = data.count / totalMessages;
      const avgSeverity = data.totalSeverity / data.count;
      
      return {
        type,
        confidence: getConfidenceScore(frequency, avgSeverity),
        description: INCIDENT_DESCRIPTIONS[type] || '',
        examples: data.examples.slice(0, 2), // Only keep 2 examples
        severity_score: Math.round(avgSeverity),
        emotional_indicators: EMOTIONAL_INDICATORS[type] || []
      };
    })
    .sort((a, b) => b.confidence - a.confidence); // Sort by confidence
} 