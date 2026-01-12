@echo off
setlocal enabledelayedexpansion

color 0C
title Pixie Stylist - DIAGNOSTIC

echo.
echo ╔════════════════════════════════════════╗
echo ║   DIAGNOSTIC - Finding Problems         ║
echo ╚════════════════════════════════════════╝
echo.

REM Check Node.js
echo [CHECK 1] Is Node.js installed?
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ ERROR: Node.js is NOT installed!
    echo.
    echo SOLUTION:
    echo 1. Download Node.js from: https://nodejs.org/
    echo 2. Choose LTS version (18+)
    echo 3. Run installer and click "Next" through all screens
    echo 4. Restart computer
    echo 5. Try again
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Node.js found: 
    node --version
)

REM Check npm
echo.
echo [CHECK 2] Is npm installed?
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ ERROR: npm not found!
    pause
    exit /b 1
) else (
    echo ✓ npm found:
    npm --version
)

REM Check project folder
echo.
echo [CHECK 3] Project folder exists?
if not exist "c:\Users\23021210\Documents\PixieStylist\package.json" (
    echo ✗ ERROR: package.json not found!
    echo Location should be: c:\Users\23021210\Documents\PixieStylist\package.json
    pause
    exit /b 1
) else (
    echo ✓ Project folder found
)

REM Change directory
cd /d c:\Users\23021210\Documents\PixieStylist

REM Try npm install with output
echo.
echo [CHECK 4] Installing dependencies (this may take 5-10 minutes)...
echo.
npm install 2>&1

if errorlevel 1 (
    echo.
    echo ✗ ERROR during npm install
    echo.
    echo SOLUTIONS TO TRY:
    echo 1. Delete folder: c:\Users\23021210\Documents\PixieStylist\node_modules
    echo 2. Run this file again
    echo 3. If still fails, try: npm cache clean --force
    echo 4. Then run this file again
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed!
echo.
echo [CHECK 5] Starting website...
echo.

npm run dev

pause
