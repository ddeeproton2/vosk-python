#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime, time
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] [SPEAK] %s [%s]" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening, micro.speak[0])) 

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
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ["aide","menu","elle"]:
        print("=====")
        spk.saywait("Vous etes sur "+files.getFilename(args.python_onlistening))
        spk.saywait("Les commandes sont:")
        spk.saywait("annuler")
        spk.saywait("demander")
        spk.saywait("question")
        execute.stop()

    if speakValue in ["demander"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/navigateur_demander.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

"""
path = this.currentDir() 
path  = files.getParentdir(path) 
path  = files.getParentdir(path) 
files.writeJSON(path + "/others/NodeJS/socketionodejs/DATA/voice.json", speak)
"""
msg = web.json_encode(micro.speak)
msg = web.encodeURI(msg)

web.openURLGET("http://192.168.1.77:13080/speak?msg="+msg)

"""
    url = search(speakValue, links)
    if url != "":
        print("[GOTO WEB] "+url)
        to_navigator = files.getParentdir(this.currentDir()) + "/webserver/navigator/to_navigator.json"
        links = files.writeJSON(to_navigator, {'gotourl':url})
"""

"""
navigator_file = files.getParentdir(this.currentDir()) + "/webserver/navigator/current.json"
navigator = files.readJSON(navigator_file)
tag = chatbot.words_getSpeaking(navigator['file'], speak)


print("navigator['file']=["+navigator['file']+"]")
print(tag)
"""

