var Turl = require('url');

class Connexions{
    constructor(){

    }
    async postTor(url, data, options = {}) {
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
    async getTor(url, options = {}) {

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
      
      
}

const internet = new Connexions();
// Export variable
module.exports = internet;