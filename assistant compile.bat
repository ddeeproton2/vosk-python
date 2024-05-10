@rem pyinstaller.exe .\assistant.py -p python\0.0.2 --noconfirm --onefile --add-data="C:\installed\Python\Python311\Lib\site-packages\vosk":"vosk"
@rem pyinstaller.exe .\assistant.py -p python\0.0.2 --noconfirm
@rem mkdir dist\assistant\_internal\vosk
@rem xcopy /E "C:\installed\Python\Python311\Lib\site-packages\vosk" "dist\assistant\_internal\vosk"
@rem dist\assistant.exe
@rem python -m pip install pyinstaller
@rem goto start

@rem python assistant.py --micro-list-devices
@rem pause

pyinstaller.exe .\assistant.py --noconfirm --onefile --add-data="D:/installed/python/Python311/Lib/site-packages/vosk/*:vosk"  --add-data="D:/installed/python/Python311/Lib/site-packages/nltk/*:nltk"
del build\assistant.exe
copy dist\assistant.exe build\assistant.exe
del dist\assistant.exe 
rmdir dist
cd build
call "assistant P222.bat"
@rem 
:start
@rem pause
exit
assistant.exe --micro-model model/vosk-model-fr-0.22  --micro-device 10 --python-onload "onload.py" --python-onlistening "onlistening.py"

@rem python -m pip install nuitka
@rem python -m nuitka assistant.py

@pause