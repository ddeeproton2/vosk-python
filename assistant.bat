@echo OFF
;@cd /d %~dp0 
set python1="C:\installed\Python311\python.exe"
set python2="D:\installed\python\Python311\python.exe"
set USERPROFILE=C:\

rem Liste des fichiers à tester
set "fichiers=%python1% %python2%"
rem Valeur par défaut
set "valeur_fichier=Aucun environnement python trouvé"

rem Boucle pour tester chaque fichier
for %%f in (%fichiers%) do (
    if exist "%%f" (
        set "valeur_fichier=%%f"
        rem Arrêt de la boucle
        goto fin
    )
)

:fin
rem Affichage de la valeur finale
echo Valeur finale: %valeur_fichier%
set python=%valeur_fichier%
@echo ON

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


@rem %python% assistant.py --micro-list-devices
@rem pause
@rem exit

@rem ====================
@rem config 192.168.1.222
@rem sélectionn le micro cable input
@rem %python% assistant.py --micro-device 2 --speaker-voice 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --micro-model "model/vosk-model-fr-0.22" --lazarus-speaker-client 192.168.1.222:8080

@rem sélectionn le micro par défaut
@rem %python% assistant.py --micro-device 0 --speaker-voice 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --micro-model "model/vosk-model-fr-0.22"

@rem ====================
@rem config 192.168.1.77
%python% assistant.py --micro-device 0 --speaker-voice 2 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --micro-model "model/vosk-model-small-en-us-0.15" --lazarus-speaker-client 192.168.1.222:8080 --micro-samplerate 44000


@rem ====================
@rem OLD
@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --speaker-voice 0 --micro-device 3 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-server 0.0.0.0:7979 --micro-samplerate 22000
@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --speaker-voice 2 --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-client 127.0.0.1:8080
@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --speaker-voice 0 --micro-device 3 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-client 127.0.0.1:7979
@rem python assistant.py --micro-model model\vosk-model-en-us-daanzu-20200905-lgraph --micro-assistant commands --micro-device 10
@rem python assistant.py --micro-model model\vosk-model-en-us-0.22-lgraph --micro-assistant commands --micro-device 8
@rem python assistant.py --micro-model model\vosk-model-small-fr-0.22 --micro-assistant commands --micro-device 1
@rem python assistant.py --micro-model "D:\Share\Programmation\Python\ReconnaissanceVOCALE\reconaissanceVocale\v2\reconaissanceVocale\assistant\model"
@rem python assistant.py --micro-model "model/vosk-model-small-fr-0.22" --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080
@rem %python% assistant.py --micro-device 0 --speaker-voice 1 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080 --micro-model "model/vosk-model-fr-0.22"
@rem %python% assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-server 0.0.0.0:7979 --micro-model "model/vosk-model-small-fr-0.22" 
@rem %python% assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-client 127.0.0.1:7979 --micro-model "model/vosk-model-small-fr-0.22" 
@rem %python% assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --lazarus-speaker-client 192.168.1.77:8080 --micro-model "model/vosk-model-small-fr-0.22" 
@rem python assistant.py --micro-model "model/vosk-model-fr-0.22" --speaker-voice 0 --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend%


@rem pause


@echo off

REM Vérifier si le script a été lancé avec start
echo %cmdcmdline% | findstr /C:%0 > nul
if %errorlevel% equ 0 (
    @rem echo Le script a été lancé avec la commande start.
    exit
) else (
    @rem echo Le script a été lancé sans la commande start.
)