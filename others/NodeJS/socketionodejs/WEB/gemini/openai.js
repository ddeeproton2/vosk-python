

$(document).ready(function(){
	var url = window.location.href;
	if(url.startsWith("https://chat.openai.com")){
        //loadScript("https://192.168.1.77:13443/socket.io.js", createConnexionServer);
        createConnexionServer();
	}
});
 

function loadScript(url, onloaded){
    console.log("load ... "+url);
    setTimeout(function(){
        var isJsonResponse = false;
        ajax.send(url, isJsonResponse, function(rep){
            console.log("loaded ... "+url);
            setTimeout(function(){
                eval(rep);
                onloaded(rep);
            },3000);

        });
    }, 5000);
}

var geminiAsk = [];
var geminiReponses = [];
var geminiLimitReponses = 5;
var geminiCoupeLaParole = true;
var isParoleCoupee = false;

var socket;
var internalclients = [];

function createConnexionServer(){

    console.log("connexion au serveur nodejs...");
    //window.location.protocol+'//'+window.location.hostname+':'+window.location.port
    //var portsckio = window.location.protocol === "https" ? 13443 : 13080;
    //var serversckio = window.location.protocol+'//'+window.location.hostname+':'+portsckio;
    socket = io("https://192.168.1.77:13443"); // Remplacez l'URL par l'adresse de votre serveur
    console.log("connecté au serveur nodejs!");


    socket.on('on_youtube_message', function(msg, channel){
        console.log(msg);
        console.log(channel);
        /*
        if(geminiCoupeLaParole){
            isParoleCoupee = geminiReponses.length !== 0;
            if(isParoleCoupee){
                console.log("Parole coupée. Anciennes données qui seront oublées:");
                console.log(geminiReponses);
                clearInterval(intervall_askToGemini);
                intervall_askToGemini = undefined;
                geminiReponses = [];
            }
        }
		//geminiReponses = [];
        geminiAsk.push(msg);
        console.log(msg);
        console.log(geminiAsk);
        timerAskToGemini();
   */
        
    });
    console.log("écoute de l'évenement on_youtube_message");


    socket.on('on_gemini_connect', function(msg, channel){
    	msg = atob(msg);
    	console.log(msg, channel);
    	try{
    		msg = JSON.parse(msg);
    		console.log(msg, channel);
    	}catch(e){console.log("error can't JSON parse: "+msg);}
    	/*
    	if(msg.message == "I am a client" && msg.client_id != ""){
    		
    		if(internalclients.indexOf(msg.client_id) == -1){
    			internalclients.push(msg.client_id);
    		}
    		var internalclients_id = internalclients.indexOf(msg.client_id);

			var data = {
    			"message":"this is your id internalclients", 
    			"client_id":msg.client_id, 
    			"internalclients_id":internalclients_id
    		};
    		console.log(data);
    		socket.emit('on_gemini_connect', btoa(JSON.stringify(data)), "channel_general");
            //socket.emit('leave', "channel_general");
		    socket.emit('join', "channel_"+internalclients_id);
		    console.log("join channel_"+internalclients_id);

    	}
        */
    });

    socket.on('on_start', function(msg){
        console.log("serverclient_id = "+msg);
        internalclients = [];
        /*
        setTimeout(function(){
            //socket.emit('join', "channel1");
            //console.log("join channel1");
            socket.emit('join', "channel_general");
            console.log("join channel_general");
        },5000);
        
        setTimeout(function(){
            var data = {
                "message":"I am a server"
            };
            console.log(data);
            socket.emit('on_gemini_connect', btoa(JSON.stringify(data)), "channel_general");
            console.log("ready");
        },10000);    

        setTimeout(function(){
            speakVoice("Je connecte youtube sur le site "+window.location.hostname.replaceAll(".", " point "));
            console.log("ready");
        },15000);
        */
    });
}



var ajax = {
    send:function(url, isJsonResponse, ondone){
        //data.action = 'sqlexplorer';
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

