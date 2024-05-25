//node app.js --https-port 13443 --http-port 13080 --ssl-key SSL/private-key.pem --ssl-cert SSL/certificate.pem --ssl-ca SSL/ca.pem
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


//==========================

function isWindowsOS() {
  return process.platform === 'win32';
}

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
let config_speech_ip = '192.168.1.52'; 
if(!isWindowsOS()){config_speech_ip = '127.0.0.1';}
let config_speech_port = '1225';

// =========================
/*
 Link with a Language Large Model (LLM) to speak with voice vocal

 Jan:
      https://github.com/janhq/jan

 LM Studio
      https://lmstudio.ai/

*/

let config_jan_api = 'http://localhost:2339/v1/chat/completions';

// =========================





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




//========================================
// Commands for directories
//========================================

class DirectoriesManager {
  constructor() {
    this.baseDirectory = this.getCurrentDirectory();
  }

  getCurrentDirectory() {
    return __dirname;
  }

  /**
   * Vérifie si un répertoire existe
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<boolean>} Promesse résolue avec true si le répertoire existe, false sinon
   */
  async exists(path) {
    try {
      await fs.promises.access(path);
      const stats = await fs.promises.stat(path);
      return stats.isDirectory();
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      } else {
        return false;
        throw error;
      }
    }
  }

  /**
   * Crée un répertoire
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<void>} Promesse résolue lorsque le répertoire a été créé
   */
  async createDirectory(path) {
    await fs.promises.mkdir(path, { recursive: true });
  }

  /**
   * Supprime un répertoire vide
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<void>} Promesse résolue lorsque le répertoire a été supprimé
   */
  async removeEmptyDirectory(path) {
    try {
      await fs.promises.rmdir(path);
    } catch (error) {
      if (error.code === 'ENOTEMPTY') {
        console.error(`Le répertoire ${path} n'est pas vide, impossible de le supprimer`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Supprime un répertoire récursivement (y compris son contenu)
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<void>} Promesse résolue lorsque le répertoire a été supprimé récursivement
   */
  async removeDirectory(path) {
    await fs.promises.rm(path, { recursive: true });
  }

  /**
   * Liste le contenu d'un répertoire
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<string[]>} Promesse résolue avec un tableau contenant les noms des fichiers et des répertoires du répertoire spécifié
   */
  async listDirectory(path) {
    return await fs.promises.readdir(path);
  }


}

const dir = new DirectoriesManager();
/*
How to use:
==========


// Vérifier si un répertoire existe
dir.exists('images').then(exists => {
  console.log(`Le répertoire images existe : ${exists}`);
});

// Créer un répertoire
dir.createDirectory('uploads').then(() => {
  console.log('Répertoire uploads créé');
});

// Supprimer un répertoire vide
dir.removeEmptyDirectory('tmp').then(() => {
  console.log('Répertoire tmp supprimé (s'il était vide)');
});

// Supprimer un répertoire récursivement
dir.removeDirectory('old-project').then(() => {
  console.log('Répertoire old-project supprimé récursivement');
});

// Lister le contenu d'un répertoire
dir.listDirectory('docs').then(files => {
  console.log('Contenu du répertoire docs :', files);
});

*/



//========================================
// Commands for files
//========================================

class FilesManager {
  constructor() {
    this.baseDirectory = this.getCurrentDirectory();
  }

  getCurrentDirectory() {
    return __dirname;
  }

  exists(path) {
    return fs.existsSync(path);
  }

  createFile(path) {
    fs.touch(path);
  }

  readFile(path) {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  writeFile(path, content) {
    try {
      fs.writeFileSync(path, content);
    } catch (err) {
      console.error(err);
    }
  }

  rename(oldPath, newPath) {
    fs.rename(oldPath, newPath);
  }

  remove(path) {
    fs.promises.rm(path, { recursive: true });
  }


  readJSON(path) {
    const content = this.readFile(path);
    return JSON.parse(content);
  }
  
  writeJSON(path, data) {
    const content = JSON.stringify(data, null, 2); // Formatage indenté
    this.writeFile(path, content);
  }
}

const file = new FilesManager();
/*
How to use:


// if file exists
file.exists('index.html').then(exists => {
  console.log(`Le fichier index.html existe : ${exists}`);
});

// create file
file.createFile('data.txt').then(() => {
  console.log('Fichier data.txt créé');
});

// read file
file.readFile('message.txt').then(content => {
  console.log('Contenu du fichier message.txt :', content);
});

// write file
file.writeFile('message.txt', 'Hello, world!')
  .then(() => {
    console.log('Contenu écrit dans le fichier message.txt');
  });

  // Lire un objet JSON depuis un fichier
file.readJSON('config.json').then(data => {
  console.log('Configuration :', data);
});

// Écrire un objet JSON dans un fichier
const userData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
};

file.writeJSON('user.json', userData).then(() => {
  console.log('Données utilisateur écrites dans user.json');
});
*/

//==================================
// HTTP Client 
//==================================

async function post(url, data, options = {}) {

  try {
    const urlEncodedData = new URLSearchParams(data).toString();

    const response = await fetch(url, {
      method: 'POST',
      // Set default headers for POST requests (can be overridden in options)
      headers: {
        //'Content-Type': 'application/json', // Example, adjust based on data format
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Add data to be sent in the request body
      //body: JSON.stringify(data), // Assuming data is an object, adjust for other formats
      body: urlEncodedData,
      ...options, // Apply any additional options passed in
    }).catch((error) => {
      console.error(error); // Log the error
    });

    if (!response) {
      console.log(`HTTP Error  ${url}`);

      return "";
    }
    if (!response.ok) {
      console.log(`HTTP Error: ${response.status}  ${url}`);
      return "";
    }

    const contentType = response.headers.get('Content-Type');

    // Handle response based on content type (similar to GET function)
    if (contentType.includes('json')) {
      return await response.json(); // Parse JSON response
    } else if (contentType.includes('text')) {
      return await response.text(); // Get response as text
    } else {
      // Handle other content types as needed
      return await response.blob(); // Or another appropriate format
    }
  } catch (error) {
    console.error('POST request error:', error);
    //throw error; // Re-throw the error for further handling if needed
  }
}


async function get(url, options = {}) {
  //console.log('GET '+url);
  //console.log('options');
  //console.log(options);
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options, // Apply any additional options passed in
    }).catch((error) => {
      // Your error is here!
      console.log(error)
    });

    if (!response) {
      console.log(`HTTP Error  ${url}`);
      return "";
    }
    if (!response.ok) {
      //throw new Error(`HTTP Error: ${response.status}`);
      console.log(`HTTP Error: ${response.status}`);
      return "";
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
    //throw error; // Re-throw the error for further handling if needed
  }
}


//==================================
// utils functions 
//==========================


// This function is for Text To Speech (TTS)
function speech(msg, clientIP){
  //console.log("To "+clientIP+" Say "+msg);
  try {  
    (async () => {
      try {
        //const data = await get('http://'+clientIP+':'+config_speech_port+'/?message='+encodeURIComponent(msg));
        //const data = await post('http://'+clientIP+':'+config_speech_port+'/?message='+encodeURIComponent(msg));
        post('http://'+clientIP+':'+config_speech_port+'/?message='+encodeURIComponent(msg), {}, function(data) {
          console.log(`Données reçues : ${data}`);
        
        });


        //console.log(data); // Output: Parsed data (JSON, text, etc.)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
    
  } catch (error) {
    console.error('GET request error:', error);
    //throw error; // Re-throw the error for further handling if needed
  }

}

function char_to_word(msg){
  msg = msg.replaceAll(" ", " espace ");
  msg = msg.replaceAll(".", "point");
  msg = msg.replaceAll(",", "virgule");
  msg = msg.replaceAll("+", "plus");
  msg = msg.replaceAll("-", "tiret ou moins");
  msg = msg.replaceAll("(", "parenthèse ouvrante");
  msg = msg.replaceAll(")", "parenthèse fermante");
  msg = msg.replaceAll('"', "double guillemets");
  msg = msg.replaceAll("'", "apostrophe");
  msg = msg.replaceAll("!", "point d'exclamation");
  msg = msg.replaceAll("?", "point d'interrogation");
  msg = msg.replaceAll(":", "deux-points");
  msg = msg.replaceAll(";", "point-virgule");
  msg = msg.replaceAll("/", "slash");
  msg = msg.replaceAll("\\", "anti-slash");
  msg = msg.replaceAll("@", "arobase");
  msg = msg.replaceAll("#", "dièse");
  msg = msg.replaceAll("$", "dollar");
  msg = msg.replaceAll("%", "pourcent");
  msg = msg.replaceAll("^", "chapeau");
  msg = msg.replaceAll("&", "et commercial");
  msg = msg.replaceAll("*", "étoile");
  msg = msg.replaceAll("_", "souligné");
  msg = msg.replaceAll("=", "égal");
  msg = msg.replaceAll("{", "accolade ouvrante");
  msg = msg.replaceAll("}", "accolade fermante");
  msg = msg.replaceAll("[", "crochet ouvrant");
  msg = msg.replaceAll("]", "crochet fermant");
  msg = msg.replaceAll("<", "plus petit que ou inférieur");
  msg = msg.replaceAll(">", "plus grand que ou supérieur");
  msg = msg.replaceAll("|", "barre verticale");
  msg = msg.replaceAll("	", "tabulation");
  msg = msg.replaceAll("`", "accent grave inversé");
  msg = msg.replaceAll("£", " Le curseur est ici. ");
  return msg;
}


function char_to_keyword(msg){
  msg = msg.replaceAll("£", "");
  msg = msg.replaceAll(" ", "espace");
  msg = msg.replaceAll(".", "point");
  msg = msg.replaceAll(",", "virgule");
  msg = msg.replaceAll("+", "plus");
  msg = msg.replaceAll("-", "tiret_ou_moins");
  msg = msg.replaceAll("(", "parenthese_ouvrante");
  msg = msg.replaceAll(")", "parenthese_fermante");
  msg = msg.replaceAll('"', "double_guillemets");
  msg = msg.replaceAll("'", "apostrophe");
  msg = msg.replaceAll("!", "point_dexclamation");
  msg = msg.replaceAll("?", "point_dinterrogation");
  msg = msg.replaceAll(":", "deux_points");
  msg = msg.replaceAll(";", "point_virgule");
  msg = msg.replaceAll("/", "slash");
  msg = msg.replaceAll("\\", "anti_slash");
  msg = msg.replaceAll("@", "arobase");
  msg = msg.replaceAll("#", "diese");
  msg = msg.replaceAll("$", "dollar");
  msg = msg.replaceAll("%", "pourcent");
  msg = msg.replaceAll("^", "chapeau");
  msg = msg.replaceAll("&", "et_commercial");
  msg = msg.replaceAll("*", "etoile");
  msg = msg.replaceAll("_", "souligne");
  msg = msg.replaceAll("=", "egal");
  msg = msg.replaceAll("{", "accolade_ouvrante");
  msg = msg.replaceAll("}", "accolade_fermante");
  msg = msg.replaceAll("[", "crochet_ouvrant");
  msg = msg.replaceAll("]", "crochet_fermant");
  msg = msg.replaceAll("<", "plus_petit_que_ou_inferieur");
  msg = msg.replaceAll(">", "plus_grand_que_ou_superieur");
  msg = msg.replaceAll("|", "barre_verticale");
  msg = msg.replaceAll("	", "tabulation");
  msg = msg.replaceAll("`", "accent_grave_inverse");
  return msg;
}

function spell(msg, clientIP) {
  let newmsg = "";
  for (let i = 0; i < msg.length; i++) {
    newmsg = newmsg.concat("§" + msg.charAt(i));
  }
  newmsg = char_to_word(newmsg);
  newmsg = newmsg.replaceAll("§", ". ");
  speech(newmsg, clientIP);
}



// This function is an API for this application LLM https://github.com/janhq/jan
// See how to use it when the server API is started http://127.0.0.1:1337/static/index.html
function ask(msg, onresult){ 
  axios.defaults.timeout = 0;
  const headers = {
    'Content-Type': 'application/json'
  };
  const data = {
    messages: [
      {
        role: "user",
        content: msg
      }
    ],
    model: "mistral-ins-7b-q4/Repository",
    //model: "mistral-ins-7b-q4",
    //model: "stable-zephyr-3b",
    //model: "deepseek-coder-1.3b",
    stream: false,
    //max_tokens: 2048,
    max_tokens: 32768,
    "stop": [
      "st0ph3r3"
    ],
    frequency_penalty: 0.7,
    presence_penalty: 0,
    temperature: 0.7,
    top_p: 0.95
  };
  console.log(msg);
  axios.post(config_jan_api, data, { headers })
  .then(response => {
      try{
          let msg = response.data.choices[0].message.content
          //console.log(msg);
          onresult(msg);
      }catch(e){}

  })
  .catch(error => {
    console.error(error); 
  });
}

// Send voice command to "EvalOnHTTP" (Visual Code - Extension)
function vscode_execute_code(code){
  post("http://127.0.0.1:4000", { code: code });
}

// Ask to this script a question to send to a LLM
function ask_vscode(msg, nodeserver){
  let msg_protected = msg.replaceAll("'", "\'");
  vscode_execute_code(`
    let selected = cmd.readSelected();
    if(selected === ""){
      selected = cmd.readCurrentLine();
    }
    let msg = '`+msg_protected+`';
    let finalmsg = msg + "\\n\\n" + selected;
    if(selected+msg !== ""){
      cmd.post("http://`+nodeserver+`/ask", {msg:finalmsg});
    }
  `);
}


//==========================

async function mysql_request(requete) {
  try{
    const connexion = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'your_database'
    });
    const [result, fields] = await connexion.query(requete);
    connexion.end();
    // Result in a array
    const returnData = result.map(line => {
      const objectData = {};
      for (let i = 0; i < fields.length; i++) {
        objectData[fields[i].name] = line[i];
      }
      return objectData;
    });
  }catch(e){
    console.log("Error MySQL connexion");
    return;
  }
  // Retourner le tableau de données
  return returnData;
}

/*
// USE:
mysql_request('SELECT * FROM ma_table')
  .then(sql_result => {
    console.log(sql_result);
  })
  .catch(errormsg => {
    console.error(errormsg);
  });
*/

//==========================


function getLocalIpAddress() {
  if(!isWindowsOS()){return '127.0.0.1';}
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const iface = interfaces[name];
    for (const address of iface) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return null;
}



//==========================

function getAllLocalIpAddresses() {
  if(!isWindowsOS()){return ['127.0.0.1'];}
  const addresses = [];
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const iface = interfaces[name];
    for (const address of iface) {
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}
const allLocalIps = getAllLocalIpAddresses();
/*
How to use:
===========
const allLocalIps = getAllLocalIpAddresses();
if (allLocalIps.length > 0) {
  console.log('Adresses IP locales :');
  allLocalIps.forEach(ip => console.log(ip));
} else {
  console.error('Impossible de trouver des adresses IP locales');
}
*/
//==========================



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

ioHttp.on('connection', onconnection);
ioHttps.on('connection', onconnection);



/*
// How to check change in a file
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


/*
// How to send a request to Python server like here https://github.com/ddeeproton2/vosk-python
app.get('/webresponse', (req, res) => {
  const name = req.query.getvarname;
  console.log(`name : ${name}`);
  post("http://127.0.0.1", req.query, function*(data) {
    console.log(`Data recieved : ${data}`);
  
  });
  res.json({ result: 'ok' });
});
*/

// ========================

/*
// How to use a Server UDP
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
server.on('message', (message, rinfo) => {
  console.log(`Message recieved from ${rinfo.address}:${rinfo.port}: ${message}`);
});
server.bind(41234, 'localhost'); // Set local port binding, or public '0.0.0.0'
console.log('Serveur UDP is listening on port 41234');
*/


class VocalCommand {

  constructor() {
    this.commands = {}; 
    this.datadir = 'appdata';
    this.filecommand = this.datadir+'/vocalcommand.json';
    this.createDir(this.datadir);
    this.config_load();
  }

  createDir(dirname){
    dir.exists(dirname).then(exists => {
      if(!exists){
        dir.createDirectory(dirname);
      }
    });
  }

  isCommand(cmd, msg) {
    return this.commands[cmd] !== undefined && this.commands[cmd].includes(msg);
  }

  add(cmd, msg) {
    if (!this.commands[cmd]) {
      this.commands[cmd] = [];
    }
    if (!this.isCommand(cmd, msg)) {
      this.commands[cmd].push(msg);
      this.config_save();
    }
  }

  remove(cmd, msg) {
    if (!this.commands[cmd]) {
      return false; // Command not found
    }

    const index = this.commands[cmd].indexOf(msg);
    if (index !== -1) {
      this.commands[cmd].splice(index, 1); // Remove the message at the index
      if (this.commands[cmd].length === 0) {
        delete this.commands[cmd]; // Remove empty command array
      }
      return true;
    }

    return false; // Message not found in the command
  }

  config_save(){
    this.createDir(this.datadir);
    file.writeJSON(this.filecommand, this.commands);
  }

  config_load(){
    if(file.exists(this.filecommand)){
      this.commands = file.readJSON(this.filecommand);
    }
  }
}


// ====================================

const vc = new VocalCommand();
//vc.remove('test','ttttest');
console.log(vc.commands);

// ====================================

class QuestionToLLM {
  constructor(clientIPv4){
    this.isQuestion = false;
    this.clientIPv4 = clientIPv4;
  }
  start(){
    this.isQuestion = true;
    speech("Dites votre question", this.clientIPv4);
  }
  ask(msg){
    this.isQuestion = false;
    speech("Veuillez patienter. Je réfléchis à votre question. ", this.clientIPv4);
    let base = this;
    ask(msg, function(result){
      console.log(result);
      result = result.replaceAll("*","").replaceAll("\\r","");
      speech(result, base.clientIPv4);
    });
  }
}
var questionllm = new QuestionToLLM('127.0.0.1');

// ====================================

class VisualCodeCommands{
  constructor(clientIPv4){
    this.isCode = false;
    this.clientIPv4 = clientIPv4;
  }
  start(){
    this.isCode = true;
    speech("Dites votre question sur le code", this.clientIPv4);
  }
  ask(msg){
    this.isCode = false;
    console.log("Lancement du code");
    speech("Veuillez patienter. Je réfléchis à votre question. ", this.clientIPv4);
    ask_vscode(msg, getLocalIpAddress()+':'+httpServer.address().port);
  }
  
}
var visual = new VisualCodeCommands('127.0.0.1');

// ====================================

class LearningCommand{
  constructor(clientIPv4){
    this.listcmd = [
      'annuler',
      'suivant',
      'oui',
      'non',
      'repeter',
      'apprendre_commande',
      'apprendre_chiffres',
      'apprendre_lettres',
      'editeur',
      'lire', 
      'lignes_suivantes', 
      'lignes_precedantes', 
      'ecrire_chiffre',
      'ecrire_lettre',
      'nouvelle_ligne',
      'effacer_avant',
      'effacer_apres',
      'suivant',
      'precedent',
      'question',
      'vscode'
    ];
    this.isLearning = false;
    this.clientIPv4 = clientIPv4;
    this.index_listcmd = 0;
    this.learning_mode = '';
    this.learning_record = '';
  }
  start(){
    this.isLearning = true;
    this.learning_mode = "";
    if(this.index_listcmd > this.listcmd.length - 1){
      this.index_listcmd = 0;
    }
    speech("Vous lancez le mode apprentissage. Veuillez dire la commandes "+this.listcmd[this.index_listcmd]+" ou suivant ou annuler.", this.clientIPv4);
  }
  
  learn(msg){
    if(this.learning_mode === ""){
        

      if(msg === 'annuler' || vc.isCommand('annuler', msg)){
        this.isLearning = false;
        speech("Apprentissage terminé.", this.clientIPv4);
        return;
      }

      if(msg === 'suivant' || vc.isCommand('suivant', msg)){
        this.index_listcmd++;
        if(this.index_listcmd > this.listcmd.length - 1){
          this.index_listcmd = 0;
        }
        speech("Veuillez dire la commande "+this.listcmd[this.index_listcmd]+" ou suivant ou annuler.", this.clientIPv4);
        return;
      }

      if(vc.isCommand(this.listcmd[this.index_listcmd], msg)){
        speech("J'ai reconnu la commande "+this.listcmd[this.index_listcmd], this.clientIPv4);
        return;
      }

      this.learning_record = msg;
      speech("Voulez-vous garder le mot ? "+this.learning_record+" pour la commande "+this.listcmd[this.index_listcmd]+" ? Répondez oui, non ou annuler.", this.clientIPv4);
      this.learning_mode = "yes_or_no";
      return;
    }
    if(this.learning_mode === "yes_or_no"){

      if(msg === 'oui' || vc.isCommand('oui', msg)){
        this.learning_mode = "";
        speech("Enregistrement du mot, "+this.learning_record+", dans la commande "+this.listcmd[this.index_listcmd], this.clientIPv4);
        vc.add(this.listcmd[this.index_listcmd], this.learning_record);
        return;
      }

      if(msg === 'non' || vc.isCommand('non', msg)){
        this.learning_mode = "";
        speech("Annulation de l'enregistrement du mot, "+this.learning_record+", dans la commande "+this.listcmd[this.index_listcmd], this.clientIPv4);
        return;
      }

      if(msg === 'annuler' || vc.isCommand('annuler', msg)){
        this.learning_mode = "";
        this.isLearning = false;
        speech("Apprentissage terminé.", this.clientIPv4);
        return;
      }

      speech("Voulez-vous garder le mot ? "+this.learning_record+" pour la commande "+this.listcmd[this.index_listcmd]+" ? Répondez oui, non ou annuler.", this.clientIPv4);

    }
  }
}
var learning_command = new LearningCommand('127.0.0.1');

// ====================================

class LearnNumbers{
  constructor(clientIPv4){
    this.clientIPv4 = clientIPv4;
    this.isLearning = false;
    this.current_number_to_learn = 0;
    this.learning_record = "";
    this.learning_mode = "";
  }
  start(){
    this.isLearning = true;
    speech("Vous lancez le mode apprentissage des chiffres. Veuillez dire le chiffre "+this.current_number_to_learn+", suivant, annuler ou répêter", this.clientIPv4);
  }
  learn(msg){
    if(this.learning_mode === ""){
      if(vc.isCommand('repeter', msg)){
        speech("Veuillez dire le chiffre "+this.current_number_to_learn+", suivant, annuler ou répêter", this.clientIPv4);
        return;
      }
      if(vc.isCommand('suivant', msg)){
        this.current_number_to_learn++;
        speech("Veuillez dire le chiffre "+this.current_number_to_learn+", suivant, annuler ou répêter", this.clientIPv4);
        return;
      }
      if(vc.isCommand('annuler', msg)){
        this.isLearning = false;
        speech("Apprentissage terminé.", this.clientIPv4);
        return;
      }
      if(vc.isCommand(this.current_number_to_learn, msg)){
        speech("J'ai reconnu le chiffre "+this.current_number_to_learn, this.clientIPv4);
        return;
      }
      this.learning_record = msg;
      //speech("Voulez-vous garder le mot ? "+this.learning_record+" pour la commande "+this.listcmd[this.index_listcmd]+" ? Répondez oui, non, annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
      this.learning_mode = "yes_or_no";
    }
    if(this.learning_mode === "yes_or_no"){
      if(msg === 'oui' || vc.isCommand('oui', msg)){
        this.learning_mode = "";
        speech("Enregistrement du mot, "+this.learning_record+", pour le chiffre "+this.current_number_to_learn, this.clientIPv4);
        vc.add(this.current_number_to_learn, this.learning_record);
        return;
      }

      if(msg === 'non' || vc.isCommand('non', msg)){
        this.learning_mode = "";
        speech("Annulation de l'enregistrement du mot, "+this.learning_record+", pour le chiffre "+this.current_number_to_learn, this.clientIPv4);
        return;
      }

      if(msg === 'annuler' || vc.isCommand('annuler', msg)){
        this.learning_mode = "";
        this.isLearning = false;
        speech("Apprentissage terminé.", this.clientIPv4);
        return;
      }

      speech("Voulez-vous garder le mot ? "+this.learning_record+" pour le chiffre "+this.current_number_to_learn+" ? Répondez oui, non ou annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
    }
  }
}

var learning_numbers = new LearnNumbers('127.0.0.1');

// ====================================
// ====================================


class LearnChars{
  constructor(clientIPv4){
    this.clientIPv4 = clientIPv4;
    this.isLearning = false;
    this.current_char_to_learn = 0;
    this.chars_list = 'abcdefghijklmnopqrstuvwxyz .,+-()"\'!?:;/\\@#$%^&*_={}[]<>|	`';
    this.learning_record = "";
    this.learning_mode = "";
  }
  start(){
    this.isLearning = true;    
    speech("Vous lancez le mode apprentissage des lettres. Veuillez dire le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+", suivant, annuler ou répêter", this.clientIPv4);
  }
  learn(msg){
    if(this.learning_mode === ""){
      if(vc.isCommand('repeter', msg)){
        speech("Veuillez dire le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+", suivant, annuler ou répêter", this.clientIPv4);
        return;
      }
      if(vc.isCommand('suivant', msg)){
        this.current_char_to_learn++;
        if(this.current_char_to_learn > this.chars_list.length - 1){
          this.current_char_to_learn = 0;
        }
        speech("Veuillez dire le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+", suivant, annuler ou répêter", this.clientIPv4);
        return;
      }
      if(vc.isCommand('annuler', msg)){
        this.isLearning = false;
        speech("Apprentissage terminé.", this.clientIPv4);
        return;
      }
      if(vc.isCommand(char_to_keyword(this.chars_list.charAt(this.current_char_to_learn)), msg)){
        speech("J'ai reconnu la lettre "+char_to_word(this.chars_list.charAt(this.current_char_to_learn)), this.clientIPv4);
        return;
      }
      this.learning_record = msg;
      //speech("Voulez-vous garder le mot ? "+this.learning_record+" pour le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+" ? Répondez oui, non, annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
      this.learning_mode = "yes_or_no";
    }
    if(this.learning_mode === "yes_or_no"){
      if(msg === 'oui' || vc.isCommand('oui', msg)){
        this.learning_mode = "";
        speech("Enregistrement du mot, "+this.learning_record+", pour le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn)), this.clientIPv4);
        vc.add(char_to_keyword(this.chars_list.charAt(this.current_char_to_learn)), this.learning_record);
        return;
      }

      if(['non','mon'].indexOf(msg) !== -1 || vc.isCommand('non', msg)){
        this.learning_mode = "";
        speech("Annulation de l'enregistrement du mot, "+this.learning_record+", pour le caractère "+this.chars_list.charAt(this.current_char_to_learn), this.clientIPv4);
        return;
      }

      if(['annuler'].indexOf(msg) !== -1 || vc.isCommand('annuler', msg)){
        this.learning_mode = "";
        this.isLearning = false;
        speech("Apprentissage terminé.", this.clientIPv4);
        return;
      }

      speech("Voulez-vous garder le mot ? "+this.learning_record+" pour le caractère "+this.chars_list.charAt(this.current_char_to_learn)+" ? Répondez oui, non ou annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
    }
  }
}

var learning_chars = new LearnChars('127.0.0.1');
// ====================================
// ====================================

class Editor{
  constructor(clientIPv4, nodeserver){
    this.clientIPv4 = clientIPv4;
    this.isWorking = false;
    this.nodeserver = nodeserver;
    this.working_mode = "";
    this.chars_list = 'abcdefghijklmnopqrstuvwxyz .,+-()"\'!?:;/\\@#$%^&*_={}[]<>|	`';
  }
  start(){
    this.isWorking = true;
    speech("Vous lancez le mode editeur.", this.clientIPv4);
  }
  work(msg){
    if(this.working_mode === ""){
      if(['annuler'].indexOf(msg) !== -1 || vc.isCommand('annuler', msg)){
        this.isWorking = false;
        speech("Sortie du mode editeur.", this.clientIPv4);
        return;
      }

      if(['lire'].indexOf(msg) !== -1 || vc.isCommand('lire', msg)){
        //speech("Lecture de visual code", this.clientIPv4);
        //this.vscode_read(this.nodeserver);
        this.vscode_readposition(this.nodeserver);
        return;
      }

      if(vc.isCommand('lire_position', msg)){
        this.vscode_readposition(this.nodeserver);
        return;
      }

      if(['lignes suivantes'].indexOf(msg) !== -1 || vc.isCommand('lignes_suivantes', msg)){
        speech("Passe à la ligne suivante", this.clientIPv4);
        this.vscode_nextline(this.nodeserver);
        return;
      }

      if(['ligne précédente'].indexOf(msg) !== -1 || vc.isCommand('lignes_precedantes', msg)){
        speech("Passe à la ligne précédente", this.clientIPv4);
        this.vscode_prevline(this.nodeserver);
        return;
      }


      if(msg === 'écrire chiffres' || vc.isCommand('ecrire_chiffre', msg)){
        speech("Epelez votre chiffre", this.clientIPv4);
        this.working_mode = "spell_number";
        return;
      }

      if(msg === 'écrire lettre' || vc.isCommand('ecrire_lettre', msg)){
        speech("Epelez votre lettre", this.clientIPv4);
        this.working_mode = "spell_char";
        return;
      }

      if(msg === 'nouvelle ligne' || vc.isCommand('nouvelle_ligne', msg)){
        this.vscode_addnewline(this.nodeserver);
        return;
      }

      if(msg === 'effacer avant' || vc.isCommand('effacer_avant', msg)){
        this.vscode_deletebefore(this.nodeserver);
        return;
      }
      if(msg === 'effacer après' || vc.isCommand('effacer_apres', msg)){
        this.vscode_deleteafter(this.nodeserver);
        return;
      }
      //cool
      if(['suivant','après','avancer','prochain','flèche droite'].indexOf(msg) !== -1 || vc.isCommand('suivant', msg)){
        this.vscode_cursorMoveToNextChar(this.nodeserver);
        return;
      }

      if(['précédent','avant','reviens','reculez','fléche gauche'].indexOf(msg) !== -1 || vc.isCommand('precedent', msg)){
        this.vscode_cursorMoveToPreviousChar(this.nodeserver);
        return;
      }

    }
    //===============
    if(this.working_mode === "spell_number"){
      if(msg === 'annuler' || vc.isCommand('annuler', msg)){
        this.working_mode = "";
        speech("Sortie du mode Epelez votre chiffre.", this.clientIPv4);
        return;
      }
      var selected = this.getVoiceToNumber(msg);
      if(selected !== ""){
        this.vscode_writemsg(selected, this.nodeserver);
      }
    }    
    
    //===============
    if(this.working_mode === "spell_char"){
      if(msg === 'annuler' || vc.isCommand('annuler', msg)){
        this.working_mode = "";
        speech("Sortie du mode Epelez votre lettre.", this.clientIPv4);
        return;
      }
      var selected = this.getVoiceToChar(msg);
      if(selected !== ""){
        this.vscode_writemsg(selected, this.nodeserver);
      }
    }
  }
  //=============
  getVoiceToChar(msg){
    for(let i = 0; i < this.chars_list.length; i++){
      let selectedChar = this.chars_list.charAt(i);
      let selectedCharKeyword = char_to_keyword(selectedChar);
      //let selectedCharTitle = char_to_word(selectedChar);
      if(vc.isCommand(selectedCharKeyword, msg)){
        return selectedChar;
      }
    }
    return "";
  }
  //=============
  getVoiceToNumber(msg){
    for(let i = 0; i < 10; i++){
      if(vc.isCommand(i, msg)){
        return i;
      }
    }
    return "";
  }
  //=============
  vscode_cursorMoveToPreviousChar(nodeserver){
    vscode_execute_code(`
      if(cmd.cursorMoveToPreviousChar()){
        cmd.post("http://`+nodeserver+`/speak", {msg:"Recule de un caractère"});
      }else{
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not move to previous char in visual'});
      }
    `);
  }
  vscode_cursorMoveToNextChar(nodeserver){
    vscode_execute_code(`
      if(cmd.cursorMoveToNextChar()){
        cmd.post("http://`+nodeserver+`/speak", {msg:"Avance de un caractère"});
      }else{
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not move to next char in visual'});
      }
    `);
  }
  vscode_deleteafter(nodeserver){
    vscode_execute_code(`
      if(cmd.deleteAfter(1)){
        cmd.post("http://`+nodeserver+`/speak", {msg:"Efface un caractère après"});
      }else{
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not delete after in visual'});
      }
    `);
  }
  vscode_deletebefore(nodeserver){
    vscode_execute_code(`
      if(cmd.deleteBefore(1)){
        cmd.post("http://`+nodeserver+`/speak", {msg:"Efface un caractère avant"});
      }else{
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not delete before in visual'});
      }
    `);
  }
  vscode_addnewline(nodeserver){
    vscode_execute_code(`
      if(!cmd.cursorMoveToEndLine()){
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not move to end line in visual'});
      }
      if(cmd.addNewLineAtCursorPosition()){
        cmd.post("http://`+nodeserver+`/speak", {msg:"Ajout d'une nouvelle ligne"});
      }else{
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not add new line in visual'});
      }
    `);
  }
  vscode_writemsg(msg, nodeserver){
    let msg_protected = msg.replaceAll("'", "\'");
    vscode_execute_code(`
      if(cmd.insertInEditorAtCurrentPosition('`+msg_protected+`')){
        cmd.post("http://`+nodeserver+`/speak", {msg:"Ecriture `+msg_protected+`"});
      }else{
        cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not write in visual'});
      }
    `);
  }
  vscode_ask(msg, nodeserver){
    let msg_protected = msg.replaceAll("'", "\'");
    vscode_execute_code(`
      let selected = cmd.readSelected();
      if(selected === ""){
        selected = cmd.readCurrentLine();
      }
      let msg = '`+msg_protected+`';
      let finalmsg = msg + "\\n\\n" + selected;
      if(selected+msg !== ""){
        cmd.post("http://`+nodeserver+`/ask", {msg:finalmsg});
      }
    `);
  }
  vscode_read(nodeserver){
    vscode_execute_code(`
      let selected = cmd.readSelected();
      if(selected === ""){
        selected = cmd.readCurrentLine();
      }
      if(selected !== ""){
        cmd.post("http://`+nodeserver+`/spell", {msg:selected});
      }
    `);
  }
  vscode_readposition(nodeserver){
    vscode_execute_code(`
      let before = cmd.readCurrentLineBeforePosition();
      let after = cmd.readCurrentLineAfterPosition();
      if(before+after !== ""){
        cmd.post("http://`+nodeserver+`/spell", {msg:before+"£"+after});
      }
    `);
  }
  vscode_nextline(nodeserver){
    vscode_execute_code(`
      let res = cmd.cursorMoveToNextLine();
      if(!res){
        if(cmd.isCursorLastLine()){
          cmd.post("http://`+nodeserver+`/speak", {msg:"Vous êtes à la dernière ligne"});
        }
      }
    `);
  }
  vscode_prevline(nodeserver){
    vscode_execute_code(`
      let res = cmd.cursorMoveToPrevLine();
      if(!res){
        if(cmd.isCursorFistLine()){
          cmd.post("http://`+nodeserver+`/speak", {msg:"Vous êtes à la première ligne"});
        }
      }
    `);
  }
}
var editor = new Editor('127.0.0.1', '127.0.0.1');

// ====================================

const startMessage = "Dites question pour me demander quelque chose. Dites question visual studio ou Apprendre commande, ou Apprendre lettre, ou Apprendre chiffres, ou éditeur, ou répêter.";

app.get('/speak', (req, res) => {
    //console.log(req);
    const msg = req.query.msg;
    const segments = req.ip.split(':');
    const clientIPv4 = segments.slice(-1);
    console.log('From '+clientIPv4+' : '+msg);
    ioHttp.emit('emitall', "voice", "all", "voice_order", "speech", msg);
    ioHttps.emit('emitall', "voice", "all", "voice_order", "speech", msg);
    res.json({ result: 'ok' });
    // =================== Ask LLM
    if(questionllm.isQuestion){
      questionllm.ask(msg);
      return;
    }
    if(vc.isCommand('question', msg)){
      questionllm = new QuestionToLLM(clientIPv4);
      questionllm.start();
      return;
    }
    // =================== Ask LLM for Visual Studio
    if(visual.isCode){
      visual.ask(msg);
      return;
    }
    if(vc.isCommand('vscode', msg)){
      visual = new VisualCodeCommands(clientIPv4);
      visual.start();
      return;
    }
    // =================== Learning Bases
    if(learning_command.isLearning){
      learning_command.learn(msg);
      return; 
    }
    if(['apprendre commande'].indexOf(msg) !== -1 || vc.isCommand('apprendre_commande', msg)){
      learning_command = new LearningCommand(clientIPv4);
      learning_command.start();
      return;
    }
    // =================== Learning Numbers
    if(learning_numbers.isLearning){
      learning_numbers.learn(msg);
      return;
    }
    if(['apprendre chiffres'].indexOf(msg) !== -1 || vc.isCommand('apprendre_chiffres', msg)){
      learning_numbers = new LearnNumbers(clientIPv4);
      learning_numbers.start();
      return;
    }
    // =================== Learning Chars
    if(learning_chars.isLearning){
      learning_chars.learn(msg);
      return;
    }
    if(['apprendre lettre',"apprends de l'être"].indexOf(msg) !== -1 || vc.isCommand('apprendre_lettres', msg)){
      learning_chars = new LearnChars(clientIPv4);
      learning_chars.start();
      return;
    }
    // =================== Editeur vscode
    if(editor.isWorking){
      editor.work(msg);
      return;
    }
    if(['éditeur',"l'éditeur"].indexOf(msg) !== -1 || vc.isCommand('editeur', msg)){
      editor = new Editor(clientIPv4, getLocalIpAddress()+':'+httpServer.address().port);
      editor.start();
      return;
    }
    // =================== Last commands (must be at the end)
    if(vc.isCommand('repeter', msg)){
      speech(startMessage, clientIPv4);
      return;
    }
});



// Configuration du middleware body-parser (because we read POST variables)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/ask', (req, res) => {
  const msg = req.body.msg;
  console.log(`ask msg : ${msg}`);
  speech(msg, config_speech_ip);
  ask(msg, function(result){
      console.log("Réponse");
      console.log(result);
      //result = result.replaceAll("*","");
      speech(result, config_speech_ip);
  });

  res.send('Données POST reçues avec succès !');
});


app.post('/spell', (req, res) => {
  const msg = req.body.msg;
  console.log(`spell msg : ${msg}`);
  spell(msg, config_speech_ip);
  res.send('Données POST reçues avec succès !');
});

app.post('/speak', (req, res) => {
  const msg = req.body.msg;
  console.log(`speak msg : ${msg}`);
  speech(msg, config_speech_ip);
  res.send('Données POST reçues avec succès !');
});



httpServer.listen(argv['http-port'] || 13080, () => {
  console.log(`Node HTTP serving on:`);
  if (allLocalIps.length > 0) {
    allLocalIps.forEach(ip => console.log(`${ip}:${httpServer.address().port}`));
  } else {
    console.error('No local ip found');
  }
  //console.log(`Server HTTP listening `+getLocalIpAddress()+`:${httpServer.address().port}`);
});

httpsServer.listen(argv['https-port'] || 13443, () => {
  console.log(`Node HTTPS serving on:`);
  const allLocalIps = getAllLocalIpAddresses();
  if (allLocalIps.length > 0) {
    allLocalIps.forEach(ip => console.log(`${ip}:${httpsServer.address().port}`));
  }
  //console.log(`Server node HTTPS listening `+getLocalIpAddress()+`:${httpsServer.address().port}`);
});


console.log("=================================================================");
console.log("Jan should be started as API Server https://github.com/janhq/jan");
console.log("Voice Recognizer should be started https://github.com/ddeeproton2");
console.log("This app.js need VSCode and the extension EvalOnHTTP server started:");
console.log("https://github.com/ddeeproton2/vosk-python/blob/main/others/vscode_evalonhttp/VSCodeExtensions.exe");
console.log("Commands:");
console.log("Say question, to ask something to the IA");
console.log("Say code, to ask something to the IA from the position of the cursor in VSCode editor");
// We should hear the text here if both servers are started
console.log('You shoud hear this: "'+startMessage+'"');
speech(startMessage, config_speech_ip);
console.log("=================================================================");



/*
//========================================
// server-to-server connexions - MASTER
//========================================
const privateKey2 = fs.readFileSync(argv['ssl-key2'] || __dirname + '/SSL/http2/localhost-privkey.pem', 'utf8');
const certificate2 = fs.readFileSync(argv['ssl-cert2'] || __dirname + '/SSL/http2/localhost-cert.pem', 'utf8');

const server = http2.createSecureServer({
  key: privateKey2,
  cert: certificate2,
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers, flags) => {
    //const method = headers[':method'];
    //const path = headers[':path'];
    //console.log("path="+path);
    console.log(headers.test);

  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('it works');
});

server.listen(12443); 

//========================================
// server-to-server connexions - CLIENT
//========================================

const clientConnexion = http2.connect('https://localhost:12443', {
  ca: fs.readFileSync(argv['ssl-cert2'] || __dirname + '/SSL/http2/localhost-cert.pem'),
});
clientConnexion.on('error', (err) => console.error(err));

const client = clientConnexion.request({ ':path': '/','test':'cool' });

client.on('response', (headers, flags) => {
  for (const name in headers) {
    //console.log(`${name}: ${headers[name]}`);
  }
});

client.setEncoding('utf8');
let data = '';
client.on('data', (chunk) => { data += chunk; });
client.on('end', () => {
  console.log(`${data}`);
  clientConnexion.close();
});
client.end(); 

*/
