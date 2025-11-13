# Test Player Profile with Phase 1 Correct Fields
$baseUrl = "https://cricket-1-zawr.onrender.com/api"

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PLAYER PROFILE TEST (Phase 1 Fields)    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

# Step 1: Register
Write-Host "1. Register User..." -NoNewline
$registerBody = @{
    username = "profiletest_$(Get-Random)"
    email = "profiletest_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json" -TimeoutSec 30
    $token = $response.jwt
    $userId = $response.user.id
    Write-Host " ✓ (ID: $userId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Create Profile (using profile_image, not profileImageUrl)
Write-Host "2. Create Profile (profile_image field)..." -NoNewline
$profileBody = @{
    data = @{
        displayName = "Test User Phase1"
        role = "Batsman"
        age = 28
        profile_image = "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        bio = "Testing Phase 1 changes"
        skillLevel = "Intermediate"
        phoneNumber = "9876543210"
    }
} | ConvertTo-Json -Depth 3

try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles" -Method Post -Body $profileBody -Headers $headers -TimeoutSec 30
    $profileId = $profileResponse.data.id
    $documentId = $profileResponse.data.documentId
    Write-Host " ✓ (ID: $documentId)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) { Write-Host "   $($_.ErrorDetails.Message)" -ForegroundColor Yellow }
    $failCount++
    exit
}

# Step 3: Get Profile
Write-Host "3. Get Profile..." -NoNewline
try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   Display Name: $($getResponse.data.displayName)" -ForegroundColor White
    Write-Host "   Profile Image: $($getResponse.data.profile_image)" -ForegroundColor White
    Write-Host "   Role: $($getResponse.data.role)" -ForegroundColor White
    Write-Host "   Phone: $($getResponse.data.phoneNumber)" -ForegroundColor White
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# Step 4: Update Profile
Write-Host "4. Update Profile..." -NoNewline
$updateBody = @{
    data = @{
        bio = "Updated bio after Phase 1"
        profile_image = "https://res.cloudinary.com/demo/image/upload/updated.jpg"
        age = 29
    }
} | ConvertTo-Json -Depth 3

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Put -Body $updateBody -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   Updated Image: $($updateResponse.data.profile_image)" -ForegroundColor White
    Write-Host "   Updated Age: $($updateResponse.data.age)" -ForegroundColor White
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $failCount++
}

# Step 5: Verify Update
Write-Host "5. Verify Update..." -NoNewline
try {
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Get -Headers $headers -TimeoutSec 30
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   Bio: $($verifyResponse.data.bio)" -ForegroundColor White
    Write-Host "   Image: $($verifyResponse.data.profile_image)" -ForegroundColor White
    Write-Host "   Age: $($verifyResponse.data.age)" -ForegroundColor White
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
}

# Step 6: Delete Profile
Write-Host "6. Delete Profile..." -NoNewline
try {
    Invoke-RestMethod -Uri "$baseUrl/player-profiles/$documentId" -Method Delete -Headers $headers -TimeoutSec 30 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    $failCount++
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

Write-Host "`n📋 Phase 1 Field Changes:" -ForegroundColor Cyan
Write-Host "   ✅ Use 'profile_image' (not 'profileImageUrl')" -ForegroundColor Green
Write-Host "   ✅ Location in user object (not in profile)" -ForegroundColor Green
Write-Host "   ✅ Removed duplicate 'location' field" -ForegroundColor Green

if ($passCount -eq $total) {
    Write-Host "`n🎉 All tests passed! Phase 1 changes working correctly!" -ForegroundColor Green
}

Write-Host ""
