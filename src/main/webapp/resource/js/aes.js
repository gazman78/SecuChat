function chiffrer(keyAES, message) {
	var messageArray = new Uint8Array(message.length);
	
	for(var i=0; i < message.length; i++) {
		messageArray[i] = message.charCodeAt(i);
	}

	return window.crypto.subtle.digest({name: "SHA-256"}, keyAES).then(function (hash) {
	  //console.log("SHA-256:");
	  //console.log(new Uint8Array(hash));

	  return window.crypto.subtle.importKey("raw", hash, {name: "AES-CBC"}, true, ["encrypt", "decrypt"]).then(function (key) {
		var data = messageArray;
		var algorithm = key.algorithm;
		algorithm.iv = window.crypto.getRandomValues(new Uint8Array(16));

		return window.crypto.subtle.encrypt(algorithm, key, data).then(function (ct) {
		  //console.log("AES-CBC encrypt:");
		  //console.log(new Uint8Array(ct));
		  console.log(ct);
			envoi([keyAES, algorithm.iv, new Uint8Array(ct)]);
			return ([keyAES, algorithm.iv, new Uint8Array(ct)]);
		}, handle_error);
	  }, handle_error);
	}, handle_error);
}

function dechiffrer(keyAES, iv, ct) {

	window.crypto.subtle.digest({name: "SHA-256"}, keyAES).then(function (hash) {
	  //console.log("SHA-256:");
	  //console.log(new Uint8Array(hash));

	  window.crypto.subtle.importKey("raw", hash, {name: "AES-CBC"}, true, ["encrypt", "decrypt"]).then(function (key) {
		var algorithm = key.algorithm;
		algorithm.iv = iv;
		window.crypto.subtle.decrypt(algorithm, key, ct).then(function (pt) {
			ptArray = new Uint8Array(pt);
			messageDechiffre = "";
			for(var i=0; i < ptArray.length; i++) {
				messageDechiffre = messageDechiffre + String.fromCharCode(ptArray[i]);
			}
			console.log(messageDechiffre);
		  }, handle_error);
	  }, handle_error);
	}, handle_error);
}

function handle_error() {
	alert('probleme');
}

function generateKey() {
	var array = new Uint8Array(32);
	window.crypto.getRandomValues(array);
	return array;
}

function translateKeyToBinary(array) {
	var binary = '';
	var temp;
	for(var i = 0; i < array.length; i++) {
		temp = array[i].toString(2);
		temp = new Array(9 - temp.length).join('0') + temp;
		binary += temp;
	}
	return binary;
}

function translateBinaryToKey(binary) {
	var key = new Uint8Array(32);
	var temp;
	for(var i = 0; i < key.length; i++) {
		temp = binary.substr(i*8, 8);
		key[i] = parseInt(temp, 2);
	}
	return key;
}

function envoi(data) {
	console.log(data);
	dechiffrer(data[0], data[1], data[2]);
}