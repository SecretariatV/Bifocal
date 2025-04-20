// Import the real messages from the JSON file
import messagesData from './messages.json';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  riskLevel: 'low' | 'medium' | 'high';
  imageUrl?: string;
}

export const contacts: Contact[] = [
  {
    id: 'mounikasaka7@gmail.com',
    name: 'Mouni',
    relationship: 'Hackathon Partner',
    riskLevel: 'low',
    imageUrl: 'https://avatars.githubusercontent.com/u/123456789'
  },
  {
    id: 'sanyahegde7@gmail.com',
    name: 'Sanya',
    relationship: 'Hackathon Partner',
    riskLevel: 'low',
    imageUrl: 'https://avatars.githubusercontent.com/u/987654321'
  },
  {
    id: '+14802078487',
    name: 'Shreya',
    relationship: 'Hackathon Partner',
    riskLevel: 'low',
    imageUrl: 'https://avatars.githubusercontent.com/u/543216789'
  }
];

export default contacts;

export interface Message {
  id: number;
  contactId: string;
  type: 'sent' | 'received';
  text: string;
  timestamp: string;
  highlighted?: boolean;
  pattern?: string;
}

export interface Pattern {
  id: number;
  name: string;
  description: string;
  frequency: string;
  severity: string;
}

interface ImportedMessage {
  id: number;
  contactId: string;
  type: 'sent' | 'received';
  text: string;
  timestamp: string;
}

interface ImportedData {
  name: string;
  messages: ImportedMessage[];
}

// Type assertion to ensure the imported data matches our expected format
const typedMessagesData = messagesData as ImportedData[];

export const messages: Message[] = typedMessagesData.flatMap(contact => 
  contact.messages.map(msg => ({
    ...msg,
    highlighted: false,
    pattern: undefined
  }))
);

export const patterns: Pattern[] = [
  {
    id: 1,
    name: 'Control/Surveillance',
    description: 'Attempts to monitor or control location and activities',
    frequency: 'High',
    severity: 'Medium'
  },
  {
    id: 2,
    name: 'Emotional Manipulation',
    description: 'Using emotions to influence behavior',
    frequency: 'Medium',
    severity: 'High'
  }
]; 