#global: self, speak, arrstr
#from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
# Pour tester
# ..\nodejs20\node.exe app.js --python c:/Installed/Python311/python.exe --script ../../../build/roms/navigateur_demander.py --param1 test --param2 tttt

import sys
import os



"""
class TDatetime:
    def display():
        pass
"""

def hour(t):
    import datetime, time
    now =  datetime.datetime.now()
    def az(number, num_digits=2): # Add Zero
        #print(number)
        return str(number).zfill(num_digits)
    print("[%s:%s:%s %s.%s.%s] %s" % (az(now.hour),az(now.minute),az(now.second),az(now.day),az(now.month),now.year, t))

hour("test")
"""
nom_variable = "args"
isOnEval = nom_variable in locals() and  nom_variable in globals()
if not isOnEval: # si on test, on créer virtuellement les classes utilisés 
"""


"""
if __name__ == "__main__":
    print("=== MAIN ===")
    from includes.web.v001.myweb import MyWeb
    from includes.files.v001.myfiles import MyFiles
    from includes.messaging.v001.mymessaging import TMessaging
    messaging = TMessaging()
    web = MyWeb()
    files = MyFiles()

    class TSelf:
        pass
    self = TSelf()

    class TMicro:
        pass
    micro = TMicro()
    
    class TArgs:
        python_onlistening = "navigateur_demander.py"
    args = TArgs()
    
    class TSpk:
        def saywait(s, t):
            hour("%s SPEAK %s" % (args.python_onlistening, t)) 
    spk = TSpk()
    
    class TExec:
        currentDir = os.path.dirname(os.path.abspath(__file__))
        def stop(s):
            hour("%s STOP" % (args.python_onlistening)) 
            print (">    args.python_onlistening = '%s'" % (args.python_onlistening)) 
            print (">    self.mode = '%s'" % (self.mode)) 
            print (">    self.sentences = '%s'" % (self.sentences)) 
            print (">    self.message = '%s'" % (self.message)) 
            sys.exit(0)
    execute = TExec()
    "" "    
    class TFiles:
        def isFile(self, name):
            return True
        def getFilename(self, name):
            print(name)
        def readJSON(self, name):
            print(name)
            return ['test','test']
    files = TFiles()
    
    class TWeb:
        def json_encode(t):
            return t
            pass
        def encodeURI(t):
            return t
            pass
        def openURLGET(t):
            return t
            pass
    
    web = TWeb()
    "" " 
"""
if not hasattr(self, 'mode'):
    self.mode = ""
    #self.mode = "chiffre_menu"

if not hasattr(self, 'isMajuscule'):
    self.isMajuscule = False

if not hasattr(micro, 'speak'):
    micro.speak = ['deux','alfer2']

if not hasattr(self, 'message'):
    self.message = "cool"

if not hasattr(self, 'oldmessages'):
    self.oldmessages = []

if not hasattr(self, 'oldmessageindex'):
    self.oldmessageindex = 0

if not hasattr(self, 'sentences'):
    self.sentences = ['deux', 'alfer2']

if not hasattr(self, 'speakletters'):
    def speakletters(execute, files, micro, spk):
        #spk.saywait("Epeler les chiffres")
        file = execute.currentDir + "/lettre.json"
        if not files.isFile(file):
            print("File not found ["+file+"]")
            return ""
        jsonList = files.readJSON(file)
        for speakValue in micro.speak:
            if speakValue in jsonList:
                lettre = jsonList[speakValue][0]
                if self.isMajuscule :
                    lettre = lettre.upper()
                #gui.pyautogui.write(lettre)
                if self.isMajuscule :
                    spk.saywait(lettre+ " majuscule")
                else:
                    spk.saywait(lettre)
                return lettre
            if speakValue in ["majuscule","minuscule"]:
                self.isMajuscule = not self.isMajuscule
                
                if self.isMajuscule:
                    spk.saywait("Majuscule activé")
                else:
                    spk.saywait("Majuscule désactivé")
                
                return ""
        return ""
        pass
    self.speakletters = speakletters







"""
if not hasattr(self, 'speaknumbers'):
    
    print("==== Define speaknumber")
"""
def speaknumbers(execute, files, micro, spk):
    #global execute
    file = execute.currentDir + "/chiffre.json"
    if not files.isFile(file):
        print("File not found ["+file+"]")
        return ""
    jsonList = files.readJSON(file)
    for speakValue in micro.speak:
        if speakValue in jsonList:
            chiffre = jsonList[speakValue][0]
            #gui.pyautogui.write(chiffre)
            spk.saywait(chiffre)
            return chiffre
    return ""




