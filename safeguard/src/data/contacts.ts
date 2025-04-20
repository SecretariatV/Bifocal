export interface Contact {
  id: number;
  name: string;
  risk: 'low' | 'medium' | 'high';
  phone?: string;
  email?: string;
  relationship?: string;
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
    risk: 'high',
    phone: '+18482607842',
    email: 'mounikasaka7@gmail.com',
    relationship: 'Ex-Partner'
  },
  {
    id: 2,
    name: 'Shreya',
    risk: 'medium',
    phone: '+14802078487',
    relationship: 'Former Classmate'
  },
  {
    id: 3,
    name: 'Sanya',
    risk: 'low',
    phone: '+14692477056',
    email: 'sanyahegde7@gmail.com',
    relationship: 'Friend'
  },
  {
    id: 4,
    name: 'Aanya Sharma',
    risk: 'low',
    relationship: 'Classmate'
  },
  {
    id: 5,
    name: 'Aditya Shah',
    risk: 'low',
    relationship: 'Friend'
  },
  {
    id: 6,
    name: 'Ananya Desai',
    risk: 'low',
    phone: '+1777888999'
  },
  {
    id: 7,
    name: 'Arjun Kumar',
    risk: 'low',
    phone: '+1122334455'
  },
  {
    id: 8,
    name: 'divya',
    risk: 'low',
    phone: '+1999888777'
  },
  {
    id: 9,
    name: 'Ishaan Mehta',
    risk: 'low',
    phone: '+1555666777'
  },
  {
    id: 10,
    name: 'karthik',
    risk: 'low',
    phone: '+1444555666'
  },
  {
    id: 11,
    name: 'Kavya Patel',
    risk: 'low',
    email: 'kavya.p@gmail.com'
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