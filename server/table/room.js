const HoldEm = require('../game/holdEm');
const Deck = require('../game/deck');
const GameState = require('../game/gameState');
const PlayerSimple = require('../game/playerSimple');

let Room = (id, name, bigBlind, maxPlayers, io) =>
{
	let tablePlayers = Array(maxPlayers).fill(null);
	
	let holdEm;
	
	let visitors = [];
	
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
	
	let getPlayersAtTable = () =>
	{
		let players = [];
		tablePlayers.forEach((tablePlayer) =>
		{
			if (tablePlayer)
			{
				players.push(tablePlayer.getPlayer());
			}
		});
		return players;
	}
	
	let tablePlayersToPlayersSimpleWithOrigin = (tablePlayerOrigin, gamePlayers) =>
	{
		let indexOrigin;
		let gamePlayerIndex = 0;
		for (let i = 0; i < maxPlayers; i++)
		{
			let tablePlayer = tablePlayers[i];
			if (tablePlayer)
			{
				if (tablePlayer.getPlayer() === tablePlayerOrigin.getPlayer())
				{
					indexOrigin = i;
					break;
				}
				gamePlayerIndex++;
			}
		}
		
		if (indexOrigin >= 0)
		{
			let playersSimple = Array(maxPlayers).fill(null);
			
			playersSimple[0] = gamePlayers[gamePlayerIndex];
			
			gamePlayerIndex = (gamePlayerIndex + 1) % gamePlayers.length;
			let currentAddIndex = 1;
			for (let i = (indexOrigin + 1) % maxPlayers; i != indexOrigin; i = (i + 1) % maxPlayers)
			{
				let tablePlayer = tablePlayers[i];
				if (tablePlayer)
				{
					playersSimple[currentAddIndex] = gamePlayers[gamePlayerIndex];
					gamePlayerIndex = (gamePlayerIndex + 1) % gamePlayers.length;
				}
				currentAddIndex++;
			}
			return playersSimple;
		}
		else
		{
			return tablePlayersToPlayersSimple(gamePlayers);
		}
	}
	
	let tablePlayersToPlayersSimple = (gamePlayers) =>
	{
		let playersSimple = Array(maxPlayers).fill(null);
		let gamePlayerIndex = 0;
		for (let i = 0; i < maxPlayers; i++)
		{
			let tablePlayer = tablePlayers[i];
			if (tablePlayer)
			{
				playersSimple[i] = gamePlayers[gamePlayerIndex];
				gamePlayerIndex++;
			}
		}
		return playersSimple;
	}
	
	let tablePlayersToPlayersSimpleWithOriginNoGame = (tablePlayerOrigin) =>
	{
		let indexOrigin;
		for (let i = 0; i < maxPlayers; i++)
		{
			let tablePlayer = tablePlayers[i];
			if (tablePlayer && tablePlayer.getPlayer() === tablePlayerOrigin.getPlayer())
			{
				indexOrigin = i;
				break;
			}
		}
		
		if (indexOrigin >= 0)
		{
			let playersSimple = Array(maxPlayers).fill(null);
			
			let playerOrigin = tablePlayers[indexOrigin].getPlayer();
			let playerSimpleOrigin = PlayerSimple(playerOrigin.getName(), playerOrigin.getChips(), false, null, null, false);
			playersSimple[0] = playerSimpleOrigin;
			
			let currentAddIndex = 1;
			for (let i = (indexOrigin + 1) % maxPlayers; i != indexOrigin; i = (i + 1) % maxPlayers)
			{
				let tablePlayer = tablePlayers[i];
				if (tablePlayer)
				{
					let player = tablePlayer.getPlayer();
					let playerSimple = PlayerSimple(player.getName(), player.getChips(), false, null, null, false);
					playersSimple[currentAddIndex] = playerSimple;
				}
				currentAddIndex++;
			}
			return playersSimple;
		}
		else
		{
			return tablePlayersToPlayersSimpleNoGame();
		}
	}
	
	let tablePlayersToPlayersSimpleNoGame = () =>
	{
		let playersSimple = Array(maxPlayers).fill(null);
		for (let i = 0; i < maxPlayers; i++)
		{
			let tablePlayer = tablePlayers[i];
			if (tablePlayer)
			{
				let player = tablePlayer.getPlayer();
				let playerSimple = PlayerSimple(player.getName(), player.getChips(), false, null, null, false);
				playersSimple[i] = playerSimple;
			}
		}
		return playersSimple;
	}
	
	let removeVisitor = (visitor) =>
	{
		let index = visitors.indexOf(visitor);
		if (index !== -1)
		{
			visitors.splice(index, 1);
		}
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
		joinTable: (tablePlayer, i) =>
		{
			if (i >= tablePlayers.length || i < 0)
			{
				throw "Can't seat player at position " + i + " with max players " + tablePlayers.length;
			}
			
			tablePlayers[i] = tablePlayer;
			
			removeVisitor(tablePlayer.getSocket());
			
			if (!holdEm && getNumPlayersAtTable() >= 2)
			{
				self.startGame();
			}
			else if (holdEm)
			{
				// TODO: what if game is in progress? add them into game and hope it queues correctly...
			}
			
			self.updateRoomOccupants();
		},
		leaveTable: (tablePlayer) =>
		{
			let index;
			for (let i = 0; i < tablePlayers.length; i++)
			{
				if (tablePlayer === tablePlayers[i])
				{
					index = i;
					break;
				}
			}
			
			if (holdEm)
			{
				// TODO
			}
			
			tablePlayers[index] = null;
			
			self.addVisitor(tablePlayer.getSocket());
			self.updateRoomOccupants();
		},
		startGame: () =>
		{
			console.log('startHand called');
			let players = getPlayersAtTable();
			holdEm = HoldEm(players, bigBlind, Deck());
			holdEm.startHand();
		},
		addVisitor: (visitor) =>
		{
			if (visitors.indexOf(visitor) === -1)
			{
				visitors.push(visitor);
				io.sockets.connected[visitor].emit('gameState', self.getGameState());
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
					tablePlayers[i] = null;
				}
			}
		},
		getGameState: (tablePlayer = null) =>
		{
			let gameState;
			if (holdEm)
			{
				gameState = holdEm.generateGameState();
				let playersSimple;
				if (tablePlayer)
				{
					playersSimple = tablePlayersToPlayersSimpleWithOrigin(tablePlayer, gameState.players);
				}
				else
				{
					playersSimple = tablePlayersToPlayersSimple(gameState.players);
				}
				gameState.players = playersSimple;
				
				if (tablePlayer)
				{
					gameState.players.forEach((gamePlayer) =>
					{
						if (gamePlayer && gamePlayer.name === tablePlayer.getPlayer().getName())
						{
							gamePlayer.holeCards = tablePlayer.getPlayer().getHoleCards().map((card) => card.code);
						}
					});
				}
				
				if (!tablePlayer || gameState.nextActionPlayer !== tablePlayer.getPlayer())
				{
					gameState.nextAction = null;
				}
				
				if (gameState.board)
				{
					let board = gameState.board;
					gameState.board = board.map((card) => card.code);
				}
			}
			else
			{
				let playersSimple;
				if (tablePlayer)
				{
					playersSimple = tablePlayersToPlayersSimpleWithOriginNoGame(tablePlayer);
				}
				else
				{
					playersSimple = tablePlayersToPlayersSimpleNoGame();
				}
				gameState = GameState(null, null, null, null, playersSimple, null, null);
			}
			console.log(gameState);
			return gameState;
		},
		updateRoomOccupants: () =>
		{
			let gameState = self.getGameState();
			self.getVisitors().forEach((roomVisitor) =>
			{
				io.sockets.connected[roomVisitor].emit('gameState', gameState);
			});
			
			self.getTablePlayers().forEach((tablePlayer) =>
			{
				if (tablePlayer)
				{
					io.sockets.connected[tablePlayer.getSocket()].emit('gameState', self.getGameState(tablePlayer));
				}
			});
		},
		performGameAction: (action, value = null) =>
		{
			if (holdEm)
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
				self.updateRoomOccupants();
				
				return true;
			}
			else
			{
				// TODO: error here?
				return false;
			}
		}
	}
	
	return self;
}

module.exports = Room;
