let Room = require('./room');
let TablePlayer = require('./tablePlayer');
let Player = require('../game/player');

let Lobby = () =>
{
	let rooms =
	[
		Room(0, '10-handed', 20, 10)
	];
	
	let visitors = {}; // socketID: tablePlayer
	
	let hasPlayer = (name) =>
	{
		let tablePlayers = Object.values(visitors);
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
	
	let self =
	{
		getRooms: () => rooms,
		getRoom:  (id) =>
		{
			return rooms.find((room) => room.id === id);
		},
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
			let room = self.getRoom(roomID);
			if (room)
			{
				room.addVisitor(visitor);
			}
		},
		removeRoomVisitor: (visitor, roomID) =>
		{
			let room = self.getRoom(roomID);
			if (room)
			{
				room.removeVisitor(visitor);
			}
		},
		joinTable: (visitor, roomID, position) =>
		{
			if (!visitors.hasOwnProperty(visitor) || !visitors[visitor])
			{
				return false;
			}
			
			let tablePlayer = visitors[visitor];
			let room = self.getRoom(roomID);
			if (room)
			{
				room.addPlayer(tablePlayer, position);
			}
			return true;
		},
		leaveTable: (visitor, roomID) =>
		{
			
			
			
			
			
			
			
		},
		removeVisitorCompletely: (visitor) =>
		{
			let tablePlayer = visitors[visitor];
			
			self.removeVisitor(visitor);
			rooms.forEach((room) =>
			{
				if (tablePlayer)
				{
					room.removePlayer(tablePlayer);
				}
				else
				{
					room.removeVisitor(visitor);
				}
			});
		},
		createPlayer: (visitor, name) =>
		{
			if (hasPlayer(name))
			{
				return null;
			}
			
			let player = Player(name, 20000);
			let tablePlayer = TablePlayer(player, visitor);
			visitors[visitor] = tablePlayer;
			return player;
		}
	}
	
	return self;
}

module.exports = Lobby;
