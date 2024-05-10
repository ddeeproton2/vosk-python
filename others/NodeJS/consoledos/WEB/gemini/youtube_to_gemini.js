
var users = [];
var messages = [];
var totalMessages = 0;

$(document).ready(function(){
	var url = window.location.href;
	if(url.startsWith("https://www.youtube.com/live_chat")){
        loadScript("https://192.168.1.77:13443/socket.io.js", createConnexionServer);
        setTimeout(function(){
            $("yt-live-chat-text-message-renderer[readed!=true]").each(function(i){
                $(this).attr("readed","true");
            });
        },5000);
	}
});


function sendMessage(message){
    message = message
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
    .replaceiAll("la shoah", "laShoXah")
    .replaceiAll("les nazis", "lesNaXzis")
    .replaceiAll("amsterdam", "xAmsterdam")
    .removeSpecialChars()
    .trim()
    .substring(0, 199);
    console.log(message);
    if(message == ""){ console.log("Message vide Annulation");return; }
    $("yt-live-chat-message-input-renderer #input").focus();
    setTimeout(function(){document.execCommand("selectAll");}, 500);
    setTimeout(function(){document.execCommand("insertText", true, message);}, 1000);
    setTimeout(function(){$("#send-button button").click();}, 1400);
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


var socket;
function createConnexionServer(){
    console.log("connexion serveur nodejs");
    //window.location.protocol+'//'+window.location.hostname+':'+window.location.port
    //var portsckio = window.location.protocol === "https" ? 13443 : 13080;
    //var serversckio = window.location.protocol+'//'+window.location.hostname+':'+portsckio;
    socket = io("https://192.168.1.77:13443"); // Remplacez l'URL par l'adresse de votre serveur
    socket.on('on_gemini_message', function(msg, channel){
        console.log(msg);
        sendMessage(msg);
    });

    setTimeout(function(){
	    socket.emit('join', "channel1");
	    console.log("join channel1");
    },5000);
    
    setTimeout(function(){
        speakVoice("Je connecte gemini sur le site "+window.location.hostname.replaceAll(".", " point "));
        console.log("ready");
        timerScanMessages();
    },10000);
}

//https://192.168.1.222:13443/socket.io.js
function speakVoice(message){
    socket.emit('sendtovoice', message, "voice sender");
}


function timerScanMessages(){
	scanMessages();
	setTimeout(timerScanMessages, 1000);
}

var intervall_sendPipeMessages;
function sendPipeMessages(){
    console.log(messages);
    var message = messages.readPipe();
    console.log(message);
    if(message.length === 0){
        clearInterval(intervall_sendPipeMessages);
        intervall_sendPipeMessages = undefined;
        console.log("sendPipeMessages DONE");
    }
    if(message === ""){console.log("messages for Gemini EMPTY");return;}
    // emit
    var msg = message.trim().replaceiAll("gemini","")
    console.log("Message to Gemini");
    socket.emit('on_youtube_message', message, "channel1");
}


function scanMessages(){
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
        var isGemini = message.contains(["gemini"]);
        var isNewuser = users[usernameid] === undefined;
        var isAdmin = username === "⦓Φ⦔";
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

        if(username.toLowerCase() !== "gemini" && message.contains(["gemini"])){
            messages.push(message.replaceiAll("≈"," égale environ "));
        }
	});
    if(messages.length > 0){
        sendPipeMessages();
        if(intervall_sendPipeMessages === undefined){
            intervall_sendPipeMessages = setInterval(sendPipeMessages, 22000);
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

String.prototype.removeSpecialChars = function() {
    return this.replace(/[^\w\s,.'áéíóúàèìòùäëïöüâêîôû=+\-_\n\r€œ]/gi, '');
};

// Enlève tous les caractères non alphanumériques
String.prototype.removeNonAlphanumeric = function() {
    return this.replace(/[^a-zA-Z0-9]/g, "");
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

// Retourne le premier élément d'un tableau et l'efface du tableau
Array.prototype.readPipe = function() {
    const element = this.splice(0, 1)[0];
    this.map((element, index) => ({ element, index }));
    if(element === undefined){return "";}
    return element;
};

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