class TProcessio{
 
    constructor(){
        this.utilisateurs = [];
        this.myuserid = 0;
    }
    _displayUser(i){
        $('#users').append($('<div>').text(this.utilisateurs[i].statut+" "+this.utilisateurs[i].type+" "+this.utilisateurs[i].id));
    }
    process(from, to, action, varname, value){
        console.log(from+', '+to+', '+action+', '+varname+', '+value);
        if(from === "server" && action === "set" && varname === "clientid"){
 
        }
    }

}



class TGemini extends TProcessio{
    constructor() {
        super();
        this.geminiReponses = [];
        this.indexBalancing = -1;
        this.delay = 0;
        this.maxMsgBeforeClearCache = 5;
        this.maxMsgBeforeClearCache_count = 0;
    }
    gemini_process(from, to, action, varname, value){
        super.process(from, to, action, varname, value);

        if(action === "voice_order"  && varname === "speech"){
            socket.emit('emittogethttpserver', "", "", "Message reçu "+value); 
            if(value ==="youtube"){window.location.href = "https://www.youtube.com";}
        }
    }   
}


var p = new TGemini();
var url = window.location.href;
console.log(url);
//if(url.startsWith("https://gemini.google.com/app")){
    
    console.log("url Passed");

    loadScript2("https://127.0.0.1:13443/socket.io.js", function (){

        socket = io("https://127.0.0.1:13443");

        socket.on('emitto', (from, to, action, varname, value) => {
            p.gemini_process(from, to, action, varname, value);
        });

        socket.on('emitall', (from, to, action, varname, value) => {
            p.gemini_process(from, to, action, varname, value);
        });
        
        socket.on('connect', function() {
            console.log('Connected to server!');
        });

    });
//}



function loadScript2(url, onloaded){
    console.log("load ... "+url);
    setTimeout(function(){
        var isJsonResponse = false;
        ajax.send(url, isJsonResponse, function(rep){
            console.log("loaded ... "+url);
            //eval(rep);
            
			var scr = document.createElement("script");
			scr.src = url;
			document.body.appendChild(scr);
            setTimeout(function(){
                onloaded(rep);
            }, 5000);
            
        });
    }, 5000);
}




var ajax = {
    send:function(url, isJsonResponse, ondone){
        //data.action = 'sqlexplorer';
        console.log("GET "+url);
        $.ajax({
            type: 'GET',
            url: url,
            async: true,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Negotiate");
            },
            success: function(res){
                if(!isJsonResponse){ ondone(res); return; }
                try{
                    ondone(JSON.parse(res.trim())); return;
                }catch(e){
                    //ondone({error:true,errorMessage:"Json malformed response",res:res,e:e}); return;
                    ondone({error:true,errorMessage:res}); return;
                }
            },
            error: function(xhr, message, errorThrworn){
                ondone({error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
            }
        });
    },

    sendPost:function(url, data, isJsonResponse, ondone){
        //data.action = 'sqlexplorer';
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: true,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Negotiate");
            },
            success: function(res){
                if(!isJsonResponse){ ondone(res); return; }
                try{
                    ondone(JSON.parse(res.trim())); return;
                }catch(e){
                    //ondone({error:true,errorMessage:"Json malformed response",res:res,e:e}); return;
                    ondone({error:true,errorMessage:res}); return;
                }
            },
            error: function(xhr, message, errorThrworn){
                ondone({error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
            }
        });
    },
    
    sendWait:function(url, data, isJsonResponse, ondone){
        //data.action = 'sqlexplorer';
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: false,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Negotiate");
            },
            success: function(res){
                if(!isJsonResponse){ ondone(res); return; }
                try{
                    ondone(JSON.parse(res)); return;
                }catch(e){
                    //ondone({error:true,errorMessage:"Json malformed response",res:res,e:e}); return;
                    //ondone(res); return;
                    ondone({error:true,errorMessage:res}); return;
                }
            },
            error: function(xhr, message, errorThrworn){
                ondone({error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
            }
        });
    }
    
}; 

