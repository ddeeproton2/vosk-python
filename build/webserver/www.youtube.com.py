#global: self, speak, arrstr
#args.python_onlistening = "roms/onlistening2.py"
#from includes.mymaster import Master, spk, translate, gui, ocr, files, execute, web, words, arguments, args, micro, chatbot, RemoteEval
#print(currentDir)

print(params['post'])
echo(params['path']+"  ->  "+self.script)
self.print = files.read(execute.currentDir+"/../webserver/www.youtube.com.js")

