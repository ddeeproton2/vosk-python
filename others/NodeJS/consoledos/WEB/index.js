var speakOnBrowser = false;

function addScriptJavascript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    script.type = "text/javascript";
    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function addScriptModule(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    script.type = "module";
    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}


//addScriptJavascript("https://192.168.1.222:13443/socket.io.js");

var ajax = {
    type:'GET',
    send:function(url, data, isJsonResponse, ondone){
        $.ajax({
            type: ajax.type,
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
                    ondone(JSON.parse(res)); return;
                }catch(e){
                    ondone({error:true,errorMessage:"Json malformed response",res:res,e:e}); return;
                }
            },
            error: function(xhr, message, errorThrworn){
                console.log({url:url,data:data, error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
                setTimeout(function(){
                    ajax.send(url, data, isJsonResponse, ondone);
                }, 10000);
            }
        });
    }
};


function loadScript(url, onloaded){
    setTimeout(function(){
        var data = {};
        var isJsonResponse = false;
        ajax.send(url, data, isJsonResponse, function(rep){
            eval(rep);
            onloaded(rep);
        });
    }, 5000);
}



var socket;
loadScript("https://192.168.1.222:13443/socket.io.js", function(rep){


    //window.location.protocol+'//'+window.location.hostname+':'+window.location.port
    //var portsckio = window.location.protocol === "https" ? 13443 : 13080;
    //var serversckio = window.location.protocol+'//'+window.location.hostname+':'+portsckio;
    socket = io("https://192.168.1.222:13443"); // Remplacez l'URL par l'adresse de votre serveur
    socket.on('chat message', function(msg, channel){
        var json = JSON.parse(msg);
        console.log(json);
        onGetSpeak(json);
        /*
        const channels = $('#channels').val().split(',');
        channels.forEach(channel => {
            socket.emit('join', channel.trim());
        });
        channels.forEach(channel => {
            socket.emit('chat message', input.val(), channel.trim());
        });
        */
    });
    socket.emit('join', "speakvoice");
    console.log("join speakvoice");
    socket.emit('join', "sendtovoice");
    console.log("join sendtovoice");

    setTimeout(function(){
        $(".conversation-container[READED!=TRUE]").each(function(){
            $(this).attr("READED", "TRUE");
        });
        $(".tts-button[READED!=TRUE]").each(function(){
            $(this).attr("READED", "TRUE");
        });
        speakVoice("Je viens de charger le site "+window.location.hostname.replaceAll(".", " point "));
        console.log("ready");
    },10000);
});



var lastmessage = "";
function speakVoice(message){
	message = message
		.replaceAll("qu ", "qu'")
		.replaceAll(" ca ", " ça ")
		.replaceAll("honorable", "")
		.replaceAll("??", "?")
		.replaceAll("??", "?")
		.replaceAll("?", " (point d'interrogation). ");

    var isDouble = message === lastmessage;
    lastmessage = message;
    if(isDouble){return;}
    if(speakOnBrowser) {
        speakVoiceBrowser(message);
    }else{
        speakVoicePost(message);
    }
    return;

}

function speakVoicePost(message){
    socket.emit('sendtovoice', message, "voice sender");
    /*
    var url = "https://192.168.1.222:14443/spksay.py";
    ajax.type = 'POST';
	ajax.send(url, {'msg': encodeURIComponent (message)}, false, function(result){});
    */
}

function speakVoiceBrowser(message){
	const synth = window.speechSynthesis;
	const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.onend = function (event) {
		//console.log("Lecture stop");
    };
    utterThis.pitch = 1.8;
    utterThis.rate = 2;
    //utterThis.voice = 2;
    synth.speak(utterThis);
}

function getTime(){
    var d = new Date;
    return d.getTime();
}
var now = getTime();




function getFormsOnPage(){
    var form = [];
    $("form").each(function(){
        var input = [];
        $("input[type=text]", $(this)).each(function(){
            var placeholder = $(this).attr("placeholder");
            try{
                placeholder = placeholder.trim().toLowerCase().replaceAll("\t","").replaceAll("\n","")
            }catch(e){}
            var data = {
                name: $(this).attr("name"),
                id: $(this).attr("id"),
                class: $(this).attr("class"),
                title: placeholder
                //html: $(this).html()
            };
            input.push(data);
        });
        var submit = [];
        $("button[type=submit]", $(this)).each(function(){
            var data = {
                name: $(this).attr("name"),
                id: $(this).attr("id"),
                class: $(this).attr("class")
                //html: $(this).html()
            };
            submit.push(data);
        });
        form.push({input:input, submit:submit});
    });
    return form;
}


