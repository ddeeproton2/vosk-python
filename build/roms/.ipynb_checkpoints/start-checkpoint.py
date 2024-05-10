#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

spk.say(speak[0])
for speakValue in speak:

    if speakValue in ["coder", "codé", "codés", "cody", "côté","codées","programmation"]:
        spk.saywait("Entrée dans le mode programmation.")
        args.python_onlistening = this.currentDir() + "/coder.py"
        self.stop()

    if speakValue in ["fenetre"]:
        spk.saywait("Entrée dans le mode fenêtres.")
        args.python_onlistening = this.currentDir() + "/fenetre.py"
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
        self.stop()

