let Pots = require('../../game/pots');
let Player = require('../../game/player');
let Card = require('../../game/card');
let HoldEmState = require('../../game/holdEmState');

describe('betting', () =>
{
	it('should refund afer a fold', () =>
	{
		let player1 = Player("0", 100);
		let player2 = Player("1", 175);
		let player3 = Player("2", 50);
		let player4 = Player("3", 150);
		let player5 = Player("4", 80);
		let player6 = Player("5", 200);
		
		let cards = [Card(10), Card(11)];
		
		player1.deal(cards);
		player2.deal(cards);
		player3.deal(cards);
		player4.deal(cards);
		player5.deal(cards);
		player6.deal(cards);
		
		let players = [];
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		players.push(player6);
		
		let pots = Pots(players, 10);
		pots.startRound(HoldEmState().BET_TURN);
		
		let totalPotSize = 0;
		let thisBet = 0;
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player1)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player2)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 50;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player3)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 150;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player4)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(150);
		
		thisBet = 80;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player5)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(150);
		
		thisBet = 175;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player6)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(175);
		
		expect(player6.getChips()).toBe(25);
		pots.fold();
		expect(player6.getChips()).toBe(50);
		expect(player2.hasHoleCards()).toBe(false);
		totalPotSize -= 25;
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player6)).toBe(150);
		expect(pots.getCurrentBet()).toBe(150);
		expect(pots.isEven()).toBe(true);
	});
	
	it("shouldn't let you bet when betting's over", () =>
	{
		let player1 = Player("0", 100);
		let player2 = Player("1", 100);
		let player3 = Player("2", 100);
		let player4 = Player("3", 100);
		let player5 = Player("4", 10000);
		let player6 = Player("5", 100);
		
		let cards = [Card(10), Card(11)];
		
		player1.deal(cards);
		player2.deal(cards);
		player3.deal(cards);
		player4.deal(cards);
		player5.deal(cards);
		player6.deal(cards);
		
		let players = [];
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		players.push(player6);
		
		let pots = Pots(players, 10);
		pots.startRound(HoldEmState().BET_TURN);
		
		let totalPotSize = 0;
		let thisBet = 0;
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player1)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player2)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player3)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player4)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player5)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player6)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		expect(pots.isEven()).toBe(true);
		expect(pots.isBettingOver()).toBe(true);
		pots.startRound(HoldEmState().BET_RIVER);
		
		try
		{
			pots.addToPot(100);
			expect(true).toBe(false);
		}
		catch (x)
		{
			expect(pots.getTotalSize()).toBe(totalPotSize);
			expect(pots.isEven()).toBe(true);
			expect(pots.getCurrentBet()).toBe(0);
		}
	});
	
	it('should handle all in bets that are lower than the current bet but larger than an already all in bet', () =>
	{
		let player1 = Player("0", 120);
		let player2 = Player("1", 10000);
		let player3 = Player("2", 100);
		let player4 = Player("3", 150);
		let player5 = Player("4", 50);
		let player6 = Player("5", 10000);
		
		let cards = [Card(10), Card(11)];
		
		player1.deal(cards);
		player2.deal(cards);
		player3.deal(cards);
		player4.deal(cards);
		player5.deal(cards);
		player6.deal(cards);
		
		let players = [];
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		players.push(player6);
		
		let pots = Pots(players, 10);
		pots.startRound(HoldEmState().BET_TURN);
		
		let totalPotSize = 0;
		let thisBet = 0;
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player1)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player2)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 100;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player3)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(100);
		
		thisBet = 150;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player4)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(150);
		
		thisBet = 50;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player5)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(150);
		
		thisBet = 150;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player6)).toBe(thisBet);
		expect(pots.getCurrentBet()).toBe(150);
		
		thisBet = 20;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player1)).toBe(120);
		expect(pots.getCurrentBet()).toBe(150);
		
		thisBet = 50;
		totalPotSize += thisBet;
		pots.addToPot(thisBet);
		expect(pots.getTotalSize()).toBe(totalPotSize);
		expect(pots.getChipsThisRound(player2)).toBe(150);
		expect(pots.getCurrentBet()).toBe(150);
		
		expect(pots.isEven()).toBe(true);
		expect(pots.isBettingOver()).toBe(false);
		pots.startRound(HoldEmState().BET_RIVER);
	});
});