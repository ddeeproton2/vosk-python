const config = require('../config.js');
const dir = require('./directoriesmanager.js');
const file = require('./filesmanager.js');
const internet = require('./connexions.js');
const PGP = require('./PGP.js');

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
    msg = msg.replaceAll(".", "point");
    msg = msg.replaceAll(",", "virgule");
    msg = msg.replaceAll("+", "plus");
    msg = msg.replaceAll("-", "tiret ou moins");
    msg = msg.replaceAll("(", "parenthèse ouvrante");
    msg = msg.replaceAll(")", "parenthèse fermante");
    msg = msg.replaceAll('"', "double guillemets");
    msg = msg.replaceAll("'", "apostrophe");
    msg = msg.replaceAll("!", "point d'exclamation");
    msg = msg.replaceAll("?", "point d'interrogation");
    msg = msg.replaceAll(":", "deux-points");
    msg = msg.replaceAll(";", "point-virgule");
    msg = msg.replaceAll("/", "slash");
    msg = msg.replaceAll("\\", "anti-slash");
    msg = msg.replaceAll("@", "arobase");
    msg = msg.replaceAll("#", "dièse");
    msg = msg.replaceAll("$", "dollar");
    msg = msg.replaceAll("%", "pourcent");
    msg = msg.replaceAll("^", "chapeau");
    msg = msg.replaceAll("&", "et commercial");
    msg = msg.replaceAll("*", "étoile");
    msg = msg.replaceAll("_", "souligné");
    msg = msg.replaceAll("=", "égal");
    msg = msg.replaceAll("{", "accolade ouvrante");
    msg = msg.replaceAll("}", "accolade fermante");
    msg = msg.replaceAll("[", "crochet ouvrant");
    msg = msg.replaceAll("]", "crochet fermant");
    msg = msg.replaceAll("<", "plus petit que ou inférieur");
    msg = msg.replaceAll(">", "plus grand que ou supérieur");
    msg = msg.replaceAll("|", "barre verticale");
    msg = msg.replaceAll("	", "tabulation");
    msg = msg.replaceAll("`", "accent grave inversé");
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
  



class VocalCommand {

    constructor() {
      this.commands = {}; 
      this.commandsNumeric = {}; 
      this.commandsAlphabet = {}; 
      this.datadir = 'appdata';
      this.filecommand = this.datadir+'/vocalcommand.json';
      this.filenumbers = this.datadir+'/numbers.json';
      this.filechars = this.datadir+'/chars.json';
      this.createDir(this.datadir);
      this.config_load();
      this.config_save();
      this.currentMode = ""; // General menu
      this.typeSpeak = ""; // "" | "number" | "alphabet"
    }
  
    createDir(dirname){
      dir.exists(dirname).then(exists => {
        if(!exists){
          dir.createDirectory(dirname);
        }
      });
    }
  
    isCommand(cmd, msg){
      return this.commands[cmd] !== undefined && this.commands[cmd].includes(msg);
    }
    isCommandNumeric(cmd, msg){
      return this.commandsNumeric[cmd] !== undefined && this.commandsNumeric[cmd].includes(msg);
    }
    isCommandAlphabet(cmd, msg){
      return this.commandsAlphabet[cmd] !== undefined && this.commandsAlphabet[cmd].includes(msg);
    }
    getCommandNumeric(cmd, msg){
      return this.commandsNumeric[cmd];
    }
    getCommandAlphabet(cmd, msg){
      return this.commandsAlphabet[cmd];
    }
  
    add(cmd, msg) {
      if (!this.commands[cmd]) {
        this.commands[cmd] = [];
      }
      if (!this.isCommand(cmd, msg)) {
        this.commands[cmd].push(msg);
        this.config_save();
      }
    }
  
    remove(cmd, msg) {
      if (!this.commands[cmd]) {
        return false; // Command not found
      }
      const index = this.commands[cmd].indexOf(msg);
      if (index !== -1) {
        this.commands[cmd].splice(index, 1); // Remove the message at the index
        if (this.commands[cmd].length === 0) {
          delete this.commands[cmd]; // Remove empty command array
        }
        return true;
      }
      return false; // Message not found in the command
    }
  
    config_save(){
      this.createDir(this.datadir);
      file.writeJSON(this.filecommand, this.commands);
      // ==== Save numeric
      this.commandsNumeric = {};
      for(let i = 0; i <= 9; i++){
        this.commandsNumeric[this.commands[i]] = i.toString();
      }
      file.writeJSON(this.filenumbers, this.commandsNumeric);
      // ==== Save alphapbet
      this.chars_list = 'abcdefghijklmnopqrstuvwxyz .,+-()"\'!?:;/\\@#$%^&*_={}[]<>|	`';
      this.commandsAlphabet = {};
      for(let i = 0; i < this.chars_list.length; i++){
        let currentCommand = this.commands[char_to_keyword(this.chars_list.charAt(i))];
        for(let c in currentCommand){
          this.commandsAlphabet[currentCommand[c]] = this.chars_list.charAt(i);
        }
      }
      file.writeJSON(this.filechars, this.commandsAlphabet);
    }
  
