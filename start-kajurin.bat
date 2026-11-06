@echo off
title KAJURIN - Sistem Inventaris Ruang Kajur
color 0b

echo ======================================================================
echo           KAJURIN - SISTEM INVENTARIS RUANG KAJUR (SMK)
echo ======================================================================
echo.

set "PATH=%~dp0tools\node-v20.18.0-win-x64;%PATH%"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan di folder tools\node-v20.18.0-win-x64.
    pause
    exit /b
)

echo Membuka browser PC Kajur: http://localhost:3000 ...
start "" http://localhost:3000

echo Menjalankan Web Server KAJURIN...
echo Tekan Ctrl+C untuk menghentikan server jika selesai digunakan.
echo.
node server/index.js
pause

