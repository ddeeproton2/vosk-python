
class TProcessio{
 
    constructor(){
        this.utilisateurs = [];
        this.myuserid = 0;
    }
    _displayUser(i){
        if(this.utilisateurs[i].statut === undefined){
            console.log("WARNING user mal formed at index "+i);
        }
        var display = this.utilisateurs[i].statut+" "+this.utilisateurs[i].type+" "+this.utilisateurs[i].id;
        //console.log(display);
        $('#users').append($('<div>').text(display));
    }
    process(from, to, action, varname, value){
        if(from === "server" && action === "set" && varname === "clientid"){
            this.myuserid = value;
            $('#users').html("");
            for(var i in this.utilisateurs){
                if(this.myuserid === this.utilisateurs[i].id){
                    //this.utilisateurs[i].type = 'me'; // on peut plus savoir qui est le master youtube après
                }
                this._displayUser(i);
            }
        }
        if(action === "set" && varname === "clienttype"){
            $('#users').html("");
            for(var i in this.utilisateurs){
                if(from === this.utilisateurs[i].id){
                    //if(this.myuserid !== this.utilisateurs[i].id){
                    if(value !== undefined){
                        this.utilisateurs[i].type = value;
                    }
                    //}
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
            //console.log(this.utilisateurs);
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
                    /*
                    console.log("newuser");
                    console.log({
                        statut:'newuser',
                        type: 'unknown',
                        id: users[i]
                    });
                    */
                }
            }
            for(var i in this.utilisateurs){
                if(users.indexOf(this.utilisateurs[i].id) === -1){
                    this.utilisateurs.splice(i, 1); 
                }
            }

            for(let j in this.utilisateurs){
                console.log("j",j);
                this._displayUser(j);
            }
            console.log(this.utilisateurs);
            setTimeout(function(){
                socket.emit('emitall', "", "", "set", "clienttype", "youtube_chat"); 
            },500);
        }

    }

}


class TYoutubeChat extends TProcessio{
    constructor() {
        super();
        this.isRunning = false;
    }
    youtube_chat_process(from, to, action, varname, value){
        super.process(from, to, action, varname, value);
        // GEMINI
        if(action === "gemini_to_youtube"  && varname === "reponse"){
            var msg = value;
            if(this.isRunning){
                console.log("Erreur, message trop rapide");

            }else{
           
                this.isRunning = true;
                socket.emit('emitall', "", "", "set", "clientstatut", "working"); 
                sendMessage(msg);
                setTimeout(function(base){
                    socket.emit('emitall', "", "", "set", "clientstatut", "connected"); 
                    base.isRunning = false;
                },92000, this);
            }
        }

        if(action === "set" && varname === "clientstatut"){

            sendPipeMessages(); // S'il est le master, il tente d'envoyer le message à Gemini

            /*
            // 
            for(var i in this.utilisateurs){
                if(users.indexOf(this.utilisateurs[i].id) === -1){
                    this.utilisateurs.splice(i, 1); 
                }
            }
            */

        }

        if(action === "get" && varname === "clientstatut"){
            setTimeout(function(base){
                if(base.isRunning){
                    socket.emit('emitall', "", "", "set", "clientstatut", "working"); 
                }else{
                    socket.emit('emitall', "", "", "set", "clientstatut", "connected"); 
                }
            },500, this);
        }

    }

}



