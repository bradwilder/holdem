let Board = require('./board');
let ActionLog = require('./actionLog');
let ActionLogEntry = require('./actionLogEntry');
let PlayerSimple = require('./playerSimple');
let HoldEmState = require('./holdEmState');
let GameState = require('./gameState');
let PlayerAction = require('./playerAction');

let HoldEm = (players, bigBlind, deck) =>
{
	let players = players.slice();
	
	let state;
	let dealer = players.length - 1;
	let pots;
	let board;
	let actionLog = ActionLog();
	
	let emitEvent = (event) =>
	{
		// TODO
	}
	
	let changeDealer = () =>
	{
		return (dealer = getNextPlayerAtTable(dealer)) >= 0;
	}
	
	let getNextPlayerAtTable = (i) =>
	{
		let playersCount = self.getPlayersCount();
		if (i >= playersCount)
		{
			throw new Exception('Invalid index' + i)
		}
		
		i = (i + 1) % playersCount;
		return self.getPlayer(i);
	}
	
	let getPlayersForMainPot = () =>
	{
		let mainPlayers = [];
		for (let i = getNextPlayerAtTable(dealer); i != dealer; i = getNextPlayerAtTable(i))
		{
			mainPlayers.push(self.getPlayer(i));
		}
		mainPlayers.push(self.getPlayer(dealer));
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
			let cards = [];
			for (let i = 0; i < 2; i++)
			{
				cards.push(deck.dealCard());
			}
			mainPlayer.deal(cards);
		});
		
		let cards = [];
		for (let i = 0; i < 5; i++)
		{
			cards.push(deck.dealCard());
		}
		board = Board(cards);
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
		getDealerPlayer: () => self.getPlayer(dealer),
		isBettingOver: () => pots.isBettingOver(),
		getTotalPotSize: () => pots.getTotalSize(),
		potsToString: () => pots.toString(),
		getMainPot: () => pots.getMainPot(),
		getChipsThisRound: (player) => pots.getChipsThisRound(player), // TODO: remove and use GameState
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
			
			return GameState(state, playerAction, self.getTotalPotSize(), getPlayersSimple());
		},
		startHand: () =>
		{
			deck.shuffle();
			
			let mainPlayers = getPlayersForMainPot();
			if (mainPlayers.length < 2)
			{
				return null;
			}
			pots = Pots(players, bigBlind, state);
			
			players.forEach((player) =>
			{
				player.fold();
			});
			
			state = HoldEmState().BLINDS;
			dealCards();
			
			pots.startRound(state);
			
			if (!changeDealer())
			{
				return null;
			}
			actionLog.addSystemEntry("Started hand");
			
			return self.generateNextAction();
		},
		bet: (addition) =>
		{
			actionLog.addEntry(pots.addToPot(addition));
			if (pots.isEven() && !pots.isHandOver())
			{
				moveState();
			}
			
			return self.generateNextAction();
		},
		check: () => bet(0),
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
			
			return generateNextAction();
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
		}
	}
	
	return self;
}

module.exports = HoldEm;
