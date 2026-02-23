param(
  [int]$Port = 3002,
  [string]$Workspace = "E:\VS开发文件\openclaw-crm"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "SilentlyContinue"

$listener = Get-NetTCPConnection -State Listen -LocalPort $Port | Select-Object -First 1
if ($listener) {
  Stop-Process -Id $listener.OwningProcess -Force
}

$workspacePattern = [regex]::Escape($Workspace)
Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -match $workspacePattern -and
    (
      $_.CommandLine -match "next dev" -or
      $_.CommandLine -match "@openclaw-crm/web.*dev" -or
      $_.CommandLine -match "pnpm\.ps1"
    )
  } |
  ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }

exit 0

