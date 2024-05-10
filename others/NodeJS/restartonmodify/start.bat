
:start
@rem ..\nodejs20\node app.js --python python --script script.py

..\nodejs20\node.exe app.js --python c:/Installed/Python311/python.exe --script ../../../build/roms/navigateur_demander.py --param1 test --param2 un--param1

..\nodejs20\node app.js --python %1 --script %2 --param1 %3 --param2 %4 --param3 %5 --param4 %6 --param5 %7
goto start
pause