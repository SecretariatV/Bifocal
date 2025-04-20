import { parseISO, format } from 'date-fns';

// Import the CSV data
const csvData = [
  { time_stamp: "2025-02-28", user_name: "Mouni", narrative_entry: "If you just listened, we wouldn't be having this fight.", incident_type: "Emotional Abuse", user_emotional_state: "Distressed", severity_score: 3, potential_crime: "N" },
  { time_stamp: "2025-03-14", user_name: "Mouni", narrative_entry: "If you leave, you'll regret it. No one else will want you.", incident_type: "Emotional Abuse", user_emotional_state: "Distressed", severity_score: 4, potential_crime: "N" },
  { time_stamp: "2025-03-13", user_name: "Sanya", narrative_entry: "You've been quiet lately, want to talk?", incident_type: "Friendly", user_emotional_state: "Neutral", severity_score: 1, potential_crime: "N" },
  { time_stamp: "2025-04-09", user_name: "Mouni", narrative_entry: "I'll make sure everyone knows what you really are.", incident_type: "Emotional Abuse", user_emotional_state: "Distressed", severity_score: 3, potential_crime: "N" },
  { time_stamp: "2025-03-09", user_name: "Sanya", narrative_entry: "Hey! Hope your week's been gentle. Let me know if you need anything 💛", incident_type: "Friendly", user_emotional_state: "Neutral", severity_score: 1, potential_crime: "N" },
  { time_stamp: "2025-03-16", user_name: "Mouni", narrative_entry: "I know what's best for you. You clearly can't handle life on your own.", incident_type: "Emotional Abuse", user_emotional_state: "Distressed", severity_score: 3, potential_crime: "N" },
  { time_stamp: "2025-02-05", user_name: "Shreya", narrative_entry: "I noticed you left your lights on last night. You should be more careful.", incident_type: "Stalking", user_emotional_state: "Fearful", severity_score: 4, potential_crime: "Y" },
  { time_stamp: "2025-01-20", user_name: "Shreya", narrative_entry: "I've been outside your place a few times… just to make sure you're okay.", incident_type: "Stalking", user_emotional_state: "Fearful", severity_score: 5, potential_crime: "Y" }
];

export interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  timestamp: string;
  raw_timestamp: string;
  incident_type: string;
  user_emotional_state: string;
  severity_score: number;
  potential_crime: string;
}

export interface MessageData {
  time_stamp: string;
  user_name: string;
  narrative_entry: string;
  incident_type: string;
  user_emotional_state: string;
  severity_score: number;
  potential_crime: string;
}

// Helper function to format timestamp
const formatMessageTimestamp = (timestamp: string): string => {
  const date = parseISO(timestamp);
  return format(date, 'MMM d, h:mm a');
};

// Process raw message data into the format our app expects
export const processMessageData = (data: MessageData[]): { [key: string]: Message[] } => {
  const messagesByUser: { [key: string]: Message[] } = {};
  
  data.forEach((msg, index) => {
    const userName = msg.user_name.toLowerCase();
    if (!messagesByUser[userName]) {
      messagesByUser[userName] = [];
    }

    const message: Message = {
      id: `${msg.time_stamp}-${index}`,
      text: msg.narrative_entry,
      type: 'received', // All messages in the CSV are received messages
      timestamp: formatMessageTimestamp(msg.time_stamp),
      raw_timestamp: msg.time_stamp,
      incident_type: msg.incident_type,
      user_emotional_state: msg.user_emotional_state,
      severity_score: msg.severity_score,
      potential_crime: msg.potential_crime
    };

    messagesByUser[userName].push(message);
  });

  // Sort messages by timestamp for each user
  Object.keys(messagesByUser).forEach(user => {
    messagesByUser[user].sort((a, b) => 
      new Date(a.raw_timestamp).getTime() - new Date(b.raw_timestamp).getTime()
    );
  });

  return messagesByUser;
};

export const processedMessages = processMessageData(csvData); 