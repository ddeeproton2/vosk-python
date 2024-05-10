var socket;
var durationQuestion = 22000;

class Timingg {
    constructor(duration) {
      this.duration = duration;
      this.callbacks = [];
      this.args = [];
      this.timer = 0;
    }

    start_or_queue(callback, ...args) {

        if(this.timer === 0){
            callback(...args);
            this.timer += this.duration;
            console.log("START "+this.timer);
            var base = this;
            setTimeout(function(){
                base.timer -= base.duration;
                console.log("END "+base.timer);
            }, this.timer);
        }else{
            this.callbacks.push(callback);
            this.args.push(...args);
            this.timer += this.duration;
            var base = this;
            setTimeout(function(){
                //base.timer -= base.duration;
                base.callbacks.shift()(base.args.shift());
                //base.timer += base.duration;
                console.log("START "+base.timer);
                setTimeout(function(){
                    base.timer -= base.duration;
                    console.log("END "+base.timer);
                }, base.timer - this.duration );
            }, base.timer - this.duration)

        }
    }
  }


  class TProcessio{
 
    constructor(){
        this.utilisateurs = [];
        this.myuserid = 0;
    }
    _displayUser(i){
        $('#users').append($('<div>').text(this.utilisateurs[i].statut+" "+this.utilisateurs[i].type+" "+this.utilisateurs[i].id));
    }
    process(from, to, action, varname, value){
        if(from === "server" && action === "set" && varname === "clientid"){
            this.myuserid = value;
            $('#users').html("");
            for(var i in this.utilisateurs){
                if(this.myuserid === this.utilisateurs[i].id){
                    //this.utilisateurs[i].type = 'me';
                }
                this._displayUser(i);
            }
        }
        if(action === "set" && varname === "clienttype"){
            $('#users').html("");
            for(var i in this.utilisateurs){
                if(from === this.utilisateurs[i].id){
                    if(this.myuserid !== this.utilisateurs[i].id){
                        this.utilisateurs[i].type = value;
                    }
                    this.utilisateurs[i].statut = 'connected';
                }
                this._displayUser(i);
            }
        }
        if(action === "set" && varname === "clientstatut"){
            $('#users').html("");
            for(var i in this.utilisateurs){
                if(from === this.utilisateurs[i].id){
                    this.utilisateurs[i].statut = value;
                }
                this._displayUser(i);
            }
        }
        if(from === "server" && action === "set" && varname === "users"){
            var users = value;
            console.log(users);
            $('#users').html("");
            for(var i in users){
                var isFound = false;
                for(var j in this.utilisateurs){
                    if(this.utilisateurs[j].id === users[i]){
                        isFound = true;
                        break;
                    }
                }
                if(!isFound){
                    this.utilisateurs.push({
                        statut:'newuser',
                        type: 'unknown',
                        id: users[i]
                    });
                }
            }
            for(var i in this.utilisateurs){
                if(users.indexOf(this.utilisateurs[i].id) === -1){
                    this.utilisateurs.splice(i, 1); 
                }
            }
            for(var i in this.utilisateurs){
                this._displayUser(i);
            }
            setTimeout(function(){
                socket.emit('emitall', "", "", "set", "clienttype", "Gemini"); 
            },500);
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

        // GEMINI
        if(action === "youtube_to_gemini"  && varname === "question"){
            var base = this;
            setTimeout(function(from, to, action, varname, value, base){
                socket.emit('emitall', "", "", "set", "clientstatut", "working"); 

                var msg = value;
                
                ttim.start_or_queue(function(msg){
                    console.log(msg);
                    askToGemini(msg);
 
                    _onNewMessage(function(base){
                        console.log("Lecture de la réponse générée par gemini");
                        var txt = "";
                        $(".response-content message-content[READED!=TRUE]").each(function(){
                            $(this).attr("READED", "TRUE");
                            txt = txt + "" + $(this).text();
                            return;
                        });
                        console.log(txt);

                        // Envoi de la réponse à mon telephone directement
                        //ajax.send("http://192.168.137.2:1225/?message="+encodeURIComponent(txt), isJsonResponse, function(rep){});
                        socket.emit('emittogethttpserver', "", "192.168.137.2:1225", txt); 
                        //socket.emit('emittogethttpserver', "", "192.168.1.22:2121", txt); 

                        // Envoi de la réponse à Youtube
                        setTimeout(function(base){
                            try{
                                console.log("START protectForFrance24");
                                txt = txt.substring(0, 1000);
                                txt = protectForFrance24(txt);
                                console.log("END protectForFrance24");
                                base.geminiReponses = base.geminiReponses.concat(txt);
                                console.log(txt);
                                //p.indexBalancing = -1;
                                base._loadbalancingReponses();
                            }catch(e){
                                console.log("Erreur");
                                console.log(e);
                            }
                            socket.emit('emitall', "", "", "set", "clientstatut", "connected"); 
                            base.maxMsgBeforeClearCache_count++;
                            if(base.maxMsgBeforeClearCache_count >= base.maxMsgBeforeClearCache){
                                base.maxMsgBeforeClearCache_count = 0;
                                setTimeout(function(){
                                    $("button[data-test-id=start-new-conversation-button]").click();
                                },2000);
                                
                            }                              
                        },2000, base);
                  
                    }, base);
                },msg);
            },2000, from, to, action, varname, value, base);
        }
        if(action === "set" && varname === "clientstatut" && value === "connected"){
            console.log("Getting clientstatut "+value);
            console.log(this.utilisateurs);
            console.log("from",from);
            var isYoutubeChat = false;
            for(var i in this.utilisateurs){
                if(from === this.utilisateurs[i].id){
                    if(this.utilisateurs[i].type === "youtube_chat"){
                        isYoutubeChat = true;
                        break;
                    }
                }
            }
            if(isYoutubeChat){
                var rep = this.geminiReponses.shift();
                if(rep === undefined){
                    console.log("Aucun message à envoyer");
                }else{
                    setTimeout(function(from, rep){
                        console.log('emitto', "", from, "gemini_to_youtube", "reponse", rep); 
                        socket.emit('emitto', "", from, "gemini_to_youtube", "reponse", rep);     
                    },this.delay, from, rep);
                    this.delay += 2000;
                }
            }else{
                console.log("is not Youtube chat client");
            }
        }
    }
    _loadbalancingReponses(){
        console.log("START _loadbalancingReponses");
        this.delay = 0;
        for(this.indexBalancing in this.utilisateurs){
            var i = this.indexBalancing;
            console.log(this.utilisateurs[i]);
            if(this.utilisateurs[i].type === "youtube_chat" && this.utilisateurs[i].statut === "connected"){
                socket.emit('emitto', "", this.utilisateurs[i].id, "get", "clientstatut", ""); 
            }
        }
        console.log("END _loadbalancingReponses");
    }
    
}

function _onNewMessage(thisfunction, ...args){
    setTimeout(function(thisfunction, ...args){
        if($(".response-content message-content[READED!=TRUE]").length === 0){
            console.log("pas de nouveau message");
            setTimeout(function(thisfunction, ...args){
                _onNewMessage(thisfunction, ...args);
            }, 2000, thisfunction, ...args);
            return;
        }
        console.log(" nouveau message");
        thisfunction(...args);
        setTimeout(function(thisfunction, ...args){
            thisfunction(...args);
        }, 2000, thisfunction, ...args);
    }, 3000, thisfunction, ...args);
}


function resetOnStart(){
    setTimeout(function(){
        $(".response-content message-content[READED!=TRUE]").each(function(){
            $(this).attr("READED", "TRUE");
        });
    }, 15000);
}



var p = new TGemini();
var ttim = new Timingg(22000);
var url = window.location.href;
console.log(url);

if(url.startsWith("https://gemini.google.com/app")){
    
    console.log("url Passed");

    loadScript2("https://192.168.1.77:13443/socket.io.js", function (){

        socket = io("https://192.168.1.77:13443");

        socket.on('emitto', (from, to, action, varname, value) => {
            p.gemini_process(from, to, action, varname, value);
        });

        socket.on('emitall', (from, to, action, varname, value) => {
            p.gemini_process(from, to, action, varname, value);
        });
        
        socket.on('connect', function() {
            console.log('Connected to server!');
        });

        /*
        socket.on('question', function(from, to, msg){
            console.log(from, to, msg);
            if(to == "gemini"){
                ttim.start_or_queue(function(msg){

                    console.log(msg);
                    askToGemini(msg);
                    setTimeout(function(){
                        var txt = "";
                        $(".response-content message-content[READED!=TRUE]").each(function(){
                            $(this).attr("READED", "TRUE");
                            txt = txt + "" + $(this).text();
                            return;
                        });
                        try{
                            //txt = protectForFrance24(txt);
                            console.log(txt);
                            socket.emit('question', "gemini", from, txt);
                        }catch(e){
                            console.log("Erreur");
                            console.log(e);
                        }
                    }, 18000);
                },msg);
            }
        });
        */

        //socket.emit('question', "gemini", "all", "Hello");
        resetOnStart();
    });
}





function askToGemini(speak){
    console.log("Ask to gemini ["+speak+"]");
    //speak = "Bard, répond le plus court possible. "+speak;
    $(".ql-editor").text("").focus();
    setTimeout(function(){document.execCommand("insertText", true, speak);}, 1000);
    setTimeout(function(){$(".send-button").click();}, 2000);
}



//$(document).ready(function(){

//});

var geminiLimitReponses = 5;
function protectForFrance24(txt){
    txt = txt
    .removeSpecialChars();
    txt = txt
    .replaceiAll("\n","")
    .replaceiAll("\r","")
    .replaceiAll("direct", "Dir°ect")
    .replaceiAll("Gaza", "xGazXa")
    .replaceiAll("cac 40", "CAC40")
    .replaceiAll("Éliminer", "xÉlimiXner")
    .replaceiAll("éliminer", "xÉlimiXner")
    .replaceiAll("URL non valide supprimée", "")
    .replaceiAll("netfrancais-definitionnon+valide", "")
    .replaceiAll("dictionnaire reverso", "")
    .replaceiAll("https", "")
    .replaceiAll("www", "")
    .replaceiAll("cerveau", "cXrveau")
    .replaceiAll("ne sont pas tous des hommes", "ne sonXt pas tous des homXmes")
    .replaceiAll("ne sont pas des hommes", "ne sonXt pas des homXmes")
    .replaceiAll("la Shoah", "laShoXah")
    .replaceiAll("les nazis", "lesNaXzis")
    .replaceiAll("amsterdam", "xAmsterdam")
    .replaceiAll("pauvr", "xPauxvr")
    .replaceiAll("esclav", "eXlav")
    .replaceiAll("dieu", "xDieu")
    .replaceiAll("brossez-vous", "BrossezVs")
    .replaceiAll("jupiter", "xJupixter")
    .replaceiAll("saturne", "xSatxrne")
    .replaceiAll("uranus", "xUranus")
    .replaceiAll("soufre", "xSoufre")
    .replaceiAll("allemand", "xAllexmand")
    .replaceiAll("israël", "XsraXl")
    .replaceiAll("tirer", "xTi°rer")
    .replaceiAll("hadith", "xHad°ith")
    .replaceiAll("faux", "Fau°x")
    .replaceiAll("facho", "Fac°ho")
    .replaceiAll("antisemit", "antim°smit")
    .replaceiAll("antipsychotique", "An°tiPxsychotique")
    .replaceiAll("secondaire", "Second°aire")
    .replaceiAll("récolte", "ré°colte")
    .replaceiAll("pêché", "Pê°ché")
    .replaceiAll("pécheurs", "Peche°urs")
    .replaceiAll("Psaume", "Psau°me")
    .replaceiAll("troll", "Tro°ll")
    .replaceiAll("éternel", "Ete°rnel")
    .replaceiAll("berger", "Ber°ger")
    .replaceiAll("con", "c°on")
    .replaceiAll("11 septembre", "11 sep")
    .replaceiAll("musulman", "mXsXlman")
    .replaceiAll("propagande", "xProgagaXnde")
    .replaceiAll("Jésus", "Jes°us")
    .replaceiAll("Christ", "Chr°ist")
    .replaceiAll("crucifixion", "xCru-ciXfixion")
    .replaceiAll("chrétien", "xChrtiens")
    .replaceiAll("christianisme", "xchrXistiXanisXmXe")
    .replaceiAll("islamiste", "xislaxmxiste")
    .replaceiAll("apprendre", "app°rendre")
    .replaceiAll("menace", "men°ace")
    .replaceiAll("terroriste", "xtirrorXste")   
    .replaceiAll("plan", "XplaXn")   
    .replaceiAll("toilet", "toXlet")   
    .replaceiAll("corruption", "CoXXuption")   
    .replaceiAll("juif", "xxif")   
    .replaceiAll("nazi", "nzi")   
    //.replaceiAll("=", " = ")
    //.replaceAll("  ", " ")
    //.replaceAll("  ", " ")
    .trim();
    txt = txt.split("Nombre de caractères")[0];
    txt = txt.sentences(180);
    txt = txt.slice(0, geminiLimitReponses);
    console.log(txt);
    if(txt.length === 0){
        console.log("Warning: Aucun message à envoyer");
        return [];
    }
    if(txt[txt.length-1].length < 199){
        txt[txt.length-1] += ".";
        
    }else{
        txt[txt.length-1][198] = ".";
    }
    console.log("STEP 7");
    return txt;
}


function loadScript(url, onloaded){
    console.log("load ... "+url);
    setTimeout(function(){
        var isJsonResponse = false;
        ajax.send(url, isJsonResponse, function(rep){
            console.log("loaded ... "+url);
            eval(rep);
            onloaded(rep);
        });
    }, 5000);
}


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



/*
class Timing {
    constructor(duration) {
      this.duration = duration;
      this.queue = []; // File d'attente des fonctions à exécuter
      this.running = false; // Indicateur pour savoir si une exécution est en cours
    }
  
    queue_or_start(callback) {
      // Ajouter la fonction à la file d'attente
      this.queue.push(callback);
  
      // Si aucune exécution en cours, démarrer le timer
      if (!this.running) {
        this.execute_next();
      }
    }
  
    execute_next() {
      // Si la file d'attente n'est pas vide
      if (this.queue.length > 0) {
        const callback = this.queue.shift(); // Récupérer la première fonction de la file d'attente
  
        // Exécuter la fonction après le délai
        setTimeout(() => {
          this.running = true; // Marquer l'exécution en cours
          callback(); // Appeler la fonction
          this.running = false; // Marquer l'exécution terminée
  
          // Exécuter la prochaine fonction dans la file d'attente
          this.execute_next();
        }, this.duration);
      }
    }
  }
*/


/*
Use case:
    // Exemple d'utilisation
    const duration = 10000;
    const questions = new Timing(duration);

    // Utilisation de la méthode queue_or_start_message avec une fonction anonyme
    questions.queue_or_start_message('Message 1', (msg) => {
        console.log('Première fonction :', msg);
    });

    questions.queue_or_start_message('Message 2', (msg) => {
        console.log('Deuxième fonction :', msg);
    });

    questions.queue_or_start_message('Message 3', (msg) => {
        console.log('Troisième fonction :', msg);
    });

    // Appel de la méthode queue_or_start avec des fonctions anonymes
    t.queue_or_start(() => {
    console.log('Première fonction');
    });

    t.queue_or_start(() => {
    console.log('Deuxième fonction');
    });

    t.queue_or_start(() => {
    console.log('Troisième fonction');
    });
*/



/*

var geminiAsk = [];
var geminiReponses = [];
var geminiLimitReponses = 5;
var geminiCoupeLaParole = false;
var isParoleCoupee = false;


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
   
        
    });
    console.log("écoute de l'évenement on_youtube_message");


    socket.on('on_gemini_connect', function(msg, channel){
    	msg = atob(msg);
    	console.log(msg, channel);
    	try{
    		msg = JSON.parse(msg);
    		console.log(msg, channel);
    	}catch(e){console.log("error can't JSON parse: "+msg);}
    	
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
    });

    socket.on('on_start', function(msg){
        console.log("serverclient_id = "+msg);
        internalclients = [];
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
    });
}


function speakVoice(message){
    socket.emit('sendtovoice', message, "voice sender");
}

var intervall_askToGemini;
function timerAskToGemini(){
	
    if(intervall_askToGemini === undefined){
        console.log("timerAskToGemini START");
        pipeMessgeToGemini();
        intervall_askToGemini = setInterval(pipeMessgeToGemini, 22000);
    }else{
        console.log("timerAskToGemini CANCELED");
    }
}

//
function pipeMessgeToGemini(){
	console.log("pipeMessgeToGemini TICK");
    var message = geminiAsk.readPipe();
    if(geminiAsk.length === 0){
        clearInterval(intervall_askToGemini);
        intervall_askToGemini = undefined;
        console.log("pipemessage DONE");
    }
    if(message === ""){console.log("geminiAsk EMPTY");return;}
    askToGemini(message);
    timerReponseGeminiToYoutube();
}



var intervall_id;
function timerReponseGeminiToYoutube(){
    console.log("timerReponseGeminiToYoutube START");
    setTimeout(function(){
        var txt = "";
        $(".response-content message-content[READED!=TRUE]").each(function(){
            $(this).attr("READED", "TRUE");
            txt = txt + "" + $(this).text();
            return;
        });
        try{
            txt = txt
                .removeSpecialChars()
                .replaceiAll("\n","")
                .replaceiAll("\r","")
                .replaceiAll("direct", "xDirect")
                .replaceiAll("gaza", "xGaza")
                .replaceiAll("cac 40", "CAC40")
                .replaceiAll("Éliminer", "xÉliminer")
                .replaceiAll("éliminer", "xÉliminer")
                .replaceiAll("URL non valide supprimée", "")
                .replaceiAll("netfrancais-definitionnon+valide", "")
                .replaceiAll("dictionnaire reverso", "")
                .replaceiAll("https", "")
                .replaceiAll("www", "")
                .replaceiAll("cerveau", "cXrveau")
                .replaceiAll("ne sont pas tous des hommes", "ne sonXt pas tous des homXmes")
                .replaceiAll("ne sont pas des hommes", "ne sonXt pas des homXmes")
                .replaceiAll("la Shoah", "laShoXah")
                .replaceiAll("les nazis", "lesNaXzis")
                .replaceiAll("amsterdam", "xAmsterdam")
                .replaceiAll("pauvr", "xPauxvr")
                .replaceiAll("esclav", "eXlav")
                .replaceiAll("dieu", "xDieu")
                .replaceiAll("brossez-vous", "BrossezVs")
                .replaceiAll("jupiter", "xJupiter")
                .replaceiAll("saturne", "xSaturne")
                .replaceiAll("uranus", "xUranus")
                .replaceiAll("soufre", "xSoufre")
                .replaceiAll("allemand", "xAllemand")
                .replaceiAll("isra", "xisra")
                .replaceiAll("tirer", "xTirer")
                .replaceiAll("hadith", "xHadith")
                .replaceiAll("faux", "xFaux")
                .replaceiAll("facho", "xFacho")
                .replaceiAll("antisemit", "antimsmit")
                .replaceiAll("antipsychotique", "xAntiPxsychotique")
                .replaceiAll("secondaire", "xSecondaire")
                .replaceiAll("récolte", "réXcolte")
                .replaceiAll("pêché", "xPêché")
                .replaceiAll("pécheurs", "xPecheurs")
                .replaceiAll("Psaume", "xPsaume")
                .replaceiAll("troll", "xTroll")
                .replaceiAll("éternel", "xEternel")
                .replaceiAll("berger", "xBerger")
                .replaceiAll("=", " = ")
                .replaceAll("  ", " ")
                .replaceAll("  ", " ")
                .trim();
            txt = txt.split("Nombre de caractères")[0];
            txt = txt.sentences(199);
            txt = txt.slice(0, geminiLimitReponses);
            
            if(txt[txt.length-1].length < 199){
                txt[txt.length-1] += ".";
                
            }else{
                txt[txt.length-1][198] = ".";
            }
            geminiReponses = geminiReponses.concat(txt);
            console.log(geminiReponses);
            console.log("timerReponseGeminiToYoutube DONE");
            if(intervall_id === undefined){
                console.log("sendReponseToYoutube START");
                sendReponseToYoutube();
                if(internalclients.length == 0){
                    console.log("Error internalclients.length == 0");
                    intervall_id = setInterval(sendReponseToYoutube, 92000);  
                }else{
                    intervall_id = setInterval(sendReponseToYoutube, 92000 / internalclients.length);            	
                }
    
                //intervall_id = setInterval(sendReponseToYoutube, 22000);
                //intervall_id = setInterval(sendReponseToYoutube, 120000);
            }
        }catch(e){
            console.log("Erreur");
            console.log(e);
        }

    }, 17000);
}

var currendIndexSending_internalclients = 0;

function sendReponseToYoutube(){
	console.log("sendReponseToYoutube TICK");
    var message = geminiReponses.readPipe();
    if(message.length === 0){
        clearInterval(intervall_id);
        intervall_id = undefined;
        console.log("sendReponseToYoutube DONE");
    }
    if(message === ""){console.log("geminiReponses EMPTY");return;}
    console.log("on_gemini_message = "+message);
    socket.emit('on_gemini_message', message, "channel_"+currendIndexSending_internalclients);
    currendIndexSending_internalclients++;
    if(currendIndexSending_internalclients > internalclients.length -1 ){currendIndexSending_internalclients = 0;}
}



function askToGemini(speak){
    console.log("Ask to gemini ["+speak+"]");
    speak = "Bard, répond le plus court possible. "+speak;
    $(".ql-editor").text("").focus();
    setTimeout(function(){document.execCommand("insertText", true, speak);}, 100);
    setTimeout(function(){$(".send-button").click();}, 200);
}




var ajax = {
    url:"?",
    type: 'POST',
    send:function(data, isJsonResponse, ondone){
        //data.action = 'sqlexplorer';
        $.ajax({
            type: this.type,
            url: this.url,
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
    
    sendWait:function(data, isJsonResponse, ondone){
        //data.action = 'sqlexplorer';
        $.ajax({
            type: 'POST',
            url: this.url,
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

*/

// ===================================
// ===================================
// On rajoute au Type String
// ===================================

String.prototype.removeSpecialChars = function(defaultVal = "") {
    return this.replace(/[^\w\s,%.'áéíóúàèìòùäëïöüâêîôû=+\-_\n\r€œ()ç:]/gi, defaultVal);
};

// Enlève tous les caractères non alphanumériques
String.prototype.removeNonAlphanumeric = function(defaultVal = "") {
    return this.replace(/[^a-zA-Z0-9]/g, defaultVal);
};

//Remplace les accents par le lettre primitive (éèêë deviennent e)
String.prototype.removeAccents = function() {
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Contains (insensible case), prend en paramètre le type String ou Array
String.prototype.contains = function(mot) {
    if (typeof mot === "string") {
        // Si le mot est une chaîne, utilisez la recherche normale
        const regex = new RegExp(mot.removeAccents(), "i");
        return regex.test(this.removeAccents());
    } else if (Array.isArray(mot)) {
        // Si le mot est un tableau, testez chaque élément
        for (let i = 0; i < mot.length; i++) {
            const regex = new RegExp(mot[i].removeAccents(), "i");
            if (regex.test(this.removeAccents())) {
                return true; // Si l'un des mots est trouvé, retournez true
            }
        }
        return false; // Aucun mot trouvé dans le tableau
    } else {
        // Si le type n'est ni une chaîne ni un tableau, retournez false
        return false;
    }
};


String.prototype.containsWord = function(mot) {
    const words = this.split(" "); // Découper la chaîne en mots
    const motSansAccents = mot.removeAccents();
    
    for (let i = 0; i < words.length; i++) {
        const wordSansAccents = words[i].removeAccents();
        const regex = new RegExp("^" + motSansAccents + "$", "i");
        if (regex.test(wordSansAccents)) {
            return true; // Si le mot est trouvé, retourner true
        }
    }
    
    return false; // Aucun mot trouvé dans la chaîne
};


String.prototype.containsWordReplace = function(mot, replacement) {
    const words = this.split(" "); // Découper la chaîne en mots
    const motSansAccents = mot.removeAccents();
    
    for (let i = 0; i < words.length; i++) {
        const wordSansAccents = words[i].removeAccents();
        const regex = new RegExp("^" + motSansAccents + "$", "i");
        if (regex.test(wordSansAccents)) {
            words[i] = replacement; // Remplacer le mot trouvé par le mot de remplacement
        }
    }
    
    return words.join(" "); // Rejoindre les mots pour former une nouvelle chaîne
};


// Remplace par (insensible à la case)
String.prototype.replacei = function(ancienneChaine, nouvelleChaine) {
    const regex = new RegExp(ancienneChaine, "i"); // "i" pour ignorer la casse
    return this.replace(regex, nouvelleChaine);
};

// Remplace tout par (insensible à la case)
String.prototype.replaceiAll = function(ancienneChaine, nouvelleChaine) {
    console.log("replaceiAll("+ancienneChaine+", "+nouvelleChaine+")");
    let modifiedString = this;
    while (modifiedString.includes(ancienneChaine)) {
        modifiedString = modifiedString.replace(new RegExp(ancienneChaine, "i"), nouvelleChaine);
    }
    return modifiedString;
};

String.prototype.crc32 = function() {
    const crcTable = [];
    const poly = 0xEDB88320; // Polynomial used in CRC32

    for (let i = 0; i < 256; i++) {
        let crc = i;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 1) ? (crc >>> 1) ^ poly : crc >>> 1;
        }
        crcTable[i] = crc >>> 0;
    }

    let crc = 0xFFFFFFFF;

    for (let i = 0; i < this.length; i++) {
        const byte = this.charCodeAt(i) & 0xFF; // Assurez-vous que le byte est dans la plage 0-255
        crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xFF];
    }

    crc = crc ^ 0xFFFFFFFF; // XOR avec 0xFFFFFFFF
    const formattedCRC32 = (crc >>> 0).toString(16).toUpperCase(); // Utilisez l'opérateur non signé pour obtenir la valeur non signée

    return formattedCRC32;
};

// découpe un chapitre en phrases en fonction des points dans la taille maximale spécifié
String.prototype.sentences = function(maxChars) {
    const sentencesArray = [];
    let currentSentence = '';

    const sentences = this.split('.'); // Divise le texte en phrases en utilisant le point comme délimiteur

    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();

        if (trimmedSentence !== '') {
            if ((currentSentence + ' ' + trimmedSentence).length <= maxChars) {
                currentSentence += (currentSentence === '' ? '' : ' ') + trimmedSentence;
            } else {
                sentencesArray.push(currentSentence.trim());
                currentSentence = trimmedSentence;
            }
        }
    }

    if (currentSentence !== '') {
        sentencesArray.push(currentSentence.trim());
    }

    return sentencesArray;
};



