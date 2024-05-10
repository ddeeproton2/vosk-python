
@echo off
;cd /d %~dp0 


if not exist "hidden_service" (
	echo "Creation du dossier hidden_service"
    mkdir "hidden_service" 2>nul
    if errorlevel 1 (
        @echo "Erreur: Impossible de creer le dossier hidden_service"
		@pause
		exit
    )
	echo "Ok"
)




@rem Lancement du proxy TOR
Tor\tor -f "torrc" --GeoIPv6File "Data\Tor\geoip6" --GeoIPFile "Data\Tor\geoip"

@pause