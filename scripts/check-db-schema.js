/**
 * Check actual database schema
 */

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

console.log('📊 Checking database schema...\n');

const tables = ['matches', 'posts', 'stories', 'chats', 'up_users'];

tables.forEach(table => {
  try {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    console.log(`\n${table}:`);
    columns.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
  } catch (error) {
    console.log(`  ❌ Table not found`);
  }
});

db.close();
