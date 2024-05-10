@rem assistant.exe --speaker-list-voices
@rem pause 
@rem assistant.exe --micro-list-devices
@rem pause
@rem assistant.exe --micro-list-models
@rem pause
set onstart="roms/includes/sounds/audio_5634777127.wav"
set onend="roms/includes/sounds/audio_4fa75b6720.wav"
@rem assistant.exe --micro-model ../model/vosk-model-fr-0.22 --speaker-voice 0 --micro-device 0 --python-onload "roms/init.py" --python-onlistening "roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080
assistant.exe --micro-model "../model/vosk-model-fr-0.22" --micro-device 0 --python-onload "roms/init.py" --python-onlistening "roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080
assistant.exe --micro-model "../model/vosk-model-small-fr-0.22" --micro-device 0 --python-onload "roms/init.py" --python-onlistening "roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080
@pause