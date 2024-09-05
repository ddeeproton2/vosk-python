const config = require('../config.js');
const dir = require('./directoriesmanager.js');
const file = require('./filesmanager.js');
const internet = require('./connexions.js');
const PGP = require('./PGP.js');
const Editor = require('./editor.js');
const {speech, char_to_word, char_to_keyword} = require('./speech.js');



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
      if(!dir.exists(dirname)){
        dir.createDirectory(dirname);
      }
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
      let vc = this.self;
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
        this.isMicro = true;
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
    spell_OLD(msg, clientIP) {
        let newmsg = "";
        for (let i = 0; i < msg.length; i++) {
          newmsg = newmsg.concat("§" + msg.charAt(i));
        }
        newmsg = char_to_word(newmsg);
        newmsg = newmsg.replaceAll("§", "... ");
        speech(newmsg, clientIP);
    }
    spell(msg_start, spell, msg_end, clientIP) {
        var letters = [];
        let d = {
          value:'',
          word:'',
          count:0
        };

        for (let i = 0; i < spell.length; i++) {
          d.count++;
          d.value = spell.charAt(i);
          d.word = char_to_word(spell.charAt(i));

          // if next char is not a repetition
          if(!(i+1 < spell.length && spell.charAt(i) == spell.charAt(i+1))){
            letters.push({
              count:d.count,
              value:d.value,
              word:d.word
            });
            d.count = 0;
            d.value = '';
            d.word = '';
          }
        }
        let newmsg = msg_start+" ";
        for (let i in letters) {
          if(letters[i].count === 1){
            newmsg = newmsg.concat(letters[i].word + "... ");
          }else{
            newmsg = newmsg.concat(letters[i].count +" fois " + letters[i].word + "... ");
          }
        }
        newmsg = newmsg.concat(" "+msg_end);
        speech(newmsg, clientIP);
    }
    ask(msg, onresult){ 
        internet.ask_lmstudio(msg, onresult);
        internet.ask_anythinglm(msg, "general", false, onresult, config.anythingllm.bearer);
        internet.ask_anythinglm(msg, "nodejs", true, onresult, config.anythingllm.bearer);
    }
    speak(msg, clientIPv4){
      let selected_number = this.editor.vs_interface.getVoiceToNumber(msg);

      if(this.vc.isCommand('micro', msg) ||  selected_number === 0){
        this.isMicro = !this.isMicro;
        if(this.isMicro){
          this.speech("Le micro est activé", clientIPv4);
        }else{
          this.speech("Le micro est désactivé", clientIPv4);
        }
      }
      if(!this.isMicro){ console.log("[Micro OFF] "+msg); return; }

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
      if(this.vc.isCommand('question', msg) ||  selected_number === 3){
          this.questionllm.clientIPv4 = clientIPv4;
          this.questionllm.start();
          return;
      }
      // =================== Ask LLM for Visual Studio
      if(this.vc.currentMode == "question_vscode"){
          this.visual.ask(msg);
          return;
      }
      if(this.vc.isCommand('vscode', msg) ||  selected_number === 2){
          this.visual.clientIPv4 = clientIPv4;
          this.visual.start();
          return;
      }
      // =================== Learning Bases
      if(this.vc.currentMode == "learning_command"){
          this.learning_command.learn(msg);
          return; 
      }
      if(this.vc.isCommand('learn_commands', msg) ||  selected_number === 4){
          this.learning_command.clientIPv4 = clientIPv4;
          this.learning_command.start();
          return;
      }
      // =================== Learning Numbers
      if(this.vc.currentMode == "learning_numbers"){
          this.learning_numbers.learn(msg);
          return;
      }
      if(this.vc.isCommand('learn_numbers', msg) ||  selected_number === 5){
          this.learning_numbers.clientIPv4 = clientIPv4;
          this.learning_numbers.start();
          return;
      }
      // =================== Learning Chars
      if(this.vc.currentMode == "learning_chars"){
          this.learning_chars.learn(msg);
          return;
      }
      if(this.vc.isCommand('learn_letters', msg) ||  selected_number === 6){
          this.learning_chars.clientIPv4 = clientIPv4;
          this.learning_chars.start();
          return;
      }
      // =================== Editeur vscode
      if(this.vc.currentMode == "editeur"){
          this.editor.work(msg);
          return;
      }
      if(['éditeur',"l'éditeur"].indexOf(msg) !== -1 || this.vc.isCommand('editeur', msg) || selected_number === 1){
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


      let list_commandes = `
        0. Micro.
        1. Editeur, travail. 
        2. Question code.
        3. Question.
        4. Apprendre commandes.
        5. Apprendre chiffres.
        6. Apprendre lettres
      `;
      console.log(list_commandes);
      this.speech(list_commandes, clientIPv4);

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