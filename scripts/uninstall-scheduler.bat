@echo off
REM PlacementQuest Auto-Launch Uninstaller
REM Removes Windows Task Scheduler tasks
REM Run this as Administrator

echo ========================================
echo   PlacementQuest Auto-Launch Uninstaller
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

echo Removing scheduled tasks...
echo.

schtasks /delete /tn "PlacementQuest_10AM" /f
schtasks /delete /tn "PlacementQuest_3PM" /f
schtasks /delete /tn "PlacementQuest_7PM" /f
schtasks /delete /tn "PlacementQuest_11PM" /f

echo.
echo All PlacementQuest scheduled tasks have been removed.
echo.
pause
