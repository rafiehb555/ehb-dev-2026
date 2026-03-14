# EHB - GitHub Upload Script
# Double-click ya right-click -> Run with PowerShell se chalayein. Sab changes auto upload ho jayenge.

$ErrorActionPreference = "Stop"
$projectRoot = "D:\EHB DEVELOPMENT 2026"

Set-Location $projectRoot

Write-Host "EHB - GitHub upload start..." -ForegroundColor Cyan

# Check if there are changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Koi naya change nahi hai. Sab pehle se uploaded hai." -ForegroundColor Yellow
    exit 0
}

# Add all
git add .
# Commit with date
$msg = "Update: " + (Get-Date -Format "yyyy-MM-dd HH:mm")
git commit -m $msg

if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit mein issue. Check karein." -ForegroundColor Red
    exit 1
}

# Push
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. GitHub par upload ho gaya: https://github.com/rafiehb555/ehb-dev-2026" -ForegroundColor Green
} else {
    Write-Host "Push fail. Pehli dafa agar login maange to browser open karke GitHub par sign-in karein." -ForegroundColor Yellow
    Write-Host "Phir dobara ye script chalayein." -ForegroundColor Yellow
    exit 1
}
