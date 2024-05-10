#!/usr/bin/env python3

class RemoteEval():
    def __init__(self, host, www_localdir  = "", isEvalFile = False, useSSL = False, SSLCERT = "cert.pem", SSLKEY = "key.pem", verbose = False):
        self.host = host
        self.www_localdir = www_localdir
        self.useSSL = useSSL
        #self.web = MyWeb()
        print("Serve ["+www_localdir+"]")
        from includes.mymaster import web

        if isEvalFile:
            web.webserverThread(self.host, self.onevalfile, useSSL, SSLCERT, SSLKEY, verbose)
        else:
            web.webserverThread(self.host, self.onevalrequest, useSSL, SSLCERT, SSLKEY, verbose)
        pass

    def onevalrequest(self, params):
        from includes.mymaster import web, echo, arguments, args, files, translate, gui, ocr, words, chatbot, micro

        #print(request)
        if params["path"] == "/favicon.ico":
            return ""

        self.script = web.decodeURI(params["path"][1:])

        if self.useSSL:
            protocol = "https"
        else:
            protocol = "http"
        url = protocol+"://"+self.host+params["path"]

        #print(filename)
        #execute.evalString(filename)
        if not files.isFile(self.script):
            msg = "Error from request ["+url+"]. Python File not found : ["+self.script+"]"
            echo(msg)
            return msg
        shortfilename = files.getFilename(self.script)
        self.print = ""
        try:
            codeObject = compile(self.script, shortfilename, 'exec')
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



        return self.print
        b = self.web.b64d(filename)
        data = self.web.json_decode(b)
        #print(data)
        execute.eval(data["pythonscript"], self)
        return data["result"]

    def onevalfile(self, params):
        from includes.mymaster import web, echo, arguments, args, files, translate, gui, ocr, words, chatbot, micro

        print(params)
        if params["path"] == "/favicon.ico":
            return "nothing"
        
        www = self.www_localdir
        if www != "" and not files.isDir(www):
            echo("www is not dir ["+www+"]")
            www = ""

        if www != "" and not www.endswith("/"):
            www += "/"

        self.script = www + web.decodeURI(params["path"][1:])

        if self.useSSL:
            protocol = "https"
        else:
            protocol = "http"
        url = protocol+"://"+self.host+params["path"]

        
        #print(self.script)
        #print("======")
        #self.script = www+"/"+self.script

        if not files.isFile(self.script):
            if not files.isDir(self.script):
                print("Is not found2 ["+self.script+"]")
                return "Is not found2 ["+self.script+"]"
            else:
                return files.writeJSONString( files.dir(self.script) )

        currentDir = files.getParentdir(self.script)

        self.print = ""

        pyCode = files.read(self.script)
        if files.getExtension(self.script) != 'py':
            return pyCode

        shortfilename = files.getFilename(self.script)
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



        return self.print
        b = self.web.b64d(filename)
        data = self.web.json_decode(b)
        #print(data)
        execute.eval(data["pythonscript"], self)
        return data["result"]