// How to start
//node app.js --https-port 13443 --http-port 13080 --ssl-key SSL/private-key.pem --ssl-cert SSL/certificate.pem --ssl-ca SSL/ca.pem
// =========================
/*
 Start an API TTS Server (application like here) :

 Android:
      https://github.com/ddeeproton2/vosk-android-demo-2024-TTS-Voice-over-HTTP

 Windows:
      https://github.com/ddeeproton2/vosk-python/blob/main/others/VoiceTextToSpeechHTTP.exe

 Python:
      https://github.com/ddeeproton2/vosk-python
      See into assistant.bat
      for param:
      ...  --speaker-server 0.0.0.0:7979 ...
      Like here:
        %python% assistant.py --micro-device 0 --python-onload "build/roms/init.py" --python-onlistening "build/roms/start.py" --playsound-onstartspeaking %onstart%  --playsound-onendspeaking %onend% --speaker-server 0.0.0.0:7979 --micro-model "model/vosk-model-small-fr-0.22" 
*/

// =========================

/*
 Link with a Language Large Model (LLM) to speak with voice vocal

 Jan:
    https://github.com/janhq/jan

 LM Studio
    https://lmstudio.ai/

  Anything LLM
    https://useanything.com
*/

// =========================

const express = require('express'); 
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const chokidar = require('chokidar');
const yargs = require('yargs');
const axios = require('axios');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const os = require('os');
const path = require('path');
const http2 = require('node:http2');
const request = require('request');
const { createPublicKey } = require('crypto');

const PGP = require('./lib/PGP.js');
const dir = require('./lib/directoriesmanager.js');
const file = require('./lib/filesmanager.js');
const internet = require('./lib/connexions.js');
const speakcommands = require('./lib/speakcommands.js');
const masterserver = require('./lib/master_server.js');
const masterclient = require('./lib/master_client.js');
const config = require('./config.js');

const app = express();
const argv = yargs.argv;
//const voicefile = __dirname + '/DATA/voice.json'; // check if file change, then we recieved a voice message
const privateKey = fs.readFileSync(argv['ssl-key'] || config.httpsServer.ssl.privateKey, 'utf8');
const certificate = fs.readFileSync(argv['ssl-cert'] || config.httpsServer.ssl.certificate, 'utf8');
const ca = fs.readFileSync(argv['ssl-ca'] || config.httpsServer.ssl.ca, 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };

// Serveur HTTP
const httpServer = http.createServer(app);
const ioHttp = socketIo(httpServer);

// Serveur HTTPS
const httpsServer = https.createServer(credentials, app);
const ioHttps = socketIo(httpsServer);

const allLocalIps = internet.getAllLocalIpAddresses();

const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/WEB/index.html');
});
app.get('/jquery-3.6.4.min.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/jquery-3.6.4.min.js');
});
app.get('/jquery-3.7.1.min.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/jquery-3.7.1.min.js');
});
app.get('/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/socket.io.js');
});
app.get('/index.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/index.js');
});
app.get('/gemini/gemini_to_youtube.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/gemini/gemini_to_youtube.js');
});
app.get('/gemini/youtube_to_gemini.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/gemini/youtube_to_gemini.js');
});
app.get('/gemini/openai.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/gemini/openai.js');
});
app.get('/allwebsites/allwebsites.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/allwebsites/allwebsites.js');
});


