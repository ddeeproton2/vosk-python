#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime, time
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

def checkWindow():
    windowTitle = "youtube"
    if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
        gui.getWindow(windowTitle)
        time.sleep(1)
        gui.pyautogui.click(167, 238)
    if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
        print("Warning : ["+windowTitle+"] window not found or focused")
        spk.saywait("Je n'ai pas la main sur la fenêtre "+windowTitle+". Commande annulée", False)
        execute.stop()

spk.say(micro.speak[0])

for speakValue in micro.speak:


    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening)+" entrée sur start.py")
        execute.stop()


    if speakValue in ["jouer"]:
        checkWindow()
        gui.pyautogui.click(764, 557) 
        spk.saywait("Jouer")
        execute.stop()


    if speakValue in ["prochain","suivant"]:
        checkWindow()
        gui.pyautogui.click(178, 873) 
        spk.saywait("suivant")
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


    if speakValue in ["démarrage"]:
        checkWindow()
        gui.pyautogui.click(109, 120)
        spk.saywait("Accueil youtube")
        time.sleep(5)
        gui.pyautogui.click(733, 647);
        execute.stop()

    
