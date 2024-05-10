
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const path = require('path');
// ==============
// Verifie et installe package.json si nécessaire
// ==============
const options = {
  cwd: '../nodejs20/'
};

// Chemin complet vers le fichier package.json
const cheminPackageJSON = path.resolve('./package.json')

// Vérifier si le fichier package.json existe
if (!fs.existsSync(cheminPackageJSON)) {
    // Afficher un message indiquant que le fichier package.json n'existe pas
    console.log("Le fichier package.json n'existe pas. Initialisation d'un nouveau projet...");

    // Exécuter npm init -y pour initialiser un nouveau projet
    try {
        execSync('npm init -y', {stdio: 'inherit' });
        console.log("Initialisation du projet terminée.");
    } catch (erreur) {
        console.error(`Erreur lors de l'initialisation du projet : ${erreur}`);
    }
} else {
    // Afficher un message indiquant que le fichier package.json existe déjà
    //console.log("Le fichier package.json existe déjà.");
}


// ==============
// Verifie et installe les modules si nécessaire
// ==============
function importerModule(moduleName) {
    try {
        // Tenter d'importer le module
        const module = require(moduleName);
        //console.log(`Module ${moduleName} importé avec succès.`);
        return module;
    } catch (erreur) {
        // Afficher l'erreur
        console.error(`Erreur lors de l'importation du module ${moduleName}: ${erreur}`);
        // Exécuter 'npm install' de manière synchrone
        console.log("Exécution de 'npm install '+moduleName+'");
        //try {
            execSync('npm install '+moduleName+' --prefix '+path.resolve('.').replace(/\\/g, '/'), { stdio: 'inherit' });
            execSync('npm fund', { stdio: 'inherit' });
            
            // Réessayer l'importation du module
            return require(moduleName);
        /*} catch (erreur) {
            // Afficher l'erreur et arrêter le script
            console.error(`Erreur lors de l'installation du module ${moduleName}: ${erreur}`);
            process.exit(1);
        }*/
    }
}

//=============
//importe automatiquement, et télécharge si nécessaire. Mieux que require donc :)
const chokidar = importerModule('chokidar');
const yargs = importerModule('yargs');
//const chokidar = require('chokidar');
//const yargs = require('yargs');

const argv = yargs.argv;
// Commande pour exécuter le serveur Python

const python = path.resolve(argv['python']) || 'python'
const script = path.resolve(argv['script']) || 'script.py'
const param1 = argv['param1'] || ''
const param2 = argv['param2'] || ''
const param3 = argv['param3'] || ''
const param4 = argv['param4'] || ''
const commandePython = python+' '+script;

if (!fs.existsSync(python)) {
    console.log('--python file not found')
}
if (!fs.existsSync(script)) {
    console.log('--script file not found')
}

if (!fs.existsSync(python) || !fs.existsSync(script)) {
    return;
}

// Fonction pour lancer le serveur
function lancerServeur() {
  //console.log('Lancement du serveur...');
  console.log('=========================================================');
  const options = {
      //cwd: "C:/Share/Programmation/Python/reconnaissanceVocale/assistantvoice/trunk/build/roms/"
  };
  const serveur = spawn(python, [script,param1,param2,param3,param4], options);

  // Gestion des événements pour la sortie standard (stdout) et les erreurs (stderr)
  serveur.stdout.on('data', (data) => {
    //console.log(`Sortie du serveur: ${data}`);
    console.log(`${data}`);
  });

  serveur.stderr.on('data', (data) => {
    console.error(`Erreur du serveur: ${data}`);
  });

  // Gestion de l'événement lorsque le processus se termine
  serveur.on('close', (code) => {
    // si code = 0 pas d'erreur
    if (code !== 0) {
      console.log(`Le script s'est arrêté avec le code de sortie ${code}`);
      //console.log('Redémarrage du serveur...');
      //lancerServeur(); // Relancer le serveur en cas d'arrêt non normal
      //watcher.close(); // on arrête de surveiller le fichier
    }
  });
}

function lancementnormale(){
  execSync(commandePython, { stdio: 'inherit' });
}

// Surveiller les modifications du fichier script
const watcher = chokidar.watch(script, {
  persistent: true,
});

// Écouter les événements de modification du fichier
watcher.on('change', () => {
  console.log('Fichier '+script+' modifié. Redémarrage...');
  lancerServeur(); // Relancer le serveur en cas de modification du fichier
});

// Lancer le serveur pour la première fois
lancerServeur();