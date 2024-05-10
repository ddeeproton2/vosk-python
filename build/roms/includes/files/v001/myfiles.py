#!/usr/bin/env python3
import os
import json
import marshal
from pathlib import Path  

class MyFiles():
    #def __init__(self):
            
    def currentDir(self):
        return os.getcwd().replace("\\","/") #return os.path.dirname(os.path.realpath(__file__))
    
    def setCurrentDir(self, d):
        os.chdir(d)

    def dir(self, dir):
        return os.listdir(dir)

    def dirAbsolute(self, dir):
        res = []
        for x in os.listdir(dir):
            res.append(os.path.abspath(x))
        return res

    def getParentdir(self, file):
        return str(Path(file).parent.absolute()).replace("\\","/")
    
    def getFilename(self, file):
        return Path(file).name
    
    def getExtension(self, file):
        f = self.getFilename(file)
        data = f.split(".")
        return data[len(data)-1]
    
    def path(self, dir): # Format windows path into linux and remove / at the end
        dir = str(dir).replace("\\","/")
        if dir[-1] == '/':
            dir = dir[:-1]
        return dir

    def isFile(self, f): # only file
        if f is None: 
            return False
        return os.path.isfile(f)

    def isDir(self, d): # only dir
        return os.path.isdir(d)

    def isExist(self, dir): # dir or file
        return os.path.exists(dir)

    def mkdir(self, dir):
        if not os.path.exists(dir):
            os.makedirs(dir)

    def deleteFile(self, f):
        os.remove(f)

    def deleteDir(self, d):
        os.rmdir(d)

    def renameFile(self, fileSource, fileDestination):
        os.rename(fileSource, fileDestination)

    def readJSON(self, file):
        if not self.isFile(file):
            return {}
        return json.load(open(file, "rb"))
            
    def writeJSON(self, file, arr):
        with open(file, "w") as outfile:
            outfile.write(json.dumps(arr, indent=4))
    
    def readJSONString(self, json_string):
        return json.loads(json_string)
            
    def writeJSONString(self, arr):
        return json.dumps(arr, indent=4)
    
    def readOBJ(self, file):
        return marshal.load(open(file, "rb"))
    
    def writeOBJ(self, file, obj):
        marshal.dump(obj, open(file, 'wb'))

    def write(self, file, content):
        f = open(file, "w")
        f.write(content)
        f.close()

    def read(self, file):
        f = open(file, encoding='utf-8', mode="r")
        return f.read()
    
    def zip_extract(self, file, destination):
        import zipfile
        with zipfile.ZipFile(file, 'r') as zip_ref:
            zip_ref.extractall(destination)
    