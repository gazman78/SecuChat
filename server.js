var net = require('net');
var fs = require("fs");
var ibe = require('./ibe/ibe_extract.js');
var server = net.createServer(function(c) {
	console.log('client connected');
	c.on('end', function() {
		console.log('client disconnected');
	});
	c.on('data', function(data){
		var sercret_key=ibe.extract_secret_key(data);
		fs.appendFile("clients_already_exist", data, "UTF-8");
		console.log(sercret_key);
		c.write(sercret_key);
	});	
	c.pipe(c);
});
server.listen(8124, function() {
	console.log('server listening on port 8124');
});