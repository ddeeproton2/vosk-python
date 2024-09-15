This project is discontinued from github from 20 jun 2024 because of 2FA.

You will find the next releases on my personnal TOR website (if online)

http://pb6eymfu7ow6jlvwgsjh75ojr5pwvcr47bx3axo4b6d3t6nyprmugzad.onion

or try my website

http://ddeeproton.infinityfreeapp.com

# vosk-python
 Offline speech recognition in Python for Windows

This project is under dev, but can already used

This is only libraries aviable, and you make your code.

You can code this eg. : 

- Link your voice with HTTP(s) in both directions

- Translate your voice

- Text to Speech

- OCR Image recognition (search a part of your screen, from an image)

- Click mouse on Desktop. Automate your Keyboard.

- Communicate with TOR network

You can recompile it to add your library

_____________________

To compile :

-Download a model https://alphacephei.com/vosk/models into model folder, "Extract here..." with winrar

-install python 3.11.5 https://www.python.org/downloads/release/python-3115/

-Open "assistant.bat", and set python path, and set the model path, (speaker, microphone 0 default), start to test your voice.

To compile start "assistant compile.bat"

_____________________

if Error :

if everything is ok, if all libraries will install it self. But you can edit "includes\mymaster.py" to fix libraries.

_____________________

To use:

Open your command prompt goto build and start "assistant.exe" to see the help commands.

it need, the folder roms, that will be "Python script" 

When you speak, it will start to speak into the script specified in you start command. 

Then you can give "Voice orders", to this script. And you can script commands to go to others scripts.

_____________________

Optional

A web server is aviable, to execute Python Scripts

The webserver starts in "build\roms\init.py"

```python
remoteeval2 = RemoteEval(host = "0.0.0.0:14080", www_localdir= files.getParentdir(execute.currentDir) + "/webserver/", isEvalFile = True, useSSL = False, verbose=False)

remoteeval = RemoteEval(host = "0.0.0.0:14443", www_localdir= files.getParentdir(execute.currentDir) + "/webserver/", isEvalFile = True, useSSL = True, SSLCERT = execute.currentDir+"/SSL/cert.pem", SSLKEY = execute.currentDir+"/SSL/key.pem", verbose=False)
```

See eg. in "build\webserver\spksay.py" to make your computer to "text to speak" (TTS) from this server

You can also use this server to use all libraries (mouse control, ...) if you code it.


_____________________

Optional 2

You can see how to link this application with a LLM (Large Language Model) to speak with bots here

https://github.com/ddeeproton2/vosk-python/tree/main/others/NodeJS/Jan-api

___________________

Others

in folder others\NodeJS\socketionodejs can help to control your webbrowser with the start.bat that start server

then you can add, in Chrome webbrowser the extensions: "User JavaScript and CSS", "CORS Unblock" to be able control the webbrowser with your voice

and add a rule like this 

### Rule to add in "User JavaScript and CSS"

```javascript
 $(document).ready(function(){
   var srcurl = "https://127.0.0.1:13443/gemini/gemini_to_youtube.js";
   loadScript2(srcurl, function(){console.log("Loaded (web) "+srcurl)});
 });
 
 
 function loadScript2(url, onloaded){
     console.log("load ... "+url);
     //setTimeout(function(){
         var isJsonResponse = false;
         ajax.send(url, isJsonResponse, function(rep){
             console.log("loaded web ... "+url);
             //eval(rep);
                      
             var scr = document.createElement("script");
             scr.src = url;
             document.body.appendChild(scr);
             
             onloaded(rep);
         });
     //}, 5000);
 }
 
 
 var ajax = {
     send:function(url, isJsonResponse, ondone){
         //data.action = 'sqlexplorer';
         $.ajax({
             type: 'GET',
             url: url,
             async: true,
             cache: false,
             beforeSend: function (request) {
                 request.setRequestHeader("Authorization", "Negotiate");
             },
             success: function(res){
                 if(!isJsonResponse){ ondone(res); return; }
                 try{
                     ondone(JSON.parse(res.trim())); return;
                 }catch(e){
                     //ondone({error:true,errorMessage:"Json malformed response",res:res,e:e}); return;
                     ondone({error:true,errorMessage:res}); return;
                 }
             },
             error: function(xhr, message, errorThrworn){
                 ondone({error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
             }
         });
     }
     
 };  

```
Then see gemini_to_youtube.js how it's done ;)
 