/**
 * Verify database indexes exist
 */

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

console.log('🔍 Verifying database indexes...\n');

const expectedIndexes = {
  matches: ['match_location_idx', 'match_datetime_idx', 'match_city_state_idx', 'match_status_idx'],
  posts: ['post_location_idx', 'post_city_state_idx', 'post_visibility_idx'],
  stories: ['story_expires_idx', 'story_expired_idx'],
  chats: ['chat_deleted_idx', 'chat_type_idx'],
  up_users: ['user_location_idx', 'user_city_state_idx']
};

let totalFound = 0;
let totalExpected = 0;

Object.entries(expectedIndexes).forEach(([table, indexes]) => {
  console.log(`\n${table}:`);
  const tableIndexes = db.prepare(`PRAGMA index_list(${table})`).all();
  
  indexes.forEach(indexName => {
    totalExpected++;
    const found = tableIndexes.find(idx => idx.name === indexName);
    if (found) {
      console.log(`  ✓ ${indexName}`);
      totalFound++;
    } else {
      console.log(`  ✗ ${indexName} (missing)`);
    }
  });
});

console.log(`\n${'='.repeat(50)}`);
console.log(`📊 Summary: ${totalFound}/${totalExpected} indexes found`);

if (totalFound === totalExpected) {
  console.log('✅ All indexes are present!');
} else {
  console.log(`⚠️  ${totalExpected - totalFound} indexes missing`);
  console.log('\nRun: node scripts/apply-indexes.js');
}

db.close();
