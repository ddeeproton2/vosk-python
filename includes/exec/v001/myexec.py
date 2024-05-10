#!/usr/bin/env python3
import importlib
import inspect
import subprocess
from pathlib import Path    
import time
import sys
import os
import signal
import threading

class TExec():
    def __init__(self):
        self.isFirstPipInstall = True
        self.currentDir = ""
        self.shortfilename = ""
        self.previous_onlistening = ""

    def pythonPath(self):
        if "python.exe" in sys.executable:
            return sys.executable
            """
            def isFile(self, f): # only file
                if f is None: 
                    return False
                return os.path.isfile(f)
            if isFile(sys.executable):
                return sys.executable
            else:
                return "python.exe"    
            """
        else:
            return "python"

    def terminate(self):
        os.kill(os.getpid(), signal.SIGTERM)

    def terminatePID(self, pid):
        os.kill(pid, signal.SIGTERM)

    def execAndRead(self, cmd):
        p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        self.pid = p.pid
        for line in p.stdout.readlines():
            print(line)
        retval = p.wait()

    def execAndContinue(self, cmd):
        #subprocess.run(cmd) 
        p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        return p.pid

    def execServer(self, programme, callback):
        """
        Fonction pour capturer la sortie d'un processus serveur.

        Args:
            programme: Le nom du programme à exécuter.
            callback: La fonction à appeler pour traiter la sortie du processus.

        Returns:
            Le processus serveur.

        Use:
            def callback(output):
                print(output)
            process = execute.execServer(["python", "serveur.py"],callback)
            #...
            process.terminate()
        """

        process = subprocess.Popen(
            [programme], stdout=subprocess.PIPE, stderr=subprocess.STDOUT
        )

        def capture_output():
            while True:
                output = process.stdout.readline().decode("utf-8")
                callback(output)

        thread = threading.Thread(target=capture_output)
        thread.start()

        return process

    def restart_application(self):
        os.execv(sys.executable, ['python'] + sys.argv) # redémarrer le script

    def stop():
        #raise Exception("stop()")
        #raise TypeError("stop()")
        raise ValueError('stop()')


    #def eval(self, filename, this = None, speak = [], arrstr = "", jsonspeak = {}):
    def eval(self, filename):
        execute = self
        from includes.mymaster import spk, web, echo, arguments, args, files, translate, gui, ocr, words, chatbot, micro, messaging
        execute.shortfilename = files.getFilename(filename)
        execute.currentDir = files.getParentdir(filename)
        speak = micro.speak

        try:
            tmpFile = open(filename, 'r', encoding="utf-8")
            pyCode = tmpFile.read()
            tmpFile.close()
            codeObject = compile(pyCode, self.shortfilename, 'exec')
            exec(codeObject)
        except Exception as ex:
            if not "stop()" in str(ex): 
                trace = []
                tb = ex.__traceback__
                while tb is not None:
                    trace.append({
                        "filename": tb.tb_frame.f_code.co_filename,
                        "name": tb.tb_frame.f_code.co_name,
                        "lineno": tb.tb_lineno
                    })
                    print("Line:  "+str(tb.tb_lineno) + " " +  tb.tb_frame.f_code.co_filename + " [" + tb.tb_frame.f_code.co_name+"]")
                    tb = tb.tb_next
                print(str({
                    'type': type(ex).__name__,
                    'message': str(ex),
                    #'trace': trace
                }))
        """
        except Exception as e:
            #try:
            if not e == "" and not "stop()" in e: 
                print("Error filename: "+filename)
                print(e)
                print("===")
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                print(exc_type, fname, exc_tb.tb_lineno)
                print(
                    type(e).__name__,          # TypeError
                    e.__traceback__.tb_lineno  # 2
                )
            #except Exception as e2:
            #    pass
        """

    def evalString(self, pyCode, shortfilename = "noname.py"):
        try:
            codeObject = compile(pyCode, shortfilename, 'exec')
            exec(codeObject)
        except Exception as ex:
            if not "stop()" in str(ex): 
                trace = []
                tb = ex.__traceback__
                while tb is not None:
                    trace.append({
                        "filename": tb.tb_frame.f_code.co_filename,
                        "name": tb.tb_frame.f_code.co_name,
                        "lineno": tb.tb_lineno
                    })
                    print("Line:  "+str(tb.tb_lineno) + " " +  tb.tb_frame.f_code.co_filename + " [" + tb.tb_frame.f_code.co_name+"]")
                    tb = tb.tb_next
                print(str({
                    'type': type(ex).__name__,
                    'message': str(ex),
                    #'trace': trace
                }))


    def sleep(self, sec):
        time.sleep(sec)

    def pipInstall(self, name):
        if self.isFirstPipInstall: 
            self.execAndRead('"'+self.pythonPath()+'" -m pip install  --upgrade pip')
        self.isFirstPipInstall = False
        print("pip install "+name)
        self.execAndRead('"'+self.pythonPath()+'" -m pip install '+name)

    def __LINE__():
        # Obtient le cadre de pile (stack frame) du niveau courant
        frame = inspect.currentframe()
        # Obtient la ligne courante à partir du cadre de pile
        line = inspect.getframeinfo(frame).lineno
        return str(line)

"""
# Fonctions bugées :(
    def eval_with_import(self, filename, modulename = None):

        if modulename and modulename not in sys.modules:
            # Module is not already loaded, proceed with import
            try:
                spec = importlib.util.find_spec(modulename)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
            except Exception as ex:
                print(f"Error importing module '{modulename}': {ex}")
            else:
                # Module is already loaded, log a message
                print(f"Module '{modulename}' is already loaded, skipping import.")


        tmpFile = open(filename, 'r', encoding="utf-8")
        pyCode = tmpFile.read()
        tmpFile.close()
        shortfilename = Path(filename).name
        try:
            codeObject = compile(pyCode, shortfilename, 'exec')
            exec(codeObject)
        except Exception as ex:
            if not "stop()" in str(ex): 
                trace = []
                tb = ex.__traceback__
                while tb is not None:
                    trace.append({
                        "filename": tb.tb_frame.f_code.co_filename,
                        "name": tb.tb_frame.f_code.co_name,
                        "lineno": tb.tb_lineno
                    })
                    print("Line:  "+str(tb.tb_lineno) + " " +  tb.tb_frame.f_code.co_filename + " [" + tb.tb_frame.f_code.co_name+"]")
                    tb = tb.tb_next
                print(str({
                    'type': type(ex).__name__,
                    'message': str(ex),
                    #'trace': trace
                }))

def getframe(self):
    return sys._getframe(1)

def execServerScriptOutput(self, programme, pythonscript, modulename):

    " ""
    Fonction pour capturer la sortie d'un processus serveur et exécuter un script Python à chaque nouvelle ligne.

    Args:
        programme: Le nom du programme à exécuter.
        pythonscript: Le chemin d'accès au fichier Python à exécuter.
        modulename: Le nom du module à importer dans le script Python. Pour obtenir le module name "../../../"+sys.modules[__name__] 

    Returns:
        Le processus serveur.

    Use:
        process = execute.execServerScriptOutput(["python", "serveur.py"], "script.py", "monmodule")
        #...
        process.terminate()
    " ""

    process = subprocess.Popen(
        [programme], stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )

    def capture_output():
        while True:
            output = process.stdout.readline().decode("utf-8").strip()
            if output:
                self.eval_with_import(pythonscript, modulename)

    thread = threading.Thread(target=capture_output)
    thread.start()

    return process
"""