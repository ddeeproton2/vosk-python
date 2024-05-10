#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot
import time
import datetime

print(args.python_onlistening)

now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

print(micro.speak)
"""
windowTitle = "p77"
if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
    gui.getWindow(windowTitle)
    time.sleep(1)
    gui.pyautogui.click(167, 238)
if not windowTitle.lower() in gui.gw.getActiveWindow().title.lower():
    print("Warning : ["+windowTitle+"] window not found or focused")
    spk.saywait("Je n'ai pas la main sur la fenêtre "+windowTitle+". Commande annulée", False)
    this.stop()
"""
if micro.speak[0] in ["sortir","annuler","quitter"]:
    spk.saywait("Sortie du mode écrire. Retour à l'accueil.")
    args.python_onlistening = execute.currentDir + "/start.py"
    execute.stop()

def lire_la_ligne():
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


#spk.say(speak[0])
for speakValue in micro.speak:

    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ["début ligne","début de ligne","début de lire","début de la ligne"]:
        spk.saywait("Début de la ligne")
        gui.pyautogui.press('home')
        execute.stop()

    if speakValue in ["fin ligne","fin de ligne","fin de la ligne"]:
        spk.saywait("Fin de la ligne")
        gui.pyautogui.press('end')
        execute.stop()

    if speakValue in ["flèche gauche"]:
        spk.saywait("Flèche gauche")
        gui.pyautogui.press('left')
        execute.stop()

    if speakValue in ["flèche droite"]:
        spk.saywait("Flèche droite")
        gui.pyautogui.press('right')
        execute.stop()

    if speakValue in ["flèche bas", "flash-back", "flashback", "flèche défendre", "flash défendre"]:
        spk.saywait("Flèche bas")
        gui.pyautogui.press('down')
        execute.stop()

    if speakValue in ["flèche haut","flash monté", "flèche montée", "flash monter", "flash muté", "flash goûter", "flash montée", "flèche monté"]:
        spk.saywait("Flèche haut")
        gui.pyautogui.press('up')
        execute.stop()

    if speakValue in ["épeler","dictée","dites"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/dicter.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ["écrire"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/ecrire.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ["envoyer"]:
        spk.saywait("Envoyer")
        gui.pyautogui.press('enter')
        execute.stop()

    if speakValue in ["lire ligne", "lire la ligne", "lecture ligne","lire l'avenir","lire en ligne","lire"]:
        lire_la_ligne()
        execute.stop()

    if speakValue in ["la main"]:
        spk.saywait("La main rose")
        gui.pyautogui.write(':hand-pink-waving:')
        execute.stop()

    if speakValue in ["le sourire","sourire"]:
        gui.pyautogui.write(':)')
        spk.saywait("Smiley sourire")
        execute.stop()

    if speakValue in ["à plus"]:
        gui.pyautogui.write('++ :)')
        spk.saywait("Smiley sourire")
        execute.stop()

    if speakValue in ["j'aime","cool"]:
        gui.pyautogui.write(':thumbsup:')
        spk.saywait("Pouce en l'air")
        execute.stop()


    if speakValue in ["effacé","c'est assez"]:
        gui.pyautogui.hotkey('ctrl', 'a')
        gui.pyautogui.press('delete')
        spk.saywait("Effacer")
        execute.stop()



#gui.pyautogui.write(speak[0].replace("virgule", ", ").replace("point", ". ").replace("l'espace", " ").replace("deux points",":").replace("arobase","@"))

def firstUpper(s):
    return s[0].upper()+s[1:]


gui.clipboard.copy(firstUpper(micro.speak[0].replace("virgule", ", ").replace("point", ". ").replace("l'espace", " ").replace("deux points",":").replace("arobase","@")))
time.sleep(1)
gui.pyautogui.hotkey('ctrl', 'v')
spk.saywait(micro.speak[0])
