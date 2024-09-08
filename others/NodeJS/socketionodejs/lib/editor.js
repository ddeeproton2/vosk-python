
// Todo
// Quand on sélectionne un mot, qu'on puisse l'entrainer vocalement

const {speech, char_to_word, char_to_keyword} = require('./speech.js');
const config = require('../config.js');
const internet = require('./connexions.js');
const VSInterface = require('./visualstudio/vsinterface.js');



  //var learning_chars = new LearnChars(config.config_speech_ip, vc);
  // ====================================
  // ====================================
  
  class Editor{
    constructor(clientIPv4, nodeserver, self){
      this.vs_interface = new VSInterface(config.config_speech_ip, config.nodeserver, self);
      this.clientIPv4 = clientIPv4;
      this.nodeserver = nodeserver;
      this.working_mode = "";
      this.persistent_data = {};
      this.self = self;
      this.old = [];
    }
    start(){
      this.self.currentMode = "editeur";
      speech("Vous lancez le mode editeur.", this.clientIPv4);
    } 
    work(msg){
      let selected_number = this.editor.vs_interface.getVoiceToNumber(msg);

      let vc = this.self;
      let vs_interface = this.vs_interface;
      //=====================================================================================
      // General Commands 
      //=====================================================================================

      // Pour réindenter
      //vscode.commands.executeCommand(‘editor.action.formatDocument’);
      ///
      // Ligne (dire numéro de ligne)
      if(vc.isCommand('aide', msg)){
        var msg = `
        micro,
        annuler,         
        ligne, 
        onglet ou titre, 
        fermer onglet, 
        ligne suivante, 
        ligne précédente, 
        ajoutez une ligne, 
        effacer avant, 
        effacer après, 
        précédent ou fléche gauche, 
        sélectionnez ligne, 
        couper,
        copier, 
        coller, 
        sauvegarder, 
        revenir, 
        rétablir, 
        plein ecran,
        agrandir,
        reduire,
        page suivante,
        page precedante,
        debut ligne, 
        fin de ligne,
        terminale,
        definition,
        apprendre,
        lire, 
        écrire chiffre, 
        écrire lettre, 
        ouvrir, 
        chercher 
        `;
        let msg_protected = msg.replaceAll("`", "\`");
        vs_interface.vscode_execute_code(`
          let msg = \``+msg_protected+`\`;
          let currentLine = cmd.currentLine();
          let currentChar = cmd.currentChar();
          cmd.post("http://`+this.nodeserver+`/speak", {
            msg:msg
          });
        `);
        return;
      }

      // Sortir
      if(['annuler'].indexOf(msg) !== -1 || vc.isCommand('annuler', msg)){
        this.self.currentMode = "";
        speech("Sortie du mode editeur.", this.clientIPv4);
        return;
      }


      if(this.working_mode === ""){

        // Ligne (dire numéro de ligne)
        if(vc.isCommand('ligne', msg)){
          vs_interface.vscode_execute_code(`
            let currentLine = cmd.currentLine();
            let currentChar = cmd.currentChar();
            cmd.post("http://`+this.nodeserver+`/speak", {
              msg:"Vous êtes à la ligne "+currentLine+". Caractère "+currentChar+"."
            });
          `);
          return;
        }



        /*
        // ======================
        // Bad code
        if(vc.isCommand('list_tabs', msg)){
            this.vscode_tabs(this.nodeserver);
            return;
        }

        json voice:
          "list_tabs": [
            "les onglets",
            "le anglais",
            "les anglais",
            "les enjeux",
            "les ongles",
            "liste"
          ],
        // ======================
        */

        if(vc.isCommand('current_tab', msg)){
          vs_interface.vscode_speak_current_tab(this.nodeserver);
          return;
        }

        if(vc.isCommand('fermer_onglet', msg)){
          vs_interface.vscode_close_active_tab(this.nodeserver);
          return;
        }

        /*
        if(vc.isCommand('lire_position', msg)){
          this.vscode_readposition(this.nodeserver);
          return;
        }
        */

        if(['lignes suivantes'].indexOf(msg) !== -1 || vc.isCommand('lignes_suivantes', msg)){
          speech("Passe à la ligne suivante", this.clientIPv4);
          vs_interface.vscode_nextline(this.nodeserver);
          return;
        }

        if(['ligne précédente'].indexOf(msg) !== -1 || vc.isCommand('lignes_precedantes', msg)){
          speech("Passe à la ligne précédente", this.clientIPv4);
          vs_interface.vscode_prevline(this.nodeserver);
          return;
        }

        if(msg === 'nouvelle ligne' || vc.isCommand('nouvelle_ligne', msg)){
          vs_interface.vscode_addnewline(this.nodeserver);
          return;
        }

        if(msg === 'effacer avant' || vc.isCommand('effacer_avant', msg)){
          vs_interface.vscode_deletebefore(this.nodeserver);
          return;
        }

        if(msg === 'effacer après' || vc.isCommand('effacer_apres', msg)){
          vs_interface.vscode_deleteafter(this.nodeserver);
          return;
        }

        if(vc.isCommand('effacer_selection', msg)){
          console.log("effacer:)");
          vs_interface.vscode_execute_code(`
            cmd.deleteSelection();
          `);
          return;
        }

        if(['suivant','après','avancer','prochain','flèche droite'].indexOf(msg) !== -1 || vc.isCommand('suivant', msg)){
          vs_interface.vscode_cursorMoveToNextChar(this.nodeserver);
          return;
        }

        if(['précédent','avant','reviens','reculez','fléche gauche'].indexOf(msg) !== -1 || vc.isCommand('precedent', msg)){
          vs_interface.vscode_cursorMoveToPreviousChar(this.nodeserver);
          return;
        }

        if(vc.isCommand('select_line', msg)){
          vs_interface.vscode_execute_code(`
            let isSelected = cmd.selectCurrentLine();
            if(isSelected){
              cmd.post("http://`+this.nodeserver+`/speak", {msg: "Ligne sélectionnée"});
            }else{
              cmd.post("http://`+this.nodeserver+`/speak", {msg: "Erreur, la Ligne n'est pas sélectionnée"});
            }
          `);
          return;
        }
      
      }

      if(vc.isCommand('cut', msg)){
        vs_interface.vscode_execute_code(`
          cmd.setClipboard( cmd.readSelected() );
          cmd.deleteSelection();
        `);
        speech("couper", this.clientIPv4);
        return;
      }

      if(vc.isCommand('copy', msg)){
        vs_interface.vscode_execute_code(`cmd.setClipboard( cmd.readSelected() );`);
        speech("copie", this.clientIPv4);
        return;
      }

      if(vc.isCommand('past', msg)){
        vs_interface.vscode_execute_code(`
          cmd.getClipboard().then((text)=>{
            cmd.insertInEditorAtCurrentPosition( text );
          });
        `);
        speech("coller", this.clientIPv4);
        return;
      }

      if(vc.isCommand('save', msg)){
        vs_interface.vscode_execute_code(`cmd.save();`);
        speech("Sauvegarder", this.clientIPv4);
        return;
      }

      if(vc.isCommand('undo', msg)){
        vs_interface.vscode_execute_code(`cmd.undo();`);
        speech("Revenir", this.clientIPv4);
        return;
      }

      if(vc.isCommand('redo', msg)){
        vs_interface.vscode_execute_code(`cmd.redo();`);
        speech("Rétablir", this.clientIPv4);
        return;
      }

      if(vc.isCommand('fullscreen', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('workbench.action.toggleFullScreen');`);
        speech("Plein écran", this.clientIPv4);
        return;
      }

      if(vc.isCommand('zoom_in', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('workbench.action.zoomIn');`);
        speech("Agrandir", this.clientIPv4);
        return;
      }

      if(vc.isCommand('zoom_out', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('workbench.action.zoomOut');`);
        speech("Réduire", this.clientIPv4);
        return;
      }

      if(vc.isCommand('page_down', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('cursorPageDown');`);
        //vs_interface.vscode_execute_code(`vscode.commands.executeCommand('scrollPageDown');`);
        speech("Descend la page", this.clientIPv4);
        return;
      }

      if(vc.isCommand('page_up', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('cursorPageUp');`);
        //vs_interface.vscode_execute_code(`vscode.commands.executeCommand('scrollPageUp');`);
        speech("Monte la page", this.clientIPv4);
        return;
      }

      if(vc.isCommand('home', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('cursorHome');`);
        speech("Le curseur est placé au début", this.clientIPv4);
        return;
      }

      if(vc.isCommand('end', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('cursorEnd');`);
        speech("Le curseur est placé é la fin", this.clientIPv4);
        return;
      }

      if(vc.isCommand('terminal', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');`);
        speech("Terminal", this.clientIPv4);
        return;
      }

      if(vc.isCommand('godefinition', msg)){
        vs_interface.vscode_execute_code(`vscode.commands.executeCommand('editor.action.revealDefinition');`);
        speech("definition", this.clientIPv4);
        return;
      }
    
      //=====================================================================================
      // Multi Modes
      //=====================================================================================

      if(this.working_mode === ""){
        if(vc.isCommand('learn', msg)){
          vs_interface.vscode_execute_code(`
            let selected = cmd.readSelected();
            if(selected === ""){
              cmd.post("http://`+this.nodeserver+`/speak", {
                msg: "Aucun mot sélectionné dans l'éditeur"
              });
            }else{
              cmd.get("http://`+this.nodeserver+`/speak?msg="+btoa(JSON.stringify({action:"learn",selected:selected})))
            }
          `);
          this.working_mode = "wait_for_start_learning";
          return;
        }

      }
      if(this.working_mode === "wait_for_start_learning"){
        try{
          this.persistent_data = JSON.parse(atob(msg));
          if(this.persistent_data.action === "learn"){
            speech("Apprentissage de la commande ID. "+this.persistent_data.selected, this.clientIPv4);
          }
          this.working_mode = "selection_confirmed_start_learning";
        }catch(error) {
          console.error('Error fetching data:', error);
          speech("Erreur dans la réception de donnée", this.clientIPv4);
          this.working_mode = "";
        }
        return;
      }
      if(this.working_mode === "selection_confirmed_start_learning"){
        if(vc.isCommand('annuler', msg)){
          this.working_mode === "";
          speech("Sortie de l'apprentissage du mot "+this.persistent_data.selected, this.clientIPv4);
          return;
        }

        this.persistent_data.msg = msg;
        if(vc.isCommand(this.persistent_data.selected, msg)){
          speech("J'ai reconnu le mot "+msg, this.clientIPv4);  
          return;
        }

        speech("Est-ce que pour la commande, "+this.persistent_data.selected+" je rajoute le mot ? "+msg, this.clientIPv4);
        this.working_mode = "new_command_confirm_learning";
        return;
      }
      if(this.working_mode === "new_command_confirm_learning"){
        if(vc.isCommand('annuler', msg)){
          this.working_mode === "";
          speech("Sortie de l'apprentissage du mot "+this.persistent_data.selected, this.clientIPv4);
          return;
        }

        if(vc.isCommand('oui', msg)){
          vc.add(this.persistent_data.selected, this.persistent_data.msg);
          speech("Enregistrement pour la commande, "+this.persistent_data.selected+" du mot "+this.persistent_data.msg, this.clientIPv4);
          this.working_mode = "selection_confirmed_start_learning";
          return;
        }

        if(vc.isCommand('non', msg)){
          speech("Annulation de l'enregistrement pour la commande, "+this.persistent_data.selected+" du mot "+msg, this.clientIPv4);
          this.working_mode = "selection_confirmed_start_learning";
          return;
        }

        // Repeat question
        speech("Est-ce que pour la commande, "+this.persistent_data.selected+" je rajoute le mot ? "+msg+" Dites oui, non, ou annuler.", this.clientIPv4);
        return;
      }

      // ================================================================
      
      // Lire
      if(this.working_mode === ""){
        if(['lire'].indexOf(msg) !== -1 || vc.isCommand('lire', msg)){
          this.working_mode = "continue_to_read";
          vs_interface.vscode_read(this.nodeserver);
          return;
        }
      }
      
      if(this.working_mode === "continue_to_read"){
        if(vc.isCommand('non', msg) || vc.isCommand('annuler', msg)){
            this.working_mode = "";
            speech("Sortie lecture de ligne", this.clientIPv4);
            return;
        }
        if(vc.isCommand('ok', msg)
        || vc.isCommand('lire', msg)
        || vc.isCommand('oui', msg)){
          vs_interface.vscode_nextline(this.nodeserver);
          vs_interface.vscode_read(this.nodeserver);          
        }
      }
    



      //===============
      if(this.working_mode === ""){
        if(msg === 'écrire chiffres' || vc.isCommand('ecrire_chiffre', msg)){
            speech("Epelez votre chiffre", this.clientIPv4);
            this.working_mode = "spell_number";
            return;
        }
      }

      if(this.working_mode === "spell_number"){
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
            this.working_mode = "";
            speech("Sortie du mode Epelez votre chiffre.", this.clientIPv4);
            return;
        }
        var selected = vs_interface.getVoiceToNumber(msg);
        if(selected !== ""){
            console.log(selected);
            vs_interface.vscode_writemsg(selected, this.nodeserver);
        }
      }
      
      //===============
      if(this.working_mode === ""){
        if(msg === 'écrire lettre' || vc.isCommand('ecrire_lettre', msg)){
            speech("Epelez votre lettre", this.clientIPv4);
            this.working_mode = "spell_char";
            return;
          }
      }

      if(this.working_mode === "spell_char"){
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.working_mode = "";
          speech("Sortie du mode Epelez votre lettre.", this.clientIPv4);
          return;
        }
        var selected = vs_interface.getVoiceToChar(msg);
        if(selected !== ""){
          vs_interface.vscode_writemsg(selected, this.nodeserver);
        }
      }
      //===============
      if(this.working_mode === ""){
        if(vc.isCommand('open', msg)){
            const directoryPath = dir.currentdir(); 
            //console.log("OPEN "+directoryPath);
            this.working_mode = "spell_number_menu";
            vs_interface.open(directoryPath);
            return;
        }
      }

      if(this.working_mode === "spell_number_menu"){
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.working_mode = "";
          speech("Sortie du mode Epelez votre chiffre.", this.clientIPv4);
          return;
        }
        if(msg === 'ok' || vc.isCommand('ok', msg)){
          this.working_mode = "";
          if(dir.exists(this.files[this.final_number])){
            console.log("Ouverture du dossier. "+this.filesnames[this.final_number]);
            vs_interface.open(this.files[this.final_number]+"/");
            return;
          }
          if(file.exists(this.files[this.final_number])){
            console.log("Ouverture du fichier. "+this.files[this.final_number]);
            vs_interface.vscode_openfile(this.nodeserver, this.files[this.final_number]);
            return;
          }
          return;
        }
        var selected = vs_interface.getVoiceToNumber(msg);
        if(selected !== ""){
          console.log(selected);
          this.final_number += selected; 
          //this.vscode_writemsg(selected, this.nodeserver);
        }
      }
      //===============

      if(this.working_mode === "spell_number_find"){
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
            this.working_mode = "";
            speech("Sortie du mode chercher un chiffre.", this.clientIPv4);
            return;
        }
        if(msg === 'chiffre' || vc.isCommand('chiffre', msg)){
          this.working_mode = "spell_number_find";
          speech("Chercher mode chiffre", this.clientIPv4);
        }
        if(msg === 'lettre' || vc.isCommand('lettre', msg)){
          this.working_mode = "spell_char_find";
          speech("Chercher mode lettres", this.clientIPv4);
        }
        if(["non"].indexOf(msg) !== -1){
          if(this.old.length == 0 || this.old[this.old.length - 1] === ""){
              speech("Annulation du mot "+this.final_find_search+". Vous n'avez plus rien en mémoire", this.clientIPv4);
              this.final_find_search = "";
          }else{
              speech("Annulation du mot "+this.final_find_search+". Votre recherche restante est "+this.old[this.old.length - 1], this.clientIPv4);
              this.final_find_search = this.old[this.old.length - 1];
              this.old.pop(); // remove last item
          }
          return;
        }
        if(msg === 'ok' || vc.isCommand('ok', msg)){
          this.working_mode = "";
          let msg_protected = this.final_find_search.replaceAll("'", "\'");
          vs_interface.vscode_execute_code(`
            let msg = '`+msg_protected+`';
            cmd.findText(msg);
          `);
          return;
        }
        var selected = vs_interface.getVoiceToNumber(msg);
        if(selected !== ""){
            //console.log(selected);
            //this.vscode_writemsg(selected, this.nodeserver);
            if(this.final_find_search !== ""){
              this.old.push(this.final_find_search);
            }
            this.final_find_search += selected; 
            console.log(this.final_find_search);
            speech(char_to_word(selected), this.clientIPv4);
        }
      }
      
      //===============
      if(this.working_mode === "spell_char_find"){
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.working_mode = "";
          speech("Sortie du mode chercher une lettre.", this.clientIPv4);
          return;
        }
        if(msg === 'chiffre' || vc.isCommand('chiffre', msg)){
          this.working_mode = "spell_number_find";
          speech("Chercher mode chiffre", this.clientIPv4);
          return;
        }
        if(msg === 'lettre' || vc.isCommand('lettre', msg)){
          this.working_mode = "spell_char_find";
          speech("Chercher mode lettres", this.clientIPv4);
          return;
        }
        if(["non"].indexOf(msg) !== -1){
          if(this.old.length == 0 || this.old[this.old.length - 1] === ""){
              speech("Annulation du mot "+this.final_find_search+". Vous n'avez plus rien en mémoire", this.clientIPv4);
              this.final_find_search = "";
          }else{
              speech("Annulation du mot "+this.final_find_search+". Votre recherche restante est "+this.old[this.old.length - 1], this.clientIPv4);
              this.final_find_search = this.old[this.old.length - 1];
              this.old.pop(); // remove last item
          }
          return;
        }
        if(msg === 'ok' || vc.isCommand('ok', msg)){
          this.working_mode = "";
          let msg_protected = this.final_find_search.replaceAll("'", "\'");
          vs_interface.vscode_execute_code(`
            let msg = '`+msg_protected+`';
            cmd.findText(msg);
          `);
          return;
        }
        var selected = vs_interface.getVoiceToChar(msg);
        if(selected !== ""){
          //this.vscode_writemsg(selected, this.nodeserver);
          if(this.final_find_search !== ""){
            this.old.push(this.final_find_search);
          }
          this.final_find_search += selected; 
          console.log(this.final_find_search);
          speech(char_to_word(selected), this.clientIPv4);
        }
      }
      //===============
      if(this.working_mode === ""){
  
        if(vc.isCommand('find', msg)){
          vs_interface.vscode_execute_code(`vscode.commands.executeCommand('actions.find');`); // find open
          speech("Chercher", this.clientIPv4);
          /*
          setTimeout(function(){
            vs_interface.vscode_execute_code(`vscode.commands.executeCommand('editor.action.nextMatchFindAction');`); // find next
            //vs_interface.vscode_execute_code(`vscode.commands.executeCommand('closeFindWidget');`); // find close
          },3000);
          */
          return;
        }

        /*
        if(vc.isCommand('find', msg)){
          //editor.action.extensioneditor.showfind
          this.working_mode = "find_menu";
          speech("Voulez-vous épeller des chiffres ou des lettres ?", this.clientIPv4);
          
          this.vscode_execute_code(`
            cmd.findText("Ligne");
          `);
          
          return;
        }
        */

      }

      if(this.working_mode === "find_menu"){
        this.final_find_search = ""; 
        if(msg === 'chiffres' || vc.isCommand('chiffre', msg)){
          this.working_mode = "spell_number_find";
          speech("Chercher mode chiffre", this.clientIPv4);
        }
        if(msg === 'lettre' || vc.isCommand('lettre', msg)){
          this.working_mode = "spell_char_find";
          speech("Chercher mode lettres", this.clientIPv4);
        }
        if(msg === 'annuler' || vc.isCommand('annuler', msg)){
          this.working_mode = "";
          speech("Sortie du mode chercher un mot.", this.clientIPv4);
          return;
        }
      }


    }
  }
  //var editor = new Editor(config.config_speech_ip, config.nodeserver, vc);


// Export variable
module.exports = Editor;