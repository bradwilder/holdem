let HoldEm = require('../../game/holdEm');
let Player = require('../../game/player');
let Deck = require('../../game/deck');
let HoldEmState = require('../../game/holdEmState');

let verifyPlayerAction = (holdEm, expectedGameState, expectedPlayer, expectedMinRaise, expectedMaxRaise, expectedCall, expectedTotalPotSize) =>
{
	let nextAction = holdEm.generateNextAction();
	let playerAction = nextAction.playerAction;
	
	expect(playerAction.player.getName()).toBe(expectedPlayer.getName());
	expect(playerAction.minRaise).toBe(expectedMinRaise);
	expect(playerAction.maxRaise).toBe(expectedMaxRaise);
	expect(playerAction.call).toBe(expectedCall);
	
	expect(nextAction.state).toBe(expectedGameState);
	expect(holdEm.getTotalPotSize()).toBe(expectedTotalPotSize);
}

let verify = (holdEm, expectedGameState, expectedTotalPotSize) =>
{
	let nextAction = holdEm.generateNextAction();
	let playerAction = nextAction.playerAction;
	
	expect(playerAction).toBeUndefined();
	expect(nextAction.state).toBe(expectedGameState);
	expect(holdEm.getTotalPotSize()).toBe(expectedTotalPotSize);
}

