//node app.js --https-port 13443 --http-port 13080 --ssl-key SSL/private-key.pem --ssl-cert SSL/certificate.pem --ssl-ca SSL/ca.pem

// =========================
let config_speech_ip = '192.168.1.57'; 
let config_speech_port = '1225';
/*
 Link to Listen port like application here 

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

let config_jan_api = 'http://localhost:2339/v1/chat/completions';

// Link with a Language Large Model (LLM) as API for Jan
// https://github.com/janhq/jan
// So you can speak with an IA :)

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

async function post2(url, data, callback) {
  try{
      //const encodedData = new URLSearchParams(data); // Encode data as URL-encoded string
      const contentType = response.headers.get('Content-Type');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/x-www-form-urlencoded',  // Set appropriate Content-Type
          'Content-Type': contentType
        },
        //body: encodedData.toString(),  // Send encoded data as string
        body: data,  // Send encoded data as string
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const responseData = await response.text(); // Get response as text
      callback(responseData);
  }catch(e){}
}


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

httpServer.listen(argv['http-port'] || 13080, () => {
  console.log(`Server HTTP listening on port ${httpServer.address().port}`);
});

httpsServer.listen(argv['https-port'] || 13443, () => {
  console.log(`Server HTTPS listening on port ${httpsServer.address().port}`);
});

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



//========================================
// Commands for VSCode
//========================================

function vscode_execute_code(code){
  post("http://127.0.0.1:4000", { code: code });
}


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



var isQuestion = false;
var isCode = false;
app.get('/speak', (req, res) => {
    //console.log(req);
    const msg = req.query.msg;
    const segments = req.ip.split(':');
    const clientIPv4 = segments.slice(-1);
    console.log('From '+clientIPv4);
    console.log('Speak :');
    console.log(msg);
    ioHttp.emit('emitall', "voice", "all", "voice_order", "speech", msg);
    ioHttps.emit('emitall', "voice", "all", "voice_order", "speech", msg);
    if(isQuestion){
        isQuestion = false;
        speech("Veuillez patienter. Je réfléchis à votre question. ", clientIPv4);
        ask(msg, function(result){
          console.log(result);
          result = result.replaceAll("*","").replaceAll("\\r","");
          speech(result, clientIPv4);
        });
        res.json({ result: 'ok' });
        return;
    }
    if(msg === "question"){
        isQuestion = true;
        speech("Dites votre question", clientIPv4);
        res.json({ result: 'ok' });
        return;
    }
    if(isCode){
        isCode = false;
        console.log("Lancement du code");
        speech("Veuillez patienter. Je réfléchis à votre question. ", clientIPv4);

        let msg_protected = msg.replaceAll("'", "\'");

        vscode_execute_code(`
          let selected = cmd.readSelected();
          if(selected === ""){
            selected = cmd.readCurrentLine();
          }
          let msg = '`+msg_protected+`'+"\\n\\n"+selected;
          cmd.post("http://127.0.0.1:13080/ask", {msg:msg});
        `);

        res.json({ result: 'ok' });
        return;
    }

    if(msg === "code"){
        isCode = true;
        speech("Dites votre question sur le code", clientIPv4);
        res.json({ result: 'ok' });
        return;
    }

    /*
    ask(msg, function(result){
        console.log(result);
        result = result.replaceAll("*","");
        speech(result, clientIPv4);
    });
    */

    res.json({ result: 'ok' });
});



// Configuration du middleware body-parser
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





console.log("=================================================================");
console.log("Jan should be started as API Server https://github.com/janhq/jan");
console.log("Voice Recognizer should be started https://github.com/ddeeproton2");
console.log("This app.js need VSCode and the extension EvalOnHTTP server started:");
console.log("https://github.com/ddeeproton2/vosk-python/blob/main/others/vscode_evalonhttp/VSCodeExtensions.exe");
console.log("Commands:");
console.log("Say question, to ask something to the IA");
console.log("Say code, to ask something to the IA from the position of the cursor in VSCode editor");
// We should hear the text here if both servers are started
const startMessage = "Dites question pour me demander quelque chose";
console.log('You shoud hear this: "'+startMessage+'"');
speech(startMessage, config_speech_ip);
console.log("=================================================================");

/*
code = `
const editor = vscode.window.activeTextEditor;
if (editor) {
  const selection = editor.selection;
  const position = selection.active;

  const text = 'Votre texte ici';

  editor.edit(editBuilder => {
    editBuilder.insert(position, text);
  });
} else {
  window.showErrorMessage("Aucun éditeur de texte actif n\'a été trouvé.");
}

`;

console.log("vscode_command_read_all_lines()");
//post_vscode("http://127.0.0.1/web/variables.php", { code: code }, function(data){});

post("http://127.0.0.1:4000", { code: code });
//post("http://127.0.0.1/web/variables.php", { code: code });
*/


/*
vscode_execute_code(`
cmd.post("http://127.0.0.1:13080/ask", {msg:"Bonjour"});
`);
*/