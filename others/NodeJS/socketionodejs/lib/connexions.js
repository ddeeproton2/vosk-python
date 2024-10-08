const Turl = require('url');
const os = require('os');
const WebSocket = require('ws');
const SocksProxyAgent = require('socks-proxy-agent'); // Assuming 'socks-proxy-agent' library
const axios = require('axios');
const mysql = require('mysql');

class Connexions{
    constructor(){

    }
    //Use:
    //const data = postTor('https://my_adress_tor.onion:13443/socket.io.js', {});
    async postTor(url, data) {
        var opts = Turl.parse(url);
        const urlEncodedData = new URLSearchParams(data).toString();
        
        // create an instance of the `SocksProxyAgent` class with the proxy server information
        var agent = new SocksProxyAgent.SocksProxyAgent('socks://127.0.0.1:9050');
        opts.agent = agent;
        opts.method = "POST";
        opts.body = urlEncodedData;
        /*
        https.get(opts, function (res) {
            console.log('"response" event!', res.headers);
            res.pipe(process.stdout);
        });
        */
        
        http.get(opts, function (res) {
            console.log('"response" event!', res.headers);
            res.pipe(process.stdout);
        });
    }


    async getTor(url) {

        var Turl = require('url');
        var opts = Turl.parse(url);
      
        // create an instance of the `SocksProxyAgent` class with the proxy server information
        var agent = new SocksProxyAgent.SocksProxyAgent('socks://127.0.0.1:9050');
        opts.agent = agent;
        /*
        https.get(opts, function (res) {
          console.log('"response" event!', res.headers);
          res.pipe(process.stdout);
        });
        */
      
        http.get(opts, function (res) {
            console.log('"response" event!', res.headers);
            res.pipe(process.stdout);
        });
      
    }