var onconnection = (socket) => {
  console.log(`Un utilisateur s'est connecté avec l'ID ${socket.id}`);
  
  // Gestion de la sélection d'un canal
  socket.on('join', (channel) => {
    socket.join(channel);
    console.log(`Utilisateur a rejoint le canal : ${channel}`);
  });

  socket.on('leave', (channel) => {
    socket.leave(channel);
    console.log(`Utilisateur a quitté le canal : ${channel}`);
  });

  // Gestion du message reçu du client dans un canal spécifique
  socket.on('chat message', (msg, channel) => {
    console.log(`Message reçu dans le canal ${channel}: ${msg}`);

    // Diffuser le message à tous les clients dans le canal spécifié
    ioHttp.to(channel).emit('chat message', msg, channel);
    ioHttps.to(channel).emit('chat message', msg, channel);
  });


  // Gestion du message reçu du client dans un canal spécifique
  socket.on('on_gemini_message', (msg, channel) => {
    console.log(`on_gemini_message on canal ${channel}: ${msg}`);

    // Diffuser le message à tous les clients dans le canal spécifié
    ioHttp.to(channel).emit('on_gemini_message', msg, channel);
    ioHttps.to(channel).emit('on_gemini_message', msg, channel);
  });

  socket.on('on_gemini_connect', (msg, channel) => {
    console.log(`on_gemini_connect on canal ${channel}: ${msg}`);
    // Diffuser le message à tous les clients dans le canal spécifié
    ioHttp.to(channel).emit('on_gemini_connect', msg, channel);
    ioHttps.to(channel).emit('on_gemini_connect', msg, channel);
    //socket.emit('on_gemini_message', msg, channel);
  });
  
  
  // Gestion du message reçu du client dans un canal spécifique
  socket.on('on_youtube_message', (msg, channel) => {
    console.log(`on_youtube_message on canal ${channel}: ${msg}`);

    // Diffuser le message à tous les clients dans le canal spécifié
    ioHttp.to(channel).emit('on_youtube_message', msg, channel);
    ioHttps.to(channel).emit('on_youtube_message', msg, channel);
  });


  // Gestion du message reçu du client dans un canal spécifique
  socket.on('sendtovoice', (msg, channel) => {
    console.log(`Message reçu dans le canal ${channel}: ${msg}`);
    /*
    internet.post("http://192.168.1.77:14080/spksay.py", {msg:encodeURIComponent(msg)}, function*(data) {
      console.log(`Données reçues : ${data}`);
    });
    */
    // Diffuser le message à tous les clients dans le canal spécifié
    //ioHttp.to(channel).emit('sendtovoice', msg, channel);
    //ioHttps.to(channel).emit('sendtovoice', msg, channel);
  });


  socket.on('emitall',(from, to, action, varname, value) => {
    
    console.log(`${from} ${action} ${varname} ${value}`);
    if(from === "server"){return;}
    // Diffuser le message à tous les clients
    ioHttp.emit('emitall', socket.id, to, action, varname, value);
    ioHttps.emit('emitall', socket.id, to, action, varname, value);
  });

  
  socket.on('emitto',(from, to, action, varname, value) => {
    console.log(`${from} ${to} ${action} ${varname} ${value}`);
    if(from === "server"){return;}
    // Diffuser le message à tous les clients
    ioHttp.to(to).emit('emitto', socket.id,  to,  action, varname, value);
    ioHttps.to(to).emit('emitto', socket.id,  to,  action, varname, value);
  });

  socket.on('emittogethttpserver',(from, to, value) => {
    console.log(`${from} ${to} ${value}`);
    (async () => {
      try {
        const data = await get('http://'+config.config_speech_ip+':'+config.config_speech_port+'/?message='+encodeURIComponent(value));
        console.log(data); // Output: Parsed data (JSON, text, etc.)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();

  });


  // Gestion du message reçu du client dans un canal spécifique
  socket.on('question', (from, to, msg) => {
    console.log(`${from} ${to} ${msg}`);
  
    // Diffuser le message à tous les clients
    ioHttp.emit('question',from, to, msg);
    ioHttps.emit('question',from, to, msg);
  });

  // Gestion de la déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    console.log(`Un utilisateur s'est déconnecté avec l'ID ${socket.id}`);
    users.splice(users.indexOf(socket.id), 1);
    setTimeout(function(){
        ioHttp.emit('emitall', "server", "", "set", "users", users);
        ioHttps.emit('emitall', "server", "", "set", "users", users);
    },400);
  });
  // Ajouter l'utilisateur à la liste

  users.push(socket.id);


  setTimeout(function(){
    ioHttp.emit('emitall', "server", "", "set", "users", users);
    ioHttps.emit('emitall', "server", "", "set", "users", users);
    socket.emit('emitto', "server", socket.id, "set", "clientid", socket.id);
  },400);
  
};

ioHttp.on('connection', onconnection);
ioHttps.on('connection', onconnection);


/*
// How to send a request to Python server like here https://github.com/ddeeproton2/vosk-python
app.get('/webresponse', (req, res) => {
  const name = req.query.getvarname;
  console.log(`name : ${name}`);
  internet.post("http://127.0.0.1", req.query, function(data) {
    console.log(`Data recieved : ${data}`);
  
  });
  res.json({ result: 'ok' });
});
*/

// ====================================


app.get('/speak', (req, res) => {
    //console.log(req);
    const msg = req.query.msg;
    const segments = req.ip.split(':');
    const clientIPv4 = segments.slice(-1);
    console.log('From '+clientIPv4+' : '+msg);
    ioHttp.emit('emitall', "voice", "all", "voice_order", "speech", msg);
    ioHttps.emit('emitall', "voice", "all", "voice_order", "speech", msg);
    res.json({ result: 'ok' });

    speakcommands.speak(msg, clientIPv4);
});

// Configuration du middleware body-parser (because we read POST variables)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/ask', (req, res) => {
  const msg = req.body.msg;
  console.log(`ask msg : ${msg}`);
  speakcommands.speech(msg, config.config_speech_ip);
  /*
  speakcommands.ask(msg, function(result){
      console.log("Réponse");
      console.log(result);
      //result = result.replaceAll("*","");
      speakcommands.speech(result, config.config_speech_ip);      
  });
*/
  internet.ollama_ask(msg).then((response)=> {
    response.text().then((rep)=>{
      let r = JSON.parse(rep);
      let reponse = r.message.content;
      console.log(reponse);
      speakcommands.speech(reponse, config.config_speech_ip);    
    });
  });;
  


  res.send('Données POST reçues avec succès !');
});


