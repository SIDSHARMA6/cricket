# Simple Chat API Test Script

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzYxOTcyMTMxLCJleHAiOjE3NjQ1NjQxMzF9.CyE1NaM67FONrBf5xAxebknIlMKNd1kduK3YRu01hLM"
$baseUrl = "http://localhost:1337/api"

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "🚀 Testing Chat API..." -ForegroundColor Green
Write-Host ""

# Test 1: Send a message
Write-Host "📨 Test 1: Sending a message..." -ForegroundColor Yellow
$messageData = @{
    data = @{
        message = "Hello cricket community! Ready for the match? 🏏"
        messageType = "text"
        tags = @("cricket", "test")
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/chats" -Method POST -Body $messageData -Headers $headers
    Write-Host "✅ Message sent successfully!" -ForegroundColor Green
    Write-Host "Message ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Message: $($response.data.message)" -ForegroundColor Cyan
    Write-Host "Sender: $($response.data.sender.username)" -ForegroundColor Cyan
    $messageId = $response.data.id
} catch {
    Write-Host "❌ Failed to send message: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get all messages
Write-Host "📋 Test 2: Getting all messages..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/chats?page=1&pageSize=10" -Method GET -Headers $headers
    Write-Host "✅ Messages retrieved successfully!" -ForegroundColor Green
    Write-Host "Total messages: $($response.meta.pagination.total)" -ForegroundColor Cyan
    Write-Host "Messages on this page: $($response.data.Count)" -ForegroundColor Cyan
    if ($response.data.Count -gt 0) {
        Write-Host "Latest message: $($response.data[0].message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to get messages: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Add reaction (if we have a message ID)
if ($messageId) {
    Write-Host "👍 Test 3: Adding reaction to message..." -ForegroundColor Yellow
    $reactionData = @{
        emoji = "👍"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/chats/$messageId/reaction" -Method POST -Body $reactionData -Headers $headers
        Write-Host "✅ Reaction added successfully!" -ForegroundColor Green
        Write-Host "Reactions: $($response.data.reactions | ConvertTo-Json)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Failed to add reaction: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Chat API testing completed!" -ForegroundColor Green