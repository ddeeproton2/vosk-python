var premiereLecture = true;

 
$(document).ready(function(){
	var url = window.location.href;
	if(url.startsWith("https://www.youtube.com/live_chat")){
		changeImages();
	}else{
		setTimeout(function(){
			//searchSelectFirst();
			checkStatutLecteur();
		}, 2000);
		alwaysHideAntiAdblock();
		iframe_changeImages();
	}

});



function changeImages(){
	var lastVideo = "";
	$("yt-live-chat-text-message-renderer[readed!=true]").each(function(i){
		$(this).attr("readed","true");
		var username = $("#author-name", this).text();
		var message = $("#message",this).text();
		var html = $("#message",this).html();
		var img = $(".style-scope.yt-img-shadow", this);
		
		$("#message",this).css("color","#7777ff");
		$("#author-name.yt-live-chat-author-chip", this).css("color","blue!important");
		
		img.click(function(){
			$(this).toggleClass("big");
		});
		console.log(username+" > "+message);
		
		ajouterBoutonsAuMessage(this, i);
		var isBanned = utilisateursBloques(this);
		utilisateursCertifiesOK(this);

		if(message.toLowerCase().match("dark") !== null || message.toLowerCase().match("F") !== null){
			$(this).css("border", "2px solid red");
		}

		setTimeout(function(){
			setBigImage(img);
		}, 100);
		
		if(!premiereLecture && message.trim() !== "" && !isBanned){
			parlerVoix(username.split(" ")[0]+" écrit. "+ message+". écrit par "+username.split(" ")[0]);
		}

		/*
		if(message.toLowerCase().match("dark") !== null 
		|| message.toLowerCase().match("F") !== null){
			console.warn(username+" > "+message);
			notifyMe(username+" > "+message);
		}
		*/
		
		if(html.match('shared-tooltip-text=":yt:"') && !isBanned){
			lastVideo = this;
		}
		
		
	});

	if(lastVideo !== ""){
		getVideo(lastVideo);
	}

	premiereLecture = false;
	setTimeout(changeImages, 100);
}




function iframe_changeImages(){
	var base = $("#chatframe").contents();
	var lastVideo = "";
	$("yt-live-chat-text-message-renderer[readed!=true]", base).each(function(i){
		$(this).attr("readed","true");
		var username = $("#author-name", this).text();
		var message = $("#message",this).text();
		var html = $("#message",this).html();
		var img = $(".style-scope.yt-img-shadow", this);
		
		$("#message",this).css("color","#7777ff");
		$("#author-name.yt-live-chat-author-chip", this).css("color","blue!important");
		
		img.click(function(){
			$(this).toggleClass("big");
		});
		console.log(username+" > "+message);
		
		ajouterBoutonsAuMessage(this, i);
		var isBanned = utilisateursBloques(this);
		utilisateursCertifiesOK(this);

		if(message.toLowerCase().match("dark") !== null || message.toLowerCase().match("F") !== null){
			$(this).css("border", "2px solid red");
		}

		setTimeout(function(){
			setBigImage(img);
		}, 100);
		
		if(!premiereLecture && message.trim() !== "" && !isBanned){
			parlerVoix(username.split(" ")[0]+" écrit. "+ message+". écrit par "+username.split(" ")[0]);
		}

		/*
		if(message.toLowerCase().match("dark") !== null 
		|| message.toLowerCase().match("F") !== null){
			console.warn(username+" > "+message);
			notifyMe(username+" > "+message);
		}
		*/
		
		if(html.match('shared-tooltip-text=":yt:"') && !isBanned){
			lastVideo = this;
		}
		
		
	});

	if(lastVideo !== ""){
		getVideo(lastVideo);
	}

	premiereLecture = false;
	setTimeout(iframe_changeImages, 100);
}





function alwaysHideAntiAdblock(){

	setTimeout(function(){
		$("script").each(function(){if($(this).attr("src")){if($(this).attr("src").match("desktop_polymer_css_polymer_serving_disabled.js")){$(this).remove();}}});
		
		if($("tp-yt-iron-overlay-backdrop").is(":visible")){
			$("tp-yt-iron-overlay-backdrop, ytd-popup-container").hide();

			$().unbind('scroll');
			setTimeout(PlayLecteur, 100);
		}else{
			alwaysHideAntiAdblock();
		}
	}, 2000);
}


