const axios = require('axios');

const BASE_URL = 'http://localhost:1337/api';
let authToken = '';

// Test credentials
const credentials = {
  identifier: 'test@example.com',
  password: 'Password123'
};

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/auth/local`, credentials);
    authToken = response.data.jwt;
    console.log('✅ Login successful!');
    console.log('Token:', authToken.substring(0, 20) + '...\n');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testSendMessage() {
  try {
    console.log('📨 Test 1: Send a simple text message');
    const response = await axios.post(
      `${BASE_URL}/chats`,
      {
        data: {
          message: 'Hello cricket community! Ready for the match? 🏏',
          messageType: 'text',
          tags: ['cricket', 'match']
        }
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Message sent successfully!');
    console.log('Message ID:', response.data.data.id);
    console.log('Message:', response.data.data.message);
    console.log('Sender:', response.data.data.sender.username);
    console.log('');
    return response.data.data.id;
  } catch (error) {
    console.error('❌ Send message failed:', error.response?.data || error.message);
  }
}

async function testGetMessages() {
  try {
    console.log('📋 Test 2: Get all messages');
    const response = await axios.get(`${BASE_URL}/chats?page=1&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    console.log('✅ Messages retrieved successfully!');
    console.log('Total messages:', response.data.meta.pagination.total);
    console.log('Messages on this page:', response.data.data.length);
    if (response.data.data.length > 0) {
      console.log('Latest message:', response.data.data[0].message);
    }
    console.log('');
    return response.data.data;
  } catch (error) {
    console.error('❌ Get messages failed:', error.response?.data || error.message);
  }
}

async function testReplyToMessage(messageId) {
  try {
    console.log('💬 Test 3: Reply to a message');
    const response = await axios.post(
      `${BASE_URL}/chats`,
      {
        data: {
          message: 'Absolutely! Can\'t wait! 🔥',
          messageType: 'text',
          replyTo: messageId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Reply sent successfully!');
    console.log('Reply ID:', response.data.data.id);
    console.log('Reply message:', response.data.data.message);
    console.log('Replying to:', response.data.data.replyTo?.message);
    console.log('');
    return response.data.data.id;
  } catch (error) {
    console.error('❌ Reply failed:', error.response?.data || error.message);
  }
}

async function testAddReaction(messageId) {
  try {
    console.log('👍 Test 4: Add reaction to message');
    const response = await axios.post(
      `${BASE_URL}/chats/${messageId}/reaction`,
      {
        emoji: '👍'
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Reaction added successfully!');
    console.log('Reactions:', response.data.data.reactions);
    console.log('');
  } catch (error) {
    console.error('❌ Add reaction failed:', error.response?.data || error.message);
  }
}

async function testEditMessage(messageId) {
  try {
    console.log('✏️ Test 5: Edit message');
    const response = await axios.put(
      `${BASE_URL}/chats/${messageId}`,
      {
        data: {
          message: 'Hello cricket community! Ready for the BIG match? 🏏🔥'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Message edited successfully!');
    console.log('Updated message:', response.data.data.message);
    console.log('Is edited:', response.data.data.isEdited);
    console.log('');
  } catch (error) {
    console.error('❌ Edit message failed:', error.response?.data || error.message);
  }
}

async function testMentionUsers(userId) {
  try {
    console.log('@ Test 6: Mention users in message');
    const response = await axios.post(
      `${BASE_URL}/chats`,
      {
        data: {
          message: 'Great game today! Amazing performance! 👏',
          messageType: 'text',
          mentions: [userId],
          tags: ['cricket', 'celebration']
        }
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Message with mention sent successfully!');
    console.log('Message:', response.data.data.message);
    console.log('Mentions:', response.data.data.mentions);
    console.log('');
  } catch (error) {
    console.error('❌ Mention failed:', error.response?.data || error.message);
  }
}

async function testDeleteMessage(messageId) {
  try {
    console.log('🗑️ Test 7: Delete message');
    const response = await axios.delete(`${BASE_URL}/chats/${messageId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    console.log('✅ Message deleted successfully!');
    console.log('Response:', response.data.data.message);
    console.log('');
  } catch (error) {
    console.error('❌ Delete message failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Chat API Tests\n');
  console.log('='.repeat(50));
  console.log('');

  try {
    // Login
    await login();

    // Test 1: Send message
    const messageId = await testSendMessage();

    // Test 2: Get all messages
    const messages = await testGetMessages();

    // Test 3: Reply to message
    if (messageId) {
      await testReplyToMessage(messageId);
    }

    // Test 4: Add reaction
    if (messageId) {
      await testAddReaction(messageId);
    }

    // Test 5: Edit message
    if (messageId) {
      await testEditMessage(messageId);
    }

    // Test 6: Mention users
    if (messages && messages.length > 0) {
      const userId = messages[0].sender.id;
      await testMentionUsers(userId);
    }

    // Test 7: Delete message (optional - uncomment to test)
    // if (messageId) {
    //   await testDeleteMessage(messageId);
    // }

    console.log('='.repeat(50));
    console.log('✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run the tests
runTests();
