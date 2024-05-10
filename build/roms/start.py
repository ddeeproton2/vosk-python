#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] [SPEAK] %s [%s]" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening, speak[0])) 

spk.say(micro.speak[0], False)
for speakValue in micro.speak:


    if speakValue in ["aide","menu","elle"]:
        print("=====")
        spk.saywait("Vous etes sur "+files.getFilename(args.python_onlistening))
        spk.saywait("Les commandes sont:")
        spk.saywait("dicter")
        spk.saywait("youtube")
        spk.saywait("navigateur")
        spk.saywait("visual studio code")
        spk.saywait("gemini")
        spk.saywait("fenetre")
        pass        

    if speakValue in ["dicter"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/chat.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()


    if speakValue in ["youtube"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/youtube.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()


    if speakValue in ["navigateur"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/navigateur.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    """
    if speakValue in ["coder", "codé", "codés", "cody", "côté","codées","programmation"]:
        spk.saywait("Entrée dans le mode programmation.")
        args.python_onlistening = this.currentDir() + "/coder.py"
        this.stop()
    """

    if speakValue in ["visual studio code", "visual", "studio"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/visual_studio_code.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ["gemini", "jenny", "jamie"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/gemini.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()


    if speakValue in ["fenetre"]:
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/fenetre.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
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

