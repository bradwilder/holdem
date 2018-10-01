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
			// TODO: leaving table
			// tablePlayers.forEach((tablePlayer) =>
			// {
			// 	if (tablePlayer && tablePlayer.getPlayer().getChips() === 0)
			// 	{
			// 		self.leaveTable(tablePlayer);
			// 	}
			// });
			
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
	
	let sendWinnersOnTimer = (gameState, winners, seconds = defaultWait / 2) =>
	{
		if (timeout)
		{
			clearTimeout(timeout);
		}
		
		let i = 0;
		
		let sendWinner = () =>
		{
//			console.log('sendWinner called');
			if (i < winners.length)
			{
				sendWinnerToAll(gameState, winners[i]);
				i++;
				timeout = setTimeout(() => sendWinner(), seconds * 1000);
			}
			else
			{
				// if (getNumPlayersAtTable() >= 2)
				// {
				// 	startGameOnTimer(0);
				// }
				// else
				// {
				// 	setToNoGameOnTimer(0);
				// }
			}
		}
		
		sendWinner();
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
	
	let sendWinnerToAll = (gameState, winner) =>
	{
		self.getVisitors().forEach((roomVisitor) =>
		{
			sendGameState(roomVisitor, gameState.cloneWinner(winner));
		});
		
		self.getTablePlayers().forEach((tablePlayer) =>
		{
			if (tablePlayer)
			{
				sendGameState(tablePlayer.getSocket(), gameState.cloneWinner(winner, tablePlayer.getPlayer()));
			}
		});
	}
	
	let updateRoomOccupants = () =>
	{
		let gameState = holdEm.getGameState();
		self.getVisitors().forEach((roomVisitor) =>
		{
			sendGameState(roomVisitor, gameState.cloneForVisitor());
		});
		
		self.getTablePlayers().forEach((tablePlayer) =>
		{
			if (tablePlayer)
			{
				sendGameState(tablePlayer.getSocket(), gameState.cloneForPlayer(tablePlayer.getPlayer()));
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
			
			holdEm.addPlayer(tablePlayer.getPlayer(), position);
			
			tablePlayers[position] = tablePlayer;
			
			removeVisitor(tablePlayer.getSocket());
			
			let state = holdEm.getState();
			if (state === HoldEmState().NO_GAME && getNumPlayersAtTable() >= 2)
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
				sendGameState(visitor, holdEm.getGameState().cloneForVisitor());
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
			
			self.getGameState();
		},
		getGameState: (tablePlayer = null) =>
		{
			// let gameState = holdEm.getGameState();
			// if (tablePlayer)
			// {
			// 	gameState.players = tablePlayersToPlayersSimpleWithOrigin(tablePlayer, gameState.players);
				
			// 	let indexOrigin = tablePlayers.indexOf(tablePlayer);
			// 	gameState.dealerIndex = (gameState.dealerIndex - indexOrigin + maxPlayers) % maxPlayers;
			// }
			
			// if (tablePlayer)
			// {
			// 	gameState.players.forEach((gamePlayer) =>
			// 	{
			// 		if (gamePlayer && gamePlayer.getName() === tablePlayer.getPlayer().getName())
			// 		{
			// 			gamePlayer.holeCards = tablePlayer.getPlayer().getHoleCards();
			// 		}
			// 	});
			// }
			
			// if (!tablePlayer || (!gameState.nextActionPlayer || gameState.nextActionPlayer.getName() !== tablePlayer.getPlayer().getName()))
			// {
			// 	gameState.nextAction = null;
			// }
			// //gameState.nextActionPlayer = null;
			
			// if (gameState.winners)
			// {
			// 	if (getNumPlayersAtTable() >= 2)
			// 	{
			// 		startGameOnTimer(defaultWait);
			// 	}
			// 	else
			// 	{
			// 		setToNoGameOnTimer(defaultWait);
			// 	}
			// }
			
//			if (gameState.winners)
//			console.log(JSON.stringify(gameState, null, 4));
			
			
			let gameState = holdEm.getGameState();
			
			
			let state = holdEm.getState();
			if (state === HoldEmState().WINNER)
			{
				let winners = holdEm.getWinners();
//				console.log(JSON.stringify(winners, null, 4));
				// TODO
				sendWinnersOnTimer(gameState, winners);
				
			}
			
			
//			console.log(JSON.stringify(gameState, null, 4));
			return gameState.cloneState(tablePlayer? tablePlayer.getPlayer() : null);
		},
		performGameAction: (player, action, value = null) =>
		{
			let gameState = holdEm.getGameState();
			if (gameState.nextActionPlayer.getName() === player.getName())
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
				self.getGameState();
				
				return true;
			}
			
			return false;
		}
	}
	
	return self;
}

module.exports = Room;
