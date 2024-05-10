#args.python_onlistening = "roms/onlistening2.py"
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot, RemoteEval

import datetime, time
now =  datetime.datetime.now()
print ("[%s:%s:%s %s.%s.%s] %s" % (now.hour,now.minute,now.second,now.day,now.month,now.year, args.python_onlistening)) 
#==============================================
#app.js de nodeJS est censé requêter cette page
#==============================================
if 'msg' in params["post"]:
    msg = params["post"]['msg'] # on est censé recevoir du text pur String reçu par un emit() du navigateur au serveur NodeJS qui fait le relais
    print(msg)
    msg = web.decodeURI(msg)
    print(msg)
    spk.say(msg)
