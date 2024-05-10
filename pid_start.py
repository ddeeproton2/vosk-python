

import subprocess
import os
import sys

# Vérifiez si des arguments ont été passés au script
if len(sys.argv) > 1:
    # Récupérez les arguments comme une liste
    command = sys.argv[1:]

    # Vérifiez si l'argument "START" est présent
    if "START" in command:
        # Supprimez l'argument "START" de la liste
        
        # Assurez-vous que le reste de la commande est un fichier batch valide
        batch_file = command[1]
        command.remove("START")
        
        batch_file = os.path.abspath(batch_file)
        print(batch_file)
        print("==")
        # Définir le répertoire de travail sur celui du fichier batch
        working_directory = os.path.dirname(batch_file)
        
        if batch_file.endswith('.bat') and os.path.exists(batch_file):
            # Lancez le fichier batch dans une nouvelle fenêtre
            process = subprocess.Popen(['cmd', '/c', batch_file], creationflags=subprocess.CREATE_NEW_CONSOLE, cwd=working_directory)
            #process = subprocess.Popen(['cmd', '/c', batch_file], creationflags=subprocess.DETACHED_PROCESS, cwd=working_directory) # En arrière plan
        else:
            # Lancez le processus dans une nouvelle fenêtre
            process = subprocess.Popen([batch_file], creationflags=subprocess.CREATE_NEW_CONSOLE, cwd=working_directory)
        pid = process.pid

        # Affichez le PID
        print("Le PID du processus est:", pid)
        print("taskkill /F /PID ", pid)
        
    else:
    
        # Lancez le processus normalement
        process = subprocess.Popen(command)

        # Obtenez le PID du processus
        pid = process.pid

        # Affichez le PID
        print("Le PID du processus est:", pid)
        print("taskkill /F /PID ", pid)

        # Attendre que le processus se termine
        process.wait()

        # Vérifiez si le processus est toujours en cours d'exécution
        if os.path.exists("/proc/{}/status".format(pid)):
            print("Le processus est toujours en cours d'exécution.")
        else:
            print("Le processus a terminé son exécution.")
else:
    print("Veuillez fournir au moins un argument pour lancer un processus.")