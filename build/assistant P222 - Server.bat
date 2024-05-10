@rem pyinstaller.exe .\assistant.py -p python\0.0.2 --noconfirm --onefile --add-data="C:\installed\Python\Python311\Lib\site-packages\vosk":"vosk"
@rem pyinstaller.exe .\assistant.py -p python\0.0.2 --noconfirm
@rem mkdir dist\assistant\_internal\vosk
@rem xcopy /E "C:\installed\Python\Python311\Lib\site-packages\vosk" "dist\assistant\_internal\vosk"
@rem dist\assistant.exe


@rem python -m pip install pyinstaller
@rem 
goto start
pyinstaller.exe .\assistant.py --noconfirm --onefile --add-data="D:/installed/python/Python311/Lib/site-packages/vosk/*:vosk"
del assistant.exe
copy dist\assistant.exe assistant.exe
del dist\assistant.exe 
rmdir dist
@rem 
:start
set onstart="roms/includes/sounds/audio_5634777127.wav"
set onend="roms/includes/sounds/audio_4fa75b6720.wav"
assistant.exe --micro-model ../model/vosk-model-fr-0.22 --speaker-voice 0 --micro-device 3 --python-onload "roms/init.py" --python-onlistening "roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-server 0.0.0.0:7979

@rem python -m pip install nuitka
@rem python -m nuitka assistant.py

@pause