function checkLinksOnPage(speak){
    //getFormsOnPage();
    var bestScoreValue = 0;
    var bestTitle = "";
    var bestLink = "";
    var bestSpeak = "";
    var debug = false;

    for(var i in speak){


        $("a").each(function(){
            if($(this).text().trim() === ""){return;}
    
            var href = $(this).attr("href") || "";
    
            //if(doublons.indexOf(href) > -1){return;}
            //doublons.push(href);
    
            if(href.startsWith("/")){href = window.location.origin + href;}
            if(!href.startsWith(window.location.origin)){return;}
            if(href.startsWith("https://www.youtube.com/shorts/")){return;}
            
            var title = $(this).parent().parent().text().toLowerCase();
            if(title.indexOf("accueil") > -1){return;}
            title = title.replaceAll("en cours de lecture","");
            title = title.replaceAll("m de vues","");
            title = title.replaceAll("k de vues","");
            title = onlyletters(title);
            title = title.trim()
                .replaceAll("\t","")
                .replaceAll("\n","")
                .replaceAll("\r","")
                .trim();
            while(title.indexOf("  ") > -1){
                title = title.replaceAll("  "," ")
            }
            if(title === ""){return;}

            var currentScore = 0;
            var s = (speak[i] || "").split(" ");
            var l = title.split(" ");
            if(debug){ console.log({'s':s,'l':l}); }
            for(var ii in s){
                for(var jj in l){
                    var ss = s[ii].toLowerCase();
                    var ll = l[jj].toLowerCase();
                    var banned = ["le","la","les","de","des","du","un","une"];
                    var isbanned = banned.indexOf(ss) > -1 || banned.indexOf(ll) > -1;
                    if(!isbanned && ss === ll){
                        currentScore++;
                    }                    
                }
            }
            if(currentScore > bestScoreValue){
                bestScoreValue = currentScore;
                bestTitle = title; 
                bestLink = href;
                bestSpeak = speak[i];
            }
        });
    }
    if(bestScoreValue > 0){
        console.log([bestLink,bestScoreValue,bestSpeak,bestTitle]);
        if(!debug){
            window.location = bestLink;
        }
    }
}

function readLinksOnPage(){
    $("a").each(function(){
        if($(this).text().trim() === ""){return;}

        var href = $(this).attr("href") || "";

        //if(doublons.indexOf(href) > -1){return;}
        //doublons.push(href);

        if(href.startsWith("/")){href = window.location.origin + href;}
        if(!href.startsWith(window.location.origin)){return;}
        if(href.startsWith("https://www.youtube.com/shorts/")){return;}

        var title = $(this).parent().parent().text().toLowerCase();
        if(title.indexOf("accueil") > -1){return;}
        title = title.replaceAll("en cours de lecture","");
        title = title.replaceAll("m de vues","");
        title = title.replaceAll("k de vues","");
        title = onlyletters(title);
        title = title.trim()                
            .replaceAll("\t","")
            .replaceAll("\n","")
            .replaceAll("\r","")
            .trim();
        while(title.indexOf("  ") > -1){
            title = title.replaceAll("  "," ")
        }
        if(title === ""){return;}
        console.log(title);
        $(window).scrollTop($(this).position().top);
        speakVoice(title.substring(0, 100));

    });

}


function onlyletters(s){
    return s.replace(/[^a-z ]/gi, ' ');
}
function onlylettersAndNumbers(s){
    return s.replace(/[^a-z0-9 ]/gi, ' ');
}

function toutLire(){
    var s = $("body").text();
    console.log(s);
    while(s !== ""){
        speakVoice(s.substring(0,200));
        s = s.substring(200)
    }
}
var mettreEnPauseVideo = false;

function PauseLecteur(){
	//console.log("> pause");
	$(".ytp-play-button.ytp-button[data-title-no-tooltip=Pause]").click();
}
function PlayLecteur(){
	//console.log("> lire");
	$(".ytp-play-button.ytp-button[data-title-no-tooltip=Lire]").click();
}

function checkStatutLecteur(){
	if(mettreEnPauseVideo){
		var status = localStorage.getItem("player-status");
		if(status === "lire"){
			PlayLecteur();
		}
		if(status === "pause"){
			PauseLecteur();
		}
		setTimeout(function(){
			checkStatutLecteur();
		}, 500);
	}
}


function notifyMe(text) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification(text);
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(text);
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }

