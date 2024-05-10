#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime, time
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] [SPEAK] %s [%s]" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening, speak[0])) 

"""
windowTitle = "vivaldi"
if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
    gui.getWindow(windowTitle)
    time.sleep(1)
if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
    print("Warning : ["+windowTitle+"] window not found or focused")
    spk.saywait("Je n'ai pas la main sur la fenêtre "+windowTitle+". Commande annulée", False)
    this.stop()

gui.pyautogui.click(167, 238)
"""


#spk.say(speak[0], False)

#links = files.readJSON(files.getParentdir(this.currentDir()) + "/webserver/navigator/links.json")
#print(links)


for speakValue in micro.speak:

    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Sortie du mode fenêtres. Retour à l'accueil.")
        execute.stop()

    if speakValue in ["aide","menu","elle"]:
        print("=====")
        spk.saywait("Vous etes sur "+files.getFilename(args.python_onlistening))
        spk.saywait("Les commandes sont:")
        spk.saywait("annuler")
        spk.saywait("allez")
        spk.saywait("moins fort")
        spk.saywait("plus fort")
        spk.saywait("couper")

    if speakValue in ["allez"]:
        gui.pyautogui.click(764, 557) 
        spk.saywait("Jouer")
        execute.stop()

    if speakValue in ["moins fort"]:
        gui.pyautogui.press('volumedown')
        spk.saywait("Moins fort")
        execute.stop()

    if speakValue in ["plus fort"]:
        gui.pyautogui.press('volumeup')
        spk.saywait("plus fort")
        execute.stop()

    if speakValue in ["couper"]:
        gui.pyautogui.press('volumemute')
        spk.saywait("couper le volume")
        execute.stop()

