let Room = require('./room');

let Lobby = () =>
{
	let rooms =
	[
		Room(0, '10-handed', 20, 10)
	];
	
	let getRoom = (id) =>
	{
		return rooms.find((room) => room.id === id);
	}
	
	let visitors = [];
	
	let self =
	{
		getRooms: () => rooms,
		getVisitors: () => visitors,
		addVisitor: (visitor) =>
		{
			if (visitors.indexOf(visitor) === -1)
			{
				visitors.push(visitor);
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
		addRoomVisitor: (visitor, roomID) =>
		{
			let room = getRoom(roomID);
			if (room)
			{
				room.addVisitor(visitor);
			}
		},
		removeRoomVisitor: (visitor, roomID) =>
		{
			let room = getRoom(roomID);
			if (room)
			{
				room.removeVisitor(visitor);
			}
		},
		removeVisitorCompletely: (visitor) =>
		{
			self.removeVisitor();
			rooms.forEach((room) =>
			{
				room.removeVisitor(visitor);
			});
		}
	}
	
	return self;
}

module.exports = Lobby;
