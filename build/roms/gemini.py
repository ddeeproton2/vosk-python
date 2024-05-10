#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot
import datetime
now =  datetime.datetime.now()


print ("[%s:%s:%s %s.%s.%s] [SPEAK] %s [%s]" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening, speak[0])) 
spk.say(micro.speak[0], False)

for speakValue in micro.speak:

    if speakValue in ["aide","menu"]:
        print("=====")
        spk.saywait("annuler")
        #spk.saywait("écrire")
        execute.stop()
        pass


    if speakValue in ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]:

        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()



path = execute.currentDir # build/roms
path  = files.getParentdir(path) # build
path  = files.getParentdir(path) #/
files.writeJSON(files.getParentdir(execute.currentDir) + "/others/NodeJS/socketionodejs/DATA/voice.json", speak)

