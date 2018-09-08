let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);


var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port ' + port);

app.get('/', function( req, res ) {
	res.send('Hello World');
});

io.sockets.on('connection', function(socket)
{
	socket.on('enterRoom', function(tableId)
	{
		console.log('enterRoom: ' + tableId);
		io.emit('event', 'fuck you');
	});
});
