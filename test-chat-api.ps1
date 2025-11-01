# Test Chat API Script

Write-Host "=== Testing Community Chat API ===" -ForegroundColor Cyan

# Step 1: Login to get JWT token
Write-Host "`n1. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    identifier = "player123445@exampl