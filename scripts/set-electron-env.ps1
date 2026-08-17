# 设置 Electron 国内镜像与缓存目录（PowerShell / Windows）
# 用法：
#   .\scripts\set-electron-env.ps1       # 当前会话生效
#   .\scripts\set-electron-env.ps1 -Persist  # 写入用户环境变量永久生效
param(
  [switch]$Persist
)

$ErrorActionPreference = 'Stop'

# 国内镜像（npmmirror）
$mirrors = @{
  ELECTRON_MIRROR                      = 'https://npmmirror.com/mirrors/electron/'
  ELECTRON_BUILDER_BINARIES_MIRROR    = 'https://npmmirror.com/mirrors/electron-builder-binaries/'
}

# 缓存目录重定向到项目内，避免沙箱/权限问题
$projectRoot = Split-Path -Parent $PSScriptRoot
$cacheDir = Join-Path $projectRoot '.electron-cache'
New-Item -ItemType Directory -Force -Path $cacheDir | Out-Null
$mirrors['ELECTRON_CACHE'] = $cacheDir

foreach ($k in $mirrors.Keys) {
  $v = $mirrors[$k]
  Set-Item -Path "Env:$k" -Value $v
  if ($Persist) {
    [Environment]::SetEnvironmentVariable($k, $v, 'User')
    Write-Host "✓ 永久设置 $k = $v" -ForegroundColor Green
  } else {
    Write-Host "✓ 当前会话 $k = $v" -ForegroundColor Cyan
  }
}

if (-not $Persist) {
  Write-Host "`n提示：仅当前 PowerShell 会话生效。如需永久生效请加 -Persist 参数。" -ForegroundColor Yellow
}
