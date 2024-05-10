#!/usr/bin/env python3
"""
import inspect
import sys, os
from time import sleep
"""
import os, datetime, sys


"""
#Autre technique possible
sys.path.append(os.getcwd() + "/includes/exec/0.0.1")
sys.path.append(os.getcwd() + "/includes/web/0.0.1")
sys.path.append(os.getcwd() + "/includes/thread/0.0.1")
sys.path.append(os.getcwd() + "/includes/files/0.0.1")
sys.path.append(os.getcwd() + "/includes/micro/0.0.1")
sys.path.append(os.getcwd() + "/includes/ocr/0.0.1")
sys.path.append(os.getcwd() + "/includes/pyautogui/0.0.1")
sys.path.append(os.getcwd() + "/includes/speaker/0.0.1")
sys.path.append(os.getcwd() + "/includes/translate/0.0.1")
sys.path.append(os.getcwd() + "/includes/arguments/0.0.1")
sys.path.append(os.getcwd() + "/includes/words/0.0.1")

from myexec import TExec
from mythread import TThread
from myfiles import MyFiles
from myarguments import MyArguments
from mywords import MyWords
"""

from includes.exec.v001.myexec import TExec
from includes.thread.v001.mythread import TThread
from includes.files.v001.myfiles import MyFiles
from includes.arguments.v001.myarguments import MyArguments
from includes.words.v001.mywords import MyWords


execute = TExec()


try:
    from includes.web.v001.myweb import MyWeb
except:
    execute.pipInstall("requests")
    try:
        from includes.web.v001.myweb import MyWeb
    except Exception as e:
        print("Error: pip install vosk")
        print(e)
        quit()

try:
    from includes.micro.v001.mymicro import MyMicro
except:
    execute.pipInstall("vosk")
    execute.pipInstall("sounddevice")
    try:
        from includes.micro.v001.mymicro import MyMicro
    except Exception as e:
        print("Error: pip install vosk, sounddevice ")
        print(e)
        quit()

try:
    from includes.speaker.v001.myspeaker import MySpeaker
except:
    execute.pipInstall("pyttsx3")
    #execute.pipInstall("playsound")
    #exec.pipInstall("pygame")
    
    try:
        from includes.speaker.v001.myspeaker import MySpeaker
    except Exception as e:
        print("Error: pip install pyttsx3")
        print(e)
        quit()

try:
    from includes.pyautogui.v001.mypyautogui import MyPyautogui
except:
    execute.pipInstall("pyautogui")
    execute.pipInstall("clipboard")
    execute.pipInstall("PyGetWindow")
    try:
        from includes.pyautogui.v001.mypyautogui import MyPyautogui
    except Exception as e:
        print("Error: pip install pyautogui")
        print(e)
        quit()


try:
    from includes.ocr.v001.myocr import MyOCR
except:
    execute.pipInstall("opencv-python")
    execute.pipInstall("--only-binary Pillow Pillow")
    execute.pipInstall("pytesseract")
    try:
        from includes.ocr.v001.myocr import MyOCR
    except Exception as e:
        print("Error: pip install opencv-python, --only-binary Pillow Pillow, pytesseract")
        print(e)
        quit()


try:
    from includes.translate.v001.mytranslate import MyTranslate
except:
    execute.pipInstall("sentencepiece")
    execute.pipInstall("argostranslate")
    try:
        from includes.translate.v001.mytranslate import MyTranslate
    except Exception as e:
        print("Error: pip install sentencepiece, argostranslate")
        print(e)
        quit()

try:
    from includes.chatbot.v001.mychatbot import ChatBot
except:
    execute.pipInstall("nltk")
    try:
        from includes.chatbot.v001.mychatbot import ChatBot
    except Exception as e:
        print("Error: pip install nltk")
        print(e)
        quit()


from includes.remotespeaker.v001.remotespeaker import RemoteSpeakerClient, RemoteSpeakerServer, LazarusRemoteSpeakerClient
from includes.remoteeval.v001.remoteeval import RemoteEval
from includes.messaging.v001.mymessaging import TMessaging

def echo(text):
    now =  datetime.datetime.now()
    print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, text)) 


if os.name != "nt":
    print("WARNING: This application was created for WINDOWS operating system. You might adapt this code for your operating system "+os.name+".")

arguments = None
args = None
files = MyFiles()
web = MyWeb()
translate = None
gui = None
ocr = None
words = None
chatbot = None
micro = None
spk = None
remoteSpeakerServer = None
messaging = TMessaging()

files.write("pid.txt", str(os.getpid())) # if kill is needed


arguments = MyArguments()
args = arguments.parse()
if not args.speaker_server is None and not args.speaker_client is None:
    print("Error. --speaker-server and --speaker-client can't be both used")
    sys.exit()
#files = MyFiles()
#web = MyWeb()
translate = MyTranslate() 


if not args.lazarus_speaker_client is None:
    spk = LazarusRemoteSpeakerClient(web, args.lazarus_speaker_client, args.speaker_voice)
elif not args.speaker_client is None:
    spk = RemoteSpeakerClient(web, args.speaker_client)
    if args.speaker_list_voices:
        print("Error --speaker-list-voices can't be used with --speaker-client")
        sys.exit()
else:
    spk = MySpeaker(args.playsound_onstartspeaking, args.playsound_onendspeaking, args.speaker_voice)

if args.speaker_list_voices:
    voices = spk.getVoices()
    for i, istr in enumerate(voices):
        print(str(i) + " - "+ voices[i].name)
        print(voices[i].id)
        pass
    sys.exit()



print("Démarrage...")
spk.say("Démarrage")

gui = MyPyautogui() 
ocr = MyOCR() 
words = MyWords()
chatbot = ChatBot()


micro = MyMicro(args.micro_model, args.micro_samplerate, args.micro_device)

if not args.speaker_server is None:
    remoteSpeakerServer = RemoteSpeakerServer(web, spk, translate, args.speaker_server)
    remoteSpeakerServer.startSpeakerServer()
else:
    filename = args.python_onload

    execute.eval(filename)
    #remoteeval = RemoteEval("0.0.0.0:13000")
    #RemoteEval("0.0.0.0:13000")


class Master():
    def __init__(self):
        #self.start_application()
        micro.onstarterror = self.micro_start_error
        micro.onstartsuccess = self.micro_start_success
        micro.onlisten = self.micro_onlisten

    def micro_start(self):
        with micro.start(): # "with" is required to KeyboardInterrupt
            micro.listen()

    def micro_start_error(self):
        spk.saywait("Erreur Le micro n'est pas allumé.")
        print("Error: Micro is off")
        quit()

    def micro_start_success(self):
        print("Démarré")
        spk.say("Démarré")
        pass

    def micro_onlisten(self, speak):
        print(speak)
        spk.say(speak[0])

    #def start_application(self):
