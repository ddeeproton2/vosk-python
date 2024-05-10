#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot
import time
import datetime

print(args.python_onlistening)

now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s"  % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

windowTitle = "roms - visual studio code"
if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
    gui.getWindow(windowTitle)
    time.sleep(1)
    gui.pyautogui.click(167, 238)
if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
    print("Warning : ["+windowTitle+"] window not found or focused")
    spk.saywait("Je n'ai pas la main sur la fenêtre "+windowTitle+". Commande annulée", False)
    execute.stop()

print(micro.speak)

spk.say(micro.speak[0])
for speakValue in micro.speak:

    if speakValue in ["aide"]:
        print("=====")
        spk.saywait("Annuler")
        spk.saywait("Début de ligne")
        spk.saywait("Fin de ligne")
        spk.saywait("Flèche gauche")
        spk.saywait("Flèche droite")
        spk.saywait("Flèche bas")
        spk.saywait("Flèche haut")
        spk.saywait("Dicter")
        spk.saywait("Ecrire")
        spk.saywait("Lire")
        spk.saywait("Agrandir")
        spk.saywait("Réduire")
        pass

    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        spk.saywait("Sortie du mode programmation. Retour à l'accueil.")
        args.python_onlistening = execute.currentDir + "/start.py"
        execute.stop()

    if speakValue in ["balises if"]:
        gui.pyautogui.write('if :')
        gui.pyautogui.press('left')
        spk.saywait("Balise if")
        spk.saywait("Entrée dans le mode dictée")
        execute.previous_onlistening = args.python_onlistening
        args.python_onlistening = execute.currentDir + "/dicter.py"
        execute.stop()

    if speakValue in ["début ligne","début de ligne","début de lire","début de la ligne"]:
        gui.pyautogui.press('home')
        spk.saywait("Début de la ligne")
        execute.stop()

    if speakValue in ["fin ligne","fin de ligne","fin de la ligne"]:
        gui.pyautogui.press('end')
        spk.saywait("Fin de la ligne")
        execute.stop()

    if speakValue in ["flèche gauche"]:
        gui.pyautogui.press('left')
        spk.saywait("Flèche gauche")
        execute.stop()

    if speakValue in ["flèche droite"]:
        gui.pyautogui.press('right')
        spk.saywait("Flèche droite")
        execute.stop()

    if speakValue in ["flèche bas", "flash-back", "flashback", "flèche défendre", "flash défendre"]:
        gui.pyautogui.press('down')
        spk.saywait("Flèche bas")
        execute.stop()

    if speakValue in ["flèche haut","flash monté", "flèche montée", "flash monter", "flash muté", "flash goûter", "flash montée", "flèche monté"]:
        gui.pyautogui.press('up')
        spk.saywait("Flèche haut")
        execute.stop()

    if speakValue in ["épeler","dictée","dites"]:
        spk.saywait("Entrée dans le mode dictée")
        execute.previous_onlistening = args.python_onlistening
        args.python_onlistening = execute.currentDir + "/dicter.py"
        execute.stop()

    if speakValue in ["écrire"]:
        spk.saywait("Entrée dans le mode écrire")
        args.python_onlistening = execute.currentDir + "/ecrire.py"
        execute.stop()

    if speakValue in ["lire ligne", "lire la ligne", "lecture ligne","lire l'avenir","lire en ligne","lire"]:
        gui.pyautogui.hotkey('shiftright','shift', 'home')
        gui.pyautogui.hotkey('shiftright','shift', 'home')
        gui.pyautogui.hotkey("ctrl", "c")
        text1 = gui.texte_en_copie()
        gui.pyautogui.press("right")
        gui.pyautogui.hotkey('shiftright','shift', 'end')
        gui.pyautogui.hotkey("ctrl", "c")
        text2 = gui.texte_en_copie()
        if text2 == text1+chr(13)+chr(10): # Visual Code will copy the entire line, if ctrl+C is pressed without any letter selected, and add a newline at the end.
            text2 = ""
        if text2 != "":
            gui.pyautogui.press("left")
            
        text = text1 + text2
        spk.saywait(text)
        text = "donc le début est. " + text1 + ". Le curseur est ici. Après le curseur. " + text2
        spk.saywait(text, False)
        def spell(text):
            if text == "":
                return "Rien."
            text = text.replace("    ","¬tabulation¬")
            text = text.replace(" ","¬espace¬")
            text = text.replace(" ","¬tabulation¬")
            text = text.replace(".","¬point¬")
            r = ""
            canwrite = True
            for t in text:
                if t == "¬":
                    canwrite = not canwrite 
                    if canwrite == True:
                        r += ". "
                    else:
                        r += " "
                else:
                    if canwrite == True:
                        if t == "y":
                            t = "i grec"
                        r += " " + t + "."
                    else:
                        r += t
            r = r.replace("'",". apostrophe. ").replace(",",". virgule. ").replace("(",". ouvrir la parenthèse. ").replace(")",". fermer la parenthèse. ").replace("{",". ouvrir l'accolade. ").replace("}",". fermer l'accolade. ").replace("\"",". double guillemets. ").replace("=",". égale. ").replace("!",". point d'exclamation. ").replace("?",". point d'interrogation. ").replace("_",". tiret bas. ").replace(":",". deux points. ")
            return r
        text = "j'épelle la ligne. " + spell(text1) + ". Le curseur est ici. Après le curseur. " + spell(text2)
        #print(text)
        spk.saywait(text, False)
        execute.stop()

    if speakValue in ["agrandir"]:
        gui.pyautogui.hotkey('ctrl', 'add')
        spk.saywait("agrandisssement")

    if speakValue in ["réduire"]:
        gui.pyautogui.hotkey('ctrl', '-')
        spk.saywait("rapticissement")