describe('betting', () =>
{
	it('should yield a winner when last player folds', () =>
	{
		let player0 = Player("0", 2000);
		let player1 = Player("1", 2000);
		let player2 = Player("2", 2000);
		let player3 = Player("3", 2000);
		let player4 = Player("4", 2000);
		let player5 = Player("5", 2000);
		
		let players = [];
		players.push(player0);
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		
		holdEm = HoldEm(players, 20, Deck());
		
		holdEm.startHand();
		
		let gameState;
		
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player0, 0, 0, 10, 0);
		
		gameState = holdEm.generateNextAction();
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player0.getChips()).toBe(1990);
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player1, 0, 0, 20, 10);
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player1.getChips()).toBe(1980);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 40, 2000, 20, 30);
		
		gameState = holdEm.bet(50);
		expect(player2.getChips()).toBe(1950);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player3, 80, 2000, 50, 80);
		
		gameState = holdEm.fold();
		expect(player3.getChips()).toBe(2000);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player4, 80, 2000, 50, 80);
		
		gameState = holdEm.fold();
		expect(player4.getChips()).toBe(2000);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player5, 80, 2000, 50, 80);
		
		gameState = holdEm.fold();
		expect(player5.getChips()).toBe(2000);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player0, 70, 1990, 40, 80);
		
		gameState = holdEm.fold();
		expect(player0.getChips()).toBe(1990);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player1, 60, 1980, 30, 80);
		
		gameState = holdEm.fold();
		expect(player1.getChips()).toBe(1980);
		verify(holdEm, HoldEmState().WINNER, 0);
		expect(player2.getChips()).toBe(2030);
	});
	
	it('should go to showdown when all players are all in', () =>
	{
		let player0 = Player("0", 100);
		let player1 = Player("1", 100);
		let player2 = Player("2", 100);
		let player3 = Player("3", 100);
		let player4 = Player("4", 10000);
		let player5 = Player("5", 100);
		
		let players = [];
		players.push(player0);
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		
		holdEm = HoldEm(players, 20, Deck());
		
		holdEm.startHand();
		
		let gameState;
		
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player0, 0, 0, 10, 0);
		
		gameState = holdEm.generateNextAction();
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player0.getChips()).toBe(90);
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player1, 0, 0, 20, 10);
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player1.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 40, 100, 20, 30);
		
		gameState = holdEm.bet(100);
		expect(player2.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player3, 0, 0, 100, 130);
		
		gameState = holdEm.bet(100);
		expect(player3.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player4, 0, 0, 100, 230);
		
		gameState = holdEm.bet(100);
		expect(player4.getChips()).toBe(9900);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player5, 0, 0, 100, 330);
		
		gameState = holdEm.bet(100);
		expect(player5.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player0, 0, 0, 90, 430);
		
		gameState = holdEm.bet(90);
		expect(player0.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player1, 0, 0, 80, 520);
		
		gameState = holdEm.bet(80);
		expect(player1.getChips()).toBe(0);
		verify(holdEm, HoldEmState().WINNER, 600);
		
		let pot;
		while (pot = holdEm.awardPot())
		{
			let players = pot.getPlayers();
			players.forEach((player) =>
			{
				let holes = player.getHoleCards();
				//console.log('test ' + player.getName() + ': ' + holes[0] + ' ' + holes[1]);
			});
			
			let board = holdEm.getBoard();
			//console.log('test board: ' + board[0] + ' ' + board[1] + ' ' + board[2] + ' ' + board[3] + ' ' + board[4]);
			
			let winners = pot.getWinners(board);
			if (winners)
			{
				//console.log('test pot winners count: ' + winners.length);
				//console.log('test pot winners: ' + winners.map((winner) => winner.getName()));
				winners.forEach((winner) =>
				{
					//console.log('test winner ' + winner.getName() + ' chips: ' + winner.getChips());
				});
			}
			//console.log('test pot size: ' + pot.getSize());
		}
	});
	
	it('should let you check the option', () =>
	{
		let player0 = Player("0", 100);
		let player1 = Player("1", 100);
		let player2 = Player("2", 100);
		let player3 = Player("3", 100);
		let player4 = Player("4", 100);
		let player5 = Player("5", 100);
		
		let players = [];
		players.push(player0);
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		
		holdEm = HoldEm(players, 20, Deck());
		
		holdEm.startHand();
		
		let gameState;
		
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player0, 0, 0, 10, 0);
		
		gameState = holdEm.generateNextAction();
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player0.getChips()).toBe(90);
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player1, 0, 0, 20, 10);
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player1.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 40, 100, 20, 30);
		
		gameState = holdEm.bet(20);
		expect(player2.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player3, 40, 100, 20, 50);
		
		gameState = holdEm.bet(20);
		expect(player3.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player4, 40, 100, 20, 70);
		
		gameState = holdEm.bet(20);
		expect(player4.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player5, 40, 100, 20, 90);
		
		gameState = holdEm.bet(20);
		expect(player5.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player0, 30, 90, 10, 110);
		
		gameState = holdEm.bet(10);
		expect(player0.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player1, 20, 80, 0, 120);
		
		gameState = holdEm.check();
		expect(player1.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_FLOP, player0, 20, 80, 0, 120);
	});
	
	it('should refund an incontestable bet when the last potentially matching player folds', () =>
	{
		let player0 = Player("0", 100);
		let player1 = Player("1", 100);
		let player2 = Player("2", 50);
		let player3 = Player("3", 50);
		let player4 = Player("4", 50);
		let player5 = Player("5", 50);
		
		let players = [];
		players.push(player0);
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		
		holdEm = HoldEm(players, 20, Deck());
		
		holdEm.startHand();
		
		let gameState;
		
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player0, 0, 0, 10, 0);
		
		gameState = holdEm.generateNextAction();
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player0.getChips()).toBe(90);
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player1, 0, 0, 20, 10);
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player1.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 40, 50, 20, 30);
		
		gameState = holdEm.check();
		expect(player2.getChips()).toBe(50);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player3, 40, 50, 20, 30);
		
		gameState = holdEm.check();
		expect(player3.getChips()).toBe(50);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player4, 40, 50, 20, 30);
		
		gameState = holdEm.check();
		expect(player4.getChips()).toBe(50);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player5, 40, 50, 20, 30);
		
		gameState = holdEm.check();
		expect(player5.getChips()).toBe(50);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player0, 30, 90, 10, 30);
		
		gameState = holdEm.bet(90);
		expect(player0.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player1, 0, 0, 80, 120);
		
		gameState = holdEm.fold();
		expect(player1.getChips()).toBe(80);
		expect(player0.getChips()).toBe(50);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 0, 0, 50, 70, 0);
	});
	
	it('should refund an incontestable pet when the last potentially matching player folds', () =>
	{
		let player0 = Player("0", 100);
		let player1 = Player("1", 175);
		let player2 = Player("2", 50);
		let player3 = Player("3", 150);
		let player4 = Player("4", 80);
		let player5 = Player("5", 200);
		
		let players = [];
		players.push(player0);
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		
		holdEm = HoldEm(players, 20, Deck());
		
		holdEm.startHand();
		
		let gameState;
		
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player0, 0, 0, 10, 0);
		
		gameState = holdEm.generateNextAction();
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player0.getChips()).toBe(90);
		verifyPlayerAction(holdEm, HoldEmState().BLINDS, player1, 0, 0, 20, 10);
		
		gameState = holdEm.bet(gameState.playerAction.call);
		expect(player1.getChips()).toBe(155);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 40, 50, 20, 30);
		
		gameState = holdEm.check();
		expect(player2.getChips()).toBe(50);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player3, 40, 150, 20, 30);
		
		gameState = holdEm.check();
		expect(player3.getChips()).toBe(150);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player4, 40, 80, 20, 30);
		
		gameState = holdEm.check();
		expect(player4.getChips()).toBe(80);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player5, 40, 175, 20, 30);
		
		gameState = holdEm.check();
		expect(player5.getChips()).toBe(200);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player0, 30, 90, 10, 30);
		
		gameState = holdEm.bet(90);
		expect(player0.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player1, 155, 155, 80, 120);
		
		gameState = holdEm.bet(80);
		expect(player1.getChips()).toBe(75);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player2, 0, 0, 50, 200);
		
		gameState = holdEm.bet(50);
		expect(player2.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player3, 150, 150, 100, 250);
		
		gameState = holdEm.bet(150);
		expect(player3.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player4, 0, 0, 80, 400);
		
		gameState = holdEm.bet(80);
		expect(player4.getChips()).toBe(0);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player5, 175, 175, 150, 480);
		
		gameState = holdEm.bet(175);
		expect(player5.getChips()).toBe(25);
		verifyPlayerAction(holdEm, HoldEmState().BET_PREFLOP, player1, 0, 0, 75, 655);
		
		gameState = holdEm.fold();
		expect(player1.getChips()).toBe(75);
		expect(player5.getChips()).toBe(50);
		verify(holdEm, HoldEmState().WINNER, 630);
	});
});