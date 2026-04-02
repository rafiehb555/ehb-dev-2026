param(
    [int]$PollSeconds = 30,
    [int]$QuietSeconds = 120
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$uploadScript = Join-Path $projectRoot "upload-to-github.ps1"
$logsDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logsDir "auto-github-sync.log"

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

Write-Log "Auto GitHub sync started for $projectRoot"
Write-Log "PollSeconds=$PollSeconds QuietSeconds=$QuietSeconds"

$pendingSince = $null

while ($true) {
    try {
        if (Test-GitOperationInProgress) {
            Write-Log "Git operation in progress. Auto upload paused until rebase/merge completes." "WARN"
            $pendingSince = $null
            Start-Sleep -Seconds $PollSeconds
            continue
        }

        $status = Get-WorkingTreeStatus

        if ([string]::IsNullOrWhiteSpace($status)) {
            $pendingSince = $null
        } else {
            if (-not $pendingSince) {
                $pendingSince = Get-Date
                Write-Log "Changes detected. Quiet timer started."
            } else {
                $elapsed = ((Get-Date) - $pendingSince).TotalSeconds
                if ($elapsed -ge $QuietSeconds) {
                    Write-Log "Quiet period complete. Running auto upload."
                    & powershell -NoLogo -ExecutionPolicy Bypass -File $uploadScript -CommitMessage ("auto-sync: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss"))
                    $exitCode = $LASTEXITCODE

                    if ($exitCode -eq 0) {
                        Write-Log "Auto upload completed."
                    } elseif ($exitCode -eq 2) {
                        Write-Log "Auto upload skipped because remote branch needs sync first." "WARN"
                    } elseif ($exitCode -eq 3) {
                        Write-Log "Auto upload paused because git rebase/merge is still active." "WARN"
                    } else {
                        Write-Log "Auto upload failed with exit code $exitCode." "WARN"
                    }

                    $pendingSince = $null
                }
            }
        }
    } catch {
        Write-Log ("Watcher error: " + $_.Exception.Message) "ERROR"
    }

    Start-Sleep -Seconds $PollSeconds
}
