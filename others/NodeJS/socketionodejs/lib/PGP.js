
 
	/* global PGP */
const openpgp = require('./openpgp.js');


var PGP = {
	generate: function(){
		openpgp.init();
		var keys = openpgp.generate_key_pair(1, 512, PGP.RandomText(), '');
		return {
			privateKey: keys.privateKeyArmored,
			publicKey: keys.publicKeyArmored
		};
	},
	encrypt: function(message, key){
		openpgp.init();
		var pub_key = openpgp.read_publicKey(key);
		return openpgp.write_encrypted_message(pub_key, message);
	},
	decrypt: function(message, key){
		var res = "";
		openpgp.init();
		var priv_key = openpgp.read_privateKey(key);
		var msg = openpgp.read_message(message);
                //console.log(msg);
		var keymat = null;
		var sesskey = null;
		// Find the private (sub)key for the session key of the message
		for (var i = 0; i < msg[0].sessionKeys.length; i++) {
				if (priv_key[0].privateKeyPacket.publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
						keymat = {
								key: priv_key[0],
								keymaterial: priv_key[0].privateKeyPacket
						};
						sesskey = msg[0].sessionKeys[i];
						break;
				}
				for (var j = 0; j < priv_key[0].subKeys.length; j++) {
						if (priv_key[0].subKeys[j].publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
								keymat = {
										key: priv_key[0],
										keymaterial: priv_key[0].subKeys[j]
								};
								sesskey = msg[0].sessionKeys[i];
								break;
						}
				}
		}
		if (keymat == null) return "error in PGP.decrypt";
		if (keymat.keymaterial.decryptSecretMPIs('')) res = msg[0].decrypt(keymat, sesskey);
		return res;
	},
	RandomText: function() {
		var length = 35,
				charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
				retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
				retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}
}

function showMessages(str){
	//alert(str);
}

/*
function encrypt(){
	var encrypted = PGP.encrypt($('#messageToEncrypt').val(), $('#pubgenkey').val());
	$('#encrypted').val(encrypted);
}

function decrypt(){
	var decrypted = PGP.decrypt($('#messageToDecrypt').val(), $('#privgenkey').val());
	$('#decrypted').val(decrypted);
}

function generate(){
	//var pgp = PGP_generate();
	var pgp = PGP.generate();
	$('#privgenkey').val(pgp.privateKey);
	$('#pubgenkey').val(pgp.publicKey);
	return false;
}
*/


// Export the 'PGP' variable
module.exports = PGP;