import { parseISO, format } from 'date-fns';

// Import the CSV data
const csvData = [
  { time_stamp: "2025-03-02", user_name: "Sanya", narrative_entry: "Wanna do a movie night soon?" },
  { time_stamp: "2025-03-17", user_name: "Shreya", narrative_entry: "You really shouldn't walk home alone so late." },
  { time_stamp: "2025-02-14", user_name: "Sanya", narrative_entry: "You're on my mind today—sending love!" },
  { time_stamp: "2025-01-20", user_name: "Shreya", narrative_entry: "I've been outside your place a few times... just to make sure you're okay." },
  { time_stamp: "2025-03-05", user_name: "Sanya", narrative_entry: "You're on my mind today—sending love!" },
  { time_stamp: "2025-03-23", user_name: "Shreya", narrative_entry: "You really shouldn't walk home alone so late." },
  { time_stamp: "2025-02-28", user_name: "Mouni", narrative_entry: "If you just listened, we wouldn't be having this fight." },
  { time_stamp: "2025-02-24", user_name: "Mouni", narrative_entry: "If you just listened, we wouldn't be having this fight." },
  { time_stamp: "2025-03-13", user_name: "Mouni", narrative_entry: "You're imagining things again. Why do you always make me the bad guy?" },
  { time_stamp: "2025-03-02", user_name: "Shreya", narrative_entry: "Saw you at the coffee shop today. That green sweater looks good on you." },
  { time_stamp: "2025-03-19", user_name: "Mouni", narrative_entry: "You're imagining things again. Why do you always make me the bad guy?" },
  { time_stamp: "2025-01-01", user_name: "Shreya", narrative_entry: "I've been outside your place a few times... just to make sure you're okay." },
  { time_stamp: "2025-02-05", user_name: "Shreya", narrative_entry: "I noticed you left your lights on last night. You should be more careful." },
  { time_stamp: "2025-03-09", user_name: "Sanya", narrative_entry: "Lunch next week? I'm free Tuesday!" },
  { time_stamp: "2025-03-15", user_name: "Shreya", narrative_entry: "Saw you at the coffee shop today. That green sweater looks good on you." },
  { time_stamp: "2025-03-14", user_name: "Mouni", narrative_entry: "If you leave, you'll regret it. No one else will want you." },
  { time_stamp: "2025-03-11", user_name: "Sanya", narrative_entry: "Wanna do a movie night soon?" },
  { time_stamp: "2025-03-16", user_name: "Mouni", narrative_entry: "I know what's best for you. You clearly can't handle life on your own." },
  { time_stamp: "2025-04-06", user_name: "Shreya", narrative_entry: "Why didn't you smile at me when I waved? Are you avoiding me?" },
  { time_stamp: "2025-03-05", user_name: "Mouni", narrative_entry: "You're lucky I even put up with you." },
  { time_stamp: "2025-01-24", user_name: "Mouni", narrative_entry: "You're imagining things again. Why do you always make me the bad guy?" },
  { time_stamp: "2025-02-13", user_name: "Shreya", narrative_entry: "I've been outside your place a few times... just to make sure you're okay." },
  { time_stamp: "2025-01-01", user_name: "Shreya", narrative_entry: "That guy you were talking to... is he important to you?" },
  { time_stamp: "2025-02-14", user_name: "Mouni", narrative_entry: "You're lucky I even put up with you." },
  { time_stamp: "2025-01-14", user_name: "Sanya", narrative_entry: "You're on my mind today—sending love!" },
  { time_stamp: "2025-03-17", user_name: "Sanya", narrative_entry: "Wanna do a movie night soon?" },
  { time_stamp: "2025-01-16", user_name: "Sanya", narrative_entry: "Just checking in. You doing okay?" }
];

export interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  timestamp: string;
  raw_timestamp: string;
}

export interface MessageData {
  time_stamp: string;
  user_name: string;
  narrative_entry: string;
}

// Helper function to format timestamp
const formatMessageTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  } catch (e) {
    return timestamp; // Fallback to original timestamp if parsing fails
  }
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
      raw_timestamp: msg.time_stamp
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