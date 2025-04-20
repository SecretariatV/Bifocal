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

// Function to find all possible matches for a contact
async function findContactMatches(name, identifier) {
  return new Promise((resolve, reject) => {
    const queries = [
      // Exact match
      `SELECT DISTINCT 
        handle.ROWID,
        handle.id,
        COUNT(message.ROWID) as message_count,
        MAX(message.date) as last_message
      FROM handle 
      LEFT JOIN message ON handle.ROWID = message.handle_id
      WHERE handle.id = ?
      GROUP BY handle.ROWID`,

      // Contains email (for email searches)
      `SELECT DISTINCT 
        handle.ROWID,
        handle.id,
        COUNT(message.ROWID) as message_count,
        MAX(message.date) as last_message
      FROM handle 
      LEFT JOIN message ON handle.ROWID = message.handle_id
      WHERE handle.id LIKE ?
      GROUP BY handle.ROWID`,

      // Contains number (for phone searches)
      `SELECT DISTINCT 
        handle.ROWID,
        handle.id,
        COUNT(message.ROWID) as message_count,
        MAX(message.date) as last_message
      FROM handle 
      LEFT JOIN message ON handle.ROWID = message.handle_id
      WHERE handle.id LIKE ?
      GROUP BY handle.ROWID`
    ];

    const params = [
      identifier,
      `%${identifier}%`,
      `%${identifier.replace(/[^0-9]/g, '')}%`
    ];

    console.log(`\nSearching for ${name}:`);
    console.log('------------------------');

    let found = new Set();
    let completed = 0;

    queries.forEach((query, index) => {
      db.all(query, [params[index]], (err, rows) => {
        if (err) {
          console.error('Error:', err);
        } else {
          rows.forEach(row => {
            if (!found.has(row.id)) {
              found.add(row.id);
              console.log(`Match ${found.size}:`);
              console.log(`  ID: ${row.id}`);
              console.log(`  Message count: ${row.message_count}`);
              if (row.last_message) {
                const date = new Date(row.last_message);
                console.log(`  Last message: ${date.toLocaleString()}`);
              }
              console.log('');
            }
          });
        }
        completed++;
        if (completed === queries.length) {
          resolve();
        }
      });
    });
  });
}

// Main function
async function findContacts() {
  try {
    const contacts = {
      'Mouni': 'mounikasaka17@gmail.com',
      'Shreya': '+14802078487',
      'Sanya': 'sanyahegde7@gmail.com'
    };

    for (const [name, identifier] of Object.entries(contacts)) {
      await findContactMatches(name, identifier);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

findContacts(); 