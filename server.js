var net = require('net');
var fs = require("fs");
var readline = require('readline');
var ibe = require('./ibe/ibe_extract.js');
var server = net.createServer(function(c) {
	console.log('client connected');
	c.on('end', function() {
		console.log('client disconnected');
	});
	c.on('data', function(data){
		var contenu = fs.readFileSync("clients_already_exist", "UTF-8");
		if(contenu.indexOf(data) > -1) {
			console.log('client already defined');
		}
		else {
			// Check email format 
			var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			if (!regEmail.test(myVar)) {
				console.log ("Wrong email address");
			}
			else {
				var sercret_key=ibe.extract_secret_key(data);
				fs.appendFile("clients_already_exist", data, "UTF-8");
				console.log(sercret_key);
				c.write(sercret_key);
			]
		}
	});	
	c.pipe(c);
});
server.listen(8124, function() {
	console.log('server listening on port 8124');
});