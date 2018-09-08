let Pot = require('../../game/pot');
let Player = require('../../game/player');

let verifyEmpty = (pot, playersCount) =>
{
	expect(pot.getSize()).toBe(0);
	expect(pot.isBettingCapped()).toBe(false);
	expect(pot.isEven()).toBe(true);
	expect(pot.getCurrentBet()).toBe(0);
	expect(pot.getNumPlayers()).toBe(playersCount);
}

let verify = (pot, size, isBettingCapped, currentBet) =>
{
	expect(pot.getSize()).toBe(size);
	expect(pot.isBettingCapped()).toBe(isBettingCapped);
	expect(pot.getCurrentBet()).toBe(currentBet);
}

describe('constructor', () =>
{
	it('should create an empty pot', () =>
	{
		let player1 = Player("0", 2000);
		let player2 = Player("1", 2000);
		let player3 = Player("2", 100);
		let player4 = Player("3", 2000);
		let player5 = Player("4", 150);
		let player6 = Player("5", 50);
		
		let players = [];
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		players.push(player6);
		
		let pot = Pot(players);
		verifyEmpty(pot, players.length);
	});
});

describe('add', () =>
{
	it('should add to the pot', () =>
	{
		let player1 = Player("0", 2000);
		let player2 = Player("1", 2000);
		let player3 = Player("2", 100);
		let player4 = Player("3", 2000);
		let player5 = Player("4", 150);
		let player6 = Player("5", 50);
		
		let players = [];
		players.push(player1);
		players.push(player2);
		players.push(player3);
		players.push(player4);
		players.push(player5);
		players.push(player6);
		
		let pot = Pot(players);
		let newPot;
		
		// Simple add
		// 1 bets 200
		player1.bet(200);
		newPot = pot.add(player1, 200);
		verify(pot, 200, false, 200);
		expect(pot.getRoundCount(player1)).toBe(200);
		expect(newPot).toBeUndefined();
		
		// Simple raise
		// 2 bets 400
		player2.bet(400);
		newPot = pot.add(player2, 400);
		verify(pot, 600, false, 400);
		expect(pot.getRoundCount(player2)).toBe(400);
		expect(newPot).toBeUndefined();
		
		// Simple split
		// 3 bets 100 (all in)
		player3.bet(100);
		newPot = pot.add(player3, 100);
		verify(pot, 300, true, 100);
		expect(pot.getRoundCount(player1)).toBe(100);
		expect(pot.getRoundCount(player2)).toBe(100);
		expect(pot.getRoundCount(player3)).toBe(100);
		verify(newPot, 400, false, 300);
		expect(newPot.getRoundCount(player1)).toBe(100);
		expect(newPot.getRoundCount(player2)).toBe(300);
	});
});
