import psutil
import subprocess
import os
import sys

def fermer_et_relancer_application_par_pid(pid):
    try:
        # Fermer l'application associée au PID
        process = psutil.Process(int(pid))
        # Récupérer les paramètres de l'application
        parametres = process.cmdline()

        process.terminate()
        print("Application fermée avec succès.")

        # Relancer l'application avec les mêmes paramètres
        working_directory = os.path.dirname(parametres[0])
        subprocess.Popen(parametres, cwd=working_directory, creationflags=subprocess.CREATE_NEW_CONSOLE)
        #subprocess.Popen(parametres, cwd=working_directory, creationflags=subprocess.DETACHED_PROCESS) # En arrière plan
        print("Application relancée avec succès.")
    except psutil.NoSuchProcess:
        print("Le processus avec le PID spécifié n'existe pas.")
    except Exception as e:
        print("Une erreur s'est produite :", str(e))

# Vérifiez si des arguments ont été passés au script
if len(sys.argv) > 1:
    # Récupérez le PID passé en argument
    pid = sys.argv[1]
    fermer_et_relancer_application_par_pid(pid)
else:
    print("Veuillez fournir au moins un argument pour lancer un processus.")