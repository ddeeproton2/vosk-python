const config = require('../config.js');
const internet = require('./connexions.js');

function speech(msg, clientIP){
    //console.log("To "+clientIP+" Say "+msg);
    if(clientIP === undefined){console.log("Error: clientIP not defined :)");return;}
    try {  
      (async () => {
        try {
          //const data = await get('http://'+clientIP+':'+config.config_speech_port+'/?message='+encodeURIComponent(msg));
          //const data = await post('http://'+clientIP+':'+config.config_speech_port+'/?message='+encodeURIComponent(msg));
          internet.speech('http://'+clientIP+':'+config.config_speech_port+'/?message=', msg, {}, function(data) {
            console.log(`Données reçues : ${data}`);
          });
  
  
          //console.log(data); // Output: Parsed data (JSON, text, etc.)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })();
      
    } catch (error) {
      console.error('GET request error:', error);
      //throw error; // Re-throw the error for further handling if needed
    }
  
}

function char_to_word(msg){
    msg = msg.replaceAll(" ", " espace ");
    msg = msg.replaceAll(".", "point.");
    msg = msg.replaceAll(",", "virgule.");
    msg = msg.replaceAll("+", "plus.");
    msg = msg.replaceAll("-", "tiret ou moins.");
    msg = msg.replaceAll("(", "parenthèse ouvrante.");
    msg = msg.replaceAll(")", "parenthèse fermante.");
    msg = msg.replaceAll('"', "double guillemets.");
    msg = msg.replaceAll("'", "apostrophe.");
    msg = msg.replaceAll("!", "point d'exclamation.");
    msg = msg.replaceAll("?", "point d'interrogation.");
    msg = msg.replaceAll(":", "deux-points.");
    msg = msg.replaceAll(";", "point-virgule.");
    msg = msg.replaceAll("/", "slash.");
    msg = msg.replaceAll("\\", "anti-slash.");
    msg = msg.replaceAll("@", "arobase.");
    msg = msg.replaceAll("#", "dièse.");
    msg = msg.replaceAll("$", "dollar.");
    msg = msg.replaceAll("%", "pourcent.");
    msg = msg.replaceAll("^", "chapeau.");
    msg = msg.replaceAll("&", "et commercial.");
    msg = msg.replaceAll("*", "étoile.");
    msg = msg.replaceAll("_", "souligné.");
    msg = msg.replaceAll("=", "égal.");
    msg = msg.replaceAll("{", "accolade ouvrante.");
    msg = msg.replaceAll("}", "accolade fermante.");
    msg = msg.replaceAll("[", "crochet ouvrant.");
    msg = msg.replaceAll("]", "crochet fermant.");
    msg = msg.replaceAll("<", "plus petit que ou inférieur.");
    msg = msg.replaceAll(">", "plus grand que ou supérieur.");
    msg = msg.replaceAll("|", "barre verticale.");
    msg = msg.replaceAll("	", "tabulation.");
    msg = msg.replaceAll("`", "accent grave inversé.");
    msg = msg.replaceAll("£", " Le curseur est ici. ");
    return msg;
}
  
  
function char_to_keyword(msg){
    msg = msg.replaceAll("£", "");
    msg = msg.replaceAll(" ", "espace");
    msg = msg.replaceAll(".", "point");
    msg = msg.replaceAll(",", "virgule");
    msg = msg.replaceAll("+", "plus");
    msg = msg.replaceAll("-", "tiret_ou_moins");
    msg = msg.replaceAll("(", "parenthese_ouvrante");
    msg = msg.replaceAll(")", "parenthese_fermante");
    msg = msg.replaceAll('"', "double_guillemets");
    msg = msg.replaceAll("'", "apostrophe");
    msg = msg.replaceAll("!", "point_dexclamation");
    msg = msg.replaceAll("?", "point_dinterrogation");
    msg = msg.replaceAll(":", "deux_points");
    msg = msg.replaceAll(";", "point_virgule");
    msg = msg.replaceAll("/", "slash");
    msg = msg.replaceAll("\\", "anti_slash");
    msg = msg.replaceAll("@", "arobase");
    msg = msg.replaceAll("#", "diese");
    msg = msg.replaceAll("$", "dollar");
    msg = msg.replaceAll("%", "pourcent");
    msg = msg.replaceAll("^", "chapeau");
    msg = msg.replaceAll("&", "et_commercial");
    msg = msg.replaceAll("*", "etoile");
    msg = msg.replaceAll("_", "souligne");
    msg = msg.replaceAll("=", "egal");
    msg = msg.replaceAll("{", "accolade_ouvrante");
    msg = msg.replaceAll("}", "accolade_fermante");
    msg = msg.replaceAll("[", "crochet_ouvrant");
    msg = msg.replaceAll("]", "crochet_fermant");
    msg = msg.replaceAll("<", "plus_petit_que_ou_inferieur");
    msg = msg.replaceAll(">", "plus_grand_que_ou_superieur");
    msg = msg.replaceAll("|", "barre_verticale");
    msg = msg.replaceAll("	", "tabulation");
    msg = msg.replaceAll("`", "accent_grave_inverse");
    return msg;
}
  

module.exports = {speech, char_to_word, char_to_keyword};