<#
.SYNOPSIS
  Free up dev server ports (default: 5173 web / 5174 admin).

.DESCRIPTION
  1. netstat to find the PID
  2. Get-Process to confirm the process
  3. Stop-Process to kill it
  Only node processes are killed by default; others are reported and skipped.

.EXAMPLE
  npm run kill:port
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/kill-port.ps1 -Port 5173
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/kill-port.ps1 -Port 5173,5174 -All
#>
param(
  [int[]]$Port = @(5173, 5174),
  [switch]$All      # also kill non-node processes
)

$ErrorActionPreference = 'Stop'

function Get-ListenerPids([int]$p) {
  $pattern = ":$p\s+\S+\s+LISTENING\s+(\d+)"
  netstat -ano | Select-String -Pattern $pattern |
    ForEach-Object { [int]$_.Matches[0].Groups[1].Value } |
    Sort-Object -Unique
}

foreach ($p in $Port) {
  Write-Host "[port $p] checking" -ForegroundColor Cyan

  # 1. find PID
  $procIds = @(Get-ListenerPids $p)
  if ($procIds.Count -eq 0) {
    Write-Host "  free" -ForegroundColor Green
    continue
  }

  foreach ($procId in $procIds) {
    # 2. confirm process
    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if (-not $proc) {
      Write-Host "  PID $procId already gone, skip" -ForegroundColor DarkGray
      continue
    }

    $cmdline = (Get-CimInstance Win32_Process -Filter "ProcessId=$procId" -ErrorAction SilentlyContinue).CommandLine
    Write-Host "  PID $procId  $($proc.ProcessName)  $cmdline" -ForegroundColor Yellow

    if ($proc.ProcessName -ne 'node' -and -not $All) {
      Write-Host "  not a node process, skipped (use -All to force)" -ForegroundColor Red
      continue
    }

    # 3. kill it
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Write-Host "  killed PID $procId" -ForegroundColor Green
  }

  Start-Sleep -Milliseconds 500
  if (@(Get-ListenerPids $p).Count -gt 0) {
    Write-Host "  port $p is still in use, handle it manually" -ForegroundColor Red
  } else {
    Write-Host "  port $p released" -ForegroundColor Green
  }
}
