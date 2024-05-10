function appendScript(src){
    var scr = document.createElement("script");
    scr.src = src;
    document.body.appendChild(scr);
    console.log("script added: "+src)
}

appendScript("https://127.0.0.1:13443/allwebsites/allwebsites.js");
