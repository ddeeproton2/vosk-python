#global: self, speak, arrstr
#args.python_onlistening = "roms/onlistening2.py"
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot, RemoteEval

if self.useSSL:
    protocol = "https"
else:
    protocol = "http"

url = protocol+"://"+self.host+params["path"]

#echo("[WEB] "+url)

file = files.getParentdir(execute.currentDir) + "/webserver/navigator/speak.json"
if files.isFile(file) and 'starttime' in params['post']:
    speakjson = files.read(file)
    self.print = speakjson
    print(speakjson)
    files.deleteFile(file)
else:
    #print("no speak")
    self.print = files.writeJSONString([])

"""
if "website" in params['post']:
    file = files.getParentdir(currentDir) + "/webserver/navigator/speak.json"
    if files.isFile(file):
        speakjson = files.read(file)
        self.print = speakjson
        print(speakjson)
        #files.deleteFile(file)
    else:
        self.print = files.writeJSONString([])
else:

    file = currentDir+"/index.js"
    if files.isFile(file):
        self.print = files.read(file)
"""