var lastAction = "";
var lastActionRepeat = 0;
function onGetSpeak(speak){
    console.log("onGetSpeak");
    console.log(speak);
    if(speak.length === 0){ console.log("speak.length === 0");return;}
    switch (window.location.hostname) {
        case "www.youtube.com":
            console.log("www.youtube.com");
            onGetSpeak_Youtube(speak);
            break;
        case 'gemini.google.com':
            console.log('gemini.google.com');
            onGetSpeak_Gemini(speak);
            break;   
        default:
            console.log("site inconnu pour la commande vocale ["+window.location.hostname+"]");
    }
}

function timerReadChat(){
    setTimeout(function(){
        if(speakOnBrowser) {
            if($(".tts-button[READED!=TRUE]").length === 0){
                setTimeout(timerReadChat,1000);
                return;
            }
            var l = $(".tts-button").length - 1;
            $(".tts-button:eq("+l+")").each(function(){
                $(this).attr("READED", "TRUE");
                var btn = $(this);
                setTimeout(function(){
                    btn.click();
                },5000);
                
                return;
            });
        }else{
            var selectorObj = $(".conversation-container");
            var txt = "";
            selectorObj.each(function(){
                $(this).attr("READED", "TRUE");
                var item = $(this);
                //txt = txt + $("message-content", item).text();
                var t = $("message-content.model-response-text:visible", item).text();
                if( t !== "" && t !== undefined){txt = t;}
            });
            if(txt !== "" && txt !== undefined){
                speakVoice(txt);
                console.log(txt);
            }else{
                console.log("erreur txt vide");
                console.log(txt);
            }
                
        }
    }, 12000);
}



var isGeminiCalled = false;
var isWaitConfirmation = false;
var lastText = "";
function onGetSpeak_Gemini(speak){
    console.log("", isGeminiCalled);

    if(isGeminiCalled){
        for(var i in speak){
            console.log("test "+speak[i]);
            if(speak[i] === "non" || speak[i] === "bon"){
                if(isWaitConfirmation){
                    //document.execCommand("undo");
                    var last = $(".ql-editor").text();
                    $(".ql-editor").text("").focus();
                    setTimeout(function(){
                        document.execCommand("goEndOfLine");
                        document.execCommand("insertText", true, lastText);
                        lastText = last;
                    },1000)
                }else{  
                    console.log("Je ne vous écoute plus");
                    speakVoice("Je ne vous écoute plus");
                    isGeminiCalled = false;
                }
                return;
            }
            if(isWaitConfirmation && (speak[i] === "oui" || speak[i] === "envoyer")){
                $(".send-button").click();
                speakVoice("Envoi. Réponse dans 10 secondes.");
                timerReadChat();
                isWaitConfirmation = false;
                isGeminiCalled = false;
                return;
            }
            if(isWaitConfirmation && speak[i] === "effacer"){
                speakVoice("Effacement de l'envoi et annulation de la question");
                $(".ql-editor").text("").focus();
                isWaitConfirmation = false;
                isGeminiCalled = false;
                return;
            }
        }
    }

    if(isGeminiCalled){
        //isGeminiCalled = false;
		$(".ql-editor").focus();
        lastText = $(".ql-editor").text();
		setTimeout(function(){
            var space = $(".ql-editor").text() === "" ? "": " ";
            
			document.execCommand("insertText", true, space+speak[0]);
            setTimeout(function(){
                speakVoice($(".ql-editor").text()+". Dites oui pour envoyer");
            },2000);
            
            console.log($(".ql-editor").text());
            isWaitConfirmation = true;
		}, 2000);
    }else{
        for(var i in speak){
            console.log("test "+speak[i]);
            if(speak[i] === "question"){
                console.log("Je vous écoute");
                speakVoice("Je vous écoute");
                isGeminiCalled = true;
                $(".ql-editor").text("").focus();
            }
        }
    }
}


