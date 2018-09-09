let Board = require('./board');
let ActionLog = require('./actionLog');
let ActionLogEntry = require('./actionLogEntry');
let PlayerSimple = require('./playerSimple');
let HoldEmState = require('./holdEmState');
let GameState = require('./gameState');
let PlayerAction = require('./playerAction');
let Pots = require('./pots');

let HoldEm = (tablePlayers, bigBlind, deck) =>
{
	let players = tablePlayers.slice();
	let pendingPlayers = [];
	
	let state = HoldEmState().WINNER;
	let dealerIndex = players.length - 2;
	let pots;
	let board;
	let actionLog = ActionLog();
	
	let emitEvent = (event) =>
	{
		// TODO
	}
	
	let changeDealer = () =>
	{
		dealerIndex = getNextPlayerAtTableNotPending(dealerIndex);
	}
	
	let getNextPlayerAtTableNotPending = (i) =>
	{
		let playersCount = self.getPlayersCount();
		if (i >= playersCount)
		{
			throw 'Invalid index' + i;
		}
		
		let nextIndex = (i + 1) % playersCount;
		let index = nextIndex;
		while (index !== i && pendingPlayers.indexOf(self.getPlayer(index)) !== -1)
		{
			index = (index + 1) % playersCount;
		}
		
		if (index == i)
		{
			// Looped back to original player; let all pending players in for free
			pendingPlayers = [];
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
		
		return (i + 1) % playersCount;
	}
	
	let getPlayersForMainPot = () =>
	{
		let mainPlayers = [];
		for (let i = getNextIndexAtTable(dealerIndex); i != dealerIndex; i = getNextIndexAtTable(i))
		{
			mainPlayers.push(self.getPlayer(i));
		}
		mainPlayers.push(self.getPlayer(dealerIndex));
		return mainPlayers;
	}
	
	let getPlayersSimple = () =>
	{
		let playersSimple = [];
		players.forEach((player) =>
		{
			let playerSimple = PlayerSimple(player.getName(), player.getChips(), player.hasHoleCards(), pots.getChipsThisRound(player));
			playersSimple.push(playerSimple);
		});
		return playersSimple;
	}
	
	let moveState = () =>
	{
		if (!self.isBettingOver())
		{
			switch (state)
			{
				case HoldEmState().BLINDS:
				case HoldEmState().DEAL_HOLES:
					state = HoldEmState().BET_PREFLOP;
					break;
				case HoldEmState().BET_PREFLOP:
				case HoldEmState().DEAL_FLOP:
					state = HoldEmState().BET_FLOP;
					break;
				case HoldEmState().BET_FLOP:
				case HoldEmState().DEAL_TURN:
					state = HoldEmState().BET_TURN;
					break;
				case HoldEmState().BET_TURN:
				case HoldEmState().DEAL_RIVER:
					state = HoldEmState().BET_RIVER;
					break;
				case HoldEmState().BET_RIVER:
					state = HoldEmState().WINNER;
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
			state = HoldEmState().WINNER;
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
	
	let self =
	{
		getLogEntries: () => actionLog.getEntries(),
		getPlayersCount: () => players.length,
		getPlayer: (i) => players[i],
		getDealerPlayer: () => self.getPlayer(dealerIndex),
		isBettingOver: () => pots.isBettingOver(),
		getTotalPotSize: () => pots.getTotalSize(),
		potsToString: () => pots.toString(),
		getMainPot: () => pots.getMainPot(),
		getChipsThisRound: (player) => pots.getChipsThisRound(player), // TODO: remove and use GameState
		awardPot: () => pots.awardPot(self.getBoard()),
		generateNextAction: () =>
		{
			let playerAction;
			switch (state)
			{
				case HoldEmState().BLINDS:
				case HoldEmState().BET_PREFLOP:
				case HoldEmState().BET_FLOP:
				case HoldEmState().BET_TURN:
				case HoldEmState().BET_RIVER:
					playerAction = PlayerAction(getActionPlayer(), getCall(), getMinRaise(), getMaxRaise());
					break;
				default:
			}
			
			return GameState(state, self.getTotalPotSize(), getPlayersSimple(), playerAction);
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
			pots = Pots(mainPlayers, pendingPlayers, bigBlind);
			
			pendingPlayers = [];
			
			players.forEach((player) =>
			{
				player.fold();
			});
			
			state = HoldEmState().BLINDS;
			dealCards();
			
			pots.startRound(state);
			
			actionLog.addSystemEntry("Started hand");
			
			return self.generateNextAction();
		},
		bet: (addition) =>
		{
			let nextAction = self.generateNextAction();
			let playerAction = nextAction.playerAction;
			if (addition < playerAction.call && playerAction.player.getChips() > 0)
			{
				throw 'Bet ' + addition + ' is less than the call ' + playerAction.call;
			}
			
			if (addition > playerAction.call && addition < playerAction.minRaise)
			{
				throw 'Bet ' + addition + ' is less than the min raise ' + playerAction.minRaise;
			}
			
			if (addition !== playerAction.call && addition > playerAction.maxRaise)
			{
				throw 'Bet ' + addition + ' is greater than the max raise ' + playerAction.maxRaise;
			}
			
			actionLog.addEntry(pots.addToPot(addition));
			if (pots.isEven() && !pots.isHandOver())
			{
				moveState();
			}
			
			return self.generateNextAction();
		},
		check: () => self.bet(0),
		fold: () =>
		{
			actionLog.addEntries(pots.fold());
			if (pots.isEven() && !pots.isHandOver())
			{
				moveState();
			}
			else if (pots.isHandOver())
			{
				state = HoldEmState().WINNER;
				let boardCards = self.getBoard();
				let wonMainPot = pots.awardPot(boardCards);
				let winners = wonMainPot.getWinners(boardCards);
				let action;
				if (winners.length == 1)
				{
					action = "won pot of " + wonMainPot.getSize();
				}
				else
				{
					action = "split pot of " + wonMainPot.getSize();
				}
				let entry = ActionLogEntry(action, winners);
				
				actionLog.addEntry(entry);
			}
			
			return self.generateNextAction();
		},
		getBoard: () =>
		{
			switch (state)
			{
				case HoldEmState().BLINDS:
				case HoldEmState().DEAL_HOLES:
				case HoldEmState().BET_PREFLOP:
					return null;
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
			if (player.hasHoleCards())
			{
				throw "Can't remove player with hole cards";
			}
			
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
		},
		addPlayer: (player, i) =>
		{
			if (state !== HoldEmState().WINNER)
			{
				throw "Can't add player in state " + state;
			}
			
			if (players.indexOf(player) !== -1)
			{
				throw 'Tried to add player that already exists';
			}
			
			players.splice(i, 0, player);
			pendingPlayers.push(player);
			
			if (i <= dealerIndex)
			{
				dealerIndex++;
			}
		}
	}
	
	return self;
}

module.exports = HoldEm;