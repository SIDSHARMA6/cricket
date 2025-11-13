# Test Render Live Deployment
$baseUrl = "https://cricket-1-zawr.onrender.com/api"

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     RENDER LIVE DEPLOYMENT TEST            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

# Test 1: Server Health Check
Write-Host "1. Server Health Check..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com" -Method Get -TimeoutSec 30 -ErrorAction Stop
    Write-Host " ✓ Server is online" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ Server offline or unreachable" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $failCount++
}

# Test 2: Register User
Write-Host "2. Register User..." -NoNewline
$registerBody = @{
    username = "rendertest_$(Get-Random)"
    email = "rendertest_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json" -TimeoutSec 30
    $token = $response.jwt
    $userId = $response.user.id
    Write-Host " ✓ (User ID: $userId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $failCount++
    $token = $null
}

if ($token) {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    # Test 3: Get Current User
    Write-Host "3. Get Current User..." -NoNewline
    try {
        $user = Invoke-RestMethod -Uri "$baseUrl/users/me" -Method Get -Headers $headers -TimeoutSec 30
        Write-Host " ✓ (Username: $($user.username))" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    # Test 4: Create Post
    Write-Host "4. Create Post..." -NoNewline
    $postBody = @{ 
        data = @{ 
            caption = "Testing Render deployment"
            visibility = "public"
        } 
    } | ConvertTo-Json -Depth 3

    try {
        $postResponse = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Post -Body $postBody -Headers $headers -TimeoutSec 30
        $postId = $postResponse.data.documentId
        Write-Host " ✓ (ID: $postId)" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    # Test 5: Create Match with entry_fee (Phase 1 change)
    Write-Host "5. Create Match (test entry_fee)..." -NoNewline
    $matchBody = @{ 
        data = @{ 
            ground_name = "Render Test Ground"
            date_time = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            total_Players_need = 22
            latitude = 28.6139
            longitude = 77.2090
            city = "Delhi"
            state = "Delhi"
            entry_fee = 150.75
        } 
    } | ConvertTo-Json -Depth 3

    try {
        $matchResponse = Invoke-RestMethod -Uri "$baseUrl/matches" -Method Post -Body $matchBody -Headers $headers -TimeoutSec 30
        $matchId = $matchResponse.data.documentId
        $entryFee = $matchResponse.data.entry_fee
        Write-Host " ✓ (ID: $matchId, Fee: $entryFee)" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $failCount++
    }

    # Test 6: Get All Posts
    Write-Host "6. Get All Posts..." -NoNewline
    try {
        $posts = Invoke-RestMethod -Uri "$baseUrl/posts?pagination[limit]=5" -Method Get -Headers $headers -TimeoutSec 30
        Write-Host " ✓ (Count: $($posts.data.Count))" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    # Test 7: Get All Matches
    Write-Host "7. Get All Matches..." -NoNewline
    try {
        $matches = Invoke-RestMethod -Uri "$baseUrl/matches?pagination[limit]=5" -Method Get -Headers $headers -TimeoutSec 30
        Write-Host " ✓ (Count: $($matches.data.Count))" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    # Test 8: Create Group
    Write-Host "8. Create Group..." -NoNewline
    $groupBody = @{ 
        data = @{ 
            name = "Render Test Group"
            type = "public"
        } 
    } | ConvertTo-Json -Depth 3

    try {
        $groupResponse = Invoke-RestMethod -Uri "$baseUrl/groups" -Method Post -Body $groupBody -Headers $headers -TimeoutSec 30
        Write-Host " ✓" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    # Test 9: Create Poll
    Write-Host "9. Create Poll..." -NoNewline
    $pollBody = @{ 
        data = @{ 
            question = "Render deployment test?"
            options = @("Yes", "No")
        } 
    } | ConvertTo-Json -Depth 3

    try {
        $pollResponse = Invoke-RestMethod -Uri "$baseUrl/polls" -Method Post -Body $pollBody -Headers $headers -TimeoutSec 30
        Write-Host " ✓" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    # Test 10: Create Comment
    Write-Host "10. Create Comment..." -NoNewline
    if ($postId) {
        $commentBody = @{ 
            data = @{ 
                text = "Test comment on Render"
                post = $postId
            } 
        } | ConvertTo-Json -Depth 3

        try {
            $commentResponse = Invoke-RestMethod -Uri "$baseUrl/comments" -Method Post -Body $commentBody -Headers $headers -TimeoutSec 30
            Write-Host " ✓" -ForegroundColor Green
            $passCount++
        } catch {
            Write-Host " ✗ FAIL" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host " ⊘ Skipped (no post)" -ForegroundColor Yellow
    }
}

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              TEST RESULTS                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan

$total = $passCount + $failCount
$percentage = if ($total -gt 0) { [math]::Round(($passCount / $total) * 100, 2) } else { 0 }

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 70) { "Yellow" } else { "Red" })

Write-Host "`n📊 Deployment Status:" -ForegroundColor Cyan
if ($passCount -ge 8) {
    Write-Host "✅ Render deployment is LIVE and working!" -ForegroundColor Green
    Write-Host "🌐 API URL: https://cricket-1-zawr.onrender.com/api" -ForegroundColor White
} elseif ($passCount -ge 5) {
    Write-Host "⚠️  Render deployment is partially working" -ForegroundColor Yellow
} else {
    Write-Host "❌ Render deployment has issues" -ForegroundColor Red
}

Write-Host ""
