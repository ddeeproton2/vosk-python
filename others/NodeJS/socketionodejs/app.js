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

const PGP = require('./lib/PGP.js');
const dir = require('./lib/directoriesmanager.js');
const file = require('./lib/filesmanager.js');
const internet = require('./lib/connexions.js');
const speakcommands = require('./lib/speakcommands.js');
const config = require('./config.js');

const app = express();
const argv = yargs.argv;
const voicefile = __dirname + '/DATA/voice.json';
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
  speakcommands.ask(msg, function(result){
      console.log("Réponse");
      console.log(result);
      //result = result.replaceAll("*","");
      speakcommands.speech(result, config.config_speech_ip);
  });

  res.send('Données POST reçues avec succès !');
});


app.post('/spell', (req, res) => {
  const msg = req.body.msg;
  console.log(`spell msg : ${msg}`);
  speakcommands.spell(msg, config.config_speech_ip);
  res.send('Données POST reçues avec succès !');
});

app.post('/speak', (req, res) => {
  const msg = req.body.msg;
  console.log(`speak msg : ${msg}`);
  speakcommands.speech(msg, config.config_speech_ip);
  res.send('Données POST reçues avec succès !');
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
const startMessage = "Dites question pour me demander quelque chose. Dites question visual studio ou Apprendre commande, ou Apprendre lettre, ou Apprendre chiffres, ou éditeur, ou répêter.";
console.log('You shoud hear this: "'+startMessage+'"');
speakcommands.speech(startMessage, config.config_speech_ip);
console.log("=================================================================");

// ============== Serveur en mode websocket =================
if(config.anythingllm.is_server){
  internet.websocket_server(config.anythingllm.port_server, function(message, ws){
    console.log('Received message:', message);
    ws.send('Hello from the server!');
  });
}

// ============== Client websocket =================
if(config.anythingllm.is_client){

  internet.websocket_client(config.tor_server, config.anythingllm.url_tor, function(socket){
    console.log('WebSocket connection opened');
    socket.send('Hello from the client!');
  }), function(message, socket){
    console.log('Server message: '+message);
    //socket.send('Message recieved from the client!');
  };

}
  /*
  //========================= PGP =============================
  var d = new Date();
  var sessionPGP = PGP.generate();
  console.log(sessionPGP);
  console.log(d.getTime())
  var enc = PGP.encrypt("Hello this message is secure", sessionPGP.publicKey);
  console.log(PGP.decrypt(enc,sessionPGP.privateKey));
  //===========================================================
  */