# Comprehensive Chat API Test Suite

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzYxOTcyMTMxLCJleHAiOjE3NjQ1NjQxMzF9.CyE1NaM67FONrBf5xAxebknIlMKNd1kduK3YRu01hLM"
$baseUrl = "http://localhost:1337/api"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "🚀 Comprehensive Chat API Test Suite" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""

$testResults = @()

# Test 1: Send a simple text message
Write-Host "📨 Test 1: Send simple text message" -ForegroundColor Yellow
try {
    $messageData = @{
        data = @{
            message = "Hello cricket community! Ready for today's match? 🏏"
            messageType = "text"
            tags = @("cricket", "match")
        }
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$baseUrl/chats" -Method POST -Body $messageData -Headers $headers
    Write-Host "✅ SUCCESS: Message sent" -ForegroundColor Green
    Write-Host "   Message ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "   Content: $($response.data.message)" -ForegroundColor Cyan
    $messageId1 = $response.data.id
    $testResults += "✅ Send message: PASSED"
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "❌ Send message: FAILED"
}

Write-Host ""

# Test 2: Send message with mentions
Write-Host "📨 Test 2: Send message with mentions" -ForegroundColor Yellow
try {
    $messageData = @{
        data = @{
            message = "Great game today! Amazing performance! 👏"
            messageType = "text"
            mentions = @(7)
            tags = @("cricket", "celebration")
        }
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$baseUrl/chats" -Method POST -Body $messageData -Headers $headers
    Write-Host "✅ SUCCESS: Message with mentions sent" -ForegroundColor Green
    Write-Host "   Message ID: $($response.data.id)" -ForegroundColor Cyan
    $messageId2 = $response.data.id
    $testResults += "✅ Send message with mentions: PASSED"
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "❌ Send message with mentions: FAILED"
}

Write-Host ""

# Test 3: Send reply message
Write-Host "📨 Test 3: Send reply message" -ForegroundColor Yellow
if ($messageId1) {
    try {
        $messageData = @{
            data = @{
                message = "Absolutely! Can't wait! 🔥"
                messageType = "text"
                replyTo = $messageId1
            }
        } | ConvertTo-Json -Depth 3

        $response = Invoke-RestMethod -Uri "$baseUrl/chats" -Method POST -Body $messageData -Headers $headers
        Write-Host "✅ SUCCESS: Reply message sent" -ForegroundColor Green
        Write-Host "   Reply ID: $($response.data.id)" -ForegroundColor Cyan
        Write-Host "   Replying to: $($response.data.replyTo.message)" -ForegroundColor Cyan
        $replyId = $response.data.id
        $testResults += "✅ Send reply: PASSED"
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "❌ Send reply: FAILED"
    }
} else {
    Write-Host "⚠️ SKIPPED: No message ID available" -ForegroundColor Yellow
    $testResults += "⚠️ Send reply: SKIPPED"
}

Write-Host ""

# Test 4: Get all messages
Write-Host "📋 Test 4: Get all messages" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/chats?page=1&pageSize=10" -Method GET -Headers $headers
    Write-Host "✅ SUCCESS: Messages retrieved" -ForegroundColor Green
    Write-Host "   Total messages: $($response.meta.pagination.total)" -ForegroundColor Cyan
    Write-Host "   Messages on page: $($response.data.Count)" -ForegroundColor Cyan
    if ($response.data.Count -gt 0) {
        Write-Host "   Latest message: $($response.data[0].message)" -ForegroundColor Cyan
    }
    $testResults += "✅ Get messages: PASSED"
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "❌ Get messages: FAILED"
}

Write-Host ""

# Test 5: Get single message
Write-Host "📋 Test 5: Get single message" -ForegroundColor Yellow
if ($messageId1) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/chats/$messageId1" -Method GET -Headers $headers
        Write-Host "✅ SUCCESS: Single message retrieved" -ForegroundColor Green
        Write-Host "   Message: $($response.data.message)" -ForegroundColor Cyan
        Write-Host "   Sender: $($response.data.sender.username)" -ForegroundColor Cyan
        $testResults += "✅ Get single message: PASSED"
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "❌ Get single message: FAILED"
    }
} else {
    Write-Host "⚠️ SKIPPED: No message ID available" -ForegroundColor Yellow
    $testResults += "⚠️ Get single message: SKIPPED"
}

Write-Host ""

