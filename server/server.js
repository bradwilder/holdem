const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const router = require('express').Router();

const Lobby = require('./table/lobby');
const TablePlayer = require('./table/tablePlayer');
const Player = require('./game/player');

let lobby = Lobby(io);

let allVisitors = {}; // socketID: tablePlayer

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
	if (!allVisitors.hasOwnProperty(socket.id))
	{
		allVisitors[socket.id] = null;
	}
	io.sockets.connected[socket.id].emit('serverStart');
	
	socket.on('enterLobby', function()
	{
		console.log('enterLobby: ' + socket.id);
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
		let room = lobby.getRoom(id);
		if (room)
		{
			room.addVisitor(socket.id);
		}
	});
	
	socket.on('leaveRoom', function(id)
	{
		console.log('leaveRoom ' + id + ': ' + socket.id);
		let room = lobby.getRoom(id);
		if (room)
		{
			room.removeOccupant(socket.id);
		}
	});
	
	const hasPlayer = (name) =>
	{
		let tablePlayers = Object.values(allVisitors);
		for (let i = 0; i < tablePlayers.length; i++)
		{
			let tablePlayer = tablePlayers[i];
			if (tablePlayer && tablePlayer.getPlayer().name === name)
			{
				return true;
			}
		}
		
		return false;
	}
	
	const getPlayer = (visitor) =>
	{
		if (!allVisitors.hasOwnProperty(visitor) || !allVisitors[visitor])
		{
			return false;
		}
		
		return allVisitors[visitor];
	}
	
	socket.on('login', function(name)
	{
		console.log('login ' + name + ': ' + socket.id);
		if (hasPlayer(name))
		{
			// TODO: error
		}
		
		let newPlayer = Player(name, 20000);
		let tablePlayer = TablePlayer(newPlayer, socket.id);
		allVisitors[socket.id] = tablePlayer;
		
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
		let tablePlayer = getPlayer(socket.id);
		if (tablePlayer)
		{
			let room = lobby.getRoom(id);
			if (room)
			{
				room.joinTable(tablePlayer, position);
				lobby.updateRoomCounts();
			}
			else
			{
				// TODO: error
			}
		}
		else
		{
			// TODO: error
		}
	});
	
	socket.on('leaveTable', function(id)
	{
		console.log('leaveTable ' + id + ': ' + socket.id);
		let tablePlayer = getPlayer(socket.id);
		if (tablePlayer)
		{
			let room = lobby.getRoom(id);
			if (room)
			{
				room.leaveTable(tablePlayer);
				lobby.updateRoomCounts();
			}
			else
			{
				// TODO: error
			}
		}
		else
		{
			// TODO: error
		}
	});
	
	socket.on('tableAction', function(id, actionType, value = null)
	{
		console.log('tableAction ' + id + ', action: ' + actionType + ', value: ' + value + ': ' + socket.id);
		let room = lobby.getRoom(id);
		let tablePlayer = allVisitors[socket.id];
		if (tablePlayer)
		{
			if (room)
			{
				room.performGameAction(tablePlayer.getPlayer(), actionType, value)
			}
			else
			{
				// TODO: error
			}
		}
	});
	
	socket.on('disconnect', function(error)
	{
		console.log('disconnect: ' + socket.id);
		delete allVisitors[socket.id];
		lobby.removeVisitorCompletely(socket.id);
	});
});
