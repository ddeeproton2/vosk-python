#global: self, speak, arrstr
#
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot

print(micro.speak)
spk.parlerAttendre(micro.speak[0])

currentDir = args.python_onlistening
currentDir = files.getParentdir(currentDir)
currentDir = files.path(str(currentDir))
print(currentDir)
currentModelSpeaking = currentDir + "/start.spk"


def learn():
    while True:
        speak = micro.listen_wait()
        


if not files.isFile(currentModelSpeaking):
    
    speakList = []
    speakData = {}
    
    learn()
    """
    speakData['tag'] = "cool"
    speakData['patterns'] = []
    speakData['patterns'].append('salut')
    speakList.append(speakData)
    """

    execute.stop()
    chatbot.compileSpeak(speakList,currentModelSpeaking)
    args.python_onlistening = currentDir + "/start.py"
