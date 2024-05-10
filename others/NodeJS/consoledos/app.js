//..\nodejs20\node app.js --https-port 13443 --http-port 13080 --ssl-key SSL/private-key.pem --ssl-cert SSL/certificate.pem --ssl-ca SSL/ca.pem
const express = require('express'); 
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const chokidar = require('chokidar');
const yargs = require('yargs');
const { spawn } = require('child_process');

const app = express();
const argv = yargs.argv;

const voicefile = __dirname + '/DATA/voice.json';
// Charger les certificats SSL (remplacez les chemins par les vôtres)
const privateKey = fs.readFileSync(argv['ssl-key'] || __dirname + '/SSL/private-key.pem', 'utf8');
const certificate = fs.readFileSync(argv['ssl-cert'] || __dirname + '/SSL/certificate.pem', 'utf8');
const ca = fs.readFileSync(argv['ssl-ca'] || __dirname + '/SSL/ca.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };

// Serveur HTTP
const httpServer = http.createServer(app);
const ioHttp = socketIo(httpServer);

// Serveur HTTPS
const httpsServer = https.createServer(credentials, app);
const ioHttps = socketIo(httpsServer);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/WEB/index.html');
});
app.get('/jquery-3.6.4.min.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/jquery-3.6.4.min.js');
});
app.get('/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/socket.io.js');
});
app.get('/index.js', (req, res) => {
  res.sendFile(__dirname + '/WEB/index.js');
});

async function post(url, data, callback) {
  const encodedData = new URLSearchParams(data); // Encode data as URL-encoded string

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',  // Set appropriate Content-Type
    },
    body: encodedData.toString(),  // Send encoded data as string
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  const responseData = await response.text(); // Get response as text
  callback(responseData);
}


var onconnection = (socket) => {
  console.log('Un utilisateur s\'est connecté (HTTP)');
  
  // Gestion de la sélection d'un canal
  socket.on('join', (channel) => {
    socket.join(channel);
    console.log(`Utilisateur a rejoint le canal : ${channel}`);
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

    post("http://192.168.1.77:14080/spksay.py", {msg:encodeURIComponent(msg)}, function*(data) {
      console.log(`Données reçues : ${data}`);
    });
    

    // Diffuser le message à tous les clients dans le canal spécifié
    //ioHttp.to(channel).emit('sendtovoice', msg, channel);
    //ioHttps.to(channel).emit('sendtovoice', msg, channel);
  });


  // Gestion de la déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
  

  /*
  // Définir la commande à exécuter
  const command = 'dir';

  // Démarrer le processus DOS
  const child = spawn(command, {
    shell: true,
  });

  // Écouter l'événement "data" pour capturer la sortie
  child.stdout.on('data', (data) => {
    // Émettre l'événement "output" avec la sortie capturée
    //console.emit('output', data.toString());
    
    ioHttp.emit('output', data.toString());
    ioHttps.emit('output', data.toString());
    
  });
  */
  
  /*
  // Créer une zone de saisie pour envoyer des commandes
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    // Envoyer la commande saisie à la fenêtre DOS
    child.stdin.write(line + '\n');
  });

  // Écouter l'événement "output" pour afficher la sortie
  rl.on('output', (data) => {
    // Afficher la sortie dans la console
    console.log(data);
  });
  
  
  
  const cmd = 'dir';
  const child = spawn(cmd, {
    shell: true,
    stdio: 'inherit',
  });
    
  
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  child.on('close', (code) => {
    console.log(`Le processus s'est terminé avec le code ${code}`);
  });

  socket.on('command', (cmd) => {
    console.log('command :'+cmd);
    // Envoyer la commande saisie à la fenêtre DOS
    child.stdin.write(cmd+'\n');
    / *
    // Démarrer le processus DOS avec la commande
    const child = spawn(cmd, {
      shell: true,
    });

    // Écouter l'événement "data" pour capturer la sortie
    child.stdout.on('data', (data) => {
      // Émettre l'événement "output" avec la sortie capturée
      socket.emit('output', data.toString());
    });
    * /
  });
  */
  
  
  
  
  
};

// Logique pour le serveur HTTP
ioHttp.on('connection', onconnection);

// Logique pour le serveur HTTPS
ioHttps.on('connection', onconnection);

// Lancer les deux serveurs sur les ports spécifiés via la ligne de commande
httpServer.listen(argv['http-port'] || 13080, () => {
  console.log(`Le serveur HTTP écoute sur le port ${httpServer.address().port}`);
});

httpsServer.listen(argv['https-port'] || 13443, () => {
  console.log(`Le serveur HTTPS écoute sur le port ${httpsServer.address().port}`);
});

/*
const watcher = chokidar.watch(voicefile, {
  persistent: true,
  ignoreInitial: true,
});
watcher.on('change', (path) => {
  const speakvoice = fs.readFileSync(voicefile, 'utf-8'); 
  console.log('Speak :');
  console.log(speakvoice);
  const channel = "speakvoice";
  ioHttp.to(channel).emit('chat message', speakvoice, channel);
  ioHttps.to(channel).emit('chat message', speakvoice, channel);
});
*/


app.get('/speak', (req, res) => {
  //console.log(req);
  const msg = req.query.msg;
  console.log('Speak :');
  console.log(msg);
  const channel = "speakvoice";
  ioHttp.to(channel).emit('chat message', msg, channel);
  ioHttps.to(channel).emit('chat message', msg, channel);
  res.json({ result: 'ok' });
});

/*
app.get('/webresponse', (req, res) => {
  const nom = req.query.nom;
  console.log(`Le nom est : ${nom}`);
  post("http://127.0.0.1", req.query, function*(data) {
    console.log(`Données reçues : ${data}`);
  
  });
  res.json({ result: 'ok' });
});
*/



// ====================================
// Console DOS
// ====================================
const net = require('net');
const server = net.createServer((socket2) => {
  console.log('Un client s\'est connecté');

  socket2.on('command', (data) => {
    console.log(`Commande reçue : ${data.toString()}`);

    // Exécuter la commande
    const child = require('child_process').spawn(data.toString(), {
      shell: true,
    });

    // Envoyer la sortie du processus au client
    child.stdout.on('data', (data) => {
      socket2.write(data);
    });

    // Fermer le socket2 quand le processus se termine
    child.on('close', (code) => {
      socket2.end();
    });
  });

  socket2.on('end', () => {
    console.log('Un client s\'est déconnecté');
  });
});

server.listen(1337, () => {
  console.log('Serveur en écoute sur le port 1337');
});
