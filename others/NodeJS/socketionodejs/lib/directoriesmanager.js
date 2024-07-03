const fs = require('fs');

//========================================
// Commands for directories
//========================================

class DirectoriesManager {
  constructor() {
    this.baseDirectory = this.getCurrentDirectory();
  }

  getCurrentDirectory() {
    return this.parse(__dirname)+"/";
  }

  currentdir(){
    return this.parse(process.cwd())+"/";
  }

  /**
   * Vérifie si un répertoire existe
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<boolean>} Promesse résolue avec true si le répertoire existe, false sinon
   */
  exists(path) {
    try{
      path = this.parse(path);
      const stats = fs.lstatSync(path);
      /*
      console.log(`Is file: ${stats.isFile()}`);
      console.log(`Is directory: ${stats.isDirectory()}`);
      console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
      console.log(`Is FIFO: ${stats.isFIFO()}`);
      console.log(`Is socket: ${stats.isSocket()}`);
      console.log(`Is character device: ${stats.isCharacterDevice()}`);
      console.log(`Is block device: ${stats.isBlockDevice()}`);
      */
      return stats.isDirectory();

    }catch(error){
      console.log("directoriesmanager.js Error: "+error);
    }

    return false;
  }
  
  parse(path){
    return path.replaceAll("\\","/");
  }
  noEndingSlash(path){
    if(path[path.length-1] === "/"){
      path = path.substring(0, path.length-1);
    }
    return path;
  }
  parent(path){
    path = this.noEndingSlash(path);
    var data = path.split("/");
    data.pop();
    return data.join("/");
  }

  /**
   * Crée un répertoire
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<void>} Promesse résolue lorsque le répertoire a été créé
   */
  async createDirectory(path) {
    await fs.promises.mkdir(path, { recursive: true });
  }

  /**
   * Supprime un répertoire vide
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<void>} Promesse résolue lorsque le répertoire a été supprimé
   */
  async removeEmptyDirectory(path) {
    try {
      await fs.promises.rmdir(path);
    } catch (error) {
      if (error.code === 'ENOTEMPTY') {
        console.error(`Le répertoire ${path} n'est pas vide, impossible de le supprimer`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Supprime un répertoire récursivement (y compris son contenu)
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<void>} Promesse résolue lorsque le répertoire a été supprimé récursivement
   */
  async removeDirectory(path) {
    await fs.promises.rm(path, { recursive: true });
  }

  /**
   * Liste le contenu d'un répertoire
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<string[]>} Promesse résolue avec un tableau contenant les noms des fichiers et des répertoires du répertoire spécifié
   */
  async listDirectory(path) {
    return await fs.promises.readdir(path);
  }

   /**
   * Lit un dossier et retourne la liste des fichiers avec leur chemin complet.
   * @param {string} dirPath - Le chemin du dossier à lire. (doit terminer par "/" ou "\\")
   * @returns {Promise<string[]>} - Une promesse qui résout avec un tableau de chemins de fichiers complets.
   */
  async readDirectory(dirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if (err) {
          return reject(err);
        }
        const fullPaths = files.map(file => dirPath+file);
        resolve(fullPaths);
      });
    });
  }

}

const dir = new DirectoriesManager();
/*
How to use:
==========


// Vérifier si un répertoire existe
dir.exists('images').then(exists => {
  console.log(`Le répertoire images existe : ${exists}`);
});

// Créer un répertoire
dir.createDirectory('uploads').then(() => {
  console.log('Répertoire uploads créé');
});

// Supprimer un répertoire vide
dir.removeEmptyDirectory('tmp').then(() => {
  console.log('Répertoire tmp supprimé (s'il était vide)');
});

// Supprimer un répertoire récursivement
dir.removeDirectory('old-project').then(() => {
  console.log('Répertoire old-project supprimé récursivement');
});

// Lister le contenu d'un répertoire
dir.listDirectory('docs').then(files => {
  console.log('Contenu du répertoire docs :', files);
});

// Lister le contenu d'un répertoire (chemin absolut)
const directoryPath = 'chemin/vers/votre/dossier'; // Remplacez par le chemin de votre dossier
dir.readDirectory(directoryPath)
.then(files => {
    console.log('Liste des fichiers avec chemin complet :', files);
})
.catch(error => {
    console.error('Erreur lors de la lecture du dossier :', error);
});

*/

// Export variable
module.exports = dir;