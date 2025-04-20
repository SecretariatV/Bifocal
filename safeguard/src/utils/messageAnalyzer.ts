import axios from 'axios';

export type MessageAnalysisType = {
  isCrime: boolean;
  severityScore: number;
  receiverEmotion: string;
  perpetratorBehavior: string;
}

// Direct rule-based analysis based on our ML model's logic from HACKAI.ipynb
export const analyzeMessage = async (text: string): Promise<MessageAnalysisType> => {
  const textLower = text.toLowerCase();
  
  // Violence and threat indicators (severity 5)
  const violentThreats = [
    "kill", "death", "die", "murder", "dead", "hurt", "hit", "beat", 
    "attack", "destroy", "end you", "finish you", "eliminate"
  ];
  
  // Stalking and surveillance indicators (severity 4)
  const stalkingBehavior = [
    "watching", "following", "outside", "house", "saw you", "find you",
    "know where", "track", "spy", "surveillance", "monitor"
  ];
  
  // Manipulation and control indicators (severity 3)
  const manipulationControl = [
    "your fault", "crazy", "imagining", "making up", "overreacting",
    "ignore", "talk to me", "answer me", "respond", "listen to me",
    "can't live without", "need you", "miss you", "love you"
  ];

  // Emotional abuse indicators (severity 3)
  const emotionalAbuse = [
    "stupid", "worthless", "useless", "pathetic", "nothing without",
    "no one else", "no one will", "you deserve", "your fault"
  ];

  let severityScore = 1;
  let isCrime = false;
  let receiverEmotion = "Neutral";
  let perpetratorBehavior = "Normal";

  // Check for violent threats (Severity 5)
  if (violentThreats.some(word => textLower.includes(word))) {
    severityScore = 5;
    isCrime = true;
    receiverEmotion = "Fearful";
    perpetratorBehavior = "Threatening";
  }
  // Check for stalking behavior (Severity 4)
  else if (stalkingBehavior.some(word => textLower.includes(word))) {
    severityScore = 4;
    isCrime = textLower.includes("house") || textLower.includes("outside");
    receiverEmotion = "Scared";
    perpetratorBehavior = "Stalking";
  }
  // Check for manipulation and control (Severity 3)
  else if (manipulationControl.some(word => textLower.includes(word))) {
    severityScore = 3;
    receiverEmotion = "Anxious";
    perpetratorBehavior = "Manipulative";
  }
  // Check for emotional abuse (Severity 3)
  else if (emotionalAbuse.some(word => textLower.includes(word))) {
    severityScore = 3;
    receiverEmotion = "Distressed";
    perpetratorBehavior = "Abusive";
  }

  // Additional severity modifiers
  if (textLower.includes("angry") || textLower.includes("mad")) {
    severityScore = Math.max(severityScore, 3);
    receiverEmotion = "Anxious";
    perpetratorBehavior = "Hostile";
  }

  // Intensity modifiers
  const intensifiers = ["very", "really", "so", "extremely", "fucking", "always", "never"];
  if (intensifiers.some(word => textLower.includes(word)) && severityScore > 1) {
    severityScore = Math.min(severityScore + 1, 5);
  }

  // Multiple messages in quick succession can indicate escalation
  if (textLower.includes("?") && textLower.includes("!")) {
    severityScore = Math.max(severityScore, 3);
    perpetratorBehavior = "Escalating";
  }

  return {
    isCrime,
    severityScore,
    receiverEmotion,
    perpetratorBehavior
  };
};

// Cache for storing analysis results
const analysisCache = new Map<string, MessageAnalysisType>();

// Cached version of the analyzer
export const getCachedAnalysis = async (text: string): Promise<MessageAnalysisType> => {
  if (analysisCache.has(text)) {
    return analysisCache.get(text)!;
  }

  const analysis = await analyzeMessage(text);
  analysisCache.set(text, analysis);
  return analysis;
}; 