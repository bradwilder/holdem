let Board = require('./board');
let ActionLog = require('./actionLog');
let ActionLogEntry = require('./actionLogEntry');
let PlayerSimple = require('./playerSimple');
let HoldEmState = require('./holdEmState');
let GameState = require('./gameState');
let NextAction = require('./nextAction');
let Pots = require('./pots');

let HoldEm = (tablePlayers, bigBlind, deck, autoPostBlinds = false) =>
{
	let players = tablePlayers.slice();
	let newPlayers = [];
	let pendingPlayers = [];
	
	let dealerIndex = players.length > 0 ? players.length - 2 : -1;
	let pots;
	let board;
	let actionLog = ActionLog();
	
	let gameState = {};
	gameState.state = HoldEmState().NO_GAME;
	gameState.winners = null;
	
	let changeDealer = () =>
	{
		dealerIndex = getNextPlayerAtTableNotNew(dealerIndex);
	}
	
	let getNextPlayerAtTableNotNew = (i) =>
	{
		let playersCount = getPlayersCount();
		if (i >= playersCount)
		{
			throw 'Invalid index ' + i;
		}
		
		let nextIndex = (i + 1) % playersCount;
		let index = nextIndex;
		while (index !== i && (newPlayers.indexOf(players[index]) !== -1 || pendingPlayers.indexOf(players[index]) !== -1))
		{
			index = (index + 1) % playersCount;
		}
		
		if (index == i)
		{
			// Looped back to original player; let all pending players in for free
			newPlayers = [];
			return nextIndex;
		}
		return index;
	}
	
	let getNextIndexAtTable = (i) =>
	{
		let playersCount = getPlayersCount();
		if (i >= playersCount)
		{
			throw 'Invalid index' + i;
		}
		
		let index = (i + 1) % playersCount;
		while (pendingPlayers.indexOf(players[index]) !== -1)
		{
			index = (i + 1) % playersCount;
		}
		
		return index;
	}
	
	let getPlayersCount = () => players.length - pendingPlayers.length;
	
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
	
	let getOngoingRoundAction = (player) =>
	{
		return pots ? pots.getOngoingActionThisRound(player) : null;
	}
	
	let getPlayersSimple = () =>
	{
		let playersSimple = [];
		players.forEach((player) =>
		{
			let isDealer = players[dealerIndex] === player && gameState.state !== HoldEmState().NO_GAME;
			let playerSimple = PlayerSimple(player.name, player.getChips(), player.hasHoleCards(), [], getOngoingRoundAction(player), isDealer);
			playersSimple.push(playerSimple);
		});
		return playersSimple;
	}
	
	let moveState = () =>
	{
		if (pots.isEven() && pots.hasTwoOrMorePlayers())
		{
			if (!pots.isBettingOver())
			{
				switch (gameState.state)
				{
					case HoldEmState().BLINDS:
					case HoldEmState().DEAL_HOLES:
						dealCards();
						actionLog.addSystemEntry('Dealt holes');
						gameState.state = HoldEmState().BET_PREFLOP;
						break;
					case HoldEmState().BET_PREFLOP:
					case HoldEmState().DEAL_FLOP:
						actionLog.addSystemEntry('Dealt flop');
						gameState.state = HoldEmState().BET_FLOP;
						break;
					case HoldEmState().BET_FLOP:
					case HoldEmState().DEAL_TURN:
						actionLog.addSystemEntry('Dealt turn');
						gameState.state = HoldEmState().BET_TURN;
						break;
					case HoldEmState().BET_TURN:
					case HoldEmState().DEAL_RIVER:
						actionLog.addSystemEntry('Dealt river');
						gameState.state = HoldEmState().BET_RIVER;
						break;
					case HoldEmState().BET_RIVER:
						gameState.state = HoldEmState().WINNER;
						break;
					case HoldEmState().WINNER:
					case HoldEmState().NO_GAME:
						gameState.state = HoldEmState().BLINDS;
						break;
					default:
						// TODO: throw exception here
				}
			}
			else
			{
				gameState.state = HoldEmState().WINNER;
			}
			
			pots.startRound(gameState.state);
		}
		else if (!pots.hasTwoOrMorePlayers())
		{
			gameState.state = HoldEmState().WINNER;
			
			pots.startRound(gameState.state);
		}
	}
	
	let dealCards = () =>
	{
		let mainPlayers = pots.getMainPot().getPlayers();
		mainPlayers.forEach((mainPlayer) =>
		{
			mainPlayer.deal(deck.dealCards(2));
		});
		
		board = Board(deck.dealCards(5));
	}
	
	let getCall = () =>
	{
		switch (gameState.state)
		{
			case HoldEmState().DEAL_HOLES:
			case HoldEmState().DEAL_FLOP:
			case HoldEmState().DEAL_TURN:
			case HoldEmState().DEAL_RIVER:
			case HoldEmState().WINNER:
			case HoldEmState().NO_GAME:
				return 0;
			default:
				// TODO: throw exception here maybe?
		}
		
		let call = 0;
		try
		{
			call = pots.getCall(); 
		}
		catch (x)
		{
			// TODO: ???
		}
		
		return call;
	}
	
	let getMinRaise = () =>
	{
		switch (gameState.state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().DEAL_HOLES:
			case HoldEmState().DEAL_FLOP:
			case HoldEmState().DEAL_TURN:
			case HoldEmState().DEAL_RIVER:
			case HoldEmState().WINNER:
			case HoldEmState().NO_GAME:
				return 0;
			default:
				// TODO: throw exception here maybe?
		}
		
		let minRaise = 0;
		try
		{
			minRaise = pots.getMinRaise(); 
		}
		catch (x)
		{
			// TODO: ???
		}
		return minRaise;
	}
	
	let getMaxRaise = () =>
	{
		switch (gameState.state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().DEAL_HOLES:
			case HoldEmState().DEAL_FLOP:
			case HoldEmState().DEAL_TURN:
			case HoldEmState().DEAL_RIVER:
			case HoldEmState().WINNER:
			case HoldEmState().NO_GAME:
				return 0;
			default:
				// TODO: Throw exception here maybe?
		}
		
		let maxRaise = 0;
		try
		{
			maxRaise = pots.getMaxRaise(); 
		}
		catch (x)
		{
			// TODO: ???
		}
		return maxRaise;
	}
	
	let getBoard = () =>
	{
		switch (gameState.state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().DEAL_HOLES:
			case HoldEmState().BET_PREFLOP:
				return [];
			case HoldEmState().DEAL_FLOP:
			case HoldEmState().BET_FLOP:
				return board.getFlop();
			case HoldEmState().DEAL_TURN:
			case HoldEmState().BET_TURN:
				let flop = board.getFlop();
				let turn = board.getTurn();
				return flop.concat(turn);
			case HoldEmState().DEAL_RIVER:
			case HoldEmState().BET_RIVER:
			case HoldEmState().WINNER:
					return board.getBoard();
			default:
				return null;
		}
	}
	
	let awardPots = () =>
	{
		if (!gameState.winners)
		{
			gameState.winners = pots.awardPots(getBoard());
			gameState.winners.pots.forEach((pot) =>
			{
				let action;
				if (pot.winners.length == 1)
				{
					action = "won pot of " + pot.size;
				}
				else
				{
					action = "split pot of " + pot.size;
				}
				let entry = ActionLogEntry(action, pot.winners);
				actionLog.addEntry(entry);
			});
		}
	}
	
	let getActionPlayer = () => pots.getNextActionPlayer();
	
	let generateGameState = () =>
	{
		let nextAction = null;
		let nextActionPlayer = null;
		switch (gameState.state)
		{
			case HoldEmState().BLINDS:
			case HoldEmState().BET_PREFLOP:
			case HoldEmState().BET_FLOP:
			case HoldEmState().BET_TURN:
			case HoldEmState().BET_RIVER:
				nextAction = NextAction(getCall(), getMinRaise(), getMaxRaise());
				nextActionPlayer = getActionPlayer();
				break;
			case HoldEmState().WINNER:
				awardPots();
				break;
			default:
		}
		
		gameState = GameState(gameState.state, self.getPotSizeWithoutRound(), bigBlind, getBoard(), getPlayersSimple(), nextAction, nextActionPlayer, gameState.winners);
	}
	
	let self =
	{
		getLogEntries: () => actionLog.getEntries(),
		getTotalPotSize: () => pots ? pots.getTotalSize() : 0,
		getPotSizeWithoutRound: () => pots ? pots.getSizeWithoutRound() : 0,
		getGameState: () =>
		{
			return JSON.parse(JSON.stringify(gameState));
		},
		startHand: () =>
		{
			deck.shuffle();
			
			changeDealer();
			
			let mainPlayers = getPlayersForMainPot();
			if (mainPlayers.length < 2)
			{
				return null;
			}
			pots = Pots(mainPlayers, newPlayers, bigBlind);
			
			newPlayers = [];
			pendingPlayers = [];
			
			players.forEach((player) =>
			{
				player.fold();
			});
			
			gameState.state = HoldEmState().BLINDS;
			gameState.winners = null;
			
			pots.startRound(gameState.state);
			
			actionLog.addSystemEntry("Started hand");
			
			generateGameState();
			
			if (autoPostBlinds)
			{
				while (self.getGameState().state === HoldEmState().BLINDS)
				{
					self.call();
				}
			}
		},
		setToNoGame: () =>
		{
			if (gameState.state === HoldEmState().WINNER)
			{
				gameState.state = HoldEmState().NO_GAME;
				gameState.winners = null;
				
				players.forEach((player) =>
				{
					player.fold();
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
			
			actionLog.addEntry(pots.addToPot(addition));
			moveState();
			generateGameState();
		},
		call: () =>
		{
			self.bet(self.getGameState().nextAction.call);
		},
		check: () =>
		{
			self.bet(0)
		},
		fold: () =>
		{
			actionLog.addEntries(pots.fold());
			moveState();
			generateGameState();
		},
		foldOutOfTurn: (player) =>
		{
			if (gameState.state !== HoldEmState().NO_GAME && gameState.state !== HoldEmState().WINNER)
			{
				actionLog.addEntries(pots.foldOutOfTurn(player));
				moveState();
			}
			else if (gameState.state === HoldEmState().WINNER)
			{
				if (players.length === 0)
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
			
			players.splice(index, 1);
			
			if (index <= dealerIndex)
			{
				dealerIndex--;
			}
			
			self.foldOutOfTurn(player);
		},
		addPlayer: (player, i) =>
		{
			if (players.indexOf(player) !== -1)
			{
				throw 'Tried to add player that already exists';
			}
			
			if (gameState.state === HoldEmState().WINNER || gameState.state === HoldEmState().NO_GAME)
			{
				newPlayers.push(player);
			}
			else
			{
				pendingPlayers.push(player);
			}
			
			players.splice(i, 0, player);
			
			if (players.length === 1 || players.length === 2)
			{
				dealerIndex = i;
			}
			else if (i <= dealerIndex)
			{
				dealerIndex++;
			}
			
			generateGameState();
		}
	}
	
	generateGameState();
	
	return self;
}

module.exports = HoldEm;
