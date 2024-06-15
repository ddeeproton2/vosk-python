const fs = require('fs');
const chokidar = require('chokidar');

//========================================
// Commands for files
//========================================

class FilesManager {
  constructor() {
    this.baseDirectory = this.getCurrentDirectory();
  }

  getCurrentDirectory() {
    return __dirname;
  }

  exists(path) {
    return fs.existsSync(path);
  }

  createFile(path) {
    fs.touch(path);
  }

  readFile(path) {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  writeFile(path, content) {
    try {
      fs.writeFileSync(path, content);
    } catch (err) {
      console.error(err);
    }
  }

  rename(oldPath, newPath) {
    fs.rename(oldPath, newPath);
  }

  remove(path) {
    fs.promises.rm(path, { recursive: true });
  }


  readJSON(path) {
    const content = this.readFile(path);
    return JSON.parse(content);
  }
  
  writeJSON(path, data) {
    const content = JSON.stringify(data, null, 2); // Formatage indenté
    this.writeFile(path, content);
  }

  watch_file_changes(filename, onchange){
    // How to check change in a file
    const watcher = chokidar.watch(filename, {
      persistent: true,
      ignoreInitial: true,
    });
    watcher.on('change', (path) => {
      onchange(path);
    });
  }
}

const file = new FilesManager();



/*
How to use:


// if file exists
file.exists('index.html').then(exists => {
  console.log(`Le fichier index.html existe : ${exists}`);
});

// create file
file.createFile('data.txt').then(() => {
  console.log('Fichier data.txt créé');
});

// read file
file.readFile('message.txt').then(content => {
  console.log('Contenu du fichier message.txt :', content);
});

// write file
file.writeFile('message.txt', 'Hello, world!')
  .then(() => {
    console.log('Contenu écrit dans le fichier message.txt');
  });

  // Lire un objet JSON depuis un fichier
file.readJSON('config.json').then(data => {
  console.log('Configuration :', data);
});

// Écrire un objet JSON dans un fichier
const userData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
};

file.writeJSON('user.json', userData).then(() => {
  console.log('Données utilisateur écrites dans user.json');
});
*/


// Export variable
module.exports = file;