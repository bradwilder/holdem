const HoldEm = require('../game/holdEm');
const HoldEmState = require('../game/holdEmState');
const Deck = require('../game/deck');

let Room = (id, name, bigBlind, maxPlayers, io, defaultWait = 10) =>
{
	let tablePlayers = Array(maxPlayers).fill(null);
	let visitors = [];
	let holdEm = HoldEm([], bigBlind, Deck(), true);
	let startTimeout;
	
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
	
	let removeVisitor = (visitor) =>
	{
		let index = visitors.indexOf(visitor);
		if (index !== -1)
		{
			visitors.splice(index, 1);
		}
	}
	
	let hasVisitor = (visitor) =>
	{
		return visitors.indexOf(visitor) !== -1;
	}
	
	let startGameOnTimer = (seconds = defaultWait) =>
	{
		if (startTimeout)
		{
			clearTimeout(startTimeout);
		}
		
		let startHand = () =>
		{
//			console.log('startHand called');
			holdEm.startHand();
			startTimeout = null;
			updateRoomOccupants();
		}
		
		if (seconds > 0)
		{
			startTimeout = setTimeout(() => startHand(), seconds * 1000);
		}
		else
		{
			startHand();
		}
	}
	
	let removePlayerFromTable = (tablePlayer) =>
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
		
		holdEm.removePlayer(tablePlayer.getPlayer());
		
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
		joinTable: (tablePlayer, position) =>
		{
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
			
			let playersBefore = 0;
			for (let i = 0; i < position; i++)
			{
				let tablePlayer = tablePlayers[i];
				if (tablePlayer)
				{
					playersBefore++;
				}
			}
			
			holdEm.addPlayer(tablePlayer.getPlayer(), playersBefore);
			
			tablePlayers[position] = tablePlayer;
			
			removeVisitor(tablePlayer.getSocket());
			
			let gameState = self.getGameState();
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
				playersSimple = tablePlayersToPlayersSimple(gameState.players);
			}
			gameState.players = playersSimple;
			
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
			
			let winners = gameState.winners;
			if (winners)
			{
				if (getNumPlayersAtTable() >= 2)
				{
					startGameOnTimer(Math.max(winners.pots.length * 5, 10));
				}
				else
				{
					// TODO: timer to go into NO_GAME state
				}
				
				
				
				
				
			}
			
			let isPotContested = true;
			if (winners && winners.pots[0] && winners.pots[0].players.length <= 1)
			{
				isPotContested = false;
			}
			
			if (!isPotContested)
			{
				gameState.players.forEach((playerSimple) =>
				{
					if (playerSimple)
					{
						playerSimple.hasHoleCards = false;
					}
				});
			}
			else if (winners)
			{
				// TODO: Somehow set it up for hole card showdown depending on lastAggressor
				
				
				
				
				
				
				
			}
			
			if (gameState.board && !isPotContested)
			{
				gameState.board = [];
			}
			
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
