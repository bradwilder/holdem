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
	
	let state = HoldEmState().WINNER;
	let dealerIndex = players.length - 2;
	let pots;
	let board;
	let actionLog = ActionLog();
	
	let winners;
	
	let changeDealer = () =>
	{
		dealerIndex = getNextPlayerAtTableNotNew(dealerIndex);
	}
	
	let getNextPlayerAtTableNotNew = (i) =>
	{
		let playersCount = self.getPlayersCount();
		if (i >= playersCount)
		{
			throw 'Invalid index' + i;
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
			let playerSimple = PlayerSimple(player.getName(), player.getChips(), player.hasHoleCards(), [], getOngoingRoundAction(player), self.getDealerPlayer() === player);
			playersSimple.push(playerSimple);
		});
		return playersSimple;
	}
	
	let moveState = () =>
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
					moveToWinner();
					break;
				case HoldEmState().WINNER:
					state = HoldEmState().BLINDS;
					break;
				default:
					// TODO: throw exception here
			}
		}
		else
		{
			moveToWinner();
		}
		
		pots.startRound(state);
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
	
	let getActionPlayer = () => pots.getNextActionPlayer();
	
	let moveToWinner = () =>
	{
		state = HoldEmState().WINNER;
		if (!winners)
		{
			winners = self.awardPots();
		}
	}
	
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
		awardPot: () => pots.awardPot(self.getBoard()),
		awardPots: () =>
		{
			let potWinners = pots.awardPots(self.getBoard());
			potWinners.pots.forEach((pot) =>
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
			
			return potWinners;
		},
		generateGameState: () =>
		{
			let nextAction;
			let nextActionPlayer;
			let board = self.getBoard();
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
					if (!winners)
					{
						winners = self.awardPots();
					}
					break;
				default:
			}
			
			return GameState(state, self.getPotSizeWithoutRound(), bigBlind, board, getPlayersSimple(), nextAction, nextActionPlayer, winners);
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
			
			if (autoPostBlinds)
			{
				while (self.generateGameState().state === HoldEmState().BLINDS)
				{
					self.call();
				}
			}
		},
		bet: (addition) =>
		{
			let gameState = self.generateGameState();
			let nextAction = gameState.nextAction;
			let nextActionPlayer = gameState.nextActionPlayer;
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
			if (pots.isEven() && !pots.isHandOver())
			{
				moveState();
			}
		},
		call: () =>
		{
			self.bet(self.generateGameState().nextAction.call);
		},
		check: () =>
		{
			self.bet(0)
		},
		fold: () =>
		{
			actionLog.addEntries(pots.fold());
			if (pots.isEven() && !pots.isHandOver())
			{
				moveState();
			}
			else if (pots.isHandOver())
			{
				moveToWinner();
			}
		},
		foldOutOfTurn: (player) =>
		{
			actionLog.addEntries(pots.foldOutOfTurn(player));
			if (pots.isEven() && !pots.isHandOver())
			{
				moveState();
			}
			else if (pots.isHandOver())
			{
				moveToWinner();
			}
		},
		getBoard: () =>
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
				default:
					return board.getBoard();
			}
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
		},
		addPlayer: (player, i) =>
		{
			if (players.indexOf(player) !== -1)
			{
				throw 'Tried to add player that already exists';
			}
			
			if (state === HoldEmState().WINNER)
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
		}
	}
	
	return self;
}

module.exports = HoldEm;
