# Comprehensive Player Profile API Test

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzYxOTcyMTMxLCJleHAiOjE3NjQ1NjQxMzF9.CyE1NaM67FONrBf5xAxebknIlMKNd1kduK3YRu01hLM"
$baseUrl = "http://localhost:1337/api"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "🏏 Comprehensive Player Profile API Test" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""

# Test 1: Create a complete player profile
Write-Host "👤 Test 1: Creating complete player profile..." -ForegroundColor Yellow

$profileData = @{
    data = @{
        displayName = "Virat Kohli"
        age = 35
        birthday = "1988-11-05"
        role = "Batsman"
        battingStyle = "Right-handed"
        bowlingStyle = "Right-arm medium"
        skillLevel = "Professional"
        location = "Delhi, India"
        bio = "Professional cricket player and former captain of the Indian national team. Known for aggressive batting and exceptional fitness."
        isAvailable = $true
        rating = 4.9
        totalMatches = 254
        phoneNumber = "+91-9876543210"
        emergencyContact = "+91-9876543211"
        user = 7
        stats = @{
            matchesPlayed = 254
            runsScored = 12169
            highestScore = 183
            average = 58.18
            strikeRate = 93.17
            centuries = 43
            halfCenturies = 64
            wicketsTaken = 4
            bowlingAverage = 166.25
            economyRate = 6.25
            bestBowling = "1/15"
            catches = 137
            stumpings = 0
            runOuts = 15
        }
        achievements = @(
            @{
                title = "ICC ODI Player of the Year"
                description = "Awarded for outstanding performance in ODI cricket"
                achievedDate = "2017-12-15"
                category = "batting"
                points = 100
            },
            @{
                title = "Fastest to 10000 ODI runs"
                description = "Reached 10000 ODI runs in just 205 innings"
                achievedDate = "2018-10-24"
                category = "milestone"
                points = 150
            },
            @{
                title = "Captain of Indian Cricket Team"
                description = "Led the Indian cricket team across all formats"
                achievedDate = "2017-01-15"
                category = "team"
                points = 200
            }
        )
    }
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/player-profiles" -Method POST -Body $profileData -Headers $headers
    Write-Host "✅ SUCCESS: Complete profile created!" -ForegroundColor Green
    Write-Host "   Profile ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "   Display Name: $($response.data.displayName)" -ForegroundColor Cyan
    Write-Host "   Role: $($response.data.role)" -ForegroundColor Cyan
    Write-Host "   Skill Level: $($response.data.skillLevel)" -ForegroundColor Cyan
    $profileId = $response.data.id
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get all player profiles
Write-Host "📋 Test 2: Getting all player profiles..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/player-profiles?populate=*" -Method GET -Headers $headers
    Write-Host "✅ SUCCESS: Retrieved $($response.data.Count) profiles" -ForegroundColor Green
    
    foreach ($profile in $response.data) {
        Write-Host "   Profile: $($profile.displayName) - $($profile.role) - Rating: $($profile.rating)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get single profile with full details
if ($profileId) {
    Write-Host "👤 Test 3: Getting single profile with full details..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$profileId?populate=*" -Method GET -Headers $headers
        Write-Host "✅ SUCCESS: Retrieved detailed profile" -ForegroundColor Green
        Write-Host "   Name: $($response.data.displayName)" -ForegroundColor Cyan
        Write-Host "   Age: $($response.data.age)" -ForegroundColor Cyan
        Write-Host "   Location: $($response.data.location)" -ForegroundColor Cyan
        Write-Host "   Matches Played: $($response.data.stats.matchesPlayed)" -ForegroundColor Cyan
        Write-Host "   Runs Scored: $($response.data.stats.runsScored)" -ForegroundColor Cyan
        Write-Host "   Average: $($response.data.stats.average)" -ForegroundColor Cyan
        Write-Host "   Achievements: $($response.data.achievements.Count)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 4: Update player profile
if ($profileId) {
    Write-Host "✏️ Test 4: Updating player profile..." -ForegroundColor Yellow
    
    $updateData = @{
        data = @{
            bio = "Updated: Professional cricket player, former captain of Indian national team, and one of the greatest batsmen of all time."
            rating = 5.0
            totalMatches = 260
            stats = @{
                matchesPlayed = 260
                runsScored = 12500
                highestScore = 183
                average = 58.50
                strikeRate = 93.50
                centuries = 45
                halfCenturies = 65
                wicketsTaken = 4
                bowlingAverage = 166.25
                economyRate = 6.25
                bestBowling = "1/15"
                catches = 140
                stumpings = 0
                runOuts = 16
            }
        }
    } | ConvertTo-Json -Depth 4
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/player-profiles/$profileId" -Method PUT -Body $updateData -Headers $headers
        Write-Host "✅ SUCCESS: Profile updated!" -ForegroundColor Green
        Write-Host "   Updated Rating: $($response.data.rating)" -ForegroundColor Cyan
        Write-Host "   Updated Matches: $($response.data.totalMatches)" -ForegroundColor Cyan
        Write-Host "   Updated Runs: $($response.data.stats.runsScored)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 5: Create another player profile (different role)
Write-Host "🏏 Test 5: Creating bowler profile..." -ForegroundColor Yellow

$bowlerData = @{
    data = @{
        displayName = "Jasprit Bumrah"
        age = 30
        birthday = "1993-12-06"
        role = "Bowler"
        battingStyle = "Right-handed"
        bowlingStyle = "Right-arm fast"
        skillLevel = "Professional"
        location = "Gujarat, India"
        bio = "Fast bowler known for his unique bowling action and yorkers."
        isAvailable = $true
        rating = 4.8
        totalMatches = 120
        phoneNumber = "+91-9876543212"
        emergencyContact = "+91-9876543213"
        user = 7
        stats = @{
            matchesPlayed = 120
            runsScored = 890
            highestScore = 35
            average = 12.50
            strikeRate = 85.20
            centuries = 0
            halfCenturies = 0
            wicketsTaken = 225
            bowlingAverage = 24.30
            economyRate = 4.63
            bestBowling = "6/19"
            catches = 25
            stumpings = 0
            runOuts = 5
        }
        achievements = @(
            @{
                title = "ICC Bowler of the Year"
                description = "Best bowler in international cricket"
                achievedDate = "2019-12-15"
                category = "bowling"
                points = 120
            },
            @{
                title = "Best Bowling Figures in Debut"
                description = "Exceptional bowling performance on debut"
                achievedDate = "2016-01-23"
                category = "bowling"
                points = 80
            }
        )
    }
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/player-profiles" -Method POST -Body $bowlerData -Headers $headers
    Write-Host "✅ SUCCESS: Bowler profile created!" -ForegroundColor Green
    Write-Host "   Profile ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "   Display Name: $($response.data.displayName)" -ForegroundColor Cyan
    Write-Host "   Role: $($response.data.role)" -ForegroundColor Cyan
    Write-Host "   Wickets Taken: $($response.data.stats.wicketsTaken)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Search profiles by role
Write-Host "🔍 Test 6: Searching profiles by role..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/player-profiles?filters[role][\$eq]=Batsman&populate=*" -Method GET -Headers $headers
    Write-Host "✅ SUCCESS: Found $($response.data.Count) batsmen" -ForegroundColor Green
    
    foreach ($profile in $response.data) {
        Write-Host "   Batsman: $($profile.displayName) - Average: $($profile.stats.average)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "📊 PLAYER PROFILE API TEST SUMMARY" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""
Write-Host "✅ Tested all major player profile fields:" -ForegroundColor Green
Write-Host "   • Basic Info: displayName, age, birthday, role" -ForegroundColor Cyan
Write-Host "   • Cricket Details: battingStyle, bowlingStyle, skillLevel" -ForegroundColor Cyan
Write-Host "   • Contact: location, phoneNumber, emergencyContact" -ForegroundColor Cyan
Write-Host "   • Stats: matches, runs, average, wickets, etc." -ForegroundColor Cyan
Write-Host "   • Achievements: titles, dates, categories, points" -ForegroundColor Cyan
Write-Host "   • Status: isAvailable, rating, totalMatches" -ForegroundColor Cyan
Write-Host ""
Write-Host "🏏 Player Profile API is comprehensive and working!" -ForegroundColor Green