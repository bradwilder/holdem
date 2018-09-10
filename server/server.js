const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const router = require('express').Router();

const Lobby = require('./table/lobby');

let lobby = Lobby();

// Error handling
const sendError = (err, res) =>
{
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response =
{
    status: 200,
    data: [],
    message: null
};

router.get('/rooms', (req, res) =>
{
	response.data = lobby.getRooms();
	res.json(response);
});

// API location
app.use('/api', router);

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// TODO: do I need this?
// // Angular DIST output folder
// app.use(express.static(path.join(__dirname, 'dist')));

// // Send all other requests to the Angular app
// app.get('*', (req, res) =>
// {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

const port = process.env.PORT || 3000;
app.set('port', port);
server.listen(port, () => console.log('Listening on port ' + port));

io.sockets.on('connection', function(socket)
{
	socket.on('enterLobby', function()
	{
		console.log('enterLobby: ' + socket.id);
		io.sockets.connected[socket.id].emit('roomCounts', lobby.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()})));
		lobby.addVisitor(socket.id);
	});
	
	socket.on('leaveLobby', function()
	{
		console.log('leaveLobby: ' + socket.id);
		lobby.removeVisitor(socket.id);
	});
	
	socket.on('enterRoom', function(id)
	{
		console.log('enterRoom ' + id + ': ' + socket.id);
		io.emit('roomCounts', lobby.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()})));
		lobby.addRoomVisitor(id);
	});
	
	socket.on('leaveRoom', function(id)
	{
		console.log('leaveRoom ' + id + ': ' + socket.id);
		lobby.removeRoomVisitor(id);
	});
	
	socket.on('joinTable', function(id)
	{
		console.log('joinTable ' + id + ': ' + socket.id);
		
		// TODO!!!!!
		
		lobby.getVisitors().forEach((visitor) =>
		{
			io.sockets.connected[visitor].emit('roomCounts', lobby.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()})));
		});
	});
	
	socket.on('disconnect', function(error)
	{
		console.log('disconnect: ' + socket.id);
		lobby.removeVisitorCompletely(socket.id);
	});
});