# Test 6: Edit message
Write-Host "✏️ Test 6: Edit message" -ForegroundColor Yellow
if ($messageId1) {
    try {
        $editData = @{
            data = @{
                message = "Hello cricket community! Ready for today's BIG match? 🏏🔥"
            }
        } | ConvertTo-Json -Depth 3

        $response = Invoke-RestMethod -Uri "$baseUrl/chats/$messageId1" -Method PUT -Body $editData -Headers $headers
        Write-Host "✅ SUCCESS: Message edited" -ForegroundColor Green
        Write-Host "   Updated message: $($response.data.message)" -ForegroundColor Cyan
        Write-Host "   Is edited: $($response.data.isEdited)" -ForegroundColor Cyan
        $testResults += "✅ Edit message: PASSED"
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "❌ Edit message: FAILED"
    }
} else {
    Write-Host "⚠️ SKIPPED: No message ID available" -ForegroundColor Yellow
    $testResults += "⚠️ Edit message: SKIPPED"
}

Write-Host ""

# Test 7: Add reaction
Write-Host "👍 Test 7: Add reaction" -ForegroundColor Yellow
if ($messageId1) {
    try {
        $reactionData = @{
            emoji = "👍"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/chats/$messageId1/reaction" -Method POST -Body $reactionData -Headers $headers
        Write-Host "✅ SUCCESS: Reaction added" -ForegroundColor Green
        Write-Host "   Reactions: $($response.data.reactions | ConvertTo-Json -Compress)" -ForegroundColor Cyan
        $testResults += "✅ Add reaction: PASSED"
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Error details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        $testResults += "❌ Add reaction: FAILED"
    }
} else {
    Write-Host "⚠️ SKIPPED: No message ID available" -ForegroundColor Yellow
    $testResults += "⚠️ Add reaction: SKIPPED"
}

Write-Host ""

# Test 8: Add different reaction
Write-Host "🔥 Test 8: Add different reaction" -ForegroundColor Yellow
if ($messageId1) {
    try {
        $reactionData = @{
            emoji = "🔥"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/chats/$messageId1/reaction" -Method POST -Body $reactionData -Headers $headers
        Write-Host "✅ SUCCESS: Different reaction added" -ForegroundColor Green
        Write-Host "   Reactions: $($response.data.reactions | ConvertTo-Json -Compress)" -ForegroundColor Cyan
        $testResults += "✅ Add different reaction: PASSED"
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "❌ Add different reaction: FAILED"
    }
} else {
    Write-Host "⚠️ SKIPPED: No message ID available" -ForegroundColor Yellow
    $testResults += "⚠️ Add different reaction: SKIPPED"
}

Write-Host ""

# Test 9: Remove reaction (toggle)
Write-Host "👍 Test 9: Remove reaction (toggle)" -ForegroundColor Yellow
if ($messageId1) {
    try {
        $reactionData = @{
            emoji = "👍"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/chats/$messageId1/reaction" -Method POST -Body $reactionData -Headers $headers
        Write-Host "✅ SUCCESS: Reaction toggled" -ForegroundColor Green
        Write-Host "   Reactions: $($response.data.reactions | ConvertTo-Json -Compress)" -ForegroundColor Cyan
        $testResults += "✅ Toggle reaction: PASSED"
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "❌ Toggle reaction: FAILED"
    }
} else {
    Write-Host "⚠️ SKIPPED: No message ID available" -ForegroundColor Yellow
    $testResults += "⚠️ Toggle reaction: SKIPPED"
}

Write-Host ""

# Test Summary
Write-Host "📊 TEST SUMMARY" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green

$passed = ($testResults | Where-Object { $_ -like "*PASSED*" }).Count
$failed = ($testResults | Where-Object { $_ -like "*FAILED*" }).Count
$skipped = ($testResults | Where-Object { $_ -like "*SKIPPED*" }).Count

foreach ($result in $testResults) {
    Write-Host $result
}

Write-Host ""
Write-Host "📈 RESULTS:" -ForegroundColor Green
Write-Host "   ✅ Passed: $passed" -ForegroundColor Green
Write-Host "   ❌ Failed: $failed" -ForegroundColor Red
Write-Host "   ⚠️ Skipped: $skipped" -ForegroundColor Yellow
Write-Host "   📊 Total: $($testResults.Count)" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "🎉 ALL TESTS PASSED! Chat API is working perfectly!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️ Some tests failed. Please check the errors above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏏 Your WhatsApp-style cricket community chat is ready!" -ForegroundColor Green