const {speech, char_to_word, char_to_keyword} = require('../speech.js');
const config = require('../../config.js');
const internet = require('../connexions.js');



  // var vscommands = new VSCommands(config.config_speech_ip, vc);
  // ====================================
  // ====================================

  class VSInterface{
    constructor(clientIPv4, nodeserver, self){
      this.clientIPv4 = clientIPv4;
      this.nodeserver = nodeserver;
      this.chars_list = 'abcdefghijklmnopqrstuvwxyz .,+-()"\'!?:;/\\@#$%^&*_={}[]<>|	`';
      this.tabs = [];
      this.self = self;
    }
    //=============
    //=============
    open(directoryPath){
      // Lister le contenu d'un répertoire (full path)
      dir.readDirectory(directoryPath).then(files => {
        
        this.files = files; 
        this.files.unshift( dir.parent(directoryPath) ); 
        this.final_number = "";

        // List only files names for speaking
        dir.listDirectory(directoryPath).then(filesnames => {
          var f, msg = "";
          msg += "Dossier actuel. "+ dir.noEndingSlash(directoryPath).replaceAll("/", ". slash. ")+".  Sélectionnez le fichier désiré. ";
          console.log("Dossier actuel:");
          console.log(directoryPath);
          console.log("Sélectionnez le fichier désiré:")
          f = "Dites 0. Pour le dossier parent. ";
          msg += f;
          console.log(f);

          for(var i in filesnames){
            f = (parseInt(i)+1) + ". " + filesnames[i]+". ";
            msg += f;
            console.log(f);
          }
          this.filesnames = filesnames; 
          this.filesnames.unshift( file.filename( dir.parent(directoryPath) ) );
          speech(msg, this.clientIPv4);
        });
      });
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

    /*
    Don't do what expected
    //=============
    vscode_tabs(nodeserver){
      console.log('tabs');
      this.vscode_execute_code(`
          let tabs = vscode.workspace.textDocuments;
          let files = [];
          let count = 1;
          for(var i in tabs){
            files.push(" "+count+". "+cmd.getFileName(tabs[i].uri.fsPath));
            count++;
          }
          cmd.post("http://`+nodeserver+`/speak", {msg:"Liste des onglets ouverts "+JSON.stringify(files).replaceAll('"',"")});
      `);
    }
    */
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
      filename = file.parse(filename);
      this.tabs.push(filename);
      let filename_protected = filename.replaceAll("'", "\'");
      this.vscode_execute_code(`
        try{
          cmd.open('`+filename_protected+`');
        } catch (error) {
          cmd.post("http://`+nodeserver+`/speak", {msg:"Erreur: "+error});
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
        let currentLine = cmd.currentLine() + 1;
        let currentChar = cmd.currentChar() + 1;
        let before = cmd.readCurrentLineBeforePosition();
        let after = cmd.readCurrentLineAfterPosition();
        if(before+after === ""){
          cmd.post("http://`+nodeserver+`/speak", {msg: "Vous êtes à la ligne "+currentLine+". Caractère "+currentChar+". La ligne est vide"});
        }else{
          cmd.post("http://`+nodeserver+`/spell", {spell:before+"£"+after,msg_start: "Vous êtes à la ligne "+currentLine+". Caractère "+currentChar+". "+before+after+". J'épelle.", msg_end:"Est-ce que je continue la ligne suivante ?"});
          
        }
      `);
    }
    vscode_read_simple(nodeserver){
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
  

// Export variable
module.exports = VSInterface;