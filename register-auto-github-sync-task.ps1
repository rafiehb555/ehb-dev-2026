$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$taskName = "EHB Auto GitHub Sync"
$scriptPath = Join-Path $projectRoot "auto-github-sync.ps1"
$powerShell = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"

$action = New-ScheduledTaskAction -Execute $powerShell -Argument "-NoLogo -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`" -PollSeconds 5 -QuietSeconds 20"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null

Write-Host "Scheduled task register ho gayi: $taskName" -ForegroundColor Green
Write-Host "Ab har Windows logon par auto GitHub sync watcher start hoga." -ForegroundColor Green
