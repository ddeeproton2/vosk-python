const fs = require('fs');

//========================================
// Commands for directories
//========================================

class DirectoriesManager {
  constructor() {
    this.baseDirectory = this.getCurrentDirectory();
  }

  getCurrentDirectory() {
    return __dirname;
  }

  /**
   * Vérifie si un répertoire existe
   *
   * @param {string} path Chemin du répertoire
   * @returns {Promise<boolean>} Promesse résolue avec true si le répertoire existe, false sinon
   */
  async exists(path) {
    try {
      await fs.promises.access(path);
      const stats = await fs.promises.stat(path);
      return stats.isDirectory();
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      } else {
        return false;
        throw error;
      }
    }
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

*/

// Export variable
module.exports = dir;