#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 
print("speak")
print(micro.speak)

#spk.saywait("Epeler les chiffres")
file = execute.currentDir + "/lettre.json"
if not files.isFile(file):
    print("File not found ["+file+"]")
    execute.stop()
jsonList = files.readJSON(file)
for speakValue in micro.speak:
    if speakValue in jsonList:
        lettre = jsonList[speakValue][0]
        if self.isMajuscule :
            lettre = lettre.upper()
        gui.pyautogui.write(lettre)
        if self.isMajuscule :
            spk.saywait(lettre+ " majuscule")
        else:
            spk.saywait(lettre)
        execute.stop()
    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/coder.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()
    if speakValue in ["majuscule","minuscule"]:
        self.isMajuscule = not self.isMajuscule
        if self.isMajuscule:
            spk.saywait("Majuscule activé")
        else:
            spk.saywait("Majuscule désactivé")
        execute.stop()


