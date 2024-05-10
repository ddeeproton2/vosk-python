import psutil
from colorama import init, Fore, Back, Style

# Initialise colorama pour Windows
init()


def get_process_command_line():
    # Obtenir une liste de tous les processus en cours d'exécution
    all_processes = psutil.process_iter(['pid', 'cmdline'])

    # Parcourir tous les processus
    for process in all_processes:
        try:
            # Obtenir le PID et la ligne de commande du processus
            pid = process.info['pid']
            cmdline_list = process.info['cmdline']

            # Vérifier si la liste de la ligne de commande n'est pas vide
            if cmdline_list:
                if cmdline_list != '':
                    cmdline = ' '.join(cmdline_list)
                    # Afficher le PID et la ligne de commande
                    #print(f"PID: {pid}, CommandLine: {cmdline}")
                    print(f"{pid}")
                    print(cmdline.replace("\n",""))
                    #print(f"{pid}\t{cmdline}")
                    #print("")
                    print("")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
            
            

def get_process_command_line_colored():
    # Obtenir une liste de tous les processus en cours d'exécution
    all_processes = psutil.process_iter(['pid', 'cmdline'])
    #all_processes = psutil.process_iter([])

    # Parcourir tous les processus
    for process in all_processes:
        try:
            #print(process.info);
            # Obtenir le PID et la ligne de commande du processus
            pid = process.info['pid']
            cmdline_list = process.info['cmdline']

            # Vérifier si la liste de la ligne de commande n'est pas vide
            if cmdline_list:
                if cmdline_list != '':
                    #cmdline = ' '.join(cmdline_list)
                    # Afficher le PID et la ligne de commande
                    #print(f"PID: {pid}, CommandLine: {cmdline}")
                    print(Fore.GREEN+f"{pid}")
                    #print(Fore.WHITE + cmdline.replace("\n",""))
                    print(Fore.WHITE + Style.BRIGHT + '"'+cmdline_list[0].replace("\n","")+'" ', end="")
                    print(Style.RESET_ALL, end="")  # Réinitialiser les styles de couleur
                    for i in range(1, len(cmdline_list)):
                        print('"'+cmdline_list[i]+'" ', end="")
                    #print(f"{pid}\t{cmdline}")
                    #print("")
                    print("")
                    print(Style.RESET_ALL)  # Réinitialiser les styles de couleur
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

# Appeler la fonction pour obtenir les informations sur les processus et leurs lignes de commande
print(Back.GREEN+Fore.WHITE+"")
print("=========================================================")
print("                    PID and CommandLine")
print("=========================================================")
print(Style.RESET_ALL)  # Réinitialiser les styles de couleur
print("")
#get_process_command_line()
get_process_command_line_colored()




"""
# Imprimer du texte coloré
print(Fore.RED + 'Texte en rouge')
print(Back.GREEN + 'Texte avec fond vert')
print(Style.BRIGHT + 'Texte en gras')
print(Style.RESET_ALL)  # Réinitialiser les styles de couleur

# Vous pouvez également combiner les styles
print(Fore.YELLOW + Back.BLUE + 'Texte jaune sur fond bleu')
"""