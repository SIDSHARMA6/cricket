# Complete API Test - Render Live Deployment
$baseUrl = "https://cricket-1-zawr.onrender.com/api"

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  RENDER COMPLETE API TEST - ALL ENDPOINTS  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

# ═══════════════════════════════════════════
# AUTHENTICATION
# ═══════════════════════════════════════════
Write-Host "═══ AUTHENTICATION ═══" -ForegroundColor Yellow

Write-Host "1. Register User..." -NoNewline
$registerBody = @{
    username = "rendertest_$(Get-Random)"
    email = "rendertest_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json" -TimeoutSec 30
    $token = $response.jwt
    $userId = $response.user.id
    $username = $response.user.username
    Write-Host " ✓ (ID: $userId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "2. Login User..." -NoNewline
$loginBody = @{
    identifier = $response.user.email
    password = "Test123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/local" -Method Post -Body $loginBody -ContentType "application/json" -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# POSTS
# ═══════════════════════════════════════════
Write-Host "`n═══ POSTS ═══" -ForegroundColor Yellow

Write-Host "3. Create Post..." -NoNewline
$postBody = @{ data = @{ caption = "Render Test Post"; visibility = "public" } } | ConvertTo-Json -Depth 3
try {
    $postResponse = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Post -Body $postBody -Headers $headers -TimeoutSec 30
    $postId = $postResponse.data.documentId
    Write-Host " ✓ (ID: $postId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "4. Read All Posts..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓ (Count: $($response.data.Count))" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "5. Read Single Post..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$postId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "6. Update Post..." -NoNewline
$updateBody = @{ data = @{ caption = "Updated on Render" } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$postId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "7. Delete Post..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$postId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# COMMENTS
# ═══════════════════════════════════════════
Write-Host "`n═══ COMMENTS ═══" -ForegroundColor Yellow

# Create a post for comments
$postBody = @{ data = @{ caption = "Post for comments" } } | ConvertTo-Json -Depth 3
$postResponse = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Post -Body $postBody -Headers $headers -TimeoutSec 30
$postId = $postResponse.data.documentId

Write-Host "8. Create Comment..." -NoNewline
$commentBody = @{ data = @{ text = "Test comment"; post = $postId } } | ConvertTo-Json -Depth 3
try {
    $commentResponse = Invoke-RestMethod -Uri "$baseUrl/comments" -Method Post -Body $commentBody -Headers $headers -TimeoutSec 30
    $commentId = $commentResponse.data.documentId
    Write-Host " ✓ (ID: $commentId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "9. Read All Comments..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/comments" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "10. Read Single Comment..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/comments/$commentId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "11. Delete Comment..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/comments/$commentId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# POLLS
# ═══════════════════════════════════════════
Write-Host "`n═══ POLLS ═══" -ForegroundColor Yellow

Write-Host "12. Create Poll..." -NoNewline
$pollBody = @{ data = @{ question = "Favorite sport?"; options = @("Cricket", "Football") } } | ConvertTo-Json -Depth 3
try {
    $pollResponse = Invoke-RestMethod -Uri "$baseUrl/polls" -Method Post -Body $pollBody -Headers $headers -TimeoutSec 30
    $pollId = $pollResponse.data.documentId
    Write-Host " ✓ (ID: $pollId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "13. Read All Polls..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "14. Read Single Poll..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "15. Update Poll..." -NoNewline
$updateBody = @{ data = @{ question = "Updated question?" } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "16. Delete Poll..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/polls/$pollId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# MATCHES (Test Phase 1 entry_fee change)
# ═══════════════════════════════════════════
Write-Host "`n═══ MATCHES ═══" -ForegroundColor Yellow

Write-Host "17. Create Match (test entry_fee)..." -NoNewline
$matchBody = @{ 
    data = @{ 
        ground_name = "Render Test Ground"
        date_time = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        total_Players_need = 22
        latitude = 28.6139
        longitude = 77.2090
        city = "Delhi"
        entry_fee = 150.75
    } 
} | ConvertTo-Json -Depth 3

try {
    $matchResponse = Invoke-RestMethod -Uri "$baseUrl/matches" -Method Post -Body $matchBody -Headers $headers -TimeoutSec 30
    $matchId = $matchResponse.data.documentId
    Write-Host " ✓ (ID: $matchId, Fee: $($matchResponse.data.entry_fee))" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "18. Read All Matches..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/matches" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "19. Read Single Match..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/matches/$matchId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "20. Update Match..." -NoNewline
$updateBody = @{ data = @{ ground_name = "Updated Ground" } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/matches/$matchId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "21. Delete Match..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/matches/$matchId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# GROUPS
# ═══════════════════════════════════════════
Write-Host "`n═══ GROUPS ═══" -ForegroundColor Yellow

Write-Host "22. Create Group..." -NoNewline
$groupBody = @{ data = @{ name = "Render Test Group"; type = "public" } } | ConvertTo-Json -Depth 3
try {
    $groupResponse = Invoke-RestMethod -Uri "$baseUrl/groups" -Method Post -Body $groupBody -Headers $headers -TimeoutSec 30
    $groupId = $groupResponse.data.documentId
    Write-Host " ✓ (ID: $groupId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "23. Read All Groups..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "24. Read Single Group..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups/$groupId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "25. Update Group..." -NoNewline
$updateBody = @{ data = @{ description = "Updated description" } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups/$groupId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "26. Delete Group..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups/$groupId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TEAMS
# ═══════════════════════════════════════════
Write-Host "`n═══ TEAMS ═══" -ForegroundColor Yellow

Write-Host "27. Create Team..." -NoNewline
$teamBody = @{ data = @{ name = "Render Test Team"; city = "Mumbai" } } | ConvertTo-Json -Depth 3
try {
    $teamResponse = Invoke-RestMethod -Uri "$baseUrl/teams" -Method Post -Body $teamBody -Headers $headers -TimeoutSec 30
    $teamId = $teamResponse.data.documentId
    Write-Host " ✓ (ID: $teamId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "28. Read All Teams..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/teams" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "29. Read Single Team..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/teams/$teamId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "30. Update Team..." -NoNewline
$updateBody = @{ data = @{ wins = 5 } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/teams/$teamId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "31. Delete Team..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/teams/$teamId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TOURNAMENTS
# ═══════════════════════════════════════════
Write-Host "`n═══ TOURNAMENTS ═══" -ForegroundColor Yellow

Write-Host "32. Create Tournament..." -NoNewline
$tournamentBody = @{ 
    data = @{ 
        name = "Render Test Tournament"
        start_date = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
        format = "knockout"
    } 
} | ConvertTo-Json -Depth 3

try {
    $tournamentResponse = Invoke-RestMethod -Uri "$baseUrl/tournaments" -Method Post -Body $tournamentBody -Headers $headers -TimeoutSec 30
    $tournamentId = $tournamentResponse.data.documentId
    Write-Host " ✓ (ID: $tournamentId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "33. Read All Tournaments..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tournaments" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "34. Read Single Tournament..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tournaments/$tournamentId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "35. Update Tournament..." -NoNewline
$updateBody = @{ data = @{ status = "ongoing" } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tournaments/$tournamentId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "36. Delete Tournament..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tournaments/$tournamentId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# ACHIEVEMENTS
# ═══════════════════════════════════════════
Write-Host "`n═══ ACHIEVEMENTS ═══" -ForegroundColor Yellow

Write-Host "37. Create Achievement..." -NoNewline
$achievementBody = @{ 
    data = @{ 
        name = "Render Test Achievement"
        badge_type = "bronze"
        points = 10
    } 
} | ConvertTo-Json -Depth 3

try {
    $achievementResponse = Invoke-RestMethod -Uri "$baseUrl/achievements" -Method Post -Body $achievementBody -Headers $headers -TimeoutSec 30
    $achievementId = $achievementResponse.data.documentId
    Write-Host " ✓ (ID: $achievementId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "38. Read All Achievements..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/achievements" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "39. Read Single Achievement..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/achievements/$achievementId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "40. Update Achievement..." -NoNewline
$updateBody = @{ data = @{ points = 20 } } | ConvertTo-Json -Depth 3
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/achievements/$achievementId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "41. Delete Achievement..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/achievements/$achievementId" -Method Delete -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# REPORTS
# ═══════════════════════════════════════════
Write-Host "`n═══ REPORTS ═══" -ForegroundColor Yellow

Write-Host "42. Create Report..." -NoNewline
$reportBody = @{ data = @{ reason = "Test report on Render" } } | ConvertTo-Json -Depth 3
try {
    $reportResponse = Invoke-RestMethod -Uri "$baseUrl/reports" -Method Post -Body $reportBody -Headers $headers -TimeoutSec 30
    $reportId = $reportResponse.data.documentId
    Write-Host " ✓ (ID: $reportId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "43. Read All Reports..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reports" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host "44. Read Single Report..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reports/$reportId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              TEST RESULTS                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan

$total = $passCount + $failCount
$percentage = [math]::Round(($passCount / $total) * 100, 2)

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 70) { "Yellow" } else { "Red" })

Write-Host "`n🌐 Render Deployment Status:" -ForegroundColor Cyan
Write-Host "URL: https://cricket-1-zawr.onrender.com" -ForegroundColor White

if ($failCount -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Render deployment is 100% ready!" -ForegroundColor Green
} elseif ($failCount -le 5) {
    Write-Host "`n⚠️  Most tests passed. Check failed tests above." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Multiple tests failed. Review deployment." -ForegroundColor Red
}

Write-Host ""
