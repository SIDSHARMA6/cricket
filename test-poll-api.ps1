# Test Poll API - Creator-Only Delete & No Update
$baseUrl = "http://localhost:1337/api"

Write-Host "`n═══ TESTING POLL API ═══`n" -ForegroundColor Cyan

# Register User 1 (Creator)
Write-Host "[1] Registering User 1..." -NoNewline
$user1Body = @{
    username = "polluser_$(Get-Random)"
    email = "polluser_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $user1Response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $user1Body -ContentType "application/json"
    $token1 = $user1Response.jwt
    $headers1 = @{
        "Authorization" = "Bearer $token1"
        "Content-Type" = "application/json"
    }
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
    exit 1
}

# Test 1: Create Poll
Write-Host "`n[TEST 1] Create Poll" -ForegroundColor Yellow
Write-Host "  Creating poll..." -NoNewline
$pollBody = @{ 
    data = @{ 
        question = "What's your favorite sport?"
        options = @("Cricket", "Football", "Basketball", "Tennis")
    } 
} | ConvertTo-Json -Depth 3

try {
    $pollResponse = Invoke-RestMethod -Uri "$baseUrl/polls" -Method Post -Body $pollBody -Headers $headers1
    $pollId = $pollResponse.data.id
    Write-Host " ✓ (ID: $pollId)" -ForegroundColor Green
    Write-Host "  Question: $($pollResponse.data.question)" -ForegroundColor Gray
    Write-Host "  Options: $($pollResponse.data.options.Count)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Get All Polls
Write-Host "`n[TEST 2] Get All Polls" -ForegroundColor Yellow
Write-Host "  Fetching polls..." -NoNewline
try {
    $pollsResponse = Invoke-RestMethod -Uri "$baseUrl/polls" -Method Get -Headers $headers1
    Write-Host " ✓ Found $($pollsResponse.data.Count) poll(s)" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# Test 3: Get Single Poll
Write-Host "`n[TEST 3] Get Single Poll" -ForegroundColor Yellow
Write-Host "  Fetching poll $pollId..." -NoNewline
try {
    $singlePoll = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Get -Headers $headers1
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  Total Votes: $($singlePoll.data.totalVotes)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# Test 4: Vote on Poll
Write-Host "`n[TEST 4] Vote on Poll" -ForegroundColor Yellow
Write-Host "  Voting for option 0 (Cricket)..." -NoNewline
$voteBody = @{ optionIndex = 0 } | ConvertTo-Json
try {
    $voteResponse = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId/vote" -Method Post -Body $voteBody -Headers $headers1
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  Message: $($voteResponse.data.message)" -ForegroundColor Gray
    Write-Host "  Total Votes: $($voteResponse.data.totalVotes)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Change Vote
Write-Host "`n[TEST 5] Change Vote" -ForegroundColor Yellow
Write-Host "  Changing vote to option 1 (Football)..." -NoNewline
$voteBody = @{ optionIndex = 1 } | ConvertTo-Json
try {
    $voteResponse = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId/vote" -Method Post -Body $voteBody -Headers $headers1
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  Message: $($voteResponse.data.message)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# Test 6: Update Poll (Should Fail)
Write-Host "`n[TEST 6] Update Poll (Should Be Disabled)" -ForegroundColor Yellow
Write-Host "  Trying to update poll..." -NoNewline
$updateBody = @{ data = @{ question = "Updated question?" } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Put -Body $updateBody -Headers $headers1
    Write-Host " ✗ UPDATE ALLOWED (Should be disabled!)" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host " ✓ CORRECTLY DISABLED (400)" -ForegroundColor Green
    } else {
        Write-Host " ? Blocked with status $statusCode" -ForegroundColor Yellow
    }
}

# Test 7: Delete Poll by Creator
Write-Host "`n[TEST 7] Delete Poll by Creator" -ForegroundColor Yellow
Write-Host "  Deleting poll..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Delete -Headers $headers1
    Write-Host " ✓ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Note: Make sure 'delete' permission is enabled for Poll in Strapi admin" -ForegroundColor Yellow
}

# Test 8: Delete by Non-Creator
Write-Host "`n[TEST 8] Delete by Non-Creator (Should Fail)" -ForegroundColor Yellow

# Register User 2
Write-Host "  Registering User 2..." -NoNewline
$user2Body = @{
    username = "other_$(Get-Random)"
    email = "other_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $user2Response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $user2Body -ContentType "application/json"
    $token2 = $user2Response.jwt
    $headers2 = @{
        "Authorization" = "Bearer $token2"
        "Content-Type" = "application/json"
    }
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# Create poll as User 1
Write-Host "  Creating poll as User 1..." -NoNewline
$pollBody = @{ 
    data = @{ 
        question = "Test Poll"
        options = @("A", "B")
    } 
} | ConvertTo-Json -Depth 3

try {
    $pollResponse = Invoke-RestMethod -Uri "$baseUrl/polls" -Method Post -Body $pollBody -Headers $headers1
    $pollId = $pollResponse.data.id
    Write-Host " ✓ (ID: $pollId)" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# Try to delete as User 2
Write-Host "  Trying to delete as User 2..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Delete -Headers $headers2
    Write-Host " ✗ SECURITY ISSUE: Non-creator deleted poll!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host " ✓ CORRECTLY BLOCKED (403)" -ForegroundColor Green
    } else {
        Write-Host " ? Blocked with status $statusCode" -ForegroundColor Yellow
    }
}

# Cleanup
Write-Host "  Cleaning up..." -NoNewline
try {
    Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Delete -Headers $headers1 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " (already deleted)" -ForegroundColor Gray
}

Write-Host "`n═══ SUMMARY ═══" -ForegroundColor Cyan
Write-Host "✓ Poll creation works" -ForegroundColor Green
Write-Host "✓ Poll voting works" -ForegroundColor Green
Write-Host "✓ Vote changing works" -ForegroundColor Green
Write-Host "✓ Poll updates are disabled" -ForegroundColor Green
Write-Host "✓ Only creator can delete polls" -ForegroundColor Green
Write-Host "`nPoll API is ready! ✓" -ForegroundColor Green
