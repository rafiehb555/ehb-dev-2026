param(
    [int]$PollSeconds = 5,
    [int]$QuietSeconds = 20
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$uploadScript = Join-Path $projectRoot "upload-to-github.ps1"
$logsDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logsDir "auto-github-sync.log"
$lockFile = Join-Path $logsDir "auto-github-sync.lock"
$powerShell = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"

if (-not (Test-Path $logsDir)) {
    New-Item -Path $logsDir -ItemType Directory | Out-Null
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )

    $line = "[{0}] [{1}] {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level, $Message
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

function Test-ExistingWatcher {
    if (-not (Test-Path $lockFile)) {
        return $false
    }

    $existingPid = (Get-Content $lockFile -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
    if ([string]::IsNullOrWhiteSpace($existingPid)) {
        Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
        return $false
    }

    $existingProcess = Get-Process -Id ([int]$existingPid) -ErrorAction SilentlyContinue
    if ($existingProcess) {
        Write-Log "Auto GitHub sync pehle se run ho raha hai (PID $existingPid)." "WARN"
        return $true
    }

    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
    return $false
}

function Get-WorkingTreeStatus {
    Set-Location $projectRoot
    $status = git status --porcelain 2>$null
    return ($status -join "`n").Trim()
}

function Test-GitOperationInProgress {
    $gitDir = Join-Path $projectRoot ".git"
    return (Test-Path (Join-Path $gitDir "rebase-merge")) -or
        (Test-Path (Join-Path $gitDir "rebase-apply")) -or
        (Test-Path (Join-Path $gitDir "MERGE_HEAD")) -or
        (Test-Path (Join-Path $gitDir "CHERRY_PICK_HEAD"))
}

function Should-IgnorePath {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path)) {
        return $true
    }

    $normalized = $Path.Replace("/", "\")
    return $normalized -match "\\\.git\\" -or
        $normalized -match "\\node_modules\\" -or
        $normalized -match "\\\.next\\" -or
        $normalized -match "\\logs\\"
}

function Mark-Pending {
    param([string]$Reason)

    if (-not $script:pendingSince) {
        Write-Log "Changes detected via $Reason. Quiet timer started."
    }
    $script:pendingSince = Get-Date
}

if (Test-ExistingWatcher) {
    exit 0
}

Set-Content -Path $lockFile -Value $PID
Register-EngineEvent PowerShell.Exiting -Action {
    Remove-Item $using:lockFile -Force -ErrorAction SilentlyContinue
} | Out-Null

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectRoot
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [IO.NotifyFilters]'FileName, DirectoryName, LastWrite, CreationTime, Size'
$watcher.EnableRaisingEvents = $true

$watchAction = {
    $path = $Event.SourceEventArgs.FullPath
    if (-not (Should-IgnorePath $path)) {
        Mark-Pending -Reason ("filesystem event: " + $Event.SourceEventArgs.ChangeType)
    }
}

$subscriptions = @(
    (Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $watchAction),
    (Register-ObjectEvent -InputObject $watcher -EventName Created -Action $watchAction),
    (Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $watchAction),
    (Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $watchAction)
)

Write-Log "Auto GitHub sync started for $projectRoot"
Write-Log "PollSeconds=$PollSeconds QuietSeconds=$QuietSeconds"

$script:pendingSince = $null
$lastKnownStatus = ""

try {
    while ($true) {
        try {
            if (Test-GitOperationInProgress) {
                Write-Log "Git operation in progress. Auto upload paused until rebase/merge completes." "WARN"
                $script:pendingSince = $null
                Start-Sleep -Seconds $PollSeconds
                continue
            }

            $status = Get-WorkingTreeStatus

            if (-not [string]::Equals($status, $lastKnownStatus, [System.StringComparison]::Ordinal)) {
                $lastKnownStatus = $status
                if (-not [string]::IsNullOrWhiteSpace($status)) {
                    Mark-Pending -Reason "git status diff"
                }
            }

            if ([string]::IsNullOrWhiteSpace($status)) {
                $script:pendingSince = $null
            } elseif ($script:pendingSince) {
                $elapsed = ((Get-Date) - $script:pendingSince).TotalSeconds
                if ($elapsed -ge $QuietSeconds) {
                    Write-Log "Quiet period complete. Running auto upload."
                    & $powerShell -NoLogo -ExecutionPolicy Bypass -File $uploadScript -CommitMessage ("auto-sync: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss"))
                    $exitCode = $LASTEXITCODE

                    if ($exitCode -eq 0) {
                        Write-Log "Auto upload completed."
                    } elseif ($exitCode -eq 2) {
                        Write-Log "Auto upload needs manual conflict resolution." "WARN"
                    } elseif ($exitCode -eq 3) {
                        Write-Log "Auto upload paused because git rebase/merge is still active." "WARN"
                    } else {
                        Write-Log "Auto upload failed with exit code $exitCode." "WARN"
                    }

                    $script:pendingSince = $null
                    $lastKnownStatus = Get-WorkingTreeStatus
                }
            }
        } catch {
            Write-Log ("Watcher error: " + $_.Exception.Message) "ERROR"
        }

        Start-Sleep -Seconds $PollSeconds
    }
} finally {
    $subscriptions | ForEach-Object {
        if ($_){ Unregister-Event -SubscriptionId $_.Id -ErrorAction SilentlyContinue }
    }
    $watcher.Dispose()
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}
