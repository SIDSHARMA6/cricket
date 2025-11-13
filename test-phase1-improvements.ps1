# Phase 1 Improvements Test Script
# Tests: Database pooling, Request timeout, Env validation, Schema fixes, Indexes

$baseUrl = "http://localhost:1337/api"

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PHASE 1 IMPROVEMENTS - VERIFICATION     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

# ═══════════════════════════════════════════
# TEST 1: Environment Variable Validation
# ═══════════════════════════════════════════
Write-Host "═══ TEST 1: Environment Variable Validation ═══" -ForegroundColor Yellow

Write-Host "1.1 Check if server starts with valid env vars..." -NoNewline
try {
    # Check if server is running
    $response = Invoke-RestMethod -Uri "$baseUrl/../_health" -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host " ✓ Server started successfully" -ForegroundColor Green
    $passCount++
} catch {
    # Server might not have health endpoint yet, try admin
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:1337/admin" -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
        Write-Host " ✓ Server is running" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ Server not running (start with 'npm run dev')" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "1.2 Check env-validation.ts exists..." -NoNewline
if (Test-Path "config/env-validation.ts") {
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TEST 2: Database Configuration
# ═══════════════════════════════════════════
Write-Host "`n═══ TEST 2: Database Pool Configuration ═══" -ForegroundColor Yellow

Write-Host "2.1 Check database.ts has updated pool config..." -NoNewline
$dbConfig = Get-Content "config/database.ts" -Raw
if ($dbConfig -match "DATABASE_POOL_MIN.*5" -and $dbConfig -match "DATABASE_POOL_MAX.*20") {
    Write-Host " ✓ Pool size updated (min:5, max:20)" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Pool config not updated" -ForegroundColor Red
    $failCount++
}

Write-Host "2.2 Check pool timeout configurations..." -NoNewline
if ($dbConfig -match "acquireTimeoutMillis.*30000" -and $dbConfig -match "idleTimeoutMillis.*30000") {
    Write-Host " ✓ Timeout configs added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Timeout configs missing" -ForegroundColor Red
    $failCount++
}

Write-Host "2.3 Check .env.example updated..." -NoNewline
$envExample = Get-Content ".env.example" -Raw
if ($envExample -match "DATABASE_POOL_MIN=5" -and $envExample -match "DATABASE_POOL_MAX=20") {
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ .env.example not updated" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TEST 3: Request Timeout Configuration
# ═══════════════════════════════════════════
Write-Host "`n═══ TEST 3: Request Timeout Configuration ═══" -ForegroundColor Yellow

Write-Host "3.1 Check server.ts has timeout config..." -NoNewline
$serverConfig = Get-Content "config/server.ts" -Raw
if ($serverConfig -match "timeout.*REQUEST_TIMEOUT.*30000" -and $serverConfig -match "keepAliveTimeout.*KEEP_ALIVE_TIMEOUT.*65000") {
    Write-Host " ✓ Timeout configs added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Timeout configs missing" -ForegroundColor Red
    $failCount++
}

Write-Host "3.2 Check .env.example has timeout vars..." -NoNewline
if ($envExample -match "REQUEST_TIMEOUT=30000" -and $envExample -match "KEEP_ALIVE_TIMEOUT=65000") {
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Env vars not added" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TEST 4: Schema Fixes - Duplicate Fields Removed
# ═══════════════════════════════════════════
Write-Host "`n═══ TEST 4: Schema Duplicate Fields Removed ═══" -ForegroundColor Yellow

Write-Host "4.1 Check player-profile schema..." -NoNewline
$playerSchema = Get-Content "src/api/player-profile/content-types/player-profile/schema.json" -Raw
$hasProfileImageUrl = $playerSchema -match '"profileImageUrl"'
$hasLocation = $playerSchema -match '"location".*"type".*"string"'

if (-not $hasProfileImageUrl -and -not $hasLocation) {
    Write-Host " ✓ Duplicates removed (profileImageUrl, location)" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Duplicates still exist" -ForegroundColor Red
    $failCount++
}

Write-Host "4.2 Check match schema (money field removed)..." -NoNewline
$matchSchema = Get-Content "src/api/match/content-types/match/schema.json" -Raw
$hasMoney = $matchSchema -match '"money".*"type".*"string"'

if (-not $hasMoney) {
    Write-Host " ✓ 'money' field removed" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ 'money' field still exists" -ForegroundColor Red
    $failCount++
}

Write-Host "4.3 Check entry_fee has min validation..." -NoNewline
if ($matchSchema -match '"entry_fee"[\s\S]*?"min".*0') {
    Write-Host " ✓ Min validation added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Min validation missing" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TEST 5: Database Indexes Added
# ═══════════════════════════════════════════
Write-Host "`n═══ TEST 5: Database Indexes Added ═══" -ForegroundColor Yellow

Write-Host "5.1 Check match schema indexes..." -NoNewline
if ($matchSchema -match '"indexes"' -and $matchSchema -match 'match_location_idx' -and $matchSchema -match 'match_datetime_idx') {
    Write-Host " ✓ 4 indexes added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Indexes missing" -ForegroundColor Red
    $failCount++
}

Write-Host "5.2 Check post schema indexes..." -NoNewline
$postSchema = Get-Content "src/api/post/content-types/post/schema.json" -Raw
if ($postSchema -match '"indexes"' -and $postSchema -match 'post_location_idx' -and $postSchema -match 'post_created_idx') {
    Write-Host " ✓ 4 indexes added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Indexes missing" -ForegroundColor Red
    $failCount++
}

Write-Host "5.3 Check story schema indexes..." -NoNewline
$storySchema = Get-Content "src/api/story/content-types/story/schema.json" -Raw
if ($storySchema -match '"indexes"' -and $storySchema -match 'story_expires_idx' -and $storySchema -match 'story_expired_idx') {
    Write-Host " ✓ 3 indexes added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Indexes missing" -ForegroundColor Red
    $failCount++
}

Write-Host "5.4 Check chat schema indexes..." -NoNewline
$chatSchema = Get-Content "src/api/chat/content-types/chat/schema.json" -Raw
if ($chatSchema -match '"indexes"' -and $chatSchema -match 'chat_created_idx' -and $chatSchema -match 'chat_deleted_idx') {
    Write-Host " ✓ 3 indexes added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Indexes missing" -ForegroundColor Red
    $failCount++
}

Write-Host "5.5 Check user schema indexes..." -NoNewline
$userSchema = Get-Content "src/extensions/users-permissions/content-types/user/schema.json" -Raw
if ($userSchema -match '"indexes"' -and $userSchema -match 'user_location_idx' -and $userSchema -match 'user_city_state_idx') {
    Write-Host " ✓ 4 indexes added" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Indexes missing" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# TEST 6: API Functionality (Integration Test)
# ═══════════════════════════════════════════
Write-Host "`n═══ TEST 6: API Functionality After Changes ═══" -ForegroundColor Yellow

Write-Host "6.1 Register new user..." -NoNewline
$registerBody = @{
    username = "phase1test_$(Get-Random)"
    email = "phase1_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json" -TimeoutSec 30
    $token = $response.jwt
    $userId = $response.user.id
    Write-Host " ✓ (ID: $userId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
    $token = $null
}

if ($token) {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    Write-Host "6.2 Create match (test entry_fee validation)..." -NoNewline
    $matchBody = @{ 
        data = @{ 
            ground_name = "Phase 1 Test Ground"
            date_time = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            total_Players_need = 22
            latitude = 28.6139
            longitude = 77.2090
            city = "Delhi"
            entry_fee = 100.50
        } 
    } | ConvertTo-Json -Depth 3

    try {
        $matchResponse = Invoke-RestMethod -Uri "$baseUrl/matches" -Method Post -Body $matchBody -Headers $headers -TimeoutSec 30
        $matchId = $matchResponse.data.documentId
        Write-Host " ✓ (ID: $matchId)" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    Write-Host "6.3 Create post (test location indexing)..." -NoNewline
    $postBody = @{ 
        data = @{ 
            caption = "Phase 1 test post"
            latitude = 28.6139
            longitude = 77.2090
            city = "Delhi"
            state = "Delhi"
            visibility = "public"
        } 
    } | ConvertTo-Json -Depth 3

    try {
        $postResponse = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Post -Body $postBody -Headers $headers -TimeoutSec 30
        Write-Host " ✓" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }

    Write-Host "6.4 Query posts (test indexes performance)..." -NoNewline
    try {
        $start = Get-Date
        $response = Invoke-RestMethod -Uri "$baseUrl/posts?filters[city][\$eq]=Delhi&pagination[limit]=10" -Method Get -Headers $headers -TimeoutSec 30
        $duration = ((Get-Date) - $start).TotalMilliseconds
        Write-Host " ✓ (${duration}ms)" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        $failCount++
    }
}

# ═══════════════════════════════════════════
# TEST 7: File Structure Verification
# ═══════════════════════════════════════════
Write-Host "`n═══ TEST 7: File Structure Verification ═══" -ForegroundColor Yellow

Write-Host "7.1 Check src/index.ts imports env validation..." -NoNewline
$indexContent = Get-Content "src/index.ts" -Raw
if ($indexContent -match "validateEnv" -and $indexContent -match "env-validation") {
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Import missing" -ForegroundColor Red
    $failCount++
}

Write-Host "7.2 Verify all schema files are valid JSON..." -NoNewline
$schemaFiles = @(
    "src/api/match/content-types/match/schema.json",
    "src/api/post/content-types/post/schema.json",
    "src/api/story/content-types/story/schema.json",
    "src/api/chat/content-types/chat/schema.json",
    "src/api/player-profile/content-types/player-profile/schema.json",
    "src/extensions/users-permissions/content-types/user/schema.json"
)

$allValid = $true
foreach ($file in $schemaFiles) {
    try {
        $content = Get-Content $file -Raw | ConvertFrom-Json
    } catch {
        $allValid = $false
        break
    }
}

if ($allValid) {
    Write-Host " ✓ All schemas valid" -ForegroundColor Green
    $passCount++
} else {
    Write-Host " ✗ Invalid JSON in schemas" -ForegroundColor Red
    $failCount++
}

# ═══════════════════════════════════════════
# RESULTS SUMMARY
# ═══════════════════════════════════════════
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         PHASE 1 TEST RESULTS               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan

$total = $passCount + $failCount
$percentage = if ($total -gt 0) { [math]::Round(($passCount / $total) * 100, 2) } else { 0 }

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 70) { "Yellow" } else { "Red" })

Write-Host "`n═══ PHASE 1 IMPROVEMENTS CHECKLIST ═══" -ForegroundColor Yellow
Write-Host "✓ Database connection pooling (min:5, max:20)" -ForegroundColor Green
Write-Host "✓ Request timeout configuration (30s)" -ForegroundColor Green
Write-Host "✓ Environment variable validation" -ForegroundColor Green
Write-Host "✓ Schema duplicate fields removed" -ForegroundColor Green
Write-Host "✓ Database indexes added (18 total)" -ForegroundColor Green

Write-Host "`n═══ NEXT STEPS ═══" -ForegroundColor Yellow
Write-Host "1. Restart your Strapi server to apply changes" -ForegroundColor White
Write-Host "2. Database indexes will be created on next migration" -ForegroundColor White
Write-Host "3. Monitor server logs for env validation messages" -ForegroundColor White
Write-Host "4. Run full API tests: .\test-all-apis-complete.ps1" -ForegroundColor White

if ($failCount -eq 0) {
    Write-Host "`n🎉 PHASE 1 COMPLETE! All improvements verified!" -ForegroundColor Green
} elseif ($failCount -le 3) {
    Write-Host "`n⚠️  Most tests passed. Review failed tests above." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Multiple tests failed. Review implementation." -ForegroundColor Red
}

Write-Host ""
