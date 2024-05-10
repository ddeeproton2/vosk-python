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


%python% display.py

