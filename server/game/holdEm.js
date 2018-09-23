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
	
	let state = HoldEmState().NO_GAME;
	let dealerIndex = players.length > 0 ? players.length - 2 : -1;
	let pots;
	let board;
	let actionLog = ActionLog();
	
	let winners = null;
	
	let changeDealer = () =>
	{
		dealerIndex = getNextPlayerAtTableNotNew(dealerIndex);
	}
	
	let getNextPlayerAtTableNotNew = (i) =>
	{
		let playersCount = self.getPlayersCount();
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
		let playersCount = self.getPlayersCount();
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
			let isDealer = self.getDealerPlayer() === player && state !== HoldEmState().NO_GAME;
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
				switch (state)
				{
					case HoldEmState().BLINDS:
					case HoldEmState().DEAL_HOLES:
						dealCards();
						actionLog.addSystemEntry('Dealt holes');
						state = HoldEmState().BET_PREFLOP;
						break;
					case HoldEmState().BET_PREFLOP:
					case HoldEmState().DEAL_FLOP:
						actionLog.addSystemEntry('Dealt flop');
						state = HoldEmState().BET_FLOP;
						break;
					case HoldEmState().BET_FLOP:
					case HoldEmState().DEAL_TURN:
						actionLog.addSystemEntry('Dealt turn');
						state = HoldEmState().BET_TURN;
						break;
					case HoldEmState().BET_TURN:
					case HoldEmState().DEAL_RIVER:
						actionLog.addSystemEntry('Dealt river');
						state = HoldEmState().BET_RIVER;
						break;
					case HoldEmState().BET_RIVER:
						state = HoldEmState().WINNER;
						break;
					case HoldEmState().WINNER:
					case HoldEmState().NO_GAME:
						state = HoldEmState().BLINDS;
						break;
					default:
						// TODO: throw exception here
				}
			}
			else
			{
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
		let mainPlayers = pots.getMainPot().getPlayers();
		mainPlayers.forEach((mainPlayer) =>
		{
			mainPlayer.deal(deck.dealCards(2));
		});
		
		board = Board(deck.dealCards(5));
	}
	
	let getCall = () =>
	{
		switch (state)
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
		switch (state)
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
		switch (state)
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
		switch (state)
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
		if (!winners)
		{
			winners = pots.awardPots(getBoard());
			winners.pots.forEach((pot) =>
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
	
	let self =
	{
		getLogEntries: () => actionLog.getEntries(),
		getPlayersCount: () => players.length - pendingPlayers.length,
		getPlayer: (i) => players[i],
		getDealerPlayer: () => players[dealerIndex],
		getTotalPotSize: () => pots ? pots.getTotalSize() : 0,
		getPotSizeWithoutRound: () => pots ? pots.getSizeWithoutRound() : 0,
		potsToString: () => pots.toString(),
		getMainPot: () => pots.getMainPot(),
		getGameState: () =>
		{
			if (!gameState)
			{
				gameState = generateGameState();
			}
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
			
			winners = null;
			
			players.forEach((player) =>
			{
				player.fold();
			});
			
			state = HoldEmState().BLINDS;
			
			pots.startRound(state);
			
			actionLog.addSystemEntry("Started hand");
			
			gameState = generateGameState();
			
			if (autoPostBlinds)
			{
				while (self.getGameState().state === HoldEmState().BLINDS)
				{
					self.call();
				}
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
			gameState = generateGameState();
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
			gameState = generateGameState();
		},
		foldOutOfTurn: (player) =>
		{
			if (state !== HoldEmState().NO_GAME && state !== HoldEmState().WINNER)
			{
				actionLog.addEntries(pots.foldOutOfTurn(player));
				moveState();
			}
			else if (state === HoldEmState().WINNER)
			{
				state = HoldEmState().NO_GAME;
			}
			gameState = generateGameState();
		},
		removePlayer: (player) =>
		{
			let index = players.indexOf(player);
			if (index === -1)
			{
				throw "Can't remove player that doesn't exist";
			}
			
			self.foldOutOfTurn(player);
			
			players.splice(index, 1);
			
			if (index <= dealerIndex)
			{
				dealerIndex--;
			}
			gameState = generateGameState();
		},
		addPlayer: (player, i) =>
		{
			if (players.indexOf(player) !== -1)
			{
				throw 'Tried to add player that already exists';
			}
			
			if (state === HoldEmState().WINNER || state === HoldEmState().NO_GAME)
			{
				newPlayers.push(player);
			}
			else
			{
				pendingPlayers.push(player);
			}
			
			players.splice(i, 0, player);
			
			if (i <= dealerIndex)
			{
				dealerIndex++;
			}
			else if (players.length === 1)
			{
				dealerIndex = 0;
			}
			gameState = generateGameState();
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
				nextActionPlayer = getActionPlayer();
				break;
			case HoldEmState().WINNER:
				awardPots();
				break;
			default:
		}
		
		return GameState(state, self.getPotSizeWithoutRound(), bigBlind, getBoard(), getPlayersSimple(), nextAction, nextActionPlayer, winners);
	}
	
	let gameState = generateGameState();
	
	return self;
}

module.exports = HoldEm;
