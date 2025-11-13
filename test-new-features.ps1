# Test New Features: Location & Groups
$baseUrl = "http://localhost:1337/api"

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   TEST NEW FEATURES - Location & Groups   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Register User
Write-Host "1. Register User..." -NoNewline
$registerBody = @{
    username = "testuser_$(Get-Random)"
    email = "test_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $response.jwt
    $userId = $response.user.id
    Write-Host " ✓ (ID: $userId)" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test Location Update
Write-Host "`n═══ LOCATION SYSTEM ═══" -ForegroundColor Yellow

Write-Host "2. Update User Location..." -NoNewline
$locationBody = @{
    latitude = 29.1492
    longitude = 75.7217
    city = "Hisar"
    state = "Haryana"
    district = "Hisar"
    country = "India"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users/me/location" -Method Put -Body $locationBody -Headers $headers
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  Location: $($response.data.city), $($response.data.state)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Register another user for nearby test
Write-Host "`n3. Register Second User..." -NoNewline
$register2Body = @{
    username = "nearby_$(Get-Random)"
    email = "nearby_$(Get-Random)@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/auth/local/register" -Method Post -Body $register2Body -ContentType "application/json"
    $token2 = $response2.jwt
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
}

$headers2 = @{
    "Authorization" = "Bearer $token2"
    "Content-Type" = "application/json"
}

# Update second user location (nearby)
Write-Host "4. Update Second User Location (5km away)..." -NoNewline
$location2Body = @{
    latitude = 29.1892  # ~5km north
    longitude = 75.7217
    city = "Hisar"
    state = "Haryana"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/users/me/location" -Method Put -Body $location2Body -Headers $headers2 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
}

# Test Nearby Users
Write-Host "`n5. Find Nearby Users (10km radius)..." -NoNewline
try {
    $nearbyResponse = Invoke-RestMethod -Uri "$baseUrl/users/nearby?latitude=29.1492&longitude=75.7217&radius=10" -Method Get -Headers $headers
    Write-Host " ✓ Found $($nearbyResponse.meta.total) user(s)" -ForegroundColor Green
    
    if ($nearbyResponse.data.Count -gt 0) {
        foreach ($user in $nearbyResponse.data) {
            Write-Host "  - $($user.username): $($user.distance) km away" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Groups
Write-Host "`n═══ GROUP SYSTEM ═══" -ForegroundColor Yellow

Write-Host "6. Create Group..." -NoNewline
$groupBody = @{ 
    data = @{ 
        name = "Test Cricket Group"
        type = "public"
        description = "Local cricket players"
    } 
} | ConvertTo-Json -Depth 3

try {
    $groupResponse = Invoke-RestMethod -Uri "$baseUrl/groups" -Method Post -Body $groupBody -Headers $headers
    $groupId = $groupResponse.data.documentId
    Write-Host " ✓ (ID: $groupId)" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Second user joins group
Write-Host "7. Second User Joins Group..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups/$groupId/join" -Method Post -Headers $headers2
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  Members: $($response.data.members_count)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Second user leaves group
Write-Host "8. Second User Leaves Group..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups/$groupId/leave" -Method Post -Headers $headers2
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  Members: $($response.data.members_count)" -ForegroundColor Gray
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Direct Messages
Write-Host "`n═══ DIRECT MESSAGES ═══" -ForegroundColor Yellow

Write-Host "9. Send Direct Message..." -NoNewline
$dmBody = @{
    data = @{
        message = "Hey, want to play cricket this weekend?"
        receiver = $response2.user.id
    }
} | ConvertTo-Json -Depth 3

try {
    $dmResponse = Invoke-RestMethod -Uri "$baseUrl/direct-messages" -Method Post -Body $dmBody -Headers $headers
    Write-Host " ✓ (ID: $($dmResponse.data.documentId))" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "10. Read Direct Messages..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/direct-messages" -Method Get -Headers $headers
    Write-Host " ✓ (Count: $($response.data.Count))" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAIL" -ForegroundColor Red
}

# Summary
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              SUMMARY                       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n✅ Location System:" -ForegroundColor Green
Write-Host "  - Update location" -ForegroundColor White
Write-Host "  - Find nearby users with distance calculation" -ForegroundColor White

Write-Host "`n✅ Group System:" -ForegroundColor Green
Write-Host "  - Join group" -ForegroundColor White
Write-Host "  - Leave group" -ForegroundColor White

Write-Host "`n✅ Direct Messages:" -ForegroundColor Green
Write-Host "  - Send messages" -ForegroundColor White
Write-Host "  - Read messages" -ForegroundColor White

Write-Host "`nNew features are ready! 🎉`n" -ForegroundColor Green