// une fonction javascript qui va prendre un texte string en entrée qui sera découpé dans un tableau par la taille de caractères max, 
// sans y découper les mots. 
// Donc on autorise à couper sur les espaces et autres caractères non alphanumérique.   
// Cette fonction ne doit pas découper avec un caractère non alphanumérique ou accentué au début de chaîne.
String.prototype.toArrayMax = function (tailleMax) {
    // Définir une expression régulière pour les caractères non valides
    const nonValidCharRegex = /[^a-zA-Z0-9À-ÿ]/;
  
    // Définir une expression régulière pour les espaces
    const spaceRegex = /\s+/;
  
    // Découper le texte en segments en fonction des caractères non valides et des espaces
    const segments = this.split(nonValidCharRegex).join(" ").split(spaceRegex);
  
    // Initialiser le tableau de résultats
    const resultats = [];
    let ligneActuelle = "";
    let dernierSegment = "";
  
    // Itérer sur les segments
    for (const segment of segments) {
      // Si le segment est vide, on le remplace par le dernier segment
      if (!segment) {
        segment = dernierSegment;
      }
  
      // Si le segment ajouté à la ligne actuelle dépasse la taille maximale
      if (ligneActuelle.length + segment.length + 1 > tailleMax) {
        // Si la ligne actuelle n'est pas vide et ne commence pas par un caractère non valide
        if (ligneActuelle && !nonValidCharRegex.test(ligneActuelle[0])) {
          // Ajouter la ligne actuelle au tableau de résultats
          resultats.push(ligneActuelle);
        }
        // Définir une nouvelle ligne
        ligneActuelle = segment;
      } else {
        // Ajouter le segment à la ligne actuelle
        ligneActuelle += (ligneActuelle ? " " : "") + segment;
      }
  
      // Stocker le dernier segment
      dernierSegment = segment;
    }
  
    // Si la ligne actuelle n'est pas vide et ne commence pas par un caractère non valide
    if (ligneActuelle && !nonValidCharRegex.test(ligneActuelle[0])) {
      // Ajouter la ligne actuelle au tableau de résultats
      resultats.push(ligneActuelle);
    }
  
    return resultats;
  };
  
  /* 
    // Exemples d'utilisation
    const texte = "Ceci est un test. . . Bonjour";
    
    console.log(texte.toArrayMax(20));
    // Affiche:
    // ["Ceci est un test.", "Bonjour"]
  */

