@echo off
set /p PID=<pid.txt
taskkill /F /PID %PID%