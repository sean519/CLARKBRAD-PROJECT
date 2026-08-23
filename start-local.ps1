$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = 8765
$url = "http://localhost:$port/"

Write-Host "ClarkBrad local server"
Write-Host "Root: $root"
Write-Host "URL:  $url"
Write-Host ""
Write-Host "Press Ctrl+C to stop."

python -m http.server $port