"""
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

# ===================================
# START
# ===================================

hour("%s MICRO > [%s]" % (args.python_onlistening, micro.speak)) 
print (">    args.python_onlistening = '%s'" % (args.python_onlistening)) 
print (">    self.mode = '%s'" % (self.mode)) 

for speakValue in micro.speak:

    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/navigateur.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ["aide","menu","elle"]:
        print("=====")
        spk.saywait("Vous etes sur "+files.getFilename(args.python_onlistening))
        spk.saywait("Et vous etes en mode "+self.mode)
        if self.mode == "":
            spk.saywait("Pas de mode selectionner")
        spk.saywait("Les commandes sont:")
        spk.saywait("lettre")
        spk.saywait("chiffre")
        spk.saywait("envoyer")
        spk.saywait("revenir")
        #spk.saywait(self.test)
        #self.test = "cool"
        execute.stop()

    if speakValue in ["lettre"]:
        spk.saywait("Sortie du mode "+self.mode)
        self.mode = "lettre"
        spk.saywait(" et entrée dans le mode "+self.mode)
        execute.stop()

    if speakValue in ["chiffre"]:
        spk.saywait("Sortie du mode "+self.mode)
        self.mode = "chiffre"
        spk.saywait(" et entrée dans le mode "+self.mode)
        execute.stop()

    if speakValue in ["envoyer"]:
        spk.saywait("Sortie du mode "+self.mode)
        self.mode = "envoyer"
        spk.saywait(" et entrée dans le mode "+self.mode)
        execute.stop()

    if speakValue in ["revenir"]:
        spk.saywait("Revenir. Ancien message "+messaging.message)
        messaging.undo()
        spk.saywait("Nouveau message "+messaging.message)
        execute.stop()

    if speakValue in ["rétablir"]:
        spk.saywait("Rétablir. Ancien message "+messaging.message)
        messaging.redo()
        spk.saywait("Nouveau message "+messaging.message)
        execute.stop()




# ===================================
# MODE
# ===================================


if self.mode == "":
    if len(micro.speak) == 0: # si aucun on sort
        execute.stop()
    if len(micro.speak) == 1: # si un seul, alors on demande pas
        if micro.speak[0] != "":
            messaging.add(micro.speak[0])
        else:
            print("WARNING: Message is empty")
        execute.stop()
    # si plusieurs sentences
    i = 1
    self.sentences = micro.speak
    menu = ""
    for speakValue in self.sentences:
        menu += str(i)+". "+speakValue+". "
        print(str(i)+" - "+speakValue)
        i += 1
    spk.saywait(menu+" Sélectionner votre phrase")
    self.mode = "chiffre_menu"
    execute.stop()
    pass



if self.mode == "chiffre_menu":
    if len(self.sentences) == 0:
        print("WARNING: Pas de phrases a memoriser")
        self.mode = ""
        execute.stop()


    s = speaknumbers(execute, files, micro, spk)
    if s == "":
        execute.stop()
    i = int(s)-1
    print("i=["+str(i)+"]")
    if i >= 0 and i < len(self.sentences):
        sentence = self.sentences[i]
        if sentence == "":
            print("WARNING: sentence vide")
            execute.stop()
        # rajoute la sélection dans le message total
        messaging.add(sentence)
        spk.saywait("Sélection "+messaging.message)
        self.mode = ""
    else:
        spk.saywait("J'ai pas compris "+s+" Veullez indiquer un chiffre entre 1 et "+str(len(self.sentences)))
    print("speaknumber=["+s+"]")
    execute.stop()
    pass

if self.mode == "lettre":
    print("speakletters=["+self.speakletters(execute, files, micro, spk)+"]")
    execute.stop()
    pass

if self.mode == "chiffre":
    print("speaknumber=["+self.speaknumbers(execute, files, micro, spk)+"]")
    execute.stop()
    pass

if self.mode == "envoyer":
    msg = web.json_encode(micro.speak)
    msg = web.encodeURI(msg)
    web.openURLGET("http://192.168.1.77:13080/speak?msg="+msg)
    self.mode = ""
    execute.stop()
    pass

execute.stop()
