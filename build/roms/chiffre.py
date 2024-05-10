#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot
import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

print("speak")
print(micro.speak)

file = execute.currentDir + "/chiffre.json"
if not files.isFile(file):
    print("File not found ["+file+"]")
    execute.stop()
jsonList = files.readJSON(file)
for speakValue in micro.speak:

    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        spk.saywait("Retour au mode code")
        args.python_onlistening = execute.currentDir + "/coder.py"
        execute.stop()

    if speakValue in jsonList:
        chiffre = jsonList[speakValue][0]
        gui.pyautogui.write(chiffre)
        spk.saywait(chiffre)
        execute.stop()