// On rajoute au Type Array
// ===================================
/*
// Retourne le premier élément d'un tableau et l'efface du tableau
Array.prototype.readPipe = function(defaultReturn = "") {
    const element = this.splice(0, 1)[0];
    this.map((element, index) => ({ element, index }));
    if(element === undefined){return defaultReturn;}
    return element;
};
*/
/* 
  // Example usage
  const tableau = ["a", "b", "c", "d", "e"];
  
  tableau.readPipe(); // Affiche "a"
  console.log(tableau); // Affiche ["b", "c", "d", "e"]
  tableau.readPipe(); // Affiche "b"
  console.log(tableau); // Affiche ["c", "d", "e"]
*/

// ===================================


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



/*
// CODE POUR EXTENSION NAVIGATEUR
var url = "https://192.168.1.77:13443/jquery-3.7.1.min.js";
var scr = document.createElement("script");
scr.src = url;
document.body.appendChild(scr);

setTimeout(function(){
	var url = window.location.href;
	if(url.startsWith("https://gemini.google.com/app")){
		var srcurl = "https://192.168.1.77:13443/gemini/gemini_to_youtube.js";
        loadScript2(srcurl, function(){console.log("Loaded "+srcurl)});
	}	
},2000);

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
            
            onloaded(rep);
        });
    }, 5000);
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


*/
