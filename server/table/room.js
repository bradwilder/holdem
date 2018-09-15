const HoldEm = require('../game/holdEm');
const Deck = require('../game/deck');
const GameState = require('../game/gameState');
const PlayerSimple = require('../game/playerSimple');

let Room = (id, name, bigBlind, maxPlayers) =>
{
	let tablePlayers = Array(maxPlayers).fill(null);
	
	let holdEm;
	
	let visitors = [];
	
	let getNumPlayersSittingIn = () =>
	{
		let count = 0;
		tablePlayers.forEach((player) =>
		{
			if (player && !player.isSittingOut())
			{
				count++;
			}
		});
		return count;
	}
	
	let getPlayersSittingIn = () =>
	{
		let players = [];
		tablePlayers.forEach((tablePlayer) =>
		{
			if (tablePlayer && !tablePlayer.isSittingOut())
			{
				players.push(tablePlayer.getPlayer());
			}
		});
		return players;
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
			let playerSimple = PlayerSimple(playerOrigin.getName(), playerOrigin.getChips(), false, null);
			playersSimple[0] = playerSimple;
			
			let currentAddIndex = 1;
			for (let i = (indexOrigin + 1) % maxPlayers; i != indexOrigin; i = (i + 1) % maxPlayers)
			{
				let tablePlayer = tablePlayers[i];
				if (tablePlayer)
				{
					let player = tablePlayer.getPlayer();
					let playerSimple = PlayerSimple(player.getName(), player.getChips(), false, null);
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
				let playerSimple = PlayerSimple(player.getName(), player.getChips(), false, null);
				playersSimple[i] = playerSimple;
			}
		}
		return playersSimple;
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
		addPlayer: (tablePlayer, i) =>
		{
			if (i >= tablePlayers.length || i < 0)
			{
				throw "Can't seat player at position " + i + " with max players " + tablePlayers.length;
			}
			
			// TODO: what if game is in progress? add them into game and hope it queues correctly...
			tablePlayers[i] = tablePlayer;
			
			self.removeVisitor(tablePlayer.getSocket());
			
			if (!holdEm && getNumPlayersSittingIn() >= 2)
			{
				self.startGame();
			}
		},
		removePlayer: (tablePlayerToRemove) =>
		{
			for (let i = 0; i < tablePlayers.length; i++)
			{
				let tablePlayer = tablePlayers[i];
				if (tablePlayer === tablePlayerToRemove)
				{
					tablePlayers[i] = null;
				}
			}
			
			self.removeVisitor(tablePlayerToRemove.getSocket());
		},
		startGame: () =>
		{
			let players = getPlayersSittingIn();
			
			// TODO
			console.log('startHand called');
			holdEm = HoldEm(players, bigBlind, Deck());
			holdEm.startHand();
			
			
			
			
			
			
		},
		sitPlayerIn: (i) =>
		{
			let tablePlayer = tablePlayers[i];
			if (!tablePlayer)
			{
				throw 'No player at index ' + i;
			}
			
			if (!tablePlayer.isSittingOut())
			{
				throw 'Player ' + i + ' is already sitting in';
			}
			
			let newIndex = 0;
			for (let j = 0; j < tablePlayers.length && j < i; j++)
			{
				let tablePlayer = tablePlayers[j];
				if (tablePlayer && !tablePlayer.isSittingOut())
				{
					newIndex++;
				}
			}
			
			
			// TODO: is game active? if not, queue them for later
			//if ()
			
			//tablePlayer.setSittingOut(false);
			
		},
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
		getGameState: (player = null) =>
		{
			let gameState;
			if (holdEm)
			{
				gameState = holdEm.generateGameState();
				
				// TODO!!!
				console.log('gameState');
				console.log(gameState);
				console.log('gameState2');
				
				
				
				
			}
			else
			{
				let playersSimple;
				if (player)
				{
					playersSimple = tablePlayersToPlayersSimpleWithOriginNoGame(player);
				}
				else
				{
					playersSimple = tablePlayersToPlayersSimpleNoGame();
				}
				gameState = GameState(null, null, playersSimple, null);
			}
			return gameState;
		}
	}
	
	return self;
}

module.exports = Room;
