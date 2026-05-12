@echo off
title Fasal Sathi Frontend
echo =========================================
echo    ⚛️ Starting React Vite Frontend
echo =========================================
echo.

:: Check for node_modules
if not exist "node_modules\" (
    echo [1/2] node_modules not found. Installing dependencies...
    call npm install
) else (
    echo [1/2] Dependencies already installed.
)

:: Start server
echo [2/2] Starting React Server...
echo.
call npm run dev

pause
