export interface Contact {
  id: number;
  name: string;
  risk: 'low' | 'medium' | 'high';
  phone?: string;
  email?: string;
}

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

export const contacts: Contact[] = [
  {
    id: 1,
    name: 'Mouni',
    risk: 'low',
    phone: '+18482607842',
    email: 'mounikasaka7@gmail.com'
  },
  {
    id: 2,
    name: 'Shreya',
    risk: 'medium',
    phone: '+14802078487'
  },
  {
    id: 3,
    name: 'Sanya',
    risk: 'high',
    phone: '+14692477056',
    email: 'sanyahegde7@gmail.com'
  }
];

// Import the real messages from the JSON file
import messagesData from './messages.json';

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