app.post('/spell', (req, res) => {
  const spell = req.body.spell;
  const msg_start = req.body.msg_start;
  const msg_end = req.body.msg_end;
  //console.log(`spell : ${spell}`);
  //console.log(`msg : ${msg}`);
  speakcommands.spell(msg_start, spell, msg_end, config.config_speech_ip);
  res.send('Données POST reçues avec succès !');
});

app.post('/speak', (req, res) => {
  const msg = req.body.msg;
  console.log(`speak msg : ${msg}`);
  speakcommands.speech(msg, config.config_speech_ip);
  res.send('Données POST reçues avec succès !');
});

app.post('/learn', (req, res) => {
  const msg = req.body.msg;
  const name = req.body.name;
  console.log(`learn name : ${name} msg : ${msg}`);
  speakcommands.vc.add(name, msg);
  res.send(`Données apprises name : ${name} msg : ${msg}`);
});

if(config.httpServer.enabled){
  httpServer.listen(argv['http-port'] || config.httpServer.port, () => {
    console.log(`Node HTTP serving on:`);
    if (allLocalIps.length > 0) {
      allLocalIps.forEach(ip => console.log(`${ip}:${httpServer.address().port}`));
    } else {
      console.error('No local ip found');
    }
    //console.log(`Server HTTP listening `+internet.getLocalIpAddress()+`:${httpServer.address().port}`);
  });
}

if(config.httpsServer.enabled){
  httpsServer.listen(argv['https-port'] || config.httpsServer.port, () => {
    console.log(`Node HTTPS serving on:`);
    if (allLocalIps.length > 0) {
      allLocalIps.forEach(ip => console.log(`${ip}:${httpsServer.address().port}`));
    }
    //console.log(`Server node HTTPS listening `+internet.getLocalIpAddress()+`:${httpsServer.address().port}`);
  });
}

console.log("=================================================================");
console.log("Jan should be started as API Server https://github.com/janhq/jan");
console.log("Voice Recognizer should be started https://github.com/ddeeproton2");
console.log("This app.js need VSCode and the extension EvalOnHTTP server started:");
console.log("https://github.com/ddeeproton2/vosk-python/blob/main/others/vscode_evalonhttp/VSCodeExtensions.exe");
console.log("Commands:");
console.log("Say question, to ask something to the IA");
console.log("Say code, to ask something to the IA from the position of the cursor in VSCode editor");
// We should hear the text here if both servers are started

//const startMessage = "Dites question pour me demander quelque chose. Dites question visual studio ou Apprendre commande, ou Apprendre lettre, ou Apprendre chiffres, ou éditeur, ou répêter.";
//console.log('You shoud hear this: "'+startMessage+'"');
//speakcommands.speech(startMessage, config.config_speech_ip);

console.log("=================================================================");







 // const https = require('https');
/*
 let url = "http://localhost:11434/api/chat";

 var data = {
     "model": "qwen2:0.5b",
     "messages": [
         {
             "role": "user",
             "content": "Hello!"
         }
     ],
     "stream": false
 };
 */
/*
data = {
"model": "qwen2:0.5b",
"prompt": "Why is the sky blue?",
"stream": false
}
*/
/*
internet.post(url, data).then((rep)=> {
  console.log(rep);
});

*/ 
/*
 const response = fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
}).then((reponse)=> {
  //console.log(rep);
  //console.log(rep.text());
  reponse.text().then((rep)=>{
    let r = JSON.parse(rep);
    let msg = r.message.content;
    console.log(msg);
  });
});


 console.log("test");
*/



//internet.ollama_generate("hello");

