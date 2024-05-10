#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 


file = execute.currentDir + "/chiffre.json"
if not files.isFile(file):
    print("File not found ["+file+"]")
    execute.stop()
jsonList = files.readJSON(file)

for speakValue in micro.speak:

    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in jsonList:
        chiffre = jsonList[speakValue][0]
        i = 0
        lwin = []
        wi = gui.listWindows()
        for w in wi:
            if w != "":
                t = str(i)+" - "+w.replace("1", "1 ").replace("2", "2 ").replace("3", "3 ").replace("4", "4 ").replace("5", "5 ").replace("6", "6 ").replace("7", "7 ").replace("8", "8 ").replace("9", "9 ").replace("0", "0 ").replace(".", " point ")+" "
                t = t.split("-")[-1].split("\\")[-1]
            lwin.append(w)
            i = i + 1
        try:
            title = lwin[int(chiffre)]
        except:
            title = ""
        if title == "":
            spk.saywait("Je ne trouve pas le numero de fenêtre  "+str(chiffre))
        else:
            try:
                mywin = gui.gw.getWindowsWithTitle(title)[0]
                mywin.maximize()
                mywin.activate()
                spk.saywait("Vous avez choisi "+str(chiffre)+". "+title)
            except:
                print("Erreur à la sélection de la fenêtre")                
				
        execute.stop()

    


    if speakValue in ["fenetre"]:
        i = 0
        lwin = []
        wi = gui.listWindows()
        for w in wi:
            if w != "":
                t = str(i)+" - "+w.replace("1", "1 ").replace("2", "2 ").replace("3", "3 ").replace("4", "4 ").replace("5", "5 ").replace("6", "6 ").replace("7", "7 ").replace("8", "8 ").replace("9", "9 ").replace("0", "0 ").replace(".", " point ")+" "
                print(str(i)+". "+w)
                t = t.split("-")[-1].split("\\")[-1]
                spk.saywait(str(i)+". "+t, False)
            lwin.append(w)
            i = i + 1
        execute.stop()