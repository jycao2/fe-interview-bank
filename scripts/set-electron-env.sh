#!/usr/bin/env bash
# 设置 Electron 国内镜像与缓存目录（Bash / macOS / Linux / Git Bash）
# 用法：source ./scripts/set-electron-env.sh
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$PROJECT_ROOT/.electron-cache"

export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
export ELECTRON_CACHE="$PROJECT_ROOT/.electron-cache"

echo "✓ ELECTRON_MIRROR=$ELECTRON_MIRROR"
echo "✓ ELECTRON_BUILDER_BINARIES_MIRROR=$ELECTRON_BUILDER_BINARIES_MIRROR"
echo "✓ ELECTRON_CACHE=$ELECTRON_CACHE"
