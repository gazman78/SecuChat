// Dependencies
var net = require ('net');
var fs = require ("fs");
var readline = require ('readline');
var ibe = require ('./ibe/ibe_extract.js');

// Global array of clients
var clients = [];

var server = net.createServer (function (client) {
	
	// The server received a connection from a client
	console.log ('client connected');
	clients.push (client);

	client.on ('end', function () {
		// Callback called after a client connection termination
		console.log ('client disconnected');
		if ((clientIndex = clients.indexOf (client)) > -1) {
			// Remove the client from the clients array
			clients.splice (clientIndex, 1);
		}
	});

	client.on ('data', function (data) {
		// The server received data from a client
		var contenuFichierClients = fs.readFileSync ("clients_already_exist", "UTF-8");
		if (contenuFichierClients.indexOf (data) > -1) {
			/*! FIXBUG
				Si un client s'enregistre avec le nom "alut@gmail.com",
				l'email d'un autre client "salut@gmail.com" sera refusé.
			*/
			console.log ('client already defined');
		}
		else {
			// Check email format
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			console.log("data = <" + data + ">");
 
			if (!filter.test(data)) {
				// Error : mail not correctly formated
				console.log ("Wrong email address");
			}
			else {
				// Generate a secret_key
				var secret_key = ibe.extract_secret_key (data);
				fs.appendFile ("clients_already_exist", data + "\n", "UTF-8");
				// Send the secret_key to the client
				client.write (secret_key);
			}
		}
	});
});

// Bind port 8124 and listen for connections
server.listen (8125, function () {
	console.log ('server listening on port 8125');
});