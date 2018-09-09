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
	socket.on('enterLobby', function(tableId)
	{
		console.log('enterLobby: ' + tableId);
		io.emit('event', 'hey buddy');
	});
	
	socket.on('leaveLobby', function(tableId)
	{
		console.log('enterLobby: ' + tableId);
		io.emit('event', 'fuck you');
	});
});
