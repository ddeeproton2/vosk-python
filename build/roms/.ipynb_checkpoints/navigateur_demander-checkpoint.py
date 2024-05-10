#global: self, speak, arrstr
#from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
# Pour tester
# ..\nodejs20\node.exe app.js --python c:/Installed/Python311/python.exe --script ../../../build/roms/navigateur_demander.py --param1 test --param2 tttt

import sys
import os
import datetime, time
now =  datetime.datetime.now()

def az(number, num_digits=2): # Add Zero
    return str(number).zfill(num_digits)

def hour(t):
    print("[%s:%s:%s %s.%s.%s] %s" % (az(now.hour),az(now.minute),az(now.second),az(now.day),az(now.month),now.year, t))
"""
nom_variable = "args"
isOnEval = nom_variable in locals() and  nom_variable in globals()
if not isOnEval: # si on test, on créer virtuellement les classes utilisés 
"""
if __name__ == "__main__":
    from includes.web.v001.myweb import MyWeb
    from includes.files.v001.myfiles import MyFiles
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
    """    
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
    """

if not hasattr(self, 'mode'):
    self.mode = ""
    self.mode = "chiffre_menu"

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
    def speakletters():
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

if not hasattr(self, 'speaknumbers'):
    def speaknumbers():
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
    self.speaknumbers = speaknumbers



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

 




if self.mode == "":
    if len(micro.speak) == 0: # si aucun on sort
        execute.stop()
    if len(micro.speak) == 1: # si un seul, alors on demande pas
        if self.message != '':
            self.message += " "
        if micro.speak[0] != "":
            self.message += micro.speak[0]
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
    s = self.speaknumbers()
    if s == "":
        execute.stop()
    i = int(s)-1
    print("i=["+str(i)+"]")
    if i >= 0 and i < len(self.sentences):
        sentence = self.sentences[i]
        if sentence == "":
            print("WARNING: sentence vide")
            execute.stop()
        if self.message != '':
            self.message += " "
        # rajoute la sélection dans le message total
        self.message += sentence
        self.mode = ""
    else:
        spk.saywait("J'ai pas compris "+s)
    print("speaknumber=["+s+"]")
    execute.stop()
    pass

if self.mode == "lettre":
    print("speakletters=["+self.speakletters()+"]")
    execute.stop()
    pass

if self.mode == "chiffre":
    print("speaknumber=["+self.speaknumbers()+"]")
    execute.stop()
    pass

if self.mode == "envoyer":
    msg = web.json_encode(micro.speak)
    msg = web.encodeURI(msg)
    web.openURLGET("http://192.168.1.222:13080/speak?msg="+msg)
    self.mode = ""
    execute.stop()
    pass

execute.stop()
