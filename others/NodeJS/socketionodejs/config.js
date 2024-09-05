//==================================
// Set your config here
//==================================

// Export variable
module.exports = {
    // Text to Speech TTS : See servers here. Choose one of them.
    //  Android:
    //      https://github.com/ddeeproton2/vosk-android-demo-2024-TTS-Voice-over-HTTP 
    //  Windows:
    //      https://github.com/ddeeproton2/vosk-python/blob/main/others/VoiceTextToSpeechHTTP.exe
    //  Python
    //      https://github.com/ddeeproton2/vosk-python/tree/main
    //config_speech_ip: '192.168.1.52',
    //config_speech_ip: '192.168.1.57',
    config_speech_ip: '192.168.137.2',
    //config_speech_ip: '127.0.0.1',
    config_speech_port: '1225',
    
    // Config for LLM (Large language Model)
    // Easy
    //      https://github.com/janhq/jan
    // Complete and faster
    //      https://lmstudio.ai/
    
    config_jan_api: "http://192.168.1.45:1234/v1/chat/completions",

    // Config for the Extensions Visual Studio: "EvalOnHTTP"
    //      https://github.com/ddeeproton2/vosk-python/tree/main/others/vscode_evalonhttp
    vs_code_eval: "http://127.0.0.1:4000",

    // This server from client
    nodeserver: '127.0.0.1:13080',

    // Your tor server
    //      https://github.com/ddeeproton2/vosk-python/tree/main/others/tor-win32-0.3.5.8
    //      https://community.chocolatey.org/packages/tor/0.3.5.8
    //==================================================
    /*
    // Open TOR configuration and add this eg. config
    HiddenServiceDir Data\hidden_service
    HiddenServicePort 13080 127.0.0.1:13080
    HiddenServicePort 13443 127.0.0.1:13443
    HiddenServicePort 14080 127.0.0.1:14080
    */

    tor_server: 'socks://127.0.0.1:19050',
    //tor_server: 'socks://127.0.0.1:9050',

    // Config for Anything LLM
    //      https://useanything.com/
    anythingllm:{
        // === Server ===
        is_server: false,
        port_server: 14080,
        api_url: 'http://192.168.1.77:3001',
        api_channel: 'speakcommandsjs',
        // === Client ===
        is_client: false,
        url_tor:'ws://5dufelsmobi4ghtenwpuioq3ax7nyb4bgitwaddexdwnyntt7lasm2yd.onion:14080',
        bearer: 'ZQXDTDV-6CQ4PZZ-PBCFYMV-878Q02X',
        enable_heartbeat: true,
        timer_heartbeat: 30000
    },

    // This http server
    httpServer:{
        enabled: true,
        port: 13080
    },
    // This https server
    httpsServer:{
        enabled: true,
        port: 13443,
        ssl: {
            privateKey: './SSL/private-key.pem',
            certificate: './SSL/certificate.pem',
            ca: './SSL/ca.pem'
        }
    }


};