// ============== Serveur en mode websocket =================
if(config.anythingllm.is_server){

  masterserver.start(config.anythingllm.port_server, function(message, ws){
    //console.log(message);
    let data;
    try {
      data = JSON.parse(message); // Attempt to parse JSON message
      if(data.action === 'heartbeat'){
        console.log("Send heartbeat to client");
        ws.send(JSON.stringify({
          action: 'heartbeat'
        }));
        return;
      }
      if(data.action === 'handshake'){
        if(masterserver.addClient(data)){
          var enc = PGP.encrypt(JSON.stringify({
            action: 'handshake',
            publicKey: masterserver.publicKey,
            id_creation_time: masterserver.id_creation_time
          }), data.publicKey);

          ws.send(JSON.stringify({
            action: 'encoded',
            from:masterserver.id_creation_time,
            to: data.id_creation_time,
            enc: enc
          }));
          console.log("Server respond handshake encoded to "+data.id_creation_time);
        }

      }
      if(data.action === 'encoded'){
        let dec = JSON.parse(PGP.decrypt(data.enc, masterserver.privateKey));

        if(dec.action === 'question'){
          
          console.log("Question du client: "+data.from+" - "+dec.msg);
          internet.ask_anythinglm(dec.msg, config.anythingllm.api_channel, false, config.anythingllm.api_url, config.anythingllm.bearer, function(reponse){

            console.log("Envoi la réponse au client client: "+data.from);
            var enc = PGP.encrypt(JSON.stringify({
              action: 'reponse',
              msg: reponse
            }), masterserver.getClient(data.from));
    
    
            ws.send(JSON.stringify({
              action: 'encoded',
              from:masterserver.id_creation_time,
              to: data.from,
              enc: enc
            }));
            
          });



        }


      }

    } catch (error) {
      console.error('Error processing message:', error);
      //ws.send('Hello from the server!');
      return;
    }
    //console.log('Server received message:', message);
  },function(code, reason){ // close
    console.log("Connexion closed "+code+" - "+reason);
  },function(error){ // error
    console.log("Connexion error");
    console.log(error);
  });
}

// ============== Client websocket =================

var sckClient = undefined;
if(config.anythingllm.is_client){
  
  masterclient.start(config.tor_server, config.anythingllm.url_tor, function(socket){ // on connexion
    sckClient = socket;
    speakcommands.questionllm.socket = socket;
    console.log('WebSocket connection opened');
    socket.send(JSON.stringify({
      action: 'handshake',
      publicKey: masterclient.publicKey,
      id_creation_time: masterclient.id_creation_time
    }));
  }, function(message, socket){ // message
    //console.log('Server message: '+message);
    let data;
    try {
      data = JSON.parse(message); // Attempt to parse JSON message
      if(data.action === 'heartbeat'){
        console.log("Heartbeat from server");
        return;
      }
      if(data.action === 'encoded'){
        let dec = JSON.parse(PGP.decrypt(data.enc, masterclient.privateKey));
        if(dec.action === 'reponse'){
          //internet.ask_anythinglm(dec.msg, dec.channel, dec.onlydocument, onresult, dec.baerer);
          console.log("Réponse du serveur: "+dec.msg);
          //speakcommands.speak(dec.msg, config.config_speech_ip);
          speakcommands.speech(dec.msg, config.config_speech_ip);
        }

        if(dec.action === 'handshake'){
          masterclient.addClient(dec);
          speakcommands.questionllm.socket_publicKey = dec.publicKey;
          speakcommands.questionllm.socket_id_creation_time = dec.id_creation_time;

          /*
          console.log("Question au serveur");

          var enc = PGP.encrypt(JSON.stringify({
            action: 'question',
            msg: 'Raconte quelque chose en rapport avec le voyage spatial'
          }), masterclient.getClient(data.from));
  
          socket.send(JSON.stringify({
            action: 'encoded',
            from:masterclient.id_creation_time,
            to: data.from,
            enc: enc
          }));
          */
          return;
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      return;
    }
  }, function(code, reason, socket){ // close
    console.log("Connexion closed "+code+" - "+reason);
    setTimeout(function(){
      masterclient.restart();
    },5000);  
  }, function(error, message, socket){ // error
    console.log("Connexion error"+message);
  });
  speakcommands.questionllm.masterclient = masterclient;



  function send_heartbeat(){
    if(sckClient === undefined){
      console.log("Erreur le serveur est pas allumé ?");  
      return;
    }
    console.log("Client request the heartbeat");
    sckClient.send(JSON.stringify({
      action: 'heartbeat'
    }));
    /*
    var enc = PGP.encrypt(JSON.stringify({
      action: 'question',
      msg: 'Raconte quelque chose en rapport avec le voyage spatial'
    }), masterclient.getClient(data.from));

    sckClient.send(JSON.stringify({
      action: 'encoded',
      from:masterclient.id_creation_time,
      to: data.from,
      enc: enc
    }));
    */
  }

  if(config.anythingllm.enable_heartbeat){
   console.log("Envoi msg test dans 20 sec...");
    setInterval(send_heartbeat, config.anythingllm.timer_heartbeat);
  }


}

  /*
  //========================= PGP =============================
 
  var sessionPGP = PGP.generate();
  console.log(sessionPGP);
  console.log(d.getTime())
  var enc = PGP.encrypt("Hello this message is secure", sessionPGP.publicKey);
  console.log(PGP.decrypt(enc,sessionPGP.privateKey));
  //===========================================================
  */
