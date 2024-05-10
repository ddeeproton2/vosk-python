#!/usr/bin/env python3
import threading
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

import argostranslate.package
import argostranslate.translate


from pathlib import Path 

class TTSThreadTranslateAndOpenURL(threading.Thread):
    def __init__(self, text):
        threading.Thread.__init__(self)
        self.text = text
        self.start()

    def run(self):
        t = self.text
        #t = translate.translate(t, "ja", "en")
        #t = translate.translate(t, "ar", "en")
        #t = translate.translate(t, "en", "fr")
        t = translate.translate(t, "en", "fr")
        t = translate.translate(t, "en", "fr")
        t = t.replace(" &apos; ","'").replace("&", " et ").replace("[unk]","").strip()
        if t == '' or t == 'Home' or t == '4,5' or t == 'Oh oui':
            return
        print("["+str(len(t))+"]"+t)
        url = "http://192.168.1.77:8080/?voice=5&message=" + web.encodeURI(t)
        reponse = web.openURL(url, {})


class Translate(Master):

    def __init__(self):
        super().__init__()
        micro.onlisten = self.translate_onlisten
        #translate.install_argostranslate("ja","en")
        #translate.install_argostranslate("en","ja")
        #translate.install_argostranslate("ar","fr")
        #translate.install_argostranslate("en","fr")
        #print("traduction installed")


        #nom du dossier model
        #modelPath = "assistant/model"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-ar-0.22-linto-1.1.0"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-small-ja-0.22"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-small-en-us-0.15"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-ar-mgb2-0.4"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-small-en-us-0.15"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-en-us-daanzu-20200905-lgraph"
        #modelPath = "D:/Share/Programmation/Python/ReconnaissanceVOCALE/vosk-model-en-us-0.22"


    def translate_onlisten(self, speak, arrstr):
        if speak[0] == "The":
            return
        TTSThreadTranslateAndOpenURL(speak[0])


# =========

class Vocal():
    def __init__(self):
        self.data = {}

    def save(self, filename, cmd):
        if not cmd in self.data:
            self.data[cmd] = []
        files.writeJSON(filename, self.data[cmd])

    def load(self, filename):
        if files.isFile(filename):
            self.data = self.data.update({filename:files.readJSON(filename)})

    def clear(self):
        self.data = {}

    def isCommand(self, cmd, voice):
        return voice in self.data[cmd]

    def doCommand(self, cmd, voice):
        if self.isCommand(cmd, voice):
            if files.isFile(cmd+".py"):
                execute.eval(cmd+".py")

class Commandes(Master):

    def __init__(self):
        super().__init__()
        self.currendCommandDir = args.micro_assistant
        self.vocal = Vocal()

        if not files.isDir(self.currendCommandDir+"/commands"):
            files.mkdir(self.currendCommandDir+"/commands")

        self.vocal.data = self.vocal.load(self.currendCommandDir+"/commands/globals.json")
        micro.onlisten = self.command_onlisten
        self.load_command_dir()

    def command_onlisten(self, speak):
            
        if len(words.speak[len(words.speak)-1]) > 0:
            words.next()          
        words.append_item(speak)

        print(speak)
        spk.parler(speak[0])

        #elif self.currendCommandDir == self.args.micro_assistant:

    def load_command_dir(self):
        dir = self.currendCommandDir
        dir = files.path(dir)
        for f in files.dir(dir):
            # Current dir
            if f[0] != '_' and '.json' == f[-5:-1] and files.isFile(dir+"/"+f):
                if self.load_command_file(dir+"/"+f):
                    self.currendCommandDir = dir+"/"+f
                    return self.load_command_dir()
            # Sub dirs
            if f[0] != '_' and files.isDir(dir+"/"+f):
                fileJson = dir+"/"+f+"/_index.json"
                if files.isFile(fileJson):
                    files.readJSON(fileJson)
                    if self.load_command_file(dir+"/"+f+"/_index.json"):
                        return True
        return False
    

    def load_command_file(self, fileJson):
        if not '.json' in fileJson or not files.isFile(fileJson):
            return False
        self.commandes = files.readJSON(fileJson)
        if words.find(self.commandes):
            words.reset()
            execute.eval(fileJson.replace(".json",".py"))
            return True
        return False






class Learn(Commandes):

    def __init__(self):
        super().__init__()
        """
        if not self.files.isDir(self.currendCommandDir+"/commands"):
            self.mkdir(self.currendCommandDir+"/commands")
        """
        if files.isFile(self.currendCommandDir+"/commands/globals.json"):
           #self.vocalcommand_load(self.currendCommandDir+"/commands/globals.json")
            micro.onlisten = self.command_onlisten
            return
        speak = """
            Bienvenue. Nous allons configurer l'outil pour votre première utilisation. 
            Allumez votre micro et dites les mots que je vais vous faire prononcer afin d'exercer ma compréhension.
        """
        print(speak)
        spk.parlerAttendre(speak)
        micro.onlisten = self.learn_onlisten
        self.toLearn = ["oui","non","terminer"]
        self.index_toLearn = 0
        cmd = self.toLearn[self.index_toLearn]
        print("Veuillez prononcer cette commande [ "+cmd+" ]")
        spk.parlerAttendre("Veuillez prononcer cette commande [ "+cmd+" ]")


    def learn_onlisten(self, speak, arrstr):
        cmd = self.toLearn[self.index_toLearn]
        print("Garder ?")
        print(speak)
        spk.parlerAttendre("Garder ? "+speak[0])
        rep = gui.prompt("Garder ["+speak[0]+"] ", ['oui','non','suivant','terminer'])
        print(rep)
        spk.parlerAttendre(rep)
        if rep == "terminer":
            micro.onlisten = self.command_onlisten
            return
        if rep == "non":
            pass
        if rep == "oui":
            spk.parlerAttendre(rep)
            if not cmd in self.vocal.data:
                self.vocal.data = {}
            self.vocal.data[cmd].append(speak[0])
            self.vocal.save()
        if rep == "suivant":
            self.index_toLearn += 1
            if self.index_toLearn > len(self.toLearn) - 1:
                micro.onlisten = self.command_onlisten
                return
            
        cmd = self.toLearn[self.index_toLearn]
        print("Veuillez prononcer cette commande [ "+cmd+" ]")
        spk.parlerAttendre("Veuillez prononcer cette commande [ "+cmd+" ]")





class Interpreter(Master):
    def __init__(self):
        super().__init__()
        micro.onlisten = self.eval_onlisten
        self.micro_enabled = True

    def load_command_file(self, fileJson):
        if not '.json' in fileJson or not files.isFile(fileJson):
            return False
        self.commandes = files.readJSON(fileJson)
        if words.find(self.commandes):
            words.reset()
            execute.eval(fileJson.replace(".json",".py"), self)
            return True
        return False
    
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


    def eval_onlisten(self, speak):
        for speakValue in speak:
            if speakValue in ['micro','un micro']:
                self.micro_enabled = not self.micro_enabled
                if self.micro_enabled:
                    spk.saywait("Micro activé")
                else:
                    spk.saywait("Micro désactivé")
                return
        if not self.micro_enabled:
            print("[X] ", end="")
            print(speak)
            return
        if len(words.speak[len(words.speak)-1]) > 0:
            words.next()          
        words.append_item(speak)
        execute.eval(args.python_onlistening)
 


if __name__ == "__main__": 

    #assistant = Master()
    #assistant = Learn()
    #assistant = Translate()
    assistant = Interpreter()
    assistant.micro_start()


