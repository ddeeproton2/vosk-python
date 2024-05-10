#global: self, speak, arrstr
#args.python_onlistening = this.currentDir() + "/start.py"
#speak = micro.listen_wait()
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import datetime
#d1 = datetime.datetime.now()
#d2 = datetime.datetime(2023,12,29,20,00)
#d2 = datetime.datetime.now()
#now = datetime.datetime.fromtimestamp((d2  - d1).seconds)
#print(now)
#d = datetime.datetime.fromtimestamp(d2_d1.seconds)
#d = datetime.datetime.fromisoformat(str(d2_d1))
#print(str(d.hour-1)+":"+str(d.minute)+":"+str(d.second))
#print ("%s/%s/%s %s:%s:%s" % (now.month,now.day,now.year,now.hour,now.minute,now.second)) 
#time = datetime.datetime.now()
#time.timedelta.min = datetime.datetime.now()
#time.timedelta.max = datetime.datetime(1970,1,1,1,0)
#time =  datetime.datetime.fromisoformat((time - datetime.datetime(1970,1,1,1,0)))

now =  datetime.datetime.now()
#print ("%s/%s/%s %s:%s:%s" % (now.month,now.day,now.year,now.hour,now.minute,now.second)) 
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 

"""
day = time / (24 * 3600)
time = time % (24 * 3600)
hour = time / 3600
time %= 3600
minutes = time / 60
time %= 60
seconds = time


#print day, hour, minutes and seconds
print('Days', day)
print('Hours', hour)
print('Minutes', minutes)
print('Seconds', seconds)
"""



print(micro.speak)

def stop():
    raise Exception("")

if not files.isFile(execute.currentDir + "/start.spk"):

    speakList = [
        {
            'tag': "oui",
            'patterns': ["oui", "ouais", "vrai","yesss","yes","ok","certes","certainement","effectivement","confirme","confirmation","accepté","acceptez","accepter","acceptée","vas-y","allez-y","nickel","parfait","magnifique"]
        },
        {
            'tag': "non",
            'patterns': ["non", "ne", "pas","refusé","refuser","refusée","refusez","refusé","rejeté","rejetée","rejeter","rejetés","oublie","je ne veux pas","ça craint"]
        },
        {
            'tag': "annuler",
            'patterns': ["annulé", "annulée", "annuler", "annulez", "annulés","sortir","kit","quitter","quittez","terminé","terminée","terminer","terminez","fermée","fermé","fermer","arrêtez","arrêté"]
        },
        {
            'tag': "noize",
            'patterns': ["un", "euh", "hein", "hum", "heu","eux"]
        },
        {
            'tag': "coder",
            'patterns': ["coder", "codé", "codés", "cody", "côté","codées","programmation"]
        }
    ]
    chatbot.compileSpeak(speakList, execute.currentDir + "/start.spk")



def words_getSpeaking(self, modelSpeaking):
    if not files.isFile(modelSpeaking):
        print("Warning: is not file "+modelSpeaking)
        return ""
    for s in words.speak:
        for ss in s:
            for sss in ss:
                tag = chatbot.getSpeaking(modelSpeaking, sss)
                if not tag == "":
                    words.reset()
                    break
    return tag

tag = words_getSpeaking(execute.currentDir + "/start.spk")
if not tag == "" and not tag == "noize":
    spk.saywait(tag)

    if tag == "oui":
        pass

    if tag == "non":
        pass

    if tag == "annuler":
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/start.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        pass

    if tag == "coder":
        spk.saywait("Sortie de "+files.getFilename(args.python_onlistening))
        args.python_onlistening = execute.currentDir + "/coder.py"
        spk.saywait("Entrée sur "+files.getFilename(args.python_onlistening))
        pass


