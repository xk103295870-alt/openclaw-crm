param(
  [int]$Port = 3002,
  [string]$Workspace = "E:\VS开发文件\openclaw-crm",
  [ValidateSet("dev", "prod")]
  [string]$Mode = "dev"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  exit 0
}

$logDir = Join-Path $Workspace ".run-logs"
if (!(Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
}

$stdout = Join-Path $logDir "web-dev.out.log"
$stderr = Join-Path $logDir "web-dev.err.log"
Remove-Item $stdout, $stderr -Force -ErrorAction SilentlyContinue

$pnpmScript = Join-Path $env:APPDATA "npm\pnpm.ps1"
if (!(Test-Path $pnpmScript)) {
  throw "pnpm.ps1 not found at $pnpmScript"
}

$argumentList = if ($Mode -eq "dev") {
  @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $pnpmScript,
    "--filter",
    "@openclaw-crm/web",
    "dev"
  )
} else {
  @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $pnpmScript,
    "--filter",
    "@openclaw-crm/web",
    "start",
    "--",
    "-p",
    $Port
  )
}

Start-Process `
  -FilePath "powershell.exe" `
  -ArgumentList $argumentList `
  -WorkingDirectory $Workspace `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdout `
  -RedirectStandardError $stderr | Out-Null

$deadline = (Get-Date).AddSeconds(90)
do {
  Start-Sleep -Milliseconds 500
  $listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
} until ($listener -or (Get-Date) -gt $deadline)

if ($listener) {
  exit 0
}

exit 1
