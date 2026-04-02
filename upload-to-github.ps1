# EHB - GitHub Upload Script
# Safe single-run uploader for manual use and auto-sync watcher.

param(
    [string]$CommitMessage
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Test-GitOperationInProgress {
    $gitDir = Join-Path $projectRoot ".git"
    return (Test-Path (Join-Path $gitDir "rebase-merge")) -or
           (Test-Path (Join-Path $gitDir "rebase-apply")) -or
           (Test-Path (Join-Path $gitDir "MERGE_HEAD")) -or
           (Test-Path (Join-Path $gitDir "CHERRY_PICK_HEAD"))
}

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Args
    )

    $output = & git @Args 2>&1
    $code = $LASTEXITCODE
    return [pscustomobject]@{
        Output = $output
        ExitCode = $code
    }
}

Set-Location $projectRoot

Write-Host "EHB - GitHub upload start..." -ForegroundColor Cyan

if (Test-GitOperationInProgress) {
    Write-Host "Git rebase/merge operation chal rahi hai. Pehle usay complete karein, phir auto upload chalega." -ForegroundColor Yellow
    exit 3
}

$status = Invoke-Git -Args @("status", "--porcelain")
if ($status.ExitCode -ne 0) {
    Write-Host "Git status read nahi ho saka." -ForegroundColor Red
    $status.Output | ForEach-Object { Write-Host $_ }
    exit 1
}

if ([string]::IsNullOrWhiteSpace(($status.Output -join "`n"))) {
    Write-Host "Koi naya change nahi hai. Sab pehle se uploaded hai." -ForegroundColor Yellow
    exit 0
}

$branchResult = Invoke-Git -Args @("branch", "--show-current")
if ($branchResult.ExitCode -ne 0 -or [string]::IsNullOrWhiteSpace(($branchResult.Output -join "").Trim())) {
    Write-Host "Current branch detect nahi hui." -ForegroundColor Red
    exit 1
}

$branch = ($branchResult.Output -join "").Trim()

$fetch = Invoke-Git -Args @("fetch", "origin", $branch, "--quiet")
if ($fetch.ExitCode -ne 0) {
    Write-Host "Remote fetch fail hua. Push se pehle sync zaroori hai." -ForegroundColor Yellow
}

$behindResult = Invoke-Git -Args @("rev-list", "--count", "HEAD..origin/$branch")
$aheadResult = Invoke-Git -Args @("rev-list", "--count", "origin/$branch..HEAD")

if ($behindResult.ExitCode -eq 0 -and $aheadResult.ExitCode -eq 0) {
    $behind = [int](($behindResult.Output -join "").Trim())
    $ahead = [int](($aheadResult.Output -join "").Trim())

    if ($behind -gt 0) {
        Write-Host "Remote branch aapke local branch se aage hai. Pehle sync/rebase karein, phir push hoga." -ForegroundColor Yellow
        Write-Host "Branch: $branch | Behind: $behind | Ahead: $ahead" -ForegroundColor Yellow
        exit 2
    }
}

$add = Invoke-Git -Args @("add", "-A")
if ($add.ExitCode -ne 0) {
    Write-Host "Files stage nahi ho sakin." -ForegroundColor Red
    exit 1
}

$cached = Invoke-Git -Args @("diff", "--cached", "--name-only")
if ($cached.ExitCode -ne 0 -or [string]::IsNullOrWhiteSpace(($cached.Output -join "`n"))) {
    Write-Host "Stage karne ke baad commit karne layak change nahi mila." -ForegroundColor Yellow
    exit 0
}

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $CommitMessage = "auto-sync: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

$commit = Invoke-Git -Args @("commit", "-m", $CommitMessage)
if ($commit.ExitCode -ne 0) {
    Write-Host "Commit mein issue aya. Check karein." -ForegroundColor Red
    $commit.Output | ForEach-Object { Write-Host $_ }
    exit 1
}

$push = Invoke-Git -Args @("push", "origin", $branch)
if ($push.ExitCode -eq 0) {
    Write-Host "Done. GitHub par upload ho gaya: https://github.com/rafiehb555/ehb-dev-2026" -ForegroundColor Green
    exit 0
}

Write-Host "Push fail hua. Ho sakta hai remote par naye commits aa gaye hon ya login zaroori ho." -ForegroundColor Yellow
$push.Output | ForEach-Object { Write-Host $_ }
exit 1
