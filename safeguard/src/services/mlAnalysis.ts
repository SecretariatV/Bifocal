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

export const analyzeMessages = (messages: Message[]): IncidentAnalysis[] => {
  // Group messages by their pattern type
  const messagesByPattern = messages.reduce((acc, message) => {
    const pattern = detectPattern(message.text);
    if (pattern) {
      if (!acc[pattern.type]) {
        acc[pattern.type] = {
          type: pattern.type,
          description: pattern.description,
          confidence: pattern.confidence,
          severity_score: pattern.severity_score,
          examples: new Set<string>(),
          emotional_indicators: pattern.emotional_indicators
        };
      }
      acc[pattern.type].examples.add(message.text);
    }
    return acc;
  }, {} as Record<string, Omit<IncidentAnalysis, 'examples'> & { examples: Set<string> }>);

  // Convert back to array and convert Sets to arrays
  return Object.values(messagesByPattern).map(pattern => ({
    ...pattern,
    examples: Array.from(pattern.examples)
  }));
};

// Helper function to detect patterns in message text
const detectPattern = (text: string): Omit<IncidentAnalysis, 'examples'> | null => {
  // Your existing pattern detection logic
  if (text.includes('imagining things')) {
    return {
      type: 'Gaslighting',
      description: 'Distorts reality to create doubt and confusion',
      confidence: 76.67,
      severity_score: 5,
      emotional_indicators: ['confused', 'self-doubt', 'hopeless']
    };
  }
  
  if (text.includes('outside your place')) {
    return {
      type: 'Surveillance',
      description: 'Monitors activities and movements',
      confidence: 72,
      severity_score: 3,
      emotional_indicators: ['watched', 'paranoid', 'restricted']
    };
  }

  if (text.includes('leave') && text.includes('regret')) {
    return {
      type: 'Verbal Threats',
      description: 'Uses threatening language or implied harm',
      confidence: 62.22,
      severity_score: 3,
      emotional_indicators: ['on edge', 'anxious', 'fearful']
    };
  }

  // Add more patterns as needed
  return null;
}; 