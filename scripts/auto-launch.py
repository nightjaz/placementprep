#!/usr/bin/env python3
"""
PlacementQuest Auto-Launch Script
Runs via Windows Task Scheduler at specified times (10am, 3pm, 7pm, 11pm)
"""

import webbrowser
import subprocess
import os
import ctypes
from datetime import datetime

PLACEMENT_QUEST_URL = "http://localhost:3000"

def show_notification(title, message):
    """Show Windows notification using ctypes"""
    try:
        ctypes.windll.user32.MessageBoxW(0, message, title, 0x40 | 0x1000)
    except Exception as e:
        print(f"Notification failed: {e}")

def launch_browser():
    """Launch the PlacementQuest app in browser"""
    current_time = datetime.now().strftime("%H:%M")

    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")
    ]

    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]

    browser_path = None
    browser_type = None

    for path in chrome_paths:
        if os.path.exists(path):
            browser_path = path
            browser_type = "chrome"
            break

    if not browser_path:
        for path in edge_paths:
            if os.path.exists(path):
                browser_path = path
                browser_type = "edge"
                break

    if browser_path:
        try:
            subprocess.Popen([
                browser_path,
                f"--app={PLACEMENT_QUEST_URL}",
                "--new-window"
            ])
            print(f"Launched {browser_type} at {current_time}")
        except Exception as e:
            print(f"Failed to launch browser: {e}")
            webbrowser.open(PLACEMENT_QUEST_URL, new=1)
    else:
        webbrowser.open(PLACEMENT_QUEST_URL, new=1)
        print(f"Launched default browser at {current_time}")

def main():
    current_time = datetime.now().strftime("%I:%M %p")
    print(f"PlacementQuest Check-in triggered at {current_time}")
    launch_browser()

if __name__ == "__main__":
    main()