function timerScanMessages(){
	scanMessages();
	setTimeout(timerScanMessages, 1000);
}

//setTimeout(timerScanMessages, 1000);

var users = [];
var messages = [];
var totalMessages = 0;


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
		messages.push(message);
	});
    if(messages.length > 0){
        sendPipeMessages();
        if(intervall_sendPipeMessages === undefined){
            intervall_sendPipeMessages = setInterval(sendPipeMessages, 10000);
        }
    }
}



// ========

function getVideo(self){
	var username = $("#author-name", self).text();
	var message = $("#message",self).text();
	var html = $("#message",self).html();
	var img = $(".style-scope.yt-img-shadow", self);
	
	console.warn("musique:"+message);
	message = message.replaceAll("&", " ");
	ajax.url = "https://www.youtube.com/results?search_query="+message;
	ajax.type = 'GET';
	ajax.send({}, false, function(result){
		result = result.split("{\"videoRenderer\":{\"videoId\":\"")[1];
		var youtube_video_id = result = result.split("\"")[0];
		console.log(youtube_video_id);
		console.log(isPlayerPlayingIframe() ? 'Coupure de video en cours de lecture': 'Pas de coupure video en cours de lecture');
		$("iframe").remove();
		var html = $("#message",self).html();
		html = html + `
			<iframe id="myIFrame" src="https://www.youtube.com/embed/`+youtube_video_id+`" height="500" width="800" title="Iframe Example" onload="iframeReady(this);"></iframe>
		`;
		/*
		html = html + `
			<iframe id="myIFrame" src="https://www.youtube.com/watch?v=`+youtube_video_id+`" height="500" width="800" title="Iframe Example" onload="iframeReady(this);"></iframe>
		`;
		*/
		$("#message",self).html(html);

		alwaysPlayIframe();
	});
	
}


function alwaysPlayIframe(){
	PlayLecteurIframe();
	setTimeout(function(){
		//if(isPlayerPlayingIframe()){attendLaFinDeLaVideoIframe();return;}
		alwaysPlayIframe();
	}, 5000);
}

/*
function attendLaFinDeLaVideoIframe(){
	setTimeout(function(){
		if(!isPlayerPlayingIframe()){PleinEcranLecteurIframe();return;}
		attendLaFinDeLaVideoIframe();
	}, 5000);
	
}
*/


function iframeReady(iframe) {
	$("html,body").animate({ scrollTop: $(document).height() }, 1000);	
	console.log(isPlayerPlayingIframe() ? 'Lecture en cours iframe' : 'Pas de lecture iframe');
	setTimeout(function(){
		console.log(isPlayerPlayingIframe() ? 'Lecture en cours iframe' : 'Pas de lecture iframe');
	}, 20000);
	
}

function getStatusPlayerIframe(){
	return window.frames['myIFrame'].contentDocument.getElementsByClassName("ytp-play-button")[0].attributes["data-title-no-tooltip"].nodeValue;
	//return iframe.contentDocument.getElementsByClassName("ytp-play-button")[0].attributes["data-title-no-tooltip"].nodeValue;
}

function isPlayerPlayingIframe(){
	
		
	return $(".ytp-play-button.ytp-button[data-title-no-tooltip=Pause]", $("iframe").contents()).length > 0;	
	
	//return $(".ytp-play-button.ytp-button[data-title-no-tooltip=Pause]", $("#myIFrame").contents()).length > 0;	
	//return $(".ytp-play-button.ytp-button[data-title-no-tooltip=Pause]", window.frames['myIFrame'].contentDocument).length > 0;
	
	//return getStatusPlayerIframe() === "Pause";
}

function PlayLecteurIframe(){
	var iframe = $("iframe").contents();
	iframe.focus();
	$(".ytp-play-button.ytp-button[data-title-no-tooltip=Lire]", iframe).click();
	/*
	setTimeout(function(){
		PleinEcranLecteurIframe();
	}, 20000);
	*/
}

function PauseLecteurIframe(){
	var iframe = $("iframe").contents();
	$(".ytp-play-button.ytp-button[data-title-no-tooltip=Pause]", iframe).click();
}

