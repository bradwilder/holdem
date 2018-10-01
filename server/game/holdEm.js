let Board = require('./board');
let ActionLog = require('./actionLog');
let ActionLogEntry = require('./actionLogEntry');
let PlayerClient = require('./playerClient');
let HoldEmState = require('./holdEmState');
let GameStateClient = require('./gameStateClient');
let NextAction = require('./nextAction');
let Pots = require('./pots');

let HoldEm = (maxPlayers, bigBlind, deck, autoPostBlinds = false) =>
{
	let players = Array(maxPlayers).fill(null);
	let newPlayers = [];
	let pendingPlayers = [];
	
	let dealerIndex = maxPlayers - 1;
	let pots;
	let board;
	let actionLog = ActionLog();
	
	let gameState = {};
	let state = HoldEmState().NO_GAME;
	let winners = null;
	
	let lastAction = [];
	
	let addLastAction = (action) =>
	{
		lastAction.push(action);
	}
	
	let setLastAction = (action) =>
	{
		lastAction = [];
		addLastAction(action);
	}
	
	let getNumPlayersAtTable = () =>
	{
		let count = 0;
		players.forEach((player) =>
		{
			if (player)
			{
				count++;
			}
		});
		return count;
	}
	
	let getNextPlayerAtTableNotNew = (i) =>
	{
		let playersCount = players.length;
		if (i >= playersCount)
		{
			throw 'Invalid index ' + i;
		}
		
		let nextIndex = (i + 1) % playersCount;
		let index = nextIndex;
		while (!players[index] || index !== i && (newPlayers.indexOf(players[index]) !== -1 || pendingPlayers.indexOf(players[index]) !== -1))
		{
			index = (index + 1) % playersCount;
		}
		
		if (index == i)
		{
			// Looped back to original player; let all new players in for free
			newPlayers = [];
			
			index = nextIndex;
			while (!players[index] || index !== i && (newPlayers.indexOf(players[index]) !== -1 || pendingPlayers.indexOf(players[index]) !== -1))
			{
				index = (index + 1) % playersCount;
			}
			
			return index;
		}
		return index;
	}
	
	let getNextIndexAtTable = (i) =>
	{
		let playersCount = players.length;
		if (i >= playersCount)
		{
			throw 'Invalid index' + i;
		}
		
		let index = (i + 1) % playersCount;
		while (!players[index])
		{
			index = (index + 1) % playersCount;
		}
		
		return index;
	}
	
	let getPlayersForMainPot = () =>
	{
		let mainPlayers = [];
		for (let i = getNextIndexAtTable(dealerIndex); i != dealerIndex; i = getNextIndexAtTable(i))
		{
			mainPlayers.push(players[i]);
		}
		mainPlayers.push(players[dealerIndex]);
		return mainPlayers;
	}
	
	let getOngoingRoundAction = (player) => pots ? pots.getOngoingActionThisRound(player) : null;
	
	let getPlayerClients = (nextActionPlayer) =>
	{
		let playerClients = [];
		for (let i = 0; i < players.length; i++)
		{
			let player = players[i];
			
			let isDealer = dealerIndex === i;
			let playerClient;
			if (player)
			{
				playerClient = PlayerClient(isDealer, player, player.hasHoleCards(), getOngoingRoundAction(player), player === nextActionPlayer);
			}
			else
			{
				playerClient = PlayerClient(isDealer);
			}
			playerClients.push(playerClient);
		}
		return playerClients;
	}
	
	let moveState = () =>
	{
		if (pots.isEven() && pots.hasTwoOrMorePlayers())
		{
			if (!pots.isBettingOver())
			{
				switch (state)
				{
					case HoldEmState().BLINDS:
						actionLog.addSystemEntry('Dealt holes');
						state = HoldEmState().BET_PREFLOP;
						dealCards();
						break;
					case HoldEmState().BET_PREFLOP:
						actionLog.addSystemEntry('Dealt flop');
						state = HoldEmState().BET_FLOP;
						dealCards();
						break;
					case HoldEmState().BET_FLOP:
						actionLog.addSystemEntry('Dealt turn');
						state = HoldEmState().BET_TURN;
						dealCards();
						break;
					case HoldEmState().BET_TURN:
						actionLog.addSystemEntry('Dealt river');
						state = HoldEmState().BET_RIVER;
						dealCards();
						break;
					case HoldEmState().BET_RIVER:
						state = HoldEmState().WINNER;
						break;
					case HoldEmState().WINNER:
					case HoldEmState().NO_GAME:
						state = HoldEmState().BLINDS;
						break;
				}
			}
			else
			{
				dealRemainingCards();
				state = HoldEmState().WINNER;
			}
			
			pots.startRound(state);
		}
		else if (!pots.hasTwoOrMorePlayers())
		{
			state = HoldEmState().WINNER;
			
			pots.startRound(state);
		}
	}
	
	let dealCards = () =>
	{
		switch (state)
		{
			case HoldEmState().BET_PREFLOP:
				dealHoles();
				break;
			case HoldEmState().BET_FLOP:
				dealFlop();
				break;
			case HoldEmState().BET_TURN:
			case HoldEmState().BET_RIVER:
				dealTurnRiver();
				break;
		}
	}
	
	let dealRemainingCards = () =>
	{
		switch (state)
		{
			case HoldEmState().BET_PREFLOP:
				dealHoles();
			case HoldEmState().BET_FLOP:
				dealFlop();
			case HoldEmState().BET_TURN:
				dealTurnRiver();
			case HoldEmState().BET_RIVER:
				dealTurnRiver();
				break;
		}
	}
	
	let dealHoles = () =>
	{
		let mainPlayers = pots.getMainPot().getPlayers();
		mainPlayers.forEach((mainPlayer) =>
		{
			mainPlayer.deal(deck.dealCards(2));
		});
		addLastAction('dealHoles');
	}
	
	let dealFlop = () =>
	{
		board.addFlop(deck.dealCards(3));
		addLastAction('dealFlop');
	}
	
	let dealTurnRiver = () =>
	{
		board.addTurnRiver(deck.deal());
		addLastAction('dealTurnRiver');
	}
	
	let getCall = () =>
	{
		switch (state)
		{
			case HoldEmState().WINNER:
			case HoldEmState().NO_GAME:
				return 0;
		}
		
		return pots.getCall();
	}
	
	let getMinRaise = () =>
	{
		switch (state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().WINNER:
			case HoldEmState().NO_GAME:
				return 0;
		}
		
		return pots.getMinRaise();
	}
	
	let getMaxRaise = () =>
	{
		switch (state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().WINNER:
			case HoldEmState().NO_GAME:
				return 0;
		}
		
		return pots.getMaxRaise();
	}
	
	let getBoard = () => board ? board.getBoard() : null;
	
	let potPlayersToShowdownPlayers = (potPlayers, potWinners, lastAggressor, foldedPlayers) =>
	{
		let playerClients = Array(players.length).fill(null);
		let i;
		let startedLoop = false;
		
		let originIndex = players.indexOf(lastAggressor);
		if (originIndex === -1)
		{
			originIndex = (dealerIndex + 1) % players.length;
		}
		
		for (i = originIndex; i != originIndex || !startedLoop; i = (i + 1) % players.length)
		{
			startedLoop = true;
			let player = players[i];
			let isDealer = dealerIndex === i;
			
			let playerClient;
			if (player)
			{
				let newPlayer = player.clone();
				if (foldedPlayers.indexOf(player) !== -1)
				{
					newPlayer.fold();
					playerClient = PlayerClient(isDealer, newPlayer, false);
				}
				else
				{
					let hasHoleCards = newPlayer.hasHoleCards();
					if (potPlayers.indexOf(player) === -1)
					{
						newPlayer.fold();
					}
					
					if (potPlayers.length == 1)
					{
						newPlayer.fold();
					}
					
					playerClient = PlayerClient(isDealer, newPlayer, hasHoleCards);
				}
			}
			else
			{
				playerClient = PlayerClient(isDealer);
			}
			
			playerClients[i] = playerClient;
			
			if (player && potWinners.find((winner) => winner.getName() === player.getName()))
			{
				break;
			}
			else if (player && potPlayers.indexOf(player) !== -1 && potWinners.indexOf(player) === -1 && foldedPlayers.indexOf(player) === -1)
			{
				foldedPlayers.push(player);
			}
		}
		
		for (i = (i + 1) % players.length; i != originIndex; i = (i + 1) % players.length)
		{
			let player = players[i];
			let isDealer = dealerIndex === i;
			
			let playerClient;
			if (player && potWinners.find((winner) => winner.getName() === player.getName()))
			{
				let newPlayer = player.clone();
				playerClient = PlayerClient(isDealer, newPlayer, newPlayer.hasHoleCards());
			}
			else if (player)
			{
				let newPlayer = player.clone();
				let hasHoleCards = newPlayer.hasHoleCards();
				if (foldedPlayers.indexOf(player) !== -1)
				{
					hasHoleCards = false;
				}
				
				if (potPlayers.indexOf(player) !== -1 && foldedPlayers.indexOf(player) === -1)
				{
					foldedPlayers.push(player);
				}
				
				newPlayer.fold();
				
				playerClient = PlayerClient(isDealer, newPlayer, hasHoleCards);
			}
			else
			{
				playerClient = PlayerClient(isDealer);
			}
			playerClients[i] = playerClient;
		}
		
		return playerClients;
	}
	
	let awardPots = () =>
	{
		if (!winners)
		{
			winners = [];
			let awardedPots = pots.awardPots(getBoard());
			
			let foldedPlayers = [];
			awardedPots.pots.forEach((pot) =>
			{
				let action;
				if (pot.winnerState.winners.length == 1)
				{
					action = "won pot of " + pot.potSize;
				}
				else
				{
					action = "split pot of " + pot.potSize;
				}
				let entry = ActionLogEntry(action, pot.winnerState.winners);
				actionLog.addEntry(entry);
				
				winners.push({players: potPlayersToShowdownPlayers(pot.players, pot.winnerState.winners, awardedPots.lastAggressor, foldedPlayers), hand: pot.winnerState, potSize: pot.potSize});
			});
		}
	}
	
	let generateGameState = () =>
	{
		let nextAction = null;
		let nextActionPlayer = null;
		switch (state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().BET_PREFLOP:
			case HoldEmState().BET_FLOP:
			case HoldEmState().BET_TURN:
			case HoldEmState().BET_RIVER:
				nextAction = NextAction(getCall(), getMinRaise(), getMaxRaise());
				nextActionPlayer = pots.getNextActionPlayer();
				break;
			case HoldEmState().WINNER:
				awardPots();
				break;
			default:
		}
		
		gameState = GameStateClient(getPlayerClients(nextActionPlayer), bigBlind, nextAction, nextActionPlayer, self.getPotSizeWithoutRound(), getBoard(), null, lastAction);
		lastAction = [];
	}
	
	let self =
	{
		getLogEntries: () => actionLog.getEntries(),
		getTotalPotSize: () => pots ? pots.getTotalSize() : 0,
		getPotSizeWithoutRound: () => pots ? pots.getSizeWithoutRound() : 0,
		getState: () => state,
		getGameState: () => gameState.clone(),
		getWinners: () => winners,
		startHand: () =>
		{
			deck.shuffle();
			
			// TODO: removing players
			// players.forEach((player) =>
			// {
			// 	if (player && player.getChips === 0)
			// 	{
			// 		self.removePlayer(player);
			// 	}
			// });
			
			dealerIndex = getNextPlayerAtTableNotNew(dealerIndex);
			
			pendingPlayers = [];
			
			board = Board();
			
			let mainPlayers = getPlayersForMainPot();
			if (mainPlayers.length < 2)
			{
				return null;
			}
			pots = Pots(mainPlayers, newPlayers, bigBlind);
			
			newPlayers = [];
			
			players.forEach((player) =>
			{
				if (player)
				{
					player.fold();
				}
			});
			
			state = HoldEmState().BLINDS;
			winners = null;
			
			pots.startRound(state);
			
			actionLog.addSystemEntry("Started hand");
			
			generateGameState();
			
			if (autoPostBlinds)
			{
				while (state === HoldEmState().BLINDS)
				{
					self.call(true);
				}
			}
		},
		setToNoGame: () =>
		{
			if (state === HoldEmState().WINNER)
			{
				state = HoldEmState().NO_GAME;
				winners = null;
				
				players.forEach((player) =>
				{
					if (player)
					{
						player.fold();
					}
				});
				
				generateGameState();
			}
		},
		bet: (addition) =>
		{
			let newGameState = self.getGameState();
			let nextAction = newGameState.nextAction;
			let nextActionPlayer = newGameState.nextActionPlayer;
			if (addition < nextAction.call && nextActionPlayer.getChips() > 0)
			{
				throw 'Bet ' + addition + ' is less than the call ' + nextAction.call;
			}
			
			if (addition > nextAction.call && addition < nextAction.minRaise)
			{
				throw 'Bet ' + addition + ' is less than the min raise ' + nextAction.minRaise;
			}
			
			if (addition !== nextAction.call && addition > nextAction.maxRaise)
			{
				addition = nextAction.maxRaise;
			}
			
			if (addition > nextAction.call)
			{
				setLastAction('raise');
			}
			
			actionLog.addEntry(pots.addToPot(addition));
			moveState();
			generateGameState();
		},
		call: (autoPosted = false) =>
		{
			if (!autoPosted)
			{
				setLastAction('call');
			}
			self.bet(self.getGameState().nextAction.call);
		},
		check: () =>
		{
			setLastAction('check');
			self.bet(0);
		},
		fold: () =>
		{
			actionLog.addEntries(pots.fold());
			setLastAction('fold');
			moveState();
			generateGameState();
		},
		foldOutOfTurn: (player) =>
		{
			if (state !== HoldEmState().NO_GAME && state !== HoldEmState().WINNER)
			{
				actionLog.addEntries(pots.foldOutOfTurn(player));
				setLastAction('fold');
				moveState();
			}
			else if (state === HoldEmState().WINNER)
			{
				if (getNumPlayersAtTable() === 0)
				{
					self.setToNoGame();
				}
			}
			generateGameState();
		},
		removePlayer: (player) =>
		{
			let index = players.indexOf(player);
			if (index === -1)
			{
				throw "Can't remove player that doesn't exist";
			}
			
			players[index] = null;
			
			self.foldOutOfTurn(player);
		},
		addPlayer: (player, i) =>
		{
			if (players.indexOf(player) !== -1)
			{
				throw 'Tried to add player that already exists';
			}
			
			if (players[i])
			{
				throw 'Tried to add player at occupied position ' + i;
			}
			
			if (state === HoldEmState().WINNER || state === HoldEmState().NO_GAME)
			{
				newPlayers.push(player);
			}
			else
			{
				pendingPlayers.push(player);
			}
			
			players[i] = player;
			
			generateGameState();
		}
	}
	
	generateGameState();
	
	return self;
}

module.exports = HoldEm;
