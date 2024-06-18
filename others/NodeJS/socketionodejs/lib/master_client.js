const internet = require('./connexions.js');
const PGP = require('./PGP.js');

class MasterClient{
    constructor(){
        var d = new Date();
        this.clients = [];
        this.sessionPGP = PGP.generate();
        this.publicKey = this.sessionPGP.publicKey;
        this.id_creation_time = d.getTime();
        this.privateKey = this.sessionPGP.privateKey;
        this.socket = undefined;
        this.proxy = undefined;
    }

    start(proxy, url, onconnexion, onmessage, onclose, onerror){
        console.log("Start Websocket Client "+this.id_creation_time);
        this.socket = internet.websocket_client(proxy, url, onconnexion, onmessage, onclose, onerror);
        this.proxy = proxy;
        this.url = url;
        this.onconnexion = onconnexion;
        this.onmessage = onmessage;
        this.onclose = onclose;
        this.onerror = onerror;
        return this.socket;
    }
    restart(){
        if(this.proxy === undefined){
            console.log("Error: can't restart because, was not start() first");
            return undefined;
        }
        this.socket = internet.websocket_client(this.proxy, this.url, this.onconnexion, this.onmessage, this.onclose, this.onerror);
        return this.socket;
    }


    addClient(data){
        var isClient = this.isClient(data);
        if(isClient.isError){return false;}
        if(isClient.isClient){
            if(isClient.isNewPublicKey){
                isClient.client.pgp.publicKey = data.publicKey;
                console.log("update server publicKey "+isClient.client.pgp.id_creation_time);
            }else{
                console.log("Welcome back server "+isClient.client.pgp.id_creation_time);
            }
            return true;
        }else{
            if(isClient.isNewPublicKey){
                this.clients.push({
                    pgp:{
                        publicKey: data.publicKey,
                        id_creation_time: data.id_creation_time
                    },
                    wss:this.wss
                });
                console.log("New server "+data.id_creation_time);
                return true;
            }else{
                console.log("Error: this request is bad");
            }
        }
        return false;
    }
    isClient(data){
        try {
            for(var i in this.clients){
                if(this.clients[i].pgp.id_creation_time === data.id_creation_time){
                    var isNewPublicKey = this.clients[i].pgp.publicKey === data.publicKey && data.publicKey !== "";
                    return {isClient:true, client: this.clients[i], isNewPublicKey:isNewPublicKey, isError: false};
                }
            }
            return {isClient:false, client:undefined, isNewPublicKey: data.publicKey !== "", isError: false};
        } catch (error) {
            return {isClient:false, client:undefined, isNewPublicKey: false, isError: true};
        }
        
    }
    getClient(id_creation_time){
        try {
            for(var i in this.clients){
                if(this.clients[i].pgp.id_creation_time === id_creation_time){
                    return this.clients[i].pgp.publicKey;
                }
            }
        } catch (error) {
        }
        return "";
    }
}



const masterclient = new MasterClient();
// Export variable
module.exports = masterclient;
