let Room = require('./room');

let Lobby = (io) =>
{
	let rooms =
	[
		Room(0, '10-handed table', 20, 10, io)
	];
	
	let visitors = [];
	
	let createRoomCountObject = () =>
	{
		return self.getRooms().map((room) => ({id: room.id, players: room.getNumPlayers()}))
	}
	
	let self =
	{
		getRooms: () => rooms,
		getRoom: (id) =>
		{
			return rooms.find((room) => room.id === id);
		},
		getVisitors: () => visitors,
		addVisitor: (visitor) =>
		{
			if (visitors.indexOf(visitor) === -1)
			{
				visitors.push(visitor);
				io.sockets.connected[visitor].emit('roomCounts', createRoomCountObject());
			}
		},
		removeVisitor: (visitor) =>
		{
			let index = visitors.indexOf(visitor);
			if (index !== -1)
			{
				visitors.splice(index, 1);
			}
		},
		removeVisitorCompletely: (visitor) =>
		{
			self.removeVisitor(visitor);
			
			rooms.forEach((room) =>
			{
				room.removeOccupant(visitor);
			});
		},
		updateRoomCounts: () =>
		{
			io.emit('roomCounts', createRoomCountObject());
		}
	}
	
	return self;
}

module.exports = Lobby;
