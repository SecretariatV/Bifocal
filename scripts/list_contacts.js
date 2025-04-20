const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');

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

// Function to list recent contacts
function listRecentContacts() {
  db.all(`
    SELECT DISTINCT
      handle.id as identifier,
      chat.chat_identifier,
      chat.display_name,
      MAX(message.date) as last_message_date
    FROM message
    JOIN handle ON message.handle_id = handle.ROWID
    JOIN chat_message_join ON message.ROWID = chat_message_join.message_id
    JOIN chat ON chat_message_join.chat_id = chat.ROWID
    GROUP BY handle.id
    ORDER BY last_message_date DESC
    LIMIT 50
  `, (err, rows) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    console.log('\nRecent iMessage Contacts:');
    console.log('------------------------');
    rows.forEach((row, index) => {
      console.log(`\n${index + 1}. Contact: ${row.display_name || 'No name'}`);
      console.log(`   Identifier: ${row.identifier}`);
      console.log(`   Last message: ${new Date(row.last_message_date * 1000).toLocaleString()}`);
    });

    db.close();
  });
}

listRecentContacts(); 