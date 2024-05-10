@echo off
REM Vérifiez si des paramètres ont été passés
if "%~1" == "" ( 
    echo param PID is missing
    exit /b 1 
)
@echo on

set TEST=1

tasklist /FI "PID eq %*" 
