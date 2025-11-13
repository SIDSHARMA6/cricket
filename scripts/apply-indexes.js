/**
 * Apply database indexes manually
 * Run with: node scripts/apply-indexes.js
 */

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

console.log('🔧 Applying performance indexes to database...\n');

try {
  // Match indexes
  console.log('Adding Match indexes...');
  db.exec(`CREATE INDEX IF NOT EXISTS match_location_idx ON matches (latitude, longitude)`);
  db.exec(`CREATE INDEX IF NOT EXISTS match_datetime_idx ON matches (date_time)`);
  db.exec(`CREATE INDEX IF NOT EXISTS match_city_state_idx ON matches (city, state)`);
  db.exec(`CREATE INDEX IF NOT EXISTS match_status_idx ON matches (status)`);
  console.log('✓ Match indexes created (4)');

  // Post indexes
  console.log('\nAdding Post indexes...');
  db.exec(`CREATE INDEX IF NOT EXISTS post_location_idx ON posts (latitude, longitude)`);
  db.exec(`CREATE INDEX IF NOT EXISTS post_city_state_idx ON posts (city, state)`);
  db.exec(`CREATE INDEX IF NOT EXISTS post_visibility_idx ON posts (visibility)`);
  console.log('✓ Post indexes created (3)');

  // Story indexes
  console.log('\nAdding Story indexes...');
  db.exec(`CREATE INDEX IF NOT EXISTS story_expires_idx ON stories (expires_at)`);
  db.exec(`CREATE INDEX IF NOT EXISTS story_expired_idx ON stories (is_expired)`);
  console.log('✓ Story indexes created (2)');

  // Chat indexes
  console.log('\nAdding Chat indexes...');
  db.exec(`CREATE INDEX IF NOT EXISTS chat_deleted_idx ON chats (is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS chat_type_idx ON chats (message_type)`);
  console.log('✓ Chat indexes created (2)');

  // User indexes
  console.log('\nAdding User indexes...');
  db.exec(`CREATE INDEX IF NOT EXISTS user_location_idx ON up_users (latitude, longitude)`);
  db.exec(`CREATE INDEX IF NOT EXISTS user_city_state_idx ON up_users (city, state)`);
  console.log('✓ User indexes created (2)');

  console.log('\n✅ All 13 performance indexes applied successfully!');
  console.log('\n📊 Indexes Summary:');
  console.log('   - Match: 4 indexes (location, datetime, city/state, status)');
  console.log('   - Post: 3 indexes (location, city/state, visibility)');
  console.log('   - Story: 2 indexes (expiresAt, isExpired)');
  console.log('   - Chat: 2 indexes (isDeleted, messageType)');
  console.log('   - User: 2 indexes (location, city/state)');
  console.log('\n🚀 Database queries will now be much faster!');

} catch (error) {
  console.error('\n❌ Error applying indexes:', error.message);
  process.exit(1);
} finally {
  db.close();
}
