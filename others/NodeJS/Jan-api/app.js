const axios = require('axios');

ask("Affiche le code python pour afficher le message Salut");

// This function is an API for this application LLM https://github.com/janhq/jan
// See how to use then here http://127.0.0.1:1337/static/index.html
function ask(msg){
    axios.defaults.timeout = 0; // Désactive le délai d'attente par défaut

    const url = 'http://localhost:1337/v1/chat/completions'; // URL de l'API Jan Server
    const headers = {
      'Content-Type': 'application/json'
    };

    // Structure des données requises par le serveur
    const data = {
      messages: [
        {
          role: "user",
          content: msg
        }
      ],
      model: "mistral-ins-7b-q4",
      //model: "stable-zephyr-3b",
      //model: "deepseek-coder-1.3b",
      stream: false,
      max_tokens: 2048,
      "stop": [
        "hello"
      ],
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0.7,
      top_p: 0.95
    };

    // Afficher la question
    console.log(msg);

    // Envoyer la demande à l'API Jan Server
    axios.post(url, data, { headers })
      .then(response => {
          try{
              console.log(response.data.choices[0].message.content);
          }catch(e){}

      })
      .catch(error => {
        console.error(error); // Afficher les erreurs, le cas échéant
      });
      
}