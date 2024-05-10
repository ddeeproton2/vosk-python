




$(document).ready(function(){
	var url = window.location.href;
	if(url.startsWith("https://gemini.google.com/app")){
        loadScript("https://192.168.1.77:13443/socket.io.js", createConnexionServer);
        resetOnStart();
	}
});


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

var geminiAsk = [];
var socket;

function createConnexionServer(){

    console.log("connexion au serveur nodejs...");
    //window.location.protocol+'//'+window.location.hostname+':'+window.location.port
    //var portsckio = window.location.protocol === "https" ? 13443 : 13080;
    //var serversckio = window.location.protocol+'//'+window.location.hostname+':'+portsckio;
    socket = io("https://192.168.1.77:13443"); // Remplacez l'URL par l'adresse de votre serveur
    console.log("connecté au serveur nodejs!");
    socket.on('on_youtube_message', function(msg, channel){

        geminiAsk.push(msg);
        console.log(geminiAsk);
        timerAskToGemini();
   
        
    });
    console.log("écoute de l'évenement on_youtube_message");

    setTimeout(function(){
	    socket.emit('join', "channel1");
	    console.log("join channel1");
    },5000);
    
    setTimeout(function(){
        speakVoice("Je connecte youtube sur le site "+window.location.hostname.replaceAll(".", " point "));
        console.log("ready");
    },10000);
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
    var message = geminiAsk.readPipe();
    if(message.length === 0){
        clearInterval(intervall_askToGemini);
        intervall_askToGemini = undefined;
        console.log("pipemessage DONE");
    }
    if(message === ""){console.log("geminiAsk EMPTY");return;}
    askToGemini(message);
    timerReponseGeminiToYoutube();
}


var geminiReponses = [];
var intervall_id;
var geminiLimitReponses = 1;
function timerReponseGeminiToYoutube(){
    console.log("timerReponseGeminiToYoutube START");
    setTimeout(function(){
        var txt = "";
        $(".response-content message-content[READED!=TRUE]").each(function(){
            $(this).attr("READED", "TRUE");
            txt = txt + "" + $(this).text();
            return;
        });
        txt = txt.removeSpecialChars().replaceiAll("\n","").replaceiAll("\r","");
        txt = txt.sentences(200);
        txt = txt.slice(0, geminiLimitReponses);
        geminiReponses = geminiReponses.concat(txt);
        console.log(geminiReponses);
        console.log("timerReponseGeminiToYoutube DONE");
        if(intervall_id === undefined){
            console.log("sendReponseToYoutube START");
            sendReponseToYoutube();
            intervall_id = setInterval(sendReponseToYoutube, 92000);
            //intervall_id = setInterval(sendReponseToYoutube, 22000);
            //intervall_id = setInterval(sendReponseToYoutube, 120000);
        }
    }, 12000);
}


function sendReponseToYoutube(){
    var message = geminiReponses.readPipe();
    if(message.length === 0){
        clearInterval(intervall_id);
        intervall_id = undefined;
        console.log("sendReponseToYoutube DONE");
    }
    if(message === ""){console.log("geminiReponses EMPTY");return;}
    console.log("sendReponseToYoutube ["+message+"]");
    socket.emit('on_gemini_message', message, "channel1");
}

function resetOnStart(){
    setTimeout(function(){
        $(".response-content message-content[READED!=TRUE]").each(function(){
            $(this).attr("READED", "TRUE");

        });
    }, 15000);
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
