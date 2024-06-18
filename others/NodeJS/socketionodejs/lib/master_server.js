const internet = require('./connexions.js');
const PGP = require('./PGP.js');

class MasterServer{
    constructor(){
        var d = new Date();
        this.clients = [];
        this.sessionPGP = PGP.generate();
        this.publicKey = this.sessionPGP.publicKey;
        this.id_creation_time = d.getTime();
        this.privateKey = this.sessionPGP.privateKey;
        this.wss = undefined;
    }

    start(port, onmessage, onclose, onerror){
        console.log("Start Websocket Server "+this.id_creation_time);
        this.wss = internet.websocket_server(port, onmessage, onclose, onerror);
        return this.wss;
    }

    addClient(data){
        var isClient = this.isClient(data);
        if(isClient.isError){return false;}
        if(isClient.isClient){
            if(isClient.isNewPublicKey){
                isClient.client.pgp.publicKey = data.publicKey;
                console.log("update client publicKey "+isClient.client.pgp.id_creation_time);
            }else{
                console.log("Welcome back user "+isClient.client.pgp.id_creation_time);
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
                console.log("New user "+data.id_creation_time);
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


const masterserver = new MasterServer();
// Export variable
module.exports = masterserver;
