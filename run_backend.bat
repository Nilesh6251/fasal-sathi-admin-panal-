@echo off
title Fasal Sathi Backend
echo =========================================
echo    🐍 Starting Python FastAPI Backend
echo =========================================
echo.

cd backend

:: Check for virtual environment
if not exist "venv\" (
    echo [1/3] Creating virtual environment...
    python -m venv venv
) else (
    echo [1/3] Virtual environment found.
)

:: Activate virtual environment
echo [2/3] Activating virtual environment...
call venv\Scripts\activate.bat

:: Install dependencies
echo [3/3] Installing Python dependencies...
pip install -r requirements.txt

:: Start server
echo.
echo 🚀 Starting FastAPI Server on Port 5000...
uvicorn main:app --reload --port 5000

pause
