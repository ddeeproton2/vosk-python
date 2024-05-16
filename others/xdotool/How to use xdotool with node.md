const childProcess = require('child_process');

const command = 'xdotool mousemove 100 200';

childProcess.exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log('Commande exécutée avec succès');
});