function onGetSpeak_Youtube(speak){

    if($("form input[type=text]").is(":focus")){
        window.location = "https://www.youtube.com/results?search_query="+encodeURIComponent(speak[0]);
        return;
    }

    for(var i in speak){
        if(["encore","continue","coûteux","côté","gauthier","suivant","après","vas-y","benji"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 1;}
        if(["deux fois"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 2;}
        if(["trois fois"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 3;}
        if(["quatre fois"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 4;}
        if(["cinq fois"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 5;}
        
        if(speak[i] === "menu"){readLinksOnPage();return;}
        if(speak[i] === "accueil"){window.location = "/";return;}
        if(["rechargez","rafraichir","en charge"].indexOf(speak[i]) !== -1){window.location = window.location;return;}
        if(["il joue","jouer"].indexOf(speak[i]) !== -1){PlayLecteur();return;}
        if(["pause"].indexOf(speak[i]) !== -1){PauseLecteur();return;}
        if(["écrire","rires"].indexOf(speak[i]) !== -1){$("form input[type=text]").focus();console.log("focus");return;}
        if(["tout lire","tous lire","lire la page"].indexOf(speak[i]) !== -1){toutLire();console.log("lire");return;}
        if(["en haut","en gros","montez"].indexOf(speak[i]) !== -1){
            if(lastActionRepeat < 1){lastActionRepeat = 1;}
            for(var j = 1; j <= lastActionRepeat; j++){
                setTimeout(function(){
                    $(window).scrollTop($(window).scrollTop() - parseInt($(window).height() / 1.5));
                }, j * 1000);
            }
            lastActionRepeat = 0;
            lastAction = speak[i];
            return;
        }
        if(["en bas","descendre","décembre","deux cents","défend","chambre","le centre","défendre","du centre","des centres"].indexOf(speak[i]) !== -1){
            if(lastActionRepeat < 1){lastActionRepeat = 1;}
            for(var j = 1; j <= lastActionRepeat; j++){
                setTimeout(function(){
                    $(window).scrollTop($(window).scrollTop() + parseInt($(window).height() / 1.5));
                }, j * 1000);
            }
            lastActionRepeat = 0;
            lastAction = speak[i];
            return;
        }
        if(["aide","ed"].indexOf(speak[i]) !== -1){speakVoice("menu, accueil, écrire, tout lire, en bas, descendre, en haut, monter");return;}
    }
    
    for(var i in speak){
        if(speak[i].indexOf("video") !== -1 || speak[i].indexOf("vidéo") !== -1){
            speak[i].replaceAll("video","").replaceAll("vidéo","")
            console.log(speak);
            checkLinksOnPage(speak);
            return;
        }
    }
}


/*
setTimeout(function(){
    $(window).scrollTop(lastscrolltop);
    //PlayLecteur()
}, 4000);
*/


/*
if(window.location.hostname === "www.youtube.com") {
    if(confirm("Requeter le serveur ? ")){
        requestServerTimer();
    }
}
*/

// ================



function scrollOnLoad(){
    $(window).scrollTop($(document).height());
    console.log("scrollTop")
}

var indeed2 = {
    items: [],
    goPageJobs:function(){
        window.location.href = "https://ch-fr.indeed.com/jobs?q=d%C3%A9veloppeur+informatique&l=gen%C3%A8ve%2C+ge&vjk=6eaac62fc09fbc97";
    },
    goPageJob:function(i){
        window.location.href = indeed2.items[i].link;
    },
    currentPage: function(){
/*
        https://ch-fr.indeed.com/rc/clk?jk=0ddf63bdcc705670&bb=diDY3AAkrWuS0ttuXUUY5kLJor44AHnUrMOuVNlBeVmZbxxpdWK4GXX5tCNDADyQ5uBUjPRq-Glt6df8TBYOnAqh_Y91o_-C5Jobu757eGs%3D&xkcb=SoDs67M3G-5vCBQHtR0HbzkdCdPP&fccid=2ea3329cf3605836&vjs=3
        https://ch-fr.indeed.com/viewjob?jk=0ddf63bdcc705670&tk=1hjuoo6gf2fnj000&from=serp&vjs=3
*/
        if(window.location.href.startsWith("https://ch-fr.indeed.com/jobs")){return "jobs"}
        if(window.location.href.startsWith("https://ch-fr.indeed.com/viewjob")){return "job"}
        if(window.location.href.startsWith("https://ch-fr.indeed.com/rc")){return "job"}
        if(window.location.href.startsWith("https://ch-fr.indeed.com/")){return "jobs"}
    },
    getJobsList:function(){
        $("#mosaic-provider-jobcards ul:eq(0) li").each(function(){
            if(!$("a", this).length){return;}
            var data = {
                title: $("a", this).text(),
                description: $(this).text(),
                link: $("a", this).attr("href")
            };
            indeed2.items.push(data);
        })
        return indeed2.items;
    },
    onLoadPageJobs:function(){
        setTimeout(scrollOnLoad, 15000);
        setTimeout(function() {
            console.log("start");
            scrollOnLoad();
            console.log(indeed2.getJobsList());
        }, 25000);
    },
    onLoadPageJob:function(){
        setTimeout(function() {
            var data = {
                title: $("h1").text(),
                description: $("#jobDescriptionText").text(),
                type: $("#salaryInfoAndJobType").text(),
                lieu: $("#jobLocationText")-text(),
                
            };
            console.log(data);
        }, 15000);
    },
    onstart: function(){
        if(indeed2.currentPage() === "jobs"){
            indeed2.onLoadPageJobs();
        }	
        if(indeed2.currentPage() === "job"){
            indeed2.onLoadPageJob();
        }
    }
};


//$(document).ready(function(){
    if(window.location.hostname === "ch-fr.indeed.com") {
        indeed2.onstart();
    }
//});



//=====





$(document).ready(function() {

  // Vérification de la prise en charge de SpeechSynthesis
  if ('speechSynthesis' in window) {

    // Récupération de l'objet SpeechSynthesis
    var synth = window.speechSynthesis;
    var flag = false;

    // Gestion des boutons de lecture, pause et arrêt
    $("#speechplay").click(function() {
      onClickPlay();
    });
    $("#speechpause").click(function() {
      onClickPause();
    });
    $("#speechstop").click(function() {
      onClickStop();
    });

    // Gestion de la sélection des voix
    var voiceSelect = $("#voices");
    populateVoiceList(); // Fonction pour remplir la liste des voix

    // Fonction de lecture
    function onClickPlay() {
      if (!flag) {
        flag = true;
        var utterance = new SpeechSynthesisUtterance($("#texttospeech").text());
        setVoice(utterance); // Fonction pour définir la voix sélectionnée
        utterance.onend = function() {
          flag = false;
        };
        synth.speak(utterance);

        // Correction du bug d'arrêt après un certain temps
        let r = setInterval(() => {
          if (!synth.speaking) {
            clearInterval(r);
          } else {
            synth.resume();
          }
        }, 14000);
      } else if (synth.paused) {
        synth.resume();
      }
    }

    // Fonction de pause
    function onClickPause() {
      if (synth.speaking && !synth.paused) {
        synth.pause();
      }
    }

    // Fonction d'arrêt
    function onClickStop() {
      if (synth.speaking) {
        flag = false;
        synth.cancel();
      }
    }

    // Fonction pour remplir la liste des voix
    function populateVoiceList() {
      // ... (Code identique à la version JavaScript)
    }

    // Fonction pour définir la voix sélectionnée
    function setVoice(utterance) {
      var selectedOption = voiceSelect.find(":selected").data("name");
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
          utterance.voice = voices[i];
          sessionStorage.setItem("SpeechSynthesisVoice", selectedOption);
          break;
        }
      }
    }

  } else {
    // Message si SpeechSynthesis n'est pas pris en charge
    var msg = $("<h5>").text("Detected no support for Speech Synthesis").css({
      textAlign: "center",
      backgroundColor: "red",
      color: "white",
      marginTop: 0,
      marginBottom: 0
    });
    $(msg).insertBefore($("#SpeechSynthesis"));
  }

});


/*


(function($){
    $.extend(true, {
        import_js : function(script){
        	
            $("head").append($('<script></script').attr('src', script));
        }
    });
})(jQuery);

var t = new Date();
$.import_js('http://127.0.0.1/youtubebot/youtube.com2.js?'+t.getTime());



var ajax = {
    send:function(url, data, isJsonResponse, ondone){
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
                    ondone(JSON.parse(res)); return;
                }catch(e){
                    ondone({error:true,errorMessage:"Json malformed response",res:res,e:e}); return;
                }
            },
            error: function(xhr, message, errorThrworn){
                console.log({error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
                setTimeout(vocalcommand_request, 5000);
            }
        });
    }
};




function vocalcommand_request(){
	var url = "https://127.0.0.1:13000/webserver/index.js";
	var data = {};
	var isJsonResponse = false;
	ajax.send(url, data, isJsonResponse, function(rep){
		eval(rep);
	});
}




setTimeout(vocalcommand_request, 5000);

*/









// ===================================
// ===================================
// On rajoute au Type String
// ===================================

String.prototype.removeSpecialChars = function() {
    return this.replace(/[^ws,.'áéíóúàèìòùäëïöüâêîôû=+-_nr]/gi, '');
};

// Enlève tous les caractères non alphanumériques
String.prototype.removeNonAlphanumeric = function() {
    return this.replace(/[^a-zA-Z0-9]/g, "");
};

//Remplace les accents par le lettre primitive (éèêë deviennent e)
String.prototype.removeAccents = function() {
    return this.normalize("NFD").replace(/[u0300-u036f]/g, "");
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
    const spaceRegex = /s+/;
  
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
/*
// On rajoute au Type Array
// ===================================

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



