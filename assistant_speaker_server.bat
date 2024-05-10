;@cd /d %~dp0 
@rem pour linux : sudo apt-get install libportaudio2
@rem python assistant.py
@rem pause
@rem mkdir model
@rem python assistant.py --micro-download-model --micro-download-url-model https://alphacephei.com/vosk/models/vosk-model-small-fr-0.22.zip --micro-download-destination-model model --micro-download-remove-model
@rem pause
@rem python assistant.py --speaker-list-voices
@rem pause 
@rem python assistant.py --micro-list-devices
@rem pause
@rem python assistant.py --micro-list-models
@rem pause
@rem 
set onstart="build/roms/includes/sounds/audio_5634777127.wav"
set onend="build/roms/includes/sounds/audio_4fa75b6720.wav"

@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --speaker-voice 0 --micro-device 3 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-server 0.0.0.0:7979
@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --speaker-voice 2 --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-client 127.0.0.1:8080
@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --speaker-voice 0 --micro-device 3 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-client 127.0.0.1:7979


@rem python assistant.py --micro-model model\vosk-model-en-us-daanzu-20200905-lgraph --micro-assistant commands --micro-device 10
@rem python assistant.py --micro-model model\vosk-model-en-us-0.22-lgraph --micro-assistant commands --micro-device 8
@rem python assistant.py --micro-model model\vosk-model-small-fr-0.22 --micro-assistant commands --micro-device 1
@rem python assistant.py --micro-model "D:\Share\Programmation\Python\ReconnaissanceVOCALE\reconaissanceVocale\v2\reconaissanceVocale\assistant\model"



@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080
python assistant.py --micro-device 0 --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-server 0.0.0.0:7979 --micro-model "model/vosk-model-small-fr-0.22" 
python assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-client 127.0.0.1:7979 --micro-model "model/vosk-model-small-fr-0.22" 
python assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080 --micro-model "model/vosk-model-fr-0.22"
python assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080 --micro-model "model/vosk-model-small-fr-0.22" 

@rem python assistant.py --micro-model "model/vosk-model-fr-0.22" --speaker-voice 0 --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend%
pause