/*
// CODE POUR NAVIGATEUR

$(document).ready(function(){
	var url = window.location.href;
	if(url.startsWith("https://www.youtube.com/live_chat")){
		var srcurl = "https://192.168.1.77:13443/gemini/youtube_to_gemini.js";
        loadScript2(srcurl, function(){console.log("Loaded "+srcurl)});
	}
});


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


var users = [];
var messages = [];
var totalMessages = 0;

//$(document).ready(function(){
	var url = window.location.href;
	if(url.startsWith("https://www.youtube.com/live_chat")){
        loadScript("https://192.168.1.77:13443/socket.io.js", createConnexionServer);
        setTimeout(function(){
            $("yt-live-chat-text-message-renderer[readed!=true]").each(function(i){
                $(this).attr("readed","true");
            });
        },5000);
	}
//});


function sendMessage(message){
    message = message
    .removeSpecialChars()
    .trim()
    .substring(0, 199);
    console.log(message);
    if(message == ""){ console.log("Message vide Annulation");return; }
    $("yt-live-chat-message-input-renderer #input").focus();
    setTimeout(function(){document.execCommand("selectAll");}, 1000);
    setTimeout(function(){document.execCommand("selectAll");document.execCommand("insertText", true, message);}, 2000);
    setTimeout(function(){$("#send-button button").click();}, 3000);
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


var intervall_sendPipeMessagesToChat;
var messageToChat = [];

function sendPipeMessagesToChat(){
	var msgToChat = messageToChat.shift();
    console.log(msgToChat);
    if(messageToChat.length === 0){
        clearInterval(intervall_sendPipeMessagesToChat);
        intervall_sendPipeMessagesToChat = undefined;
    }
    sendMessage(msgToChat);
    if(messageToChat.length !== 0){
        if(intervall_sendPipeMessagesToChat === undefined){
        	intervall_sendPipeMessagesToChat = setInterval(sendPipeMessagesToChat, 22000);
        }
    }
}

var socket;

var client_id, internalclients_id;


var p = new TYoutubeChat();
function createConnexionServer(){
    console.log("connexion serveur nodejs");
    //window.location.protocol+'//'+window.location.hostname+':'+window.location.port
    //var portsckio = window.location.protocol === "https" ? 13443 : 13080;
    //var serversckio = window.location.protocol+'//'+window.location.hostname+':'+portsckio;
    socket = io("https://192.168.1.77:13443"); // Remplacez l'URL par l'adresse de votre serveur

    socket.on('emitto', (from, to, action, varname, value) => {
        p.youtube_chat_process(from, to, action, varname, value);
    });
    socket.on('emitall', (from, to, action, varname, value) => {
        p.youtube_chat_process(from, to, action, varname, value);
    });


    socket.on('on_gemini_message', function(msg, channel){
    	if( channel == "channel_"+internalclients_id){
	        console.log(msg);
	        messageToChat.push(msg);
	        //sendMessage(msg);
	        sendPipeMessagesToChat();
		}
    });

	var d = new Date();
	client_id = d.getTime();
	

    socket.on('on_gemini_connect', function(msg, channel){
        msg = atob(msg);
        console.log(msg, channel);
    	try{
    		msg = JSON.parse(msg);
    		console.log(msg, channel);
    	}catch(e){console.log("error can't JSON parse: "+msg);}
    	
    	if(msg.message == "I am a server"){
    		var data = {
    			"message":"I am a client", 
    			client_id:client_id
    		};
    		console.log(data);
    		socket.emit('on_gemini_connect', btoa(JSON.stringify(data)), "channel_general");
    	}
    	if(msg.message == "this is your id internalclients"){
            console.log("Recieving internalclients for client_id: "+  msg.client_id);
            if(parseInt(msg.client_id) == parseInt(client_id) && msg.internalclients_id !== ""){
                internalclients_id = msg.internalclients_id;
                console.log("I recieve internalclients_id = "+internalclients_id);
                //socket.emit('leave', "channel_general");
                socket.emit('join', "channel_"+internalclients_id);
                console.log("join channel_"+internalclients_id);
                
            }else{
                console.log("Not for me "+client_id);
            }
        }

    });


    socket.on('on_start', function(msg){
        console.log("serverclient_id = "+msg);
        setTimeout(function(){
            socket.emit('join', "channel_general");
            console.log("join channel_general");
        },5000);
        
        setTimeout(function(){
            var data = {
                "message":"I am a client", 
                client_id:client_id
            };
            console.log(data);
            socket.emit('on_gemini_connect', btoa(JSON.stringify(data)), "channel_general");
            speakVoice("Je connecte gemini sur le site "+window.location.hostname.replaceAll(".", " point "));
            console.log("ready");
            timerScanMessages();
        },10000);
    });


    timerScanMessages();
}

//https://192.168.1.222:13443/socket.io.js
function speakVoice(message){
    socket.emit('sendtovoice', message, "voice sender");
}


function timerScanMessages(){
	scanMessages();
	setTimeout(timerScanMessages, 1000);
}

function isMasterClient(){
    // Si ce n'est pas le master des clients youtube, alors on n'envoie pas les messages du tchat à gemini
    for(var i in p.utilisateurs){
        console.log("p.utilisateurs[i].type", p.utilisateurs[i].type);
        if(p.utilisateurs[i].type === "youtube_chat"){
            if(p.utilisateurs[i].id !== p.myuserid){
                console.log("Slave client ["+p.utilisateurs[i].id+"] != ["+p.myuserid+"]");
                return false;
            }else{
                console.log("I am Master");
                return true;
            }
        }
    }
}

var intervall_sendPipeMessages;
function sendPipeMessages(){
    // Si ce n'est pas le master des clients youtube, alors on n'envoie pas les messages du tchat à gemini
    if(!isMasterClient()){
        messages = [];
        return;
    }

    for(var i in p.utilisateurs){ // Cherche un Gemini dispo
        if(p.utilisateurs[i].type === "Gemini" && p.utilisateurs[i].statut === "connected"){

            console.log(messages);
            var message = messages.shift();
            console.log(message);
            if(message.length === undefined){
                clearInterval(intervall_sendPipeMessages);
                intervall_sendPipeMessages = undefined;
                console.log("sendPipeMessages DONE");
                return;
            }
            if(message === ""){console.log("messages for Gemini EMPTY");return;}
            // emit
            var msg = message.trim();
            console.log("Message to Gemini");
            console.log("on_youtube_message = "+msg);
            socket.emit('emitto', "", p.utilisateurs[i].id, "youtube_to_gemini", "question", msg); 
            break;
        }
    }
}

function scanMessages(){
	var count_messages = $("yt-live-chat-text-message-renderer").length;
	if(count_messages > 10){
		for(var i = 0; i < count_messages - 10; i++){
			$("yt-live-chat-text-message-renderer:eq("+i+")").remove();
		}
	}
	$("yt-live-chat-text-message-renderer[readed!=true]").each(function(i){
		$(this).attr("readed","true");
        totalMessages++;
		var username = $("#author-name", this).text();
		var message = $("#message",this).text();
		var html = $("#message",this).html();
		var img = $(".style-scope.yt-img-shadow", this).attr("src");
        var userid = btoa(img).replaceiAll("=","");
        var crc32 = userid.crc32();
        var usernameid = username.replaceiAll(" ","").removeAccents().removeNonAlphanumeric().toLowerCase().substring(0,4)+crc32.substring(0,4).toLowerCase();
        var isGemini = message.removeNonAlphanumeric(' ').containsWord("gg");
        var isNewuser = users[usernameid] === undefined;
        var isAdmin = username === "⦓Φ⦔";
        message = message.replaceiAll("≈"," égale environ ").containsWordReplace("gg","Bard");
        if(isNewuser){
            users[usernameid] = {
                usernameid:usernameid,
                username: username,
                isAdmin: isGemini,
                isAllowedToGemini: isGemini,
                isNewuser: isNewuser
            };
            console.log("New user");
            console.log(users[usernameid]);
        }
        $("#author-name", this).append(' - <span style="color:#333!important;font-size:8px!important;">'+usernameid+'</span><br>');

        if(username.toLowerCase() !== "gg" && isGemini){
        	var secondary_username = username;
        	if(username == "⦓Φ⦔"){ secondary_username = "Dark";}
        	var msg = " C'est l'utilisateur nommé "+
        	secondary_username 
        	+", qui t'écrit ceci, " + message;
            messages.push(msg);
        }
	});
    if(messages.length > 0){
        sendPipeMessages();
        if(intervall_sendPipeMessages === undefined){
            intervall_sendPipeMessages = setInterval(sendPipeMessages, 10000);
        }
    }
}



function readGeminiResponse(){
    var data = {
        file:'gemini_to_youtube.json',
        readpipe:'true'
    };
    var isJsonResponse = false;
    var ondone = function(json){
        if (typeof json === "string") {
            json = json.removeSpecialChars();
            if(json !== ""){
                console.log(json);
                sendMessage(json)
            }
            setTimeout(readGeminiResponse, 25000);
        }else{
            setTimeout(readGeminiResponse, 1000);
        }
        
    };
    ajax.url = "https://127.0.0.1/web/htdocs/JSON/jsondatabase.php";
    ajax.send(data, isJsonResponse, ondone);
}









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
Array.prototype.readPipe = function() {
    const element = this.splice(0, 1)[0];
    this.map((element, index) => ({ element, index }));
    if(element === undefined){return "";}
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