class TMessaging:
    def __init__(self):
        self.message = ""
        self.oldmessages = []
        self.redomessages = []

    def add(self, new_message):
        # Ajoute un espace si le message n'est pas vide
        if self.message != "":
            self.message += " "
        # Ajoute le nouveau message à la chaîne existante
        self.message += new_message
        # Ajoute la phrase entière à la liste des anciens messages
        self.oldmessages.append(new_message)

    def undo(self):
        # Vérifie s'il y a un message précédent à restaurer
        if self.oldmessages:
            # Retire le dernier message mémorisé
            removed_message = self.oldmessages.pop()
            # Ajoute le message retiré à la liste des messages pour refaire
            self.redomessages.append(removed_message)
            # Met à jour le message actuel avec le dernier message mémorisé
            if self.oldmessages:
                self.message = self.oldmessages[-1]
            else:
                self.message = ""
            return removed_message
        else:
            return self.message

    def redo(self):
        # Vérifie s'il y a un message à refaire
        if self.redomessages:
            # Récupère le dernier message retiré via undo
            redo_message = self.redomessages.pop()
            # Ajoute le message à la liste des messages restaurés
            self.oldmessages.append(redo_message)
            # Met à jour le message actuel avec le message refait
            self.message = redo_message
            return redo_message
        else:
            return self.message


"""
# Exemple d'utilisation :
messaging = TMessaging()
messaging.add("Bonjour")
messaging.add("comment ça va ?")
print(messaging.message)       # Affiche : Bonjour comment ça va ?
print(messaging.undo())        # Affiche : Bonjour
print(messaging.message)       # Affiche : Bonjour
print(messaging.redo())        # Affiche : Bonjour comment ça va ?
print(messaging.message)       # Affiche : Bonjour comment ça va ?
"""
