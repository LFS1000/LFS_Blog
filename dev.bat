@echo off
chcp 65001 >nul
title LFS Blog Dev Server
cd /d "d:\LFS_Project\LFS_Blog-master"
set "PATH=D:\IDE;%PATH%"
echo ============================================
echo   LFS Blog 开发服务器
echo   Node 版本:
node --version
echo ============================================
echo.
echo 正在启动服务器...
echo 启动后请在浏览器访问: http://localhost:3000/
echo 按 Ctrl+C 可停止服务器
echo.
node node_modules\astro\bin\astro.mjs dev --port 3000
pause