    config_load(){
      if(file.exists(this.filecommand)){
        this.commands = file.readJSON(this.filecommand);
  
      }
    }
  
    switchItemAndValue(objet) {
      const objetInverse = {};
      for (const cle in objet) {
        if (objet.hasOwnProperty(cle)) {
          objetInverse[objet[cle]] = cle;
        }
      }
      return objetInverse;
    }
  
  }
  
  
  // ====================================
  
  //const vc = new VocalCommand();
  //vc.remove('test','ttttest');
  //console.log(vc.commands);
  
  // ====================================
  
  class QuestionToLLM {
    constructor(clientIPv4, self){
      this.clientIPv4 = clientIPv4;
      this.self = self;
      this.socket = undefined;
      this.masterclient = undefined;
      this.socket_id_creation_time = undefined;
      this.socket_publicKey = "";
      this.question = "";
      this.spelling = "";
      this.spelling_old = [];
      this.old = [];
      this.reponse = "";
      this.working_mode = "";
    }
    start(){
      this.self.currentMode = "question";
      speech("Dites votre question", this.clientIPv4);
    }
    add(msg){
        let vc = this.self;
        
        if(["oui","ok","okay","envoyer"].indexOf(msg) !== -1){
            if(this.question !== ""){
            this.ask();
            }else{
                speech("Pas de question", this.clientIPv4);
            }
            return;
        }
        if(["répète"].indexOf(msg) !== -1){
            if(this.reponse === ""){
                speech("Pas de réponse à répéter", this.clientIPv4);
            }else{
                speech(this.reponse, this.clientIPv4);
            }
            return;
        }
        if(["non"].indexOf(msg) !== -1){
            if(this.old.length == 0 || this.old[this.old.length - 1] === ""){
                speech("Annulation du mot "+this.question+". Vous n'avez plus rien en mémoire", this.clientIPv4);
                this.question = "";
            }else{
                speech("Annulation du mot "+this.question+". Votre question restante est "+this.old[this.old.length - 1], this.clientIPv4);
                this.question = this.old[this.old.length - 1];
                this.old.pop(); // remove last item
            }
            return;
        }

        if(msg === 'écrire chiffres' || vc.isCommand('ecrire_chiffre', msg)){
            speech("Epelez votre chiffre", this.clientIPv4);
            this.working_mode = "spell_number";
            return;
        }
    
        if(msg === 'écrire lettre' || vc.isCommand('ecrire_lettre', msg)){
            speech("Epelez votre lettre", this.clientIPv4);
            this.working_mode = "spell_char";
            return;
        }

        //===============
        if(this.working_mode === ""){
            // Add message to queue
            if(msg !== "" && msg !== undefined){
                if(this.question !== "" && this.question !== undefined){
                    this.old.push(this.question);
                }
                this.question += msg + " ";
                speech(this.question, this.clientIPv4);
            }
        }

        //===============
        if(this.working_mode === "spell_number"){
            if(msg === 'annuler' || vc.isCommand('annuler', msg)){
                this.working_mode = "";
                speech("Sortie du mode Epelez votre chiffre.", this.clientIPv4);
                return;
            }
            var selected = this.getVoiceToNumber(msg);
            if(selected !== ""){
                // Add message to queue
                if(selected !== "" && selected !== undefined){
                    if(this.question !== "" && this.question !== undefined){
                        this.old.push(this.question);
                    }
                    this.question += selected + " ";
                    speech(this.question, this.clientIPv4);
                }
            }
        }    
        
        //===============
        if(this.working_mode === "spell_char"){
            if(msg === 'annuler' || vc.isCommand('annuler', msg)){
                this.working_mode = "";
                speech("Sortie du mode Epelez votre lettre.", this.clientIPv4);
                return;
            }
            var selected = this.getVoiceToChar(msg);
            if(selected !== ""){
                // Add message to queue
                if(selected !== "" && selected !== undefined){
                    if(this.question !== "" && this.question !== undefined){
                        this.old.push(this.question);
                    }
                    this.question += selected + " ";
                    speech(this.question, this.clientIPv4);
                }
            }
        }
    }
    ask(){
      this.self.currentMode = "";
      this.working_mode = "";
      speech("Veuillez patienter. Je réfléchis à votre question. ", this.clientIPv4);
      let base = this;
      if(this.socket === undefined){
        console.log("Error: no event socket defined");
        return;
      }
      if(this.masterclient === undefined){
        console.log("Error: no masterclient defined");
        return;
      }
      if(this.socket_id_creation_time === undefined){
        console.log("Error: no socket_id_creation_time defined");
        return;
      }

      var enc = PGP.encrypt(JSON.stringify({
        action: 'question',
        msg: this.question
      }), this.socket_publicKey);

      this.socket.send(JSON.stringify({
        action: 'encoded',
        from:this.masterclient.id_creation_time,
        to: this.socket_id_creation_time,
        enc: enc
      }));
      /*
      this.onask(this.question, function(result){
        base.reponse = result;
        console.log(result);
        result = result.replaceAll("*","").replaceAll("\\r","");
        speech(result, base.clientIPv4);
      });
      */
      this.question = "";
      this.old = [];
    }
  }
  //var questionllm = new QuestionToLLM(config.config_speech_ip, vc);
  
  
  // ====================================
  
  class VisualCodeCommands{
    constructor(clientIPv4, self){
      this.self = self;
      this.clientIPv4 = clientIPv4;
    }
    start(){
      this.self.currentMode = "question_vscode";
      speech("Dites votre question sur le code", this.clientIPv4);
    }
    ask(msg){
      this.self.currentMode = "";
      console.log("Lancement du code");
      speech("Veuillez patienter. Je réfléchis à votre question. ", this.clientIPv4);
      ask_vscode(msg, internet.getLocalIpAddress()+':'+httpServer.address().port);
    }
    
  }
  //var visual = new VisualCodeCommands(config.config_speech_ip, vc);
  
  // ====================================
  
  
  class LearningCommand{
    constructor(clientIPv4, self){
      this.self = self;
      this.listcmd = [
        'editeur',
        'lignes_suivantes', 
        'lignes_precedantes', 
        'annuler',
        'suivant',
        'oui',
        'non',
        'repeter',
        'apprendre_commande',
        'apprendre_chiffres',
        'apprendre_lettres',
        'lire', 
        'ecrire_chiffre',
        'ecrire_lettre',
        'nouvelle_ligne',
        'effacer_avant',
        'effacer_apres',
        'suivant',
        'precedent',
        'question',
        'vscode'
      ];
      this.clientIPv4 = clientIPv4;
      this.index_listcmd = 0;
      this.learning_mode = '';
      this.learning_record = '';
    }
    start(){
      this.self.currentMode = "learning_command";
      this.learning_mode = "";
      if(this.index_listcmd > this.listcmd.length - 1){
        this.index_listcmd = 0;
      }
      speech("Vous lancez le mode apprentissage. Veuillez dire la commandes "+this.listcmd[this.index_listcmd]+" ou suivant ou annuler.", this.clientIPv4);
    }
    
    learn(msg){
      if(this.learning_mode === ""){
          
  
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.self.currentMode = "";
          speech("Apprentissage terminé.", this.clientIPv4);
          return;
        }
  
        if(msg === 'suivant' || vc.isCommand('suivant', msg)){
          this.index_listcmd++;
          if(this.index_listcmd > this.listcmd.length - 1){
            this.index_listcmd = 0;
          }
          speech("Veuillez dire la commande "+this.listcmd[this.index_listcmd]+" ou suivant ou annuler.", this.clientIPv4);
          return;
        }
  
        if(vc.isCommand(this.listcmd[this.index_listcmd], msg)){
          speech("J'ai reconnu la commande "+this.listcmd[this.index_listcmd], this.clientIPv4);
          return;
        }
  
        this.learning_record = msg;
        speech("Voulez-vous garder le mot ? "+this.learning_record+" pour la commande "+this.listcmd[this.index_listcmd]+" ? Répondez oui, non ou annuler.", this.clientIPv4);
        this.learning_mode = "yes_or_no";
        return;
      }
      if(this.learning_mode === "yes_or_no"){
  
        if(msg === 'oui' || vc.isCommand('oui', msg)){
          this.learning_mode = "";
          speech("Enregistrement du mot, "+this.learning_record+", dans la commande "+this.listcmd[this.index_listcmd], this.clientIPv4);
          vc.add(this.listcmd[this.index_listcmd], this.learning_record);
          return;
        }
  
        if(msg === 'non' || vc.isCommand('non', msg)){
          this.learning_mode = "";
          speech("Annulation de l'enregistrement du mot, "+this.learning_record+", dans la commande "+this.listcmd[this.index_listcmd], this.clientIPv4);
          return;
        }
  
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.learning_mode = "";
          this.self.currentMode = "";
          speech("Apprentissage terminé.", this.clientIPv4);
          return;
        }
  
        speech("Voulez-vous garder le mot ? "+this.learning_record+" pour la commande "+this.listcmd[this.index_listcmd]+" ? Répondez oui, non ou annuler.", this.clientIPv4);
  
      }
    }
  }
  //var learning_command = new LearningCommand(config.config_speech_ip, vc);
  
  // ====================================
  
  class LearnNumbers{
    constructor(clientIPv4, self){
      this.clientIPv4 = clientIPv4;
      this.current_number_to_learn = 0;
      this.learning_record = "";
      this.learning_mode = "";
      this.self = self;
    }
    start(){
      this.self.currentMode = "learning_numbers";
      speech("Vous lancez le mode apprentissage des chiffres. Veuillez dire le chiffre "+this.current_number_to_learn+", suivant, annuler ou répêter", this.clientIPv4);
    }
    learn(msg){
        let vc = this.self;
      if(this.learning_mode === ""){
        if(vc.isCommand('repeter', msg)){
          speech("Veuillez dire le chiffre "+this.current_number_to_learn+", suivant, annuler ou répêter", this.clientIPv4);
          return;
        }
        if(vc.isCommand('suivant', msg)){
          this.current_number_to_learn++;
          speech("Veuillez dire le chiffre "+this.current_number_to_learn+", suivant, annuler ou répêter", this.clientIPv4);
          return;
        }
        if(vc.isCommand('annuler', msg)){
          this.self.currentMode = "";
          speech("Apprentissage terminé.", this.clientIPv4);
          return;
        }
        if(vc.isCommand(this.current_number_to_learn, msg)){
          speech("J'ai reconnu le chiffre "+this.current_number_to_learn, this.clientIPv4);
          return;
        }
        this.learning_record = msg;
        //speech("Voulez-vous garder le mot ? "+this.learning_record+" pour la commande "+this.listcmd[this.index_listcmd]+" ? Répondez oui, non, annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
        this.learning_mode = "yes_or_no";
      }
      if(this.learning_mode === "yes_or_no"){
        if(msg === 'oui' || vc.isCommand('oui', msg)){
          this.learning_mode = "";
          speech("Enregistrement du mot, "+this.learning_record+", pour le chiffre "+this.current_number_to_learn, this.clientIPv4);
          vc.add(this.current_number_to_learn, this.learning_record);
          return;
        }
  
        if(msg === 'non' || vc.isCommand('non', msg)){
          this.learning_mode = "";
          speech("Annulation de l'enregistrement du mot, "+this.learning_record+", pour le chiffre "+this.current_number_to_learn, this.clientIPv4);
          return;
        }
  
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.learning_mode = "";
          this.self.currentMode = "";
          speech("Apprentissage terminé.", this.clientIPv4);
          return;
        }
  
        speech("Voulez-vous garder le mot ? "+this.learning_record+" pour le chiffre "+this.current_number_to_learn+" ? Répondez oui, non ou annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
      }
    }
  }
  
 // var learning_numbers = new LearnNumbers(config.config_speech_ip, vc);
  
  // ====================================
  // ====================================
  
  
  class LearnChars{
    constructor(clientIPv4, self){
      this.clientIPv4 = clientIPv4;
      this.self = self;
      this.current_char_to_learn = 0;
      this.chars_list = 'abcdefghijklmnopqrstuvwxyz .,+-()"\'!?:;/\\@#$%^&*_={}[]<>|	`';
      this.learning_record = "";
      this.learning_mode = "";
    }
    start(){
      this.self.currentMode = "learning_chars";
      speech("Vous lancez le mode apprentissage des lettres. Veuillez dire le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+", suivant, annuler ou répêter", this.clientIPv4);
    }
    learn(msg){
        let vc = this.self;
      if(this.learning_mode === ""){
        if(vc.isCommand('repeter', msg)){
          speech("Veuillez dire le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+", suivant, annuler ou répêter", this.clientIPv4);
          return;
        }
        if(vc.isCommand('suivant', msg)){
          this.current_char_to_learn++;
          if(this.current_char_to_learn > this.chars_list.length - 1){
            this.current_char_to_learn = 0;
          }
          speech("Veuillez dire le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+", suivant, annuler ou répêter", this.clientIPv4);
          return;
        }
        if(vc.isCommand('annuler', msg)){
          this.self.currentMode = "";
          speech("Apprentissage terminé.", this.clientIPv4);
          return;
        }
        if(vc.isCommand(char_to_keyword(this.chars_list.charAt(this.current_char_to_learn)), msg)){
          speech("J'ai reconnu la lettre "+char_to_word(this.chars_list.charAt(this.current_char_to_learn)), this.clientIPv4);
          return;
        }
        this.learning_record = msg;
        //speech("Voulez-vous garder le mot ? "+this.learning_record+" pour le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn))+" ? Répondez oui, non, annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
        this.learning_mode = "yes_or_no";
      }
      if(this.learning_mode === "yes_or_no"){
        if(msg === 'oui' || vc.isCommand('oui', msg)){
          this.learning_mode = "";
          speech("Enregistrement du mot, "+this.learning_record+", pour le caractère "+char_to_word(this.chars_list.charAt(this.current_char_to_learn)), this.clientIPv4);
          vc.add(char_to_keyword(this.chars_list.charAt(this.current_char_to_learn)), this.learning_record);
          return;
        }
  
        if(['non','mon'].indexOf(msg) !== -1 || vc.isCommand('non', msg)){
          this.learning_mode = "";
          speech("Annulation de l'enregistrement du mot, "+this.learning_record+", pour le caractère "+this.chars_list.charAt(this.current_char_to_learn), this.clientIPv4);
          return;
        }
  
        if(['annuler'].indexOf(msg) !== -1 || vc.isCommand('annuler', msg)){
          this.learning_mode = "";
          this.self.currentMode = "";
          speech("Apprentissage terminé.", this.clientIPv4);
          return;
        }
  
        speech("Voulez-vous garder le mot ? "+this.learning_record+" pour le caractère "+this.chars_list.charAt(this.current_char_to_learn)+" ? Répondez oui, non ou annuler ou un autre mot pour répéter ma question.", this.clientIPv4);
      }
    }
  }
  
  //var learning_chars = new LearnChars(config.config_speech_ip, vc);
  // ====================================
  // ====================================
  
  class Editor{
    constructor(clientIPv4, nodeserver, self){
      this.clientIPv4 = clientIPv4;
      this.nodeserver = nodeserver;
      this.working_mode = "";
      this.chars_list = 'abcdefghijklmnopqrstuvwxyz .,+-()"\'!?:;/\\@#$%^&*_={}[]<>|	`';
      this.self = self;
    }
    start(){
      this.self.currentMode = "editeur";
      speech("Vous lancez le mode editeur.", this.clientIPv4);
    }
    work(msg){
        let vc = this.self;
        if(this.working_mode === ""){
            if(['annuler'].indexOf(msg) !== -1 || vc.isCommand('annuler', msg)){
                this.self.currentMode = "";
                speech("Sortie du mode editeur.", this.clientIPv4);
                return;
            }
    
            if(['lire'].indexOf(msg) !== -1 || vc.isCommand('lire', msg)){
                //speech("Lecture de visual code", this.clientIPv4);
                //this.vscode_read(this.nodeserver);
                this.vscode_readposition(this.nodeserver);
                return;
            }
            if(vc.isCommand('ligne', msg)){
                vscode_execute_code(`
                    let currentLine = cmd.currentLine();
                    let currentChar = cmd.currentChar();
                    cmd.post("http://`+this.nodeserver+`/speak", {
                      msg:"Vous êtes à la ligne "+currentLine+". Caractère "+currentChar+"."
                    });
                `);
                return;
            }
    
            if(vc.isCommand('list_tabs', msg)){
                this.vscode_tabs(this.nodeserver);
                return;
            }
    
            if(vc.isCommand('current_tab', msg)){
                this.vscode_speak_current_tab(this.nodeserver);
                return;
            }
    
            if(vc.isCommand('ouvrir', msg)){
                // TODO l'ouverture
                //this.vscode_switchToEditor(this.nodeserver,filename);
                return;
            }

            if(vc.isCommand('fermer_onglet', msg)){
                this.vscode_close_active_tab(this.nodeserver);
                return;
            }
    
            if(vc.isCommand('lire_position', msg)){
                this.vscode_readposition(this.nodeserver);
                return;
            }
    
            if(['lignes suivantes'].indexOf(msg) !== -1 || vc.isCommand('lignes_suivantes', msg)){
                speech("Passe à la ligne suivante", this.clientIPv4);
                this.vscode_nextline(this.nodeserver);
                return;
            }
    
            if(['ligne précédente'].indexOf(msg) !== -1 || vc.isCommand('lignes_precedantes', msg)){
                speech("Passe à la ligne précédente", this.clientIPv4);
                this.vscode_prevline(this.nodeserver);
                return;
            }
    
    
            if(msg === 'écrire chiffres' || vc.isCommand('ecrire_chiffre', msg)){
                speech("Epelez votre chiffre", this.clientIPv4);
                this.working_mode = "spell_number";
                return;
            }
    
            if(msg === 'écrire lettre' || vc.isCommand('ecrire_lettre', msg)){
                speech("Epelez votre lettre", this.clientIPv4);
                this.working_mode = "spell_char";
                return;
            }
    
            if(msg === 'nouvelle ligne' || vc.isCommand('nouvelle_ligne', msg)){
                this.vscode_addnewline(this.nodeserver);
                return;
            }
    
            if(msg === 'effacer avant' || vc.isCommand('effacer_avant', msg)){
                this.vscode_deletebefore(this.nodeserver);
                return;
            }
            if(msg === 'effacer après' || vc.isCommand('effacer_apres', msg)){
                this.vscode_deleteafter(this.nodeserver);
                return;
            }

            if(['suivant','après','avancer','prochain','flèche droite'].indexOf(msg) !== -1 || vc.isCommand('suivant', msg)){
                this.vscode_cursorMoveToNextChar(this.nodeserver);
                return;
            }
    
            if(['précédent','avant','reviens','reculez','fléche gauche'].indexOf(msg) !== -1 || vc.isCommand('precedent', msg)){
                this.vscode_cursorMoveToPreviousChar(this.nodeserver);
                return;
            }
    
        }
        //===============
        if(this.working_mode === "spell_number"){
                if(msg === 'annuler' || vc.isCommand('annuler', msg)){
                    this.working_mode = "";
                    speech("Sortie du mode Epelez votre chiffre.", this.clientIPv4);
                    return;
                }
                var selected = this.getVoiceToNumber(msg);
                if(selected !== ""){
                    console.log(selected);
                    this.vscode_writemsg(selected, this.nodeserver);
                }
        }
        
        //===============
        if(this.working_mode === "spell_char"){
                if(msg === 'annuler' || vc.isCommand('annuler', msg)){
                    this.working_mode = "";
                    speech("Sortie du mode Epelez votre lettre.", this.clientIPv4);
                    return;
                }
                var selected = this.getVoiceToChar(msg);
                if(selected !== ""){
                    this.vscode_writemsg(selected, this.nodeserver);
                }
        }
    }
    //=============
    getVoiceToChar(msg){
        let vc = this.self;
        for(let i = 0; i < this.chars_list.length; i++){
            let selectedChar = this.chars_list.charAt(i);
            let selectedCharKeyword = char_to_keyword(selectedChar);
            //let selectedCharTitle = char_to_word(selectedChar);
            if(vc.isCommand(selectedCharKeyword, msg)){
            return selectedChar;
            }
        }
        return "";
    }
    //=============
    getVoiceToNumber(msg){
        let vc = this.self;
        for(let i = 0; i < 10; i++){
            if(vc.isCommand(i, msg)){
                return i;
            }
        }
        return "";
    }
    //=============
    vscode_execute_code(code){
        internet.post(config.vs_code_eval, { code: code });
    }
    //=============
    ask_vscode(msg, nodeserver){
      let msg_protected = msg.replaceAll("'", "\'");
      this.vscode_execute_code(`
        let msg = '`+msg_protected+`';
        let readall = cmd.readAll();
        let selected = cmd.readSelected();
        if(selected === ""){
          selected = cmd.readCurrentLine();
        }
        let finalmsg = msg + "\\n\\n" + selected + "\\n\\nVoici mon code en entier:\\n\\n"+readall;
        if(selected+msg !== ""){
          cmd.post("http://`+nodeserver+`/ask", {msg:finalmsg});
        }
      `);
    }

    //=============
    vscode_tabs(nodeserver){
      console.log('tabs');
      this.vscode_execute_code(`
          let tabs = cmd.listOpenEditors();
          
          let files = [];
          for(var i in tabs){
            files.push(cmd.getFileName(tabs[i].uri.fsPath));
          }
          
          cmd.post("http://`+nodeserver+`/speak", {msg:"Liste des onglets ouverts "+JSON.stringify(files).replaceAll('"',"")});
      `);
    }
    vscode_speak_current_tab(nodeserver){
      this.vscode_execute_code(`
          let tab = cmd.getActiveEditorInfo();
          cmd.post("http://`+nodeserver+`/speak", {msg:"L'onglet ouvert est. "+tab.fileName.replaceAll(":",". Deux points. ").replaceAll("\\\\",". Slash. ")+"."});
      `);
    }
    vscode_switchToEditor(nodeserver, filename){
      let filename_protected = filename.replaceAll("'", "\'");
      this.vscode_execute_code(`
          if(cmd.switchToEditor(`+filename_protected+`)){
            cmd.post("http://`+nodeserver+`/speak", {msg:"Document ouvert "+`+filename_protected+`});
          }else{
            cmd.post("http://`+nodeserver+`/speak", {msg:"Erreur. Document pas ouvert "+`+filename_protected+`});
          }
      `);
    }
    vscode_openfile(nodeserver, filename){
      let filename_protected = filename.replaceAll("'", "\'");

      this.vscode_execute_code(`
          if(cmd.openNewEditor(`+filename_protected+`)){
            cmd.post("http://`+nodeserver+`/speak", {msg:"Document ouvert "+`+filename_protected+`});
          }else{
            cmd.post("http://`+nodeserver+`/speak", {msg:"Erreur. Document pas ouvert "+`+filename_protected+`});
          }
      `);
    }
    vscode_close_active_tab(nodeserver){
      this.vscode_execute_code(`
          let tabs = cmd.closeCurrentEditor();
          cmd.post("http://`+nodeserver+`/speak", {msg:"Onglet fermé"});
      `);
    }
    vscode_cursorMoveToPreviousChar(nodeserver){
      this.vscode_execute_code(`
          if(cmd.cursorMoveToPreviousChar()){
              cmd.post("http://`+nodeserver+`/speak", {msg:"Recule de un caractère"});
          }else{
              cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not move to previous char in visual'});
          }
      `);
    }
    vscode_cursorMoveToNextChar(nodeserver){
        this.vscode_execute_code(`
            if(cmd.cursorMoveToNextChar()){
                cmd.post("http://`+nodeserver+`/speak", {msg:"Avance de un caractère"});
            }else{
                cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not move to next char in visual'});
            }
        `);
    }
    vscode_deleteafter(nodeserver){
        this.vscode_execute_code(`
            if(cmd.deleteAfter(1)){
                cmd.post("http://`+nodeserver+`/speak", {msg:"Efface un caractère après"});
            }else{
                cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not delete after in visual'});
            }
        `);
    }
    vscode_deletebefore(nodeserver){
        this.vscode_execute_code(`
            if(cmd.deleteBefore(1)){
                cmd.post("http://`+nodeserver+`/speak", {msg:"Efface un caractère avant"});
            }else{
                cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not delete before in visual'});
            }
        `);
    }
    vscode_addnewline(nodeserver){
        this.vscode_execute_code(`
            if(!cmd.cursorMoveToEndLine()){
            cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not move to end line in visual'});
            }
            if(cmd.addNewLineAtCursorPosition()){
                cmd.post("http://`+nodeserver+`/speak", {msg:"Ajout d'une nouvelle ligne"});
            }else{
                cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not add new line in visual'});
            }
        `);
    }
    vscode_writemsg(msg, nodeserver){
        let msg_protected = msg.toString().replaceAll("'", "\'");
        this.vscode_execute_code(`
            if(cmd.insertInEditorAtCurrentPosition('`+msg_protected+`')){
                cmd.post("http://`+nodeserver+`/speak", {msg:"Ecriture `+msg_protected+`"});
            }else{
                cmd.post("http://`+nodeserver+`/speak", {msg:'Error Can not write in visual'});
            }
        `);
    }
    vscode_ask(msg, nodeserver){
        let msg_protected = msg.replaceAll("'", "\'");
        this.vscode_execute_code(`
            let selected = cmd.readSelected();
            if(selected === ""){
                selected = cmd.readCurrentLine();
            }
            let msg = '`+msg_protected+`';
            let finalmsg = msg + "\\n\\n" + selected;
            if(selected+msg !== ""){
                cmd.post("http://`+nodeserver+`/ask", {msg:finalmsg});
            }
        `);
    }
    vscode_read(nodeserver){
        this.vscode_execute_code(`
            let selected = cmd.readSelected();
            if(selected === ""){
                selected = cmd.readCurrentLine();
            }
            if(selected !== ""){
                cmd.post("http://`+nodeserver+`/spell", {msg:selected});
            }
        `);
    }
    vscode_readposition(nodeserver){
        this.vscode_execute_code(`
            let before = cmd.readCurrentLineBeforePosition();
            let after = cmd.readCurrentLineAfterPosition();
            if(before+after === ""){
                cmd.post("http://`+nodeserver+`/speak", {msg:"La ligne est vide"});
            }else{
                cmd.post("http://`+nodeserver+`/speak", {msg:before+after+". J'épelle."});
                cmd.post("http://`+nodeserver+`/spell", {msg:before+"£"+after});
            }
        `);
    }
    vscode_nextline(nodeserver){
        this.vscode_execute_code(`
            let res = cmd.cursorMoveToNextLine();
            if(!res){
                if(cmd.isCursorLastLine()){
                    cmd.post("http://`+nodeserver+`/speak", {msg:"Vous êtes à la dernière ligne"});
                }
            }
        `);
    }
    vscode_prevline(nodeserver){
        this.vscode_execute_code(`
            let res = cmd.cursorMoveToPrevLine();
            if(!res){
                if(cmd.isCursorFistLine()){
                    cmd.post("http://`+nodeserver+`/speak", {msg:"Vous êtes à la première ligne"});
                }
            }
        `);
    }
  }
  //var editor = new Editor(config.config_speech_ip, config.nodeserver, vc);
  
  /*
  // ====================================
  
  class SpellNumbers{
    constructor(clientIPv4, self){
      this.clientIPv4 = clientIPv4;
      this.self = self;
  
    }
    spelling(msg){
      
    }
  }
  
  var spellnumbers = new SpellNumbers(config.config_speech_ip, vc);
  
  // ====================================
  
  class SpellAlphabetic{
    constructor(clientIPv4, self){
      this.clientIPv4 = clientIPv4;
      this.self = self;
  
    }
    spelling(msg){
  
    }
  }
  
  var spellalphabetic = new SpellAlphabetic(config.config_speech_ip, vc);
  */
  


class MainSpeakCommands{
    constructor(){
        this.vc = new VocalCommand();
        this.editor = new Editor(config.config_speech_ip, config.nodeserver, this.vc);
        this.learning_chars = new LearnChars(config.config_speech_ip, this.vc);
        this.learning_numbers = new LearnNumbers(config.config_speech_ip, this.vc);
        this.learning_command = new LearningCommand(config.config_speech_ip, this.vc);
        this.visual = new VisualCodeCommands(config.config_speech_ip, this.vc);
        this.questionllm = new QuestionToLLM(config.config_speech_ip, this.vc);
    }
    speech(msg, clientIP){
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
    spell(msg, clientIP) {
        let newmsg = "";
        for (let i = 0; i < msg.length; i++) {
          newmsg = newmsg.concat("§" + msg.charAt(i));
        }
        newmsg = char_to_word(newmsg);
        newmsg = newmsg.replaceAll("§", ". ");
        speech(newmsg, clientIP);
    }
    ask(msg, onresult){ 
        internet.ask_lmstudio(msg, onresult);
        internet.ask_anythinglm(msg, "general", false, onresult, config.anythingllm.bearer);
        internet.ask_anythinglm(msg, "nodejs", true, onresult, config.anythingllm.bearer);
    }
      

    speak(msg, clientIPv4){

        // ===================
        if(this.vc.typeSpeak === "alphabet" || this.vc.typeSpeak === "numeric"){
            if(["oui","ok","okay","envoyer"].indexOf(msg) !== -1){
            if(this.questionllm.spelling !== ""){
                this.vc.typeSpeak = "";
                if(this.questionllm.spelling !== "" && this.questionllm.spelling !== undefined){
                    if(this.questionllm.question !== "" && this.questionllm.question !== undefined){
                        this.questionllm.old.push(this.questionllm.question);
                    }
                    this.questionllm.question += this.questionllm.spelling + " ";
                    this.speech(this.questionllm.question, clientIPv4);
                }
            }else{
                this.speech("Pas de caractère dicté", clientIPv4);
            }
            return;
            }
            if(["répète"].indexOf(msg) !== -1){
            if(this.questionllm.spelling === ""){
                this.speech("Pas de caractère en mémoire à répéter", clientIPv4);
            }else{
                this.speech(this.questionllm.spelling, clientIPv4);
            }
            return;
            }
            if(["non"].indexOf(msg) !== -1){
            if(this.questionllm.spelling_old.length == 0 || this.questionllm.spelling_old[this.questionllm.spelling_old.length - 1] === ""){
                this.speech("Annulation du mot "+this.questionllm.spelling+". Vous n'avez plus rien en mémoire", clientIPv4);
                questionllm.spelling = "";
            }else{
                this.speech("Annulation du mot "+this.questionllm.spelling+". Votre question restante est "+this.questionllm.spelling_old[this.questionllm.spelling_old.length - 1], clientIPv4);
                this.questionllm.spelling = this.questionllm.spelling_old[this.questionllm.spelling_old.length - 1];
                this.questionllm.spelling_old.pop(); // remove last item
            }
            return;
            }
        }
        if(this.vc.typeSpeak === "alphabet"){
            if(this.vc.isCommandAlphabet(msg)){
                if(this.questionllm.spelling !== "" && this.questionllm.spelling !== undefined){
                    this.questionllm.spelling_old.push(this.questionllm.spelling);
                }
                this.questionllm.spelling += this.vc.getCommandNumeric(msg);
                this.speech(this.questionllm.spelling, clientIPv4);
            }
            return;
        }
        if(this.vc.typeSpeak === "numeric"){
            if(this.vc.isCommandNumeric(msg)){
                if(this.questionllm.spelling !== "" && this.questionllm.spelling !== undefined){
                    this.questionllm.spelling_old.push(this.questionllm.spelling);
                }
                this.questionllm.spelling += vc.getCommandNumeric(msg);
                this.speech(this.questionllm.spelling, clientIPv4);
            }
            return;
        }
        if(["dictée lettres"].indexOf(msg) !== -1){
            this.vc.typeSpeak = "alphabet";
            this.questionllm.spelling = "";
            this.questionllm.spelling_old = [];
            return;
        }
        if(["dictée chiffres","dites chiffres","zut ce chiffre"].indexOf(msg) !== -1){
            this.vc.typeSpeak = "numeric";
            this.questionllm.spelling = "";
            this.questionllm.spelling_old = [];
            return;
        }
        // =================== Ask LLM
        if(this.vc.currentMode == "question"){
            this.questionllm.add(msg);
            return;
        }
        if(this.vc.isCommand('question', msg)){
            this.questionllm.clientIPv4 = clientIPv4;
            this.questionllm.start();
            return;
        }
    
    
        // =================== Ask LLM for Visual Studio
        if(this.vc.currentMode == "question_vscode"){
            this.visual.ask(msg);
            return;
        }
        if(this.vc.isCommand('vscode', msg)){
            this.visual.clientIPv4 = clientIPv4;
            this.visual.start();
            return;
        }
        // =================== Learning Bases
        if(this.vc.currentMode == "learning_command"){
            this.learning_command.learn(msg);
            return; 
        }
        if(['apprendre commande'].indexOf(msg) !== -1 || this.vc.isCommand('apprendre_commande', msg)){
            this.learning_command.clientIPv4 = clientIPv4;
            this.learning_command.start();
            return;
        }
        // =================== Learning Numbers
        if(this.vc.currentMode == "learning_numbers"){
            this.learning_numbers.learn(msg);
            return;
        }
        if(['apprendre chiffres'].indexOf(msg) !== -1 || this.vc.isCommand('apprendre_chiffres', msg)){
            this.learning_numbers.clientIPv4 = clientIPv4;
            this.learning_numbers.start();
            return;
        }
        // =================== Learning Chars
        if(this.vc.currentMode == "learning_chars"){
            this.learning_chars.learn(msg);
            return;
        }
        if(['apprendre lettre',"apprends de l'être"].indexOf(msg) !== -1 || this.vc.isCommand('apprendre_lettres', msg)){
            this.learning_chars.clientIPv4 = clientIPv4;
            this.learning_chars.start();
            return;
        }
        // =================== Editeur vscode
        if(this.vc.currentMode == "editeur"){
            this.editor.work(msg);
            return;
        }
        if(['éditeur',"l'éditeur"].indexOf(msg) !== -1 || this.vc.isCommand('editeur', msg)){
            this.editor.clientIPv4 = clientIPv4;
            this.editor.nodeserver = config.nodeserver;
            this.editor.start();
            return;
        }
        // =================== Last commands (must be at the end)
        if(this.vc.isCommand('repeter', msg)){
            this.speech(startMessage, clientIPv4);
            return;
        }
    
        if(['test',"testé","tester"].indexOf(msg) !== -1){
            this.tester();
        }

        return;
        questionllm = new QuestionToLLM(clientIPv4, vc);
        questionllm.start();
        questionllm.add(msg);

    }
    tester(){


    }
}


const speakcommands = new MainSpeakCommands();

// Export variable
module.exports = speakcommands;