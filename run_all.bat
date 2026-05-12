@echo off
title Fasal Sathi Boot System
echo =======================================================
echo     🚀 Fasal Sathi Dual-Boot System 🚀
echo =======================================================
echo.
echo [1/2] Launching Python Backend...
start cmd /k "run_backend.bat"

echo [2/2] Launching React Frontend...
start cmd /k "run_frontend.bat"

echo.
echo ✅ Startup commands have been issued!
echo - Please check the two new terminal windows that just opened.
echo - The backend will auto-install Python packages if needed.
echo - The frontend will auto-install npm packages if needed.
echo.
echo You can close this window now.
pause
