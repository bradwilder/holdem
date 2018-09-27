const HoldEm = require('../game/holdEm');
const HoldEmState = require('../game/holdEmState');
const Deck = require('../game/deck');

let Room = (id, name, bigBlind, maxPlayers, io, defaultWait = 10) =>
{
	let tablePlayers = Array(maxPlayers).fill(null);
	let visitors = [];
	let holdEm = HoldEm(maxPlayers, bigBlind, Deck(), true);
	let timeout;
	
	let getNumPlayersAtTable = () =>
	{
		let count = 0;
		tablePlayers.forEach((player) =>
		{
			if (player)
			{
				count++;
			}
		});
		return count;
	}
	
	let tablePlayersToPlayersSimpleWithOrigin = (tablePlayerOrigin, gamePlayers) =>
	{
		let indexOrigin = tablePlayers.indexOf(tablePlayerOrigin);
		if (indexOrigin > 0)
		{
			let playersSimple = gamePlayers.slice();
			playersSimple = playersSimple.splice(indexOrigin % maxPlayers, maxPlayers).concat(playersSimple);
			return playersSimple;
		}
		else
		{
			return gamePlayers;
		}
	}
	
	let removeVisitor = (visitor) =>
	{
		let index = visitors.indexOf(visitor);
		if (index !== -1)
		{
			visitors.splice(index, 1);
		}
	}
	
	let hasVisitor = (visitor) => visitors.indexOf(visitor) !== -1;
	
	let startGameOnTimer = (seconds = defaultWait) =>
	{
		if (timeout)
		{
			clearTimeout(timeout);
		}
		
		let startHand = () =>
		{
//			console.log('startHand called');
			holdEm.startHand();
			timeout = null;
			updateRoomOccupants();
		}
		
		if (seconds > 0)
		{
			timeout = setTimeout(() => startHand(), seconds * 1000);
		}
		else
		{
			startHand();
		}
	}
	
	let setToNoGameOnTimer = (seconds = defaultWait) =>
	{
		if (timeout)
		{
			clearTimeout(timeout);
		}
		
		let setToNoGame = () =>
		{
//			console.log('setToNoGame called');
			holdEm.setToNoGame();
			timeout = null;
			updateRoomOccupants();
		}
		
		if (seconds > 0)
		{
			timeout = setTimeout(() => setToNoGame(), seconds * 1000);
		}
		else
		{
			setToNoGame();
		}
	}
	
	let removePlayerFromTable = (tablePlayer) =>
	{
		holdEm.removePlayer(tablePlayer.getPlayer());
		let index = tablePlayers.indexOf(tablePlayer);
		tablePlayers[index] = null;
		updateRoomOccupants();
	}
	
	let sendGameState = (visitor, gameState) =>
	{
		let socket = io.sockets.connected[visitor];
		if (socket)
		{
			socket.emit('gameState', gameState);
		}
	}
	
	let updateRoomOccupants = () =>
	{
		let gameState = self.getGameState();
		self.getVisitors().forEach((roomVisitor) =>
		{
			sendGameState(roomVisitor, gameState);
		});
		
		self.getTablePlayers().forEach((tablePlayer) =>
		{
			if (tablePlayer)
			{
				sendGameState(tablePlayer.getSocket(), self.getGameState(tablePlayer));
			}
		});
	}
	
	let self =
	{
		id: id,
		name: name,
		bigBlind: bigBlind,
		maxPlayers: maxPlayers,
		getVisitors: () => visitors,
		getTablePlayers: () => tablePlayers,
		getNumPlayers: () =>
		{
			let count = 0;
			tablePlayers.forEach((player) =>
			{
				if (player)
				{
					count++;
				}
			});
			return count;
		},
		joinTable: (tablePlayer, newPosition) =>
		{
			let position = newPosition;
			switch (maxPlayers)
			{
				case 2:
					switch (newPosition)
					{
						case 0:
							position = 0;
							break;
						case 5:
							position = 1;
							break;
					}
					break;
				case 4:
					switch (newPosition)
					{
						case 0:
							position = 0;
							break;
						case 3:
							position = 1;
							break;
						case 5:
							position = 2;
							break;
						case 7:
							position = 3;
							break;
					}
					break;
				case 6:
					switch (newPosition)
					{
						case 0:
							position = 0;
							break;
						case 2:
							position = 1;
							break;
						case 3:
							position = 2;
							break;
						case 5:
							position = 3;
							break;
						case 7:
							position = 4;
							break;
						case 8:
							position = 5;
							break;
					}
					break;
			}
			
			if (position >= tablePlayers.length || position < 0)
			{
				throw "Can't seat player at position " + position + " with max players " + tablePlayers.length;
			}
			
			if (!hasVisitor(tablePlayer.getSocket()))
			{
				throw "Can't seat player that isn't in room";
			}
			
			if (tablePlayers[position])
			{
				throw "Can't seat player at position " + position + " because it's occupied";
			}
			
			holdEm.addPlayer(tablePlayer.getPlayer(), position);
			
			tablePlayers[position] = tablePlayer;
			
			removeVisitor(tablePlayer.getSocket());
			
			let gameState = holdEm.getGameState();
			if (gameState.state === HoldEmState().NO_GAME && getNumPlayersAtTable() >= 2)
			{
				startGameOnTimer();
			}
			
			updateRoomOccupants();
		},
		leaveTable: (tablePlayer) =>
		{
			self.addVisitor(tablePlayer.getSocket());
			removePlayerFromTable(tablePlayer);
		},
		addVisitor: (visitor) =>
		{
			if (visitors.indexOf(visitor) === -1)
			{
				visitors.push(visitor);
				sendGameState(visitor, self.getGameState());
			}
		},
		removeOccupant: (visitor) =>
		{
			removeVisitor(visitor);
			
			for (let i = 0; i < tablePlayers.length; i++)
			{
				let tablePlayer = tablePlayers[i];
				if (tablePlayer && tablePlayer.getSocket() === visitor)
				{
					removePlayerFromTable(tablePlayer);
				}
			}
		},
		getGameState: (tablePlayer = null) =>
		{
			let gameState = holdEm.getGameState();
			let playersSimple;
			if (tablePlayer)
			{
				playersSimple = tablePlayersToPlayersSimpleWithOrigin(tablePlayer, gameState.players);
			}
			else
			{
				playersSimple = gameState.players;
			}
			
			let spreadPlayers;
			switch (maxPlayers)
			{
				case 2:
					spreadPlayers = Array(10).fill(null);
					spreadPlayers[0] = playersSimple[0];
					spreadPlayers[5] = playersSimple[1];
					break;
				case 4:
					spreadPlayers = Array(10).fill(null);
					spreadPlayers[0] = playersSimple[0];
					spreadPlayers[3] = playersSimple[1];
					spreadPlayers[5] = playersSimple[2];
					spreadPlayers[7] = playersSimple[3];
					break;
				case 6:
					spreadPlayers = Array(10).fill(null);
					spreadPlayers[0] = playersSimple[0];
					spreadPlayers[2] = playersSimple[1];
					spreadPlayers[3] = playersSimple[2];
					spreadPlayers[5] = playersSimple[3];
					spreadPlayers[7] = playersSimple[4];
					spreadPlayers[8] = playersSimple[5];
					break;
				case 10:
					spreadPlayers = playersSimple;
					break;
			}
			gameState.players = spreadPlayers;
			
			if (tablePlayer)
			{
				gameState.players.forEach((gamePlayer) =>
				{
					if (gamePlayer && gamePlayer.name === tablePlayer.getPlayer().name)
					{
						gamePlayer.holeCards = tablePlayer.getPlayer().getHoleCards();
					}
				});
			}
			
			if (!tablePlayer || (!gameState.nextActionPlayer || gameState.nextActionPlayer.name !== tablePlayer.getPlayer().name))
			{
				gameState.nextAction = null;
			}
			
			if (gameState.winners)
			{
				if (getNumPlayersAtTable() >= 2)
				{
					startGameOnTimer(defaultWait);
				}
				else
				{
					setToNoGameOnTimer(defaultWait);
				}
			}
			
//			if (gameState.winners)
//			console.log(JSON.stringify(gameState, null, 4));
			return gameState;
		},
		performGameAction: (player, action, value = null) =>
		{
			let gameState = holdEm.getGameState();
			if (gameState.nextActionPlayer.name === player.name)
			{
				switch (action)
				{
					case 'fold':
						holdEm.fold();
						break;
					case 'check':
						holdEm.check();
						break;
					case 'call':
						holdEm.call();
						break;
					case 'raise':
						holdEm.bet(value);
						break;
				}
				updateRoomOccupants();
				
				return true;
			}
			
			return false;
		}
	}
	
	return self;
}

module.exports = Room;
