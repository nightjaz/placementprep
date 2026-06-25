@echo off
REM PlacementQuest Auto-Launch Installer
REM Creates Windows Task Scheduler tasks for 10am, 3pm, 7pm, 11pm
REM Run this as Administrator

echo ========================================
echo   PlacementQuest Auto-Launch Installer
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run this script as Administrator!
    echo Right-click the file and select "Run as administrator"
    pause
    exit /b 1
)

REM Get the script directory
set SCRIPT_DIR=%~dp0
set PYTHON_SCRIPT=%SCRIPT_DIR%auto-launch.py

REM Check if Python is installed
where python >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo Script location: %PYTHON_SCRIPT%
echo.
echo Creating scheduled tasks...
echo.

REM Delete existing tasks if they exist
schtasks /delete /tn "PlacementQuest_10AM" /f >nul 2>&1
schtasks /delete /tn "PlacementQuest_3PM" /f >nul 2>&1
schtasks /delete /tn "PlacementQuest_7PM" /f >nul 2>&1
schtasks /delete /tn "PlacementQuest_11PM" /f >nul 2>&1

REM Create new tasks
echo Creating 10:00 AM task...
schtasks /create /tn "PlacementQuest_10AM" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 10:00 /f
if %errorLevel% neq 0 (
    echo Failed to create 10AM task
) else (
    echo [OK] 10:00 AM task created
)

echo Creating 3:00 PM task...
schtasks /create /tn "PlacementQuest_3PM" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 15:00 /f
if %errorLevel% neq 0 (
    echo Failed to create 3PM task
) else (
    echo [OK] 3:00 PM task created
)

echo Creating 7:00 PM task...
schtasks /create /tn "PlacementQuest_7PM" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 19:00 /f
if %errorLevel% neq 0 (
    echo Failed to create 7PM task
) else (
    echo [OK] 7:00 PM task created
)

echo Creating 11:00 PM task...
schtasks /create /tn "PlacementQuest_11PM" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 23:00 /f
if %errorLevel% neq 0 (
    echo Failed to create 11PM task
) else (
    echo [OK] 11:00 PM task created
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo PlacementQuest will auto-launch at:
echo   - 10:00 AM
echo   - 3:00 PM
echo   - 7:00 PM
echo   - 11:00 PM
echo.
echo IMPORTANT: Make sure the Next.js dev server is running!
echo   cd placement-quest
echo   npm run dev
echo.
echo To view/modify tasks, open Task Scheduler (taskschd.msc)
echo.
pause
