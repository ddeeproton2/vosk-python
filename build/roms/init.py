#global: self, speak, arrstr
#args.python_onlistening = "roms/onlistening2.py"
from includes.mymaster import spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot, RemoteEval

#print(currentDir)

remoteeval2 = RemoteEval(host = "0.0.0.0:14080", www_localdir= files.getParentdir(execute.currentDir) + "/webserver/", isEvalFile = True, useSSL = False, verbose=False)
remoteeval = RemoteEval(host = "0.0.0.0:14443", www_localdir= files.getParentdir(execute.currentDir) + "/webserver/", isEvalFile = True, useSSL = True, SSLCERT = execute.currentDir+"/SSL/cert.pem", SSLKEY = execute.currentDir+"/SSL/key.pem", verbose=False)




"""
if not files.isFile(currentModelSpeaking):
    
    if files.isFile(currentDir+"/learn.py"):
        args.python_onlistening = currentDir+"/learn.py"

        s = "Ceci est votre premier lancement. Vous allé être redirigé en mode apprentissage. Nous allons vérifier que votre micro est branché. Dites un mot pour commencer."
        print(s)
        spk.parlerAttendre(s)
"""




"""
import datetime
d1 = datetime.datetime.now()
d2 = datetime.datetime(2023,12,30,20,00)
d2_d1 = (d2  - d1)
print(d2_d1)
"""

"""
 pip install schedule
import schedule
import time

def job():
    print("I'm working...")

# Run job every 3 second/minute/hour/day/week,
# Starting 3 second/minute/hour/day/week from now
schedule.every(3).seconds.do(job)
schedule.every(3).minutes.do(job)
schedule.every(3).hours.do(job)
schedule.every(3).days.do(job)
schedule.every(3).weeks.do(job)

# Run job every minute at the 23rd second
schedule.every().minute.at(":23").do(job)

# Run job every hour at the 42nd minute
schedule.every().hour.at(":42").do(job)

# Run jobs every 5th hour, 20 minutes and 30 seconds in.
# If current time is 02:00, first execution is at 06:20:30
schedule.every(5).hours.at("20:30").do(job)

# Run job every day at specific HH:MM and next HH:MM:SS
schedule.every().day.at("10:30").do(job)
schedule.every().day.at("10:30:42").do(job)
schedule.every().day.at("12:42", "Europe/Amsterdam").do(job)

# Run job on a specific day of the week
schedule.every().monday.do(job)
schedule.every().wednesday.at("13:15").do(job)
schedule.every().minute.at(":17").do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
"""

