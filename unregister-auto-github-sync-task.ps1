$ErrorActionPreference = "Stop"

$taskName = "EHB Auto GitHub Sync"

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Scheduled task remove ho gayi: $taskName" -ForegroundColor Yellow
} else {
    Write-Host "Scheduled task pehle se maujood nahi hai: $taskName" -ForegroundColor Yellow
}
