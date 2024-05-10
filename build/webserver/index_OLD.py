#global: self, speak, arrstr
#args.python_onlistening = "roms/onlistening2.py"
from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot, RemoteEval
if self.useSSL:
    protocol = "https"
else:
    protocol = "http"
url = protocol+"://"+self.host+params["path"]

"""
file = files.getParentdir(currentDir) + "/webserver/navigator/speak.json"
if files.isFile(file):
    json = files.read(file)
    self.print = javascript
    files.deleteFile(file)
"""


#echo("[WEB] "+url)



#print(" ")
#print(" "+self.script)
#print(params['post'])

#print(currentDir)
#echo(params['path']+"  ->  "+self.script)
if "links" in params['post']:
    #print(web.json_decode(web.decodeURI(params['post']['links'])))
    pass

if "forms" in params['post']:
    #print(web.json_decode(web.decodeURI(params['post']['forms'])))
    pass

if "website" in params['post']:
    file = currentDir+"/"+params['post']['website']+".js"
else:
    file = currentDir+"/index.js"

if files.isFile(file):
    self.print = files.read(file)
    #print(file)
else:
    msg = "File not found ["+file+"]"
    self.print = 'console.log("'+msg+'")'
    #print(msg)


#print(" ")



def getLinks(params):

    def search(find, content):
        for c in content:
            if find.find(c) != -1:
                return True
        return False

    def onlyChar(input):
        valids = ""
        for character in input:
            if character.isalpha() or character in [' ',"'"]:
                if (valids == "" and character != ' ') or valids != "":
                    valids += character
        if valids != "" and valids[-1] == " ":
            valids = valids[:-1]
        valids = valids.replace("  "," ").replace("  "," ")
        return valids


    links = []
    if "links" in params['post'] and "url" in params['post']:
        recieved_links = web.json_decode(web.decodeURI(params['post']['links']))
        for i, iStr in enumerate(recieved_links):
            isValidTite = not search(recieved_links[i]['title'], ['en cours de lecture','://'])
            isValidHref = not search(recieved_links[i]['href'], ['google.com'])
            if isValidTite and isValidHref:
                recieved_links[i]['title'] = onlyChar(recieved_links[i]['title'])
                if recieved_links[i]['title']  != "":
                    links.append({'tag':str(len(links)),'patterns':onlyChar(recieved_links[i]['title']),'href':recieved_links[i]['href']})
    return links



def search(searchtext, listcontent):
    best = 0
    index = -1
    index2 = -1
    exclude = ['a','le','la','les','de','des']

    for i, iStr in enumerate(listcontent):
        lc = listcontent[i]['patterns'].split(" ")

            
        for i2, iStr2 in enumerate(searchtext):
            stesxt = searchtext[i2]
            st = stesxt.split(" ")

            score = 0
            for patterns in lc:
                for search in st:
                    if patterns == search and not patterns in exclude and not search in exclude:
                        score += 1
            
            #print(" Score["+str(score)+"] search["+searchtext[i2]+"] patterns["+listcontent[i]['patterns']+"]")
            if score > best:
                best = score
                index = i
                index2 = i2

    if best == 0:
        return ("", "", "", "0")
    
    return (listcontent[index]['href'], listcontent[index]['patterns'], searchtext[index2], str(best))



if "links" in params['post'] and "url" in params['post']:
    links = getLinks(params)
    #print(links)

    dir = currentDir + "/navigator"
    if not files.isDir(dir):
        files.mkdir(dir)
    
    #files.writeJSON(dir + "/links.json", links)

    file = files.getParentdir(currentDir) + "/webserver/navigator/speak.json"
    if files.isFile(file):
        json = files.read(file)
        speak = files.readJSONString(json)
        #speak = files.readJSON(file)
        print(links)
        (url, patterns, searchtext, score) = search(speak, links)
        if url != "":
            echo("[SPEAK TO WEB] search=["+searchtext+"] patterns=["+patterns+"] url=["+url+"] score=["+score+"]")
            #javascript = 'window.location = "'+url+'";'
            #self.print = files.writeJSONString({'searchtext':searchtext,'patterns':patterns, 'url':url, 'score':score})
            self.print = javascript
            files.deleteFile(file)
        else:
            echo("[SPEAK TO WEB] [NOT FOUND] speak=["+speak[0]+"] patterns=["+patterns+"] url=["+url+"] score=["+score+"]")
        
    """
    #self.print
    file = dir + "/" + web.b64e(params['post']['url']).replace("=","") + ".model"
    #print(file)
    if not files.isFile(file) and not files.isFile(file+".lock"):
        files.write(file+".lock", " ")
        chatbot.compileSpeak(links, file)
        files.deleteFile(file+".lock")
        pass


    files.writeJSON(dir + "/current.json", {"file": file, "url":params['post']['url']})
    """
