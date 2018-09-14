let Room = require('./room');
let TablePlayer = require('./tablePlayer');
let Player = require('../game/player');

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
	
	let visitors = {}; // socket ids
	
	let players = {};
	
	let hasPlayer = (name) =>
	{
		let tablePlayers = Object.values(players);
		for (let i = 0; i < tablePlayers.length; i++)
		{
			let tablePlayer = tablePlayers[i];
			if (tablePlayer.getPlayer().name === name)
			{
				return true;
			}
		}
		
		return false;
	}
	
	let self =
	{
		getRooms: () => rooms,
		getVisitors: () => Object.keys(visitors),
		addVisitor: (visitor) =>
		{
			if (!visitors.hasOwnProperty(visitor))
			{
				visitors[visitor] = null;
			}
		},
		removeVisitor: (visitor) =>
		{
			delete visitors[visitor];
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
		joinTable: (visitor, roomID, position) =>
		{
			if (!visitors.hasOwnProperty(visitor) && !visitors[visitor])
			{
				return false;
			}
			
			let tablePlayer = visitors[visitor];
			let room = getRoom(roomID);
			if (room)
			{
				room.addPlayer(tablePlayer, position);
			}
			return true;
		},
		removeVisitorCompletely: (visitor) =>
		{
			self.removeVisitor();
			rooms.forEach((room) =>
			{
				room.removeVisitor(visitor);
			});
			delete players[visitor];
		},
		createPlayer: (visitor, name) =>
		{
			if (hasPlayer(name))
			{
				return null;
			}
			
			let player = Player(name, 20000);
			let tablePlayer = TablePlayer(player, visitor);
			players[visitor] = tablePlayer;
			return player;
		}
	}
	
	return self;
}

module.exports = Lobby;
