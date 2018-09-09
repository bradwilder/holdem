let Room = require('./room');

let Lobby = () =>
{
	let rooms =
	[
		Room(0, '10-handed', 20, 10)
	];
	
	let self =
	{
		getRooms: () => rooms
	}
	
	return self;
}

module.exports = Lobby;