function PleinEcranLecteurIframe(){
	var iframe = $("iframe").contents();
	if($(".ytp-fullscreen-button.ytp-button", iframe).attr("data-title-no-tooltip") === 'Plein écran'){
		$(".ytp-fullscreen-button.ytp-button", iframe).click();	
		setTimeout(function(){
			PleinEcranLecteurIframe();
		},2000);
	}
}

// ========
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

// ========


function parlerVoix(message){

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
	
	if(mettreEnPauseVideo) { localStorage.setItem("player-status", "pause"); }
	const synth = window.speechSynthesis;
	const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.onend = function (event) {
    	if(mettreEnPauseVideo) { 
			localStorage.setItem("player-status", "prepareplay");
			setTimeout(function() {
				if(localStorage.getItem("player-status") === "prepareplay"){
					localStorage.setItem("player-status", "lire");	
				}
			}, 1000);
    	}
		//console.log("lire");
    };
    utterThis.pitch = 1.8;
    utterThis.rate = 2;
    //utterThis.voice = 2;
    synth.speak(utterThis);
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

// ========

function utilisateursBloques(self){
	var result = false;
	var username = $("#author-name", self).text();
	var message = $("#message",self).text();
	var html = $("#message",self).html();
	var img = $(".style-scope.yt-img-shadow", self);

	if(
		(
			username.startsWith("LGBT")
			|| username === "ELECTRO 1"
			|| username.match("Ganja_Dz")
			|| username.match("Rasta_Dz")
			|| username.match("VirginieLyon")
			|| username.match("Dario Staw")
			|| username.match("THuĢ_Dz")
			|| username.match("Moules-frites")
			|| username.match("léa")
			
			/*
			|| username === "Said tayeb"
			|| username.startsWith("Moi même")
			|| username === "Tinkerbell"
			|| username === "Leíla"
			|| message.toLowerCase().match("leíla") !== null
			|| message.toLowerCase().match("leila") !== null
			*/
			
			
		)
		|| bannManager.isBanned(username)
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaQTpliuDEOsahHQP2lINa0xo6iCxifvWYisknoWlw")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaSn3czo2xjHjiGtW1Q9v8Wxg_Bvp0MA6O7pHc7WfA")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaRoiG_MZ6x5RmlwRQ_Wsagt0nyEExKyduEc9voJVQ")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaQejzy6D7qIg5lEsU5EVWdcnnQniz7xIfMjfK3p-A")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/APkrFKbOlvTmgbeqDMR-X-AWKOvYqOk7krSzNvQgctdCeQ")
		//|| img.attr("src").startsWith("https://yt4.ggpht.com/1oczYaS18Om3UnAqsVyMCQiUUWLl2a9YZceKckNNUsd3HPFyUgnl4DKbyBk1H_Ab3DFC6W9Gbg") // moi meme
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ECNlMNyDinvwhjuLxbJv40YI1sj-lFno2YIrv4_2eZJ0HbBk4Bkv70hjK1FVgqqx0XxmOB6uFA")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaQx3JT2HSIIINGUY3LSY9OIdLGMiMubU0Bwww")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/XQKLTci1erSehA4aelVR0V_XwBQAhjm5jCpXBOIRTtJzC2navSGcvEXIgjPFwuZpr2CPnX0B")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/APkrFKYDFuhQ3P0ppdCTLcg1mK-4zoQdx8eySx7GWLmFyA")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/zTxuGRlhy6N816HnzK7ugWCKYl9sUEGo8joWSPWToqMZo8qr5MBTZeoqESXVW0BJp3LfyGmCQFY")
		|| (img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaSzESqv6QfQkk32HvNuBkHxQb5zgl8GxW5fj-VPrg") )
		|| (username === "Toutou Zag" && !img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaThIf4GvZfYfhyCDpXCpqkkzqLfBS9AlKvrYn3lIr-Y_ThCqOR0y57db9E297ts") )
		|| (username === "ADEL" && img.attr("src").startsWith("https://yt4.ggpht.com/3vS0uHbsw8EPYTaF7KzpUW3OOAwgvO7mJ_v6zJCEg0kPC507T2FjG92G0Xg56kGkBlnK3usa") ) 
		|| (username === "mister salamandre" && img.attr("src").startsWith("https://yt4.ggpht.com/PUYRVebJ8IeHFzOEbWsVIpXWGEf0s2REMt7D7m6ZRD__vJcsgMhuiOdNVCtK0jkEES4i5zyjZmo"))
		|| (username === "Marcellin COMAN" && img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaR3ko7ZJWXA8NUond5FSoLqy6zw6oOJcalKHg"))
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaTHEeIiTQsG6AalXzBzx6KErZeKy-dupNkXQb3K6UDlo1yY8r_kvrOuEdMvhpY3")
		|| img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaSQTQsU-OQdj0mCCObUNdMgBbjeIsSyIONZqJHRcJ8bcngoT96FG6yG7eqXbnD7")
		//|| (img.attr("src").startsWith("https://yt4.ggpht.com/GmKbg-joPwU9cyTh-fdEkb8vkZPUMHllumvZkEyhaxGGzUy00bqlhmHTOqyWXPlMAB17gp2Y") && message.match("dark") === null) // Monia
		|| (img.attr("src").startsWith("https://yt4.ggpht.com/ytc/AOPolaSmVLB9s7bIGA4rhxPsyhaNNgMsAefJZJXvLDAJBg")) // Leila
	){
		/*
		var html = '<div style="display:inline-block;font-size:8px;">'+$("#message",this).html()+'</div>';
		$("#message",this).html(html);
		*/

		//&& message.toLowerCase().match("dark") === null

		$("#message", self).text("<effacé>");
		result = true;
		//$(this).hide();
		/*
		$(this).attr("style","-webkit-filter: blur(5px);filter: blur(5px);");
		$(this).attr("title", message);
		img.height(32);
		img.width(32);
		*/
	}
	
	if(username === "CCCP"){
		result = true;
	}
	return result;
}

function utilisateursCertifiesOK(self){
	var username = $("#author-name", self).text();
	var message = $("#message",self).text();
	var html = $("#message",self).html();
	var img = $(".style-scope.yt-img-shadow", self);
	// === utilisateurs certifié ok ====
	var certifie = [
		"https://yt4.ggpht.com/ytc/AOPolaQaB3wrO8esQT_PTMsum8_olcogbsEbjOOmytJsaw", // virginie certifié c'est elle
		"https://yt4.ggpht.com/ytc/AOPolaThIf4GvZfYfhyCDpXCpqkkzqLfBS9AlKvrYn3lIr-Y_ThCqOR0y57db9E297ts", // Toutou
		"https://yt4.ggpht.com/RT5jz6OnOhziAiBPl03KshmEqsNRKKN4rDiBe6PG80Z5CJ5Q--UNxBN54lPln3Q3yASXsuyyGA", // George Stobbart  
		"https://yt4.ggpht.com/UUX2VGtVpFd2XSHEkg1WG5HJRwbyIjtSqk5YTm38wBc3SWdx_oDF8gQkdy2DcTAh0nAqtiyjBQ", // Kasper ????????? ??
		"https://yt4.ggpht.com/3R5rdzGedy3g1FS8mpWKGeK6U06Y995hrZWtnrmHcQqugLa0lWkMBXyKLp8nysinaHvfRNMNOg", // MD XD
		"https://yt4.ggpht.com/qG5JTIDyblAOKnPI_D2-_bBLeS7cGg92K7dvbELUiWG4yGoNhjL9XMmU5DQLMqHHWHtdWx0l", // Alésia Vercin
		"https://yt4.ggpht.com/pqtZTUWo6ovwR2YGQGfoPPS-mKAe88fdvH825bPzRvWsnRMPDgXkunazofLtdv8P9HFmAPn6", // Dark2.0
		"https://yt4.ggpht.com/ytc/AOPolaT1_Y-VFUBmdGTGi9x_OP93JDHZ1Y-kWqNLNFu2", // Steve
		"https://yt4.ggpht.com/ZQDTXxhu6rFoLvneS8M0Iv2CIyCpkEZWhur6nyiIhWBGPM5chE3X6M-bTB34TuxUoAWOh76N7Ys", // CCCP
		"https://yt4.ggpht.com/ytc/AOPolaSzTR8TK8hV0yoHMmLZgY4qkUGLmuuQzBu8kG8T", // Opus Score
		"https://yt4.ggpht.com/ytc/AOPolaQ5H3dNGjjLJfs_n7AiolEZEFAKbySTv914oE5-CPm4-OpVzsETB4oTVkC6D7lv", // Dominique Van cauwenberghe
		"https://yt4.ggpht.com/peL9uq6xWc2HT9o-gN9OStyZzp3vWA43ZsFPXcNEwyTwdOa8hBXWTRd7RIfyLHSsKdiEER7WuA", // Vivien 
		"https://yt4.ggpht.com/ytc/AOPolaR1QV--Errt_7NIjj4O619-UOniXcMIkev4_Q", // piment loco 
		"https://yt4.ggpht.com/3vS0uHbsw8EPYTaF7KzpUW3OOAwgvO7mJ_v6zJCEg0kPC507T2FjG92G0Xg56kGkBlnK3usa", // ADEL 
		"https://yt4.ggpht.com/NuYpnpoTJ1AS4lDpQTpuWT8yJQCVSK9vV20NRRCbTN60vaLZBN2BaejOFQkwyxdRrR5n_Sn00w", // Mario
		"https://yt4.ggpht.com/ytc/AOPolaS15Vtmh_wJeusS-2eD_6F058xYVruatNfR0Ge9HA", // yuthman57 
		"https://yt4.ggpht.com/ytc/AOPolaSoAl7rx5Mb8nJvlZp-CzGvCnwoU5DjrA3uIeygVQ",
		"https://yt4.ggpht.com/ytc/AOPolaRmVwSRNWuATfm7jxwkaRpj_uJIFWkQUcWddRnkWAO2367OwRVGdDAg-PUCtgVa", //Said tayeb
		"https://yt4.ggpht.com/GmKbg-joPwU9cyTh-fdEkb8vkZPUMHllumvZkEyhaxGGzUy00bqlhmHTOqyWXPlMAB17gp2Y", // Monia
		"https://yt4.ggpht.com/ytc/AOPolaT-qPTc7GvcRr5nD_j_sHJ2qLQi4joWnbh7jvY0-C8", // MH 
		"https://yt4.ggpht.com/ytc/AOPolaRzS8Cf-ZG3kPQT42F0A2csDx-J2_R1kDew3SY6NtCd2np_UmYGQVbk9vrLxTuU", // Dario
		"https://yt4.ggpht.com/ytc/AOPolaQFcCA7vfQnEGgS9a9cJgiAh9M1zXbCuIwcMoc0qA", // Loki
		"https://yt4.ggpht.com/ytc/AOPolaS7Vay8GiBtR_3HS44TTmfm575Bwhc1ciUpv11j5IfRV_Naa38bKGA5rHaHPR6y", // Angie
		"https://yt4.ggpht.com/PMIIk4bmg1hrVcOO0R7sizi8ANjLs3D1odS25PxxDCboXHQz3DFiby8WA7GB7N91qZpvtLzxmQ", //Ananas
		"https://yt4.ggpht.com/ytc/APkrFKYKXtN40k1mMLQFe0lRVe_VH03IJoy9zZAEFWb1EwOeFXR2Kw2S17r0zpI-V_Vd", // Toutou
		"https://yt4.ggpht.com/ytc/APkrFKb7FDLiMVoZBRPjK3v8tg6zZCs_xWYJnaSg-ajDvQ", // Yuth
		"https://yt4.ggpht.com/1oczYaS18Om3UnAqsVyMCQiUUWLl2a9YZceKckNNUsd3HPFyUgnl4DKbyBk1H_Ab3DFC6W9Gbg" // moi
	];
	
	for(var i in certifie){
		if(img.attr("src").startsWith(certifie[i])){
			//$(this).css("border", "2px solid green");
			img.css("border", "4px solid #00ff00").css("border-radius", "12px");
		}
	}
}

// ========
let bannManager = {
	bannedUsers: [],
	isBanned: function(user){
		return bannManager.bannedUsers.indexOf(user) !== -1;
	},
	banUser: function(user){
		bannManager.bannedUsers.push(user);
		if(bannManager.isBanned(user)){
			console.log(user + ' is banned');
		}else{
			console.log(user + ' is NOT banned');
		}
	}
};	



function searchSelectFirst(){
	var url = window.location.href;
	if(url.startsWith("https://www.youtube.com/results")){
		$("ytd-video-renderer:eq(0) a:eq(0) img").click();	
		setTimeout(function(){
			searchSelectFirst();
		}, 2000);
	}
}


async function translate_duckduckgo(text){
	let response = await fetch("https://duckduckgo.com/translation.js?vqd=4-79771695195173220150282711940194435783&query=translate&to=fr", {
	  "headers": {
	    "accept": "*/*",
	    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
	    "content-type": "text/plain",
	    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\"",
	    "sec-ch-ua-mobile": "?0",
	    "sec-ch-ua-platform": "\"Windows\"",
	    "sec-fetch-dest": "empty",
	    "sec-fetch-mode": "cors",
	    "sec-fetch-site": "same-origin",
	    "x-requested-with": "XMLHttpRequest"
	  },
	  "referrer": "https://duckduckgo.com/",
	  "referrerPolicy": "origin",
	  "body": text,
	  "method": "POST",
	  "mode": "cors",
	  "credentials": "include"
	});
	
	return await response.text(); 
}

function translate(i){
	var messagetext = $("yt-live-chat-text-message-renderer[readed!=true]:eq("+i+") #message").text();
	var messagehtml = $("yt-live-chat-text-message-renderer[readed!=true]:eq("+i+") #message").html();
	$("yt-live-chat-text-message-renderer[readed!=true]:eq("+i+") #message").html(messagehtml+"<br>"+translate_duckduckgo(messagetext));
	
}


function ajouterBoutonsAuMessage(self, i){
	var username = $("#author-name", self).text();
	var message = $("#message",self).text();
	var html = $("#message",self).html();
	var img = $(".style-scope.yt-img-shadow", self);
	/*
	OriginalStories > <img class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" src="https://yt3.ggpht.com/WaJ1EqpAhY9XDIUI89X27Iwqtu0RSMjsw7VSJQWSOLiJK6q0gKQE37qyWzYb1nQXgAl9eis=w24-h24-c-k-nd" alt="face-pink-tears" data-emoji-id="UCkszU2WH9gy1mb0dV-11UJg/NvgfY9aeC_OFvOMPkrOAsAM" shared-tooltip-text=":face-pink-tears:" id="emoji-54"><img class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" src="https://yt3.ggpht.com/m6yqTzfmHlsoKKEZRSZCkqf6cGSeHtStY4rIeeXLAk4N9GY_yw3dizdZoxTrjLhlY4r_rkz3GA=w24-h24-c-k-nd" alt="yt" data-emoji-id="UCkszU2WH9gy1mb0dV-11UJg/CIW60IPp_dYCFcuqTgodEu4IlQ" shared-tooltip-text=":yt:" id="emoji-55"> Etta James, Gladys Knight and Chaka Khan - Ain't Nobody Business (llve BB King &amp; Friends) [HQ]
	*/
	//if(html.match('id="emoji-55">') !== null){
		//var title_song = html.split('id="emoji-55">')[1];
		//console.log("tite="+title_song)
		
		//$("#message", this).append(`

	$("#author-name", self).append(`
		<form action="https://www.youtube.com/results" target="_blank" style="float:left;">
			<input type=hidden name="autoplay" value="true">
			<input type=hidden name="search_query" value="`+message.trim().replaceAll("&"," ")+`">
			<input type=submit value="Y" class="buttonAjoutesAuMessage">
		</form>&nbsp;
		<form action="https://duckduckgo.com/" target="_blank" style="float:left;">
			<input type=hidden name="q" value="`+message.trim().replaceAll("&"," ")+`">
			<input type=submit value="D" class="buttonAjoutesAuMessage">
		</form>
		<input type=button value="T" class="buttonAjoutesAuMessage" onclick="translate(`+i+`);">
		<input type=button value="B" class="buttonAjoutesAuMessage" onclick="bannManager.banUser('`+username.replaceAll("'","\\'")+`');">
		
	`);

	//}

}


function setBigImage(img){
	var src = img.attr("src");
	if(src.startsWith("http")){
		src = src.replaceAll("=s32-","=s256-");
		//console.log(src);
		img.attr("src", src);
		/*
		img.height(128);
		img.width(128);
		*/
	}
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
                    ondone(res); return;
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
                    ondone(res); return;
                }
            },
            error: function(xhr, message, errorThrworn){
                ondone({error:true,errorMessage:"Pas de connexion au serveur. Veuillez recommencer."});
            }
        });
    }
    
}; 

// ========