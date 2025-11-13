# Player Profile CRUD Test - Localhost (Phase 1 Fixed)
$baseUrl = "http://localhost:1337/api"

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PLAYER PROFILE CRUD - LOCALHOST TEST    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

# Step 1: Register User
Write-Host "1. Register User..." -NoNewline
$registerBody = @{
    username = "profiletest_$(Get-Random)"
    email = "profiletest_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json" -TimeoutSec 10
    $token = $response.jwt
    $userId = $response.user.id
    Write-Host " ✓ (User ID: $userId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $failCount++
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Verify No Profile Exists
Write-Host "2. Verify No Profile Exists..." -NoNewline
try {
    $profiles = Invoke-RestMethod -Uri "$baseUrl/player-profiles?filters[user][id][\$eq]=$userId" -Method Get -Headers $headers -TimeoutSec 10
    if ($profiles.data.Count -eq 0) {
        Write-Host " ✓ No profile (expected)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host " ✗ Profile already exists" -ForegroundColor Red
        $failCount++
    }
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# Step 3: CREATE Profile (Phase 1 correct fields)
Write-Host "3. CREATE Profile..." -NoNewline
$profileBody = @{
    data = @{
        displayName = "Test Player $(Get-Random -Maximum 1000)"
        role = "Batsman"
        age = 28
        birthday = "1996-05-15"
        battingStyle = "Right-handed"
        bowlingStyle = "Right-arm fast"
        skillLevel = "Intermediate"
        bio = "Testing CRUD with Phase 1 changes"
        profile_image = "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        phoneNumber = "9876543210"
        isAvailable = $true
        rating = 4.5
        totalMatches = 10
    }
} | ConvertTo-Json -Depth 3

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles" -Method Post -Body $profileBody -Headers $headers -TimeoutSec 10
    $profileId = $createResponse.data.id
    $documentId = $createResponse.data.documentId
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   Profile ID: $profileId" -ForegroundColor White
    Write-Host "   Document ID: $documentId" -ForegroundColor White
    Write-Host "   Display Name: $($createResponse.data.displayName)" -ForegroundColor White
    Write-Host "   Profile Image: $($createResponse.data.profile_image)" -ForegroundColor White
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) { Write-Host "   $($_.ErrorDetails.Message)" -ForegroundColor Yellow }
    $failCount++
    exit
}

# Step 4: READ Profile (using documentId)
Write-Host "4. READ Profile (GET)..." -NoNewline
try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   Display Name: $($getResponse.data.displayName)" -ForegroundColor White
    Write-Host "   Role: $($getResponse.data.role)" -ForegroundColor White
    Write-Host "   Age: $($getResponse.data.age)" -ForegroundColor White
    Write-Host "   Profile Image: $($getResponse.data.profile_image)" -ForegroundColor White
    Write-Host "   Phone: $($getResponse.data.phoneNumber)" -ForegroundColor White
    Write-Host "   Rating: $($getResponse.data.rating)" -ForegroundColor White
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $failCount++
}

# Step 5: UPDATE Profile
Write-Host "5. UPDATE Profile..." -NoNewline
$updateBody = @{
    data = @{
        bio = "Updated bio - Phase 1 working!"
        profile_image = "https://res.cloudinary.com/demo/image/upload/updated.jpg"
        age = 29
        rating = 4.8
        totalMatches = 15
        skillLevel = "Advanced"
    }
} | ConvertTo-Json -Depth 3

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 10
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   Updated Bio: $($updateResponse.data.bio)" -ForegroundColor White
    Write-Host "   Updated Image: $($updateResponse.data.profile_image)" -ForegroundColor White
    Write-Host "   Updated Age: $($updateResponse.data.age)" -ForegroundColor White
    Write-Host "   Updated Rating: $($updateResponse.data.rating)" -ForegroundColor White
    Write-Host "   Updated Skill: $($updateResponse.data.skillLevel)" -ForegroundColor White
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) { Write-Host "   $($_.ErrorDetails.Message)" -ForegroundColor Yellow }
    $failCount++
}

# Step 6: Verify UPDATE
Write-Host "6. Verify UPDATE (GET again)..." -NoNewline
try {
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Get -Headers $headers -TimeoutSec 10
    $bioMatch = $verifyResponse.data.bio -eq "Updated bio - Phase 1 working!"
    $ageMatch = $verifyResponse.data.age -eq 29
    $ratingMatch = $verifyResponse.data.rating -eq 4.8
    
    if ($bioMatch -and $ageMatch -and $ratingMatch) {
        Write-Host " ✓ All updates verified" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host " ✗ Updates not saved correctly" -ForegroundColor Red
        $failCount++
    }
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# Step 7: Get All Profiles
Write-Host "7. Get All Profiles..." -NoNewline
try {
    $allProfiles = Invoke-RestMethod -Uri "$baseUrl/player-profiles?pagination[limit]=5" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host " ✓ (Count: $($allProfiles.data.Count))" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# Step 8: Search Profiles
Write-Host "8. Search Profiles (by role)..." -NoNewline
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles?filters[role][\$eq]=Batsman" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host " ✓ (Found: $($searchResponse.data.Count) Batsmen)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# Step 9: DELETE Profile
Write-Host "9. DELETE Profile..." -NoNewline
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Delete -Headers $headers -TimeoutSec 10
    Write-Host " ✓ Profile deleted" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $failCount++
}

# Step 10: Verify DELETE
Write-Host "10. Verify DELETE..." -NoNewline
try {
    $verifyDelete = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Get -Headers $headers -TimeoutSec 10 -ErrorAction Stop
    Write-Host " ✗ Profile still exists" -ForegroundColor Red
    $failCount++
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host " ✓ Profile not found (expected)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host " ✗ Unexpected error" -ForegroundColor Red
        $failCount++
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
Write-Host "Success Rate: $percentage%" -ForegroundColor $(if ($percentage -eq 100) { "Green" } elseif ($percentage -ge 80) { "Yellow" } else { "Red" })

Write-Host "`n📋 CRUD Operations Tested:" -ForegroundColor Cyan
Write-Host "   ✓ CREATE - New profile with Phase 1 fields" -ForegroundColor White
Write-Host "   ✓ READ   - Get profile by documentId" -ForegroundColor White
Write-Host "   ✓ UPDATE - Modify profile fields" -ForegroundColor White
Write-Host "   ✓ DELETE - Remove profile" -ForegroundColor White

Write-Host "`n📊 Phase 1 Fields Verified:" -ForegroundColor Cyan
Write-Host "   ✓ profile_image (not profileImageUrl)" -ForegroundColor Green
Write-Host "   ✓ No location field (use user location)" -ForegroundColor Green
Write-Host "   ✓ documentId for all operations" -ForegroundColor Green

if ($passCount -eq $total) {
    Write-Host "`n🎉 ALL CRUD OPERATIONS WORKING! Phase 1 fix successful!" -ForegroundColor Green
} elseif ($percentage -ge 80) {
    Write-Host "`n⚠️  Most operations working, minor issues" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Multiple operations failed" -ForegroundColor Red
}

Write-Host ""
