#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot
import time
import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 


spk.say(micro.speak[0])
if micro.speak[0] in ["sortir"]:
    spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
    args.python_onlistening = execute.currentDir + "/coder.py"
    spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
    execute.stop()


gui.clipboard.copy(micro.speak[0].replace("virgule", ", ").replace("point", ". ").replace("l'espace", " "))
time.sleep(1)
gui.pyautogui.hotkey('ctrl', 'v')