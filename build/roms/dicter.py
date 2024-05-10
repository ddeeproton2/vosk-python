#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

spk.say(micro.speak[0])

#this.previous_onlistening
for speakValue in micro.speak:

    if speakValue in ["aide"]:
        print("=====")
        spk.saywait("Annuler")
        spk.saywait("Chiffre")
        spk.saywait("Lettre")
        pass

    if speakValue in ['chiffre','chiffres']:
        spk.saywait("Entrée dans le mode chiffre")
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/chiffre.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    if speakValue in ['lettre']:
        spk.saywait("Epeler les lettres")
        self.isMajuscule = False
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/lettre.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()

    annuler = ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]
    coder = ["coder", "codé", "codés", "cody", "côté","codées","programmation"]
    ok = ['ok']
    if speakValue in annuler or speakValue in coder or speakValue in ok:
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        if execute.previous_onlistening is None:
            spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
            args.python_onlistening = execute.currentDir + "/coder.py"
            spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        else:
            args.python_onlistening = execute.previous_onlistening
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        execute.stop()
