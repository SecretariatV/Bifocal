const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');
const fs = require('fs');

// Path to iMessage database
const dbPath = path.join(os.homedir(), 'Library/Messages/chat.db');

// Create a new database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to the iMessage database');
});

// Function to get messages for a contact using multiple identifiers
async function getMessagesForContact(identifiers) {
  return new Promise((resolve, reject) => {
    const placeholders = identifiers.map(() => '?').join(' OR handle.id = ');
    const query = `
      SELECT DISTINCT
        message.ROWID as id,
        message.text,
        message.date,
        message.is_from_me,
        handle.id as contact_identifier,
        message.attributedBody
      FROM message
      JOIN handle ON message.handle_id = handle.ROWID
      WHERE (handle.id = ${placeholders})
        AND (message.text IS NOT NULL OR message.attributedBody IS NOT NULL)
      ORDER BY message.date DESC
      LIMIT 100
    `;

    db.all(query, identifiers, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      // If no direct messages found, try group chats
      if (rows.length === 0) {
        const groupQuery = `
          SELECT DISTINCT
            message.ROWID as id,
            message.text,
            message.date,
            message.is_from_me,
            handle.id as contact_identifier,
            message.attributedBody
          FROM message
          JOIN chat_message_join ON message.ROWID = chat_message_join.message_id
          JOIN chat ON chat_message_join.chat_id = chat.ROWID
          JOIN chat_handle_join ON chat.ROWID = chat_handle_join.chat_id
          JOIN handle ON chat_handle_join.handle_id = handle.ROWID
          WHERE (handle.id = ${placeholders})
            AND (message.text IS NOT NULL OR message.attributedBody IS NOT NULL)
          ORDER BY message.date DESC
          LIMIT 100
        `;
        
        db.all(groupQuery, identifiers, (err, groupRows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(groupRows);
        });
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to convert iMessage timestamp to ISO string
function convertTimestamp(timestamp) {
  // iMessage timestamps are in seconds since 2001-01-01
  const macEpoch = new Date('2001-01-01').getTime();
  try {
    // First try direct conversion
    const date = new Date(timestamp);
    if (date.getTime() > 0) {
      return date.toISOString();
    }
    // If that fails, try converting from Mac epoch
    const milliseconds = macEpoch + (Number(timestamp) / 1000000);
    const date2 = new Date(milliseconds);
    return date2.toISOString();
  } catch (e) {
    // If all conversions fail, return current time
    return new Date().toISOString();
  }
}

// Main function to extract messages
async function extractMessages() {
  try {
    // Using both phone numbers and email addresses
    const contacts = {
      'Mouni': ['+18482607842', 'mounikasaka7@gmail.com'],
      'Shreya': ['+14802078487'],
      'Sanya': ['+14692477056', 'sanyahegde7@gmail.com']
    };

    const allMessages = [];

    for (const [name, identifiers] of Object.entries(contacts)) {
      console.log(`\nExtracting messages for ${name} (${identifiers.join(', ')})...`);
      try {
        const messages = await getMessagesForContact(identifiers);
        console.log(`Found ${messages.length} messages for ${name}`);
        
        const processedMessages = messages.map(msg => {
          let messageText = msg.text;
          
          // If text is null, try to get it from attributedBody
          if (!messageText && msg.attributedBody) {
            try {
              const attributedBody = JSON.parse(msg.attributedBody.toString('utf8'));
              messageText = attributedBody.string || '';
            } catch (e) {
              messageText = '';
            }
          }
          
          return {
            id: msg.id,
            contactId: msg.contact_identifier,
            type: msg.is_from_me ? 'sent' : 'received',
            text: messageText || '',
            timestamp: convertTimestamp(msg.date),
            highlighted: false
          };
        }).filter(msg => msg.text.trim() !== ''); // Remove empty messages

        allMessages.push({
          name,
          messages: processedMessages
        });
      } catch (error) {
        console.error(`Error processing messages for ${name}:`, error);
      }
    }

    // Write to a JSON file
    const outputPath = path.join(__dirname, '../src/data/messages.json');
    fs.writeFileSync(outputPath, JSON.stringify(allMessages, null, 2));
    console.log(`\nMessages saved to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

extractMessages(); 