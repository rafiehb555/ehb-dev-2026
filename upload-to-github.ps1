# EHB - GitHub Upload Script
# Safe single-run uploader for manual use and auto-sync watcher.

param(
    [string]$CommitMessage,
    [switch]$SkipRebase
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
    [pscustomobject]@{
        Output = @($output)
        ExitCode = $code
    }
}

function Join-Output {
    param([object[]]$Lines)
    return ($Lines | ForEach-Object { "$_" }) -join "`n"
}

function Fail-WithOutput {
    param(
        [string]$Message,
        [object[]]$Output = @(),
        [int]$Code = 1
    )

    Write-Host $Message -ForegroundColor Red
    if ($Output.Count -gt 0) {
        $Output | ForEach-Object { Write-Host $_ }
    }
    exit $Code
}

Set-Location $projectRoot

Write-Host "EHB - GitHub upload start..." -ForegroundColor Cyan

if (Test-GitOperationInProgress) {
    Write-Host "Git rebase/merge operation chal rahi hai. Pehle usay complete karein, phir auto upload chalega." -ForegroundColor Yellow
    exit 3
}

$branchResult = Invoke-Git -Args @("branch", "--show-current")
if ($branchResult.ExitCode -ne 0) {
    Fail-WithOutput -Message "Current branch detect nahi hui." -Output $branchResult.Output
}

$branch = (Join-Output $branchResult.Output).Trim()
if ([string]::IsNullOrWhiteSpace($branch)) {
    Fail-WithOutput -Message "Detached HEAD state mein auto upload allow nahi hai."
}

$status = Invoke-Git -Args @("status", "--porcelain")
if ($status.ExitCode -ne 0) {
    Fail-WithOutput -Message "Git status read nahi ho saka." -Output $status.Output
}

if ([string]::IsNullOrWhiteSpace((Join-Output $status.Output).Trim())) {
    Write-Host "Koi naya change nahi hai. Sab pehle se uploaded hai." -ForegroundColor Yellow
    exit 0
}

$add = Invoke-Git -Args @("add", "-A")
if ($add.ExitCode -ne 0) {
    Fail-WithOutput -Message "Files stage nahi ho sakin." -Output $add.Output
}

$cached = Invoke-Git -Args @("diff", "--cached", "--name-only")
if ($cached.ExitCode -ne 0) {
    Fail-WithOutput -Message "Staged diff read nahi ho saka." -Output $cached.Output
}

if ([string]::IsNullOrWhiteSpace((Join-Output $cached.Output).Trim())) {
    Write-Host "Stage karne ke baad commit karne layak change nahi mila." -ForegroundColor Yellow
    exit 0
}

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $CommitMessage = "auto-sync: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

$commit = Invoke-Git -Args @("commit", "-m", $CommitMessage)
if ($commit.ExitCode -ne 0) {
    Fail-WithOutput -Message "Commit mein issue aya. Check karein." -Output $commit.Output
}

$fetch = Invoke-Git -Args @("fetch", "origin", $branch, "--quiet")
if ($fetch.ExitCode -ne 0) {
    Fail-WithOutput -Message "Remote fetch fail hua. Push se pehle sync zaroori hai." -Output $fetch.Output
}

$behindResult = Invoke-Git -Args @("rev-list", "--count", "HEAD..origin/$branch")
if ($behindResult.ExitCode -ne 0) {
    Fail-WithOutput -Message "Remote comparison fail hua." -Output $behindResult.Output
}

$behind = [int]((Join-Output $behindResult.Output).Trim())
if ($behind -gt 0 -and -not $SkipRebase) {
    Write-Host "Remote branch aage hai. Auto rebase chal raha hai..." -ForegroundColor Yellow
    $rebase = Invoke-Git -Args @("pull", "--rebase", "origin", $branch)
    if ($rebase.ExitCode -ne 0) {
        Write-Host "Auto rebase fail hua. Rebase abort ki koshish ki ja rahi hai..." -ForegroundColor Yellow
        $null = Invoke-Git -Args @("rebase", "--abort")
        Fail-WithOutput -Message "Auto sync conflict ki wajah se ruk gaya. Manual resolve zaroori hai." -Output $rebase.Output -Code 2
    }
}

$push = Invoke-Git -Args @("push", "origin", $branch)
if ($push.ExitCode -eq 0) {
    Write-Host "Done. GitHub par upload ho gaya: https://github.com/rafiehb555/ehb-dev-2026" -ForegroundColor Green
    exit 0
}

Write-Host "Initial push fail hua. Fetch + rebase + retry attempt ho raha hai..." -ForegroundColor Yellow
$fetchRetry = Invoke-Git -Args @("fetch", "origin", $branch, "--quiet")
if ($fetchRetry.ExitCode -ne 0) {
    Fail-WithOutput -Message "Retry fetch fail hua." -Output $fetchRetry.Output
}

if (-not $SkipRebase) {
    $rebaseRetry = Invoke-Git -Args @("pull", "--rebase", "origin", $branch)
    if ($rebaseRetry.ExitCode -ne 0) {
        $null = Invoke-Git -Args @("rebase", "--abort")
        Fail-WithOutput -Message "Retry rebase fail hua. Manual resolve zaroori hai." -Output $rebaseRetry.Output -Code 2
    }
}

$pushRetry = Invoke-Git -Args @("push", "origin", $branch)
if ($pushRetry.ExitCode -eq 0) {
    Write-Host "Retry success. GitHub par upload ho gaya." -ForegroundColor Green
    exit 0
}

Fail-WithOutput -Message "Push fail hua. Ho sakta hai login ya permission issue ho." -Output $pushRetry.Output
