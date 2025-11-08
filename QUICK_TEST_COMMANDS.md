# Quick Test Commands for Render API

## Prerequisites
You need a JWT token. Get one by registering or logging in:

### Get Authentication Token
```powershell
# Register new user
$body = '{"username":"testuser2025","email":"testuser2025@example.com","password":"Test@12345"}'
$response = Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/auth/local/register" -Method POST -Body $body -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).jwt
Write-Output "Token: $token"
```

Or login if user exists:
```powershell
# Login existing user
$body = '{"identifier":"testuser2025@example.com","password":"Test@12345"}'
$response = Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/auth/local" -Method POST -Body $body -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).jwt
Write-Output "Token: $token"
```

---

## 1. CREATE Player Profile

```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$body = @"
{
  "data": {
    "displayName": "John Doe",
    "age": 25,
    "birthday": "1999-05-15",
    "role": "Batsman",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "skillLevel": "Intermediate",
    "location": "Mumbai, India",
    "bio": "Passionate cricket player",
    "isAvailable": true,
    "rating": 4.5,
    "totalMatches": 45,
    "phoneNumber": "+91-9876543210",
    "emergencyContact": "+91-9876543211",
    "favoriteTeam": "Mumbai Indians",
    "stats": {
      "matchesPlayed": 45,
      "runsScored": 1250,
      "highestScore": 89,
      "average": 32.5,
      "strikeRate": 125.5,
      "centuries": 0,
      "halfCenturies": 8,
      "wicketsTaken": 12,
      "bowlingAverage": 28.5,
      "economyRate": 6.5,
      "bestBowling": "3/25",
      "catches": 15,
      "stumpings": 0,
      "runOuts": 3
    }
  }
}
"@

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$response = Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles" -Method POST -Body $body -Headers $headers
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 2. READ Single Profile

```powershell
# Replace 1 with actual profile ID
Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/1" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 3. READ All Profiles

```powershell
Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles?page=1&pageSize=10" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

---

## 4. UPDATE Profile (Including favoriteTeam)

```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$profileId = 1  # Replace with actual ID

$body = @"
{
  "data": {
    "displayName": "John Doe Updated",
    "bio": "Updated bio text",
    "age": 26,
    "location": "Delhi, India",
    "favoriteTeam": "Delhi Capitals",
    "rating": 4.7,
    "totalMatches": 50
  }
}
"@

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$response = Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/$profileId" -Method PUT -Body $body -Headers $headers
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 5. SEARCH Profiles

### Search by Role and Skill Level
```powershell
Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/search?role=Batsman&skillLevel=Professional" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### Search by Text Query
```powershell
Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/search?query=Mumbai" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### Search by Location
```powershell
Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/search?location=Delhi" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

---

## 6. DELETE Profile

```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$profileId = 1  # Replace with actual ID

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/$profileId" -Method DELETE -Headers $headers
```

---

## Using cURL (Alternative)

### CREATE
```bash
curl -X POST https://cricket-1-zawr.onrender.com/api/player-profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @test-player-complete.json
```

### READ
```bash
curl -X GET https://cricket-1-zawr.onrender.com/api/player-profiles/1
```

### UPDATE
```bash
curl -X PUT https://cricket-1-zawr.onrender.com/api/player-profiles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"data":{"displayName":"Updated Name","favoriteTeam":"India"}}'
```

### DELETE
```bash
curl -X DELETE https://cricket-1-zawr.onrender.com/api/player-profiles/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Test Files Created

- `test-player-complete.json` - Complete player profile data
- `test-update.json` - Update request body
- `test-register.json` - User registration data

Use these files with the `-d @filename` flag in cURL or `Get-Content filename -Raw` in PowerShell.