    async post(url, data, options = {}) {

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
      
      
    async get(url, options = {}) {
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
      

    async mysql_request(requete) {
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
      

    getLocalIpAddress() {
        if(!this.isWindowsOS()){return '127.0.0.1';}
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
      
    getAllLocalIpAddresses() {
        if(!this.isWindowsOS()){return ['127.0.0.1'];}
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
    
    isWindowsOS() {
        return process.platform === 'win32';
    }

    speech(url, msg){
        try {  
          (async () => {
            try {
                this.post(url+encodeURIComponent(msg), {}, function(data) {
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


    ask_lmstudio(msg, onresult, model = "mistral-ins-7b-q4/Repository", max_tokens = 32768){ 
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
          model: model,
          //model: "mistral-ins-7b-q4",
          //model: "stable-zephyr-3b",
          //model: "deepseek-coder-1.3b",
          stream: false,
          //max_tokens: 2048,
          max_tokens: max_tokens,
          "stop": [
            "st0ph3r3"
          ],
          frequency_penalty: 0.7,
          presence_penalty: 0,
          temperature: 0.7,
          top_p: 0.95
        };
        console.log(msg);
        axios.post(config.config_jan_api, data, { headers })
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


    // Bearer is in config.bearer
    ask_anythinglm(msg, channel, onlydocuments, api_url, bearer, onresult){ 
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+bearer
        };
        var data = {
          "message": msg,
          "mode": onlydocuments === true ? "query" : "chat"
        };
      
        axios.post(api_url+"/api/v1/workspace/"+channel+"/chat", data, { headers })
        .then(response => {
            try{
                //console.log(response); 
                onresult(response.data.textResponse);
            }catch(e){
              console.error(e); 
            }
        })
        .catch(error => {
          console.error(error); 
        });
    }
      
    ollama_ask(ask){
      var data = {
          "model": "qwen2:0.5b",
          "messages": [
              {
                  "role": "user",
                  "content": ask
              }
          ],
          "stream": false
      };
      const response = fetch('http://localhost:11434/api/chat', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });
     /*.then((reponse)=> {
        reponse.text().then((rep)=>{
          let r = JSON.parse(rep);
          let msg = r.message.content;
          console.log(msg);
        });
     });
     */

     return response;
     
    }

    ollama_ask_old(ask){
      var data = {
          "model": "qwen2:0.5b",
          "messages": [
              {
                  "role": "user",
                  "content": ask
              }
          ],
          "stream": false
      };
      const response = fetch('http://localhost:11434/api/chat', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     }).then((reponse)=> {
        reponse.text().then((rep)=>{
          let r = JSON.parse(rep);
          let msg = r.message.content;
          console.log(msg);
        });
     });
     
    }

    ollama_generate(ask){
      var data = {
      "model": "qwen2:0.5b",
      "prompt": ask,
      "stream": false
     };

      const response = fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
     });
     
     console.log(reponse);

    }

    server_udp(bindAddress = '0.0.0.0', port = 41234, onmessage){
        const dgram = require('dgram');
        const server = dgram.createSocket('udp4');
        server.on('message', (message, rinfo) => {
            console.log(`Message recieved from ${rinfo.address}:${rinfo.port}: ${message}`);
        });
        server.bind(port, bindAddress);
        console.log('Serveur UDP is listening on port '+port);
    }

    websocket_server(port, onmessage, onclose, onerror){


        const wss = new WebSocket.Server({ port: port}); // Create WebSocket server on port 8080
        //console.log(wss.clients);
        wss.on('connection', (ws) => {
          console.log('Client connected');
      
          ws.on('message', (messageBinary) => {
            var message = "";
            // Handle message as UTF-8 encoded text (most common scenario)
            if (typeof messageBinary === 'string') {
              message = messageBinary;
            } else if (messageBinary instanceof Buffer) {
              message = messageBinary.toString('utf-8');
            } else {
              console.warn('Received message in unknown format:', message);
            }
            
            onmessage(message, ws);
            return;
            ws.send('Hello from the server!');
            
            try {
              const data = JSON.parse(message); // Attempt to parse JSON message
      
      
              /*
              const { action, channel, varname, value } = data; // Destructure message properties
      
              if (action === 'join') { // Handle 'join' action
                console.log(`${ws.remoteAddress} joined channel: ${channel}`);
                ws.join(channel); // Simulate channel joining (replace with your channel management logic)
              } else if (action === 'emitto' || action === 'emitall') { // Handle 'emitto' or 'emitall' actions
                if (!channel || !varname || typeof value === 'undefined') {
                  console.error('Invalid emit message format');
                  return;
                }
      
                const emitTo = action === 'emitto' ? [varname] : wss.clients.filter((client) => client.readyState === WebSocket.OPEN); // Target specific client(s) or all connected clients
                emitTo.forEach((client) => client.send(JSON.stringify({ from: ws.remoteAddress, to, action, varname, value })));
              } else {
                console.warn(`Unknown action: ${action}`);
              }
              */
            } catch (error) {
              console.error('Error processing message:', error);
            }
            
          });
      
          // ... (add other event handlers for 'close', 'error', etc. as needed)
        });
      
        wss.on('close', (code, reason) => {
            //console.log(`Client disconnected: code=${code}, reason=${reason}`);
            // Traitez la déconnexion ici
            onclose(code, reason);
        });
    
        wss.on('error', (error) => {
            //console.error('WebSocket error:', error);
            // Traitez les erreurs ici
            onerror(error);
        });

        console.log('WebSocket server listening on port '+port);
        return wss;
    }

    websocket_client(proxy_tor, destination_url, onconnexion, onmessage, onclose, onerror){
        // SOCKS proxy to connect to
        console.log('using proxy server %j', proxy_tor);
        console.log('attempting to connect to WebSocket %j', destination_url);

        // create an instance of the `SocksProxyAgent` class with the proxy server information
        var agent = new SocksProxyAgent.SocksProxyAgent(proxy_tor);

        // initiate the WebSocket connection
        var socket = new WebSocket(destination_url, { 
            agent: agent,
            perMessageDeflate: false
        });

        socket.on('open', () => {
            //console.log('WebSocket connection opened');
            //socket.send('Hello from the client!');
            onconnexion(socket);
        });

        socket.on('message', (message) => {
            let msg = "";
            // Handle message as UTF-8 encoded text (most common scenario)
            if (typeof message === 'string') {
                msg = message;
                //console.log('Received message from server:', message);
            } else if (message instanceof Buffer) {
                msg = message.toString('utf-8');
                // Handle message as binary data if necessary
                //console.log('Received binary data from server:', message.toString('utf-8')); // Assuming UTF-8 encoding
            } else {
                console.warn('Received message from server in unknown format:', message);
            }
            onmessage(msg, socket);
        });


        socket.on('close', (code, reason) => {
            console.log(`WebSocket connection closed: code=${code}, reason=${reason}`);
            onclose(code, reason, socket);
        });
    
        socket.on('error', onerror);
        return socket;
    }
}

// Maybe to do...
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




const internet = new Connexions();
// Export variable
module.exports = internet;