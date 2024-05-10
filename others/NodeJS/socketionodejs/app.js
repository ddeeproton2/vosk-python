//..\nodejs20\node app.js --https-port 13443 --http-port 13080 --ssl-key SSL/private-key.pem --ssl-cert SSL/certificate.pem --ssl-ca SSL/ca.pem
const express = require('express'); 
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const chokidar = require('chokidar');
const yargs = require('yargs');

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

async function post(url, data, callback) {
  try{
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
  }catch(e){}
}




/*
USE:

(async () => {
  try {
    const data = await get('http://127.0.0.1:8888/?message=cool');
    console.log(data); // Output: Parsed data (JSON, text, etc.)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();

*/

async function get(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options, // Apply any additional options passed in
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');

    // Handle response based on content type
    if (contentType.includes('json')) {
      return await response.json(); // Parse JSON response
    } else if (contentType.includes('text')) {
      return await response.text(); // Get response as text
    } else {
      // Handle other content types as needed
      return await response.blob(); // Or another appropriate format
    }
  } catch (error) {
    console.error('GET request error:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}







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
    post("http://192.168.1.77:14080/spksay.py", {msg:encodeURIComponent(msg)}, function*(data) {
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
        const data = await get('http://192.168.1.57:1225/?message='+encodeURIComponent(value));
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
  ioHttp.emit('emitall', "voice", "all", "voice_order", "speech", msg);
  ioHttps.emit('emitall', "voice", "all", "voice_order", "speech", msg);
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

// ========================

/*
// Serveur UDP
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
server.on('message', (message, rinfo) => {
  console.log(`Message reçu de ${rinfo.address}:${rinfo.port}: ${message}`);
});
server.bind(41234, 'localhost'); // Remplacez par votre adresse IP et port souhaités
console.log('Serveur UDP en écoute sur le port 41234');
*/




