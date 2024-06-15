//==================================
// Set your config here
//==================================

// Export variable
module.exports = {
    // config_speech_ip: See servers here. Choose one of them.
    //  Android:
    //      https://github.com/ddeeproton2/vosk-android-demo-2024-TTS-Voice-over-HTTP 
    //  Windows:
    //      https://github.com/ddeeproton2/vosk-python/blob/main/others/VoiceTextToSpeechHTTP.exe
    //  Python
    //      https://github.com/ddeeproton2/vosk-python/tree/main
    //      
    config_speech_ip: '127.0.0.1', 
    config_speech_port: '1225',
    

    // Config for LLM (Large language Model)
    // Easy
    //      https://github.com/janhq/jan
    // Complete and faster
    //      https://lmstudio.ai/
    
    config_jan_api: "http://127.0.0.1:1234/v1/chat/completions",


    // Config for the Extensions Visual Studio: "EvalOnHTTP"
    //      https://github.com/ddeeproton2/vosk-python/tree/main/others/vscode_evalonhttp
    
    vs_code_eval: "http://127.0.0.1:4000",


    // This server from client

    nodeserver: '127.0.0.1:13080',


    // Your tor server
    //      https://github.com/ddeeproton2/vosk-python/tree/main/others/tor-win32-0.3.5.8
    //      https://community.chocolatey.org/packages/tor/0.3.5.8
   
    tor_server: 'socks://127.0.0.1:9050',

    
    // Config for Anything LLM
    //      https://useanything.com/
  
    anythingllm:{
        // === Server ===
        is_server: false,
        port_server: 14080,
        // === Client ===
        is_client: false,
        url_tor:'ws://your_tor_domain.onion:14080',
        bearer: 'XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX'
    }
};