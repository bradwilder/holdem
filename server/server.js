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
	console.log('connection: ' + socket.id);
	lobby.addVisitor(socket.id);
	io.sockets.connected[socket.id].emit('serverStart');
	
	socket.on('enterLobby', function()
	{
		console.log('enterLobby: ' + socket.id);
		io.sockets.connected[socket.id].emit('roomCounts', lobby.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()})));
	});
	
	socket.on('leaveLobby', function()
	{
		console.log('leaveLobby: ' + socket.id);
	});
	
	socket.on('enterRoom', function(id)
	{
		console.log('enterRoom ' + id + ': ' + socket.id);
		lobby.addRoomVisitor(socket.id, id);
		io.sockets.connected[socket.id].emit('gameState', lobby.getRoom(id).getGameState());
	});
	
	socket.on('leaveRoom', function(id)
	{
		console.log('leaveRoom ' + id + ': ' + socket.id);
		lobby.removeRoomVisitor(socket.id, id);
	});
	
	socket.on('login', function(name)
	{
		console.log('login ' + name + ': ' + socket.id);
		let newPlayer = lobby.createPlayer(socket.id, name);
		if (newPlayer)
		{
			io.sockets.connected[socket.id].emit('loggedIn', newPlayer);
		}
		else
		{
			// TODO: error
		}
	});
	
	socket.on('joinTable', function(id, position)
	{
		console.log('joinTable ' + id + ', position: ' + position + ': ' + socket.id);
		if (lobby.joinTable(socket.id, id, position))
		{
			io.emit('roomCounts', lobby.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()})));
			
			let room = lobby.getRoom(id);
			if (room)
			{
				let roomVisitors = room.getVisitors();
				let gameState = room.getGameState();
				// console.log('visitor gameState');
				// console.log(gameState);
				// console.log('visitor gameState2');
				roomVisitors.forEach((roomVisitor) =>
				{
					io.sockets.connected[roomVisitor].emit('gameState', gameState);
				});
				
				let tablePlayers = room.getTablePlayers();
				tablePlayers.forEach((tablePlayer) =>
				{
					if (tablePlayer)
					{
						let gameState = room.getGameState(tablePlayer);
						// console.log('player gameState: ' + tablePlayer.getPlayer().getName());
						// console.log(gameState);
						// console.log('player gameState2');
						io.sockets.connected[tablePlayer.getSocket()].emit('gameState', gameState);
					}
				});
			}
		}
		else
		{
			// TODO: error
		}
	});
	
	socket.on('disconnect', function(error)
	{
		console.log('disconnect: ' + socket.id);
		lobby.removeVisitorCompletely(socket.id);
		io.emit('roomCounts', lobby.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()})));
	});
});
