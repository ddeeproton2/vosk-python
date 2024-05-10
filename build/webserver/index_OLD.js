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


/*
//indeed.onstart();


ajax.send(url, data, isJsonResponse, function(rep){
    eval(rep);
});
*/ 


var lastmessage = "";
function speakVoice(message){
    var isDouble = message === lastmessage;
    lastmessage = message;
    if(isDouble){return;}
	/*
	ajax.url = "http://127.0.0.1:8080/?voice=2&message="+encodeURI(message);
	ajax.type = 'GET';
	ajax.send({}, false, function(result){
		
	});
	return;
	// ===============
	*/
	message = message
		.replaceAll("qu ", "qu'")
		.replaceAll(" ca ", " ça ")
		.replaceAll("honorable", "")
		.replaceAll("??", "?")
		.replaceAll("??", "?")
		.replaceAll("?", " (point d'interrogation). ");
	
	
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
    if(speak.length === 0){return;}
    
    if(window.location.origin === "https://www.youtube.com"){
        if($("form input[type=text]").is(":focus")){
            window.location = "https://www.youtube.com/results?search_query="+encodeURIComponent(speak[0]);
            return;
        }
    }

    for(var i in speak){
        if(["encore","continue","coûteux","côté","gauthier","suivant","après","vas-y","benji"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 1;}
        if(["deux fois"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 2;}
        if(["trois fois"].indexOf(speak[i]) !== -1){speak[i] = lastAction;lastActionRepeat = 3;}
        if(speak[i] === "menu"){readLinksOnPage();return;}
        if(speak[i] === "accueil"){window.location = "/";return;}
        if(["rechargez","rafraichir"].indexOf(speak[i]) !== -1){window.location = window.location;return;}
        if(["il joue","jouer"].indexOf(speak[i]) !== -1){PlayLecteur();return;}
        if(["pause"].indexOf(speak[i]) !== -1){PauseLecteur();return;}
        if(speak[i] === "écrire"){$("form input[type=text]").focus();console.log("focus");return;}
        if(["tout lire","tous lire","lire la page"].indexOf(speak[i]) !== -1){toutLire();console.log("lire");return;}
/*
        if(["en haut","en gros","montez"].indexOf(speak[i]) !== -1){
            for(var j = 1; j <= lastActionRepeat; j++){
                setTimeout(function(){
                    $(window).scrollTop($(window).scrollTop() - parseInt($(window).height() / 1.5));
                }, j * 1000);
            }
            lastActionRepeat = 0;
            lastAction = speak[i];
            return;
        }
        if(["en bas","descendre","décembre","deux cents","défend","le centre","défendre","du centre","des centres"].indexOf(speak[i]) !== -1){
            for(var j = 1; j <= lastActionRepeat; j++){
                setTimeout(function(){
                    $(window).scrollTop($(window).scrollTop() + parseInt($(window).height() / 1.5));
                }, j * 1000);
            }
            lastActionRepeat = 0;
            lastAction = speak[i];
            return;
        }
*/
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


function requestServerTimer(){
    //var url = "https://192.168.1.222:13000/webserver/index.py";
    var url = "https://127.0.0.1:13000/webserver/index.py";
    
    var data = {
        starttime: now, 
        website: window.location.hostname, 
        url: window.location.href
    };
    var isJsonResponse = true;
    ajax.send(url, data, isJsonResponse, function(rep){
        try{
            onGetSpeak(rep);
        }catch(e){
            console.log(e);
        }
        setTimeout(requestServerTimer, 3000);
    });
}

//var lastscrolltop = 0;
setTimeout(function(){
    //lastscrolltop = $(window).scrollTop();
    //$(window).scrollTop($(document).height());
    requestServerTimer();    
    //PlayLecteur();
}, 2000);

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