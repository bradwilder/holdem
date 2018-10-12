let Player = require('../../game/player');
let Card = require('../../game/card');

describe('player', () =>
{
	it('should default to 0 chips', () =>
	{
		let player = Player('hey');
		expect(player.getChips()).toBe(0);
	});
	
	it('should start with no cards', () =>
	{
		let player = Player('hey');
		expect(player.hasHoleCards()).toBe(false);
		expect(player.getHoleCards().length).toBe(0);
	});
	
	it('should let you create a name and chips', () =>
	{
		let player = Player('hey', 50);
		expect(player.getName()).toBe('hey');
		expect(player.getChips()).toBe(50);
	});
	
	it('should let you award chips', () =>
	{
		let player = Player('hey', 50);
		expect(player.getChips()).toBe(50);
		player.awardChips(75);
		expect(player.getChips()).toBe(125);
	});
	
	it('should let you bet chips', () =>
	{
		let player = Player('hey', 50);
		expect(player.getChips()).toBe(50);
		player.bet(25);
		expect(player.getChips()).toBe(25);
	});
	
	it('should let you bet all your chips', () =>
	{
		let player = Player('hey', 50);
		expect(player.getChips()).toBe(50);
		player.bet(50);
		expect(player.getChips()).toBe(0);
	});
	
	it('should throw if you bet more than your chips', () =>
	{
		let player = Player('hey', 50);
		expect(player.getChips()).toBe(50);
		expect(() => {player.bet(75)}).toThrow();
	});
	
	it('should let you deal cards', () =>
	{
		let player = Player('hey', 50);
		player.deal([Card(30), Card(20)]);
		expect(player.hasHoleCards()).toBe(true);
		let holes = player.getHoleCards();
		expect(holes.length).toBe(2);
		expect(holes[0].getCode()).toBe(30);
		expect(holes[1].getCode()).toBe(20);
	});
	
	it('should let you fold', () =>
	{
		let player = Player('hey', 50);
		player.deal([Card(30), Card(20)]);
		expect(player.hasHoleCards()).toBe(true);
		player.fold();
		expect(player.hasHoleCards()).toBe(false);
	});
	
	it('should export to JSON', () =>
	{
		let player = Player('hey', 50);
		let json = player.toJSON();
		expect(Object.keys(json).length).toBe(3);
		expect(json.name).toBe('hey');
		expect(json.chips).toBe(50);
		expect(json.holeCards).toEqual([]);
	});
	
	it('should export to JSON with hole cards', () =>
	{
		let player = Player('hey', 50);
		player.deal([Card(30), Card(20)]);
		let json = player.toJSON();
		expect(Object.keys(json).length).toBe(3);
		expect(json.name).toBe('hey');
		expect(json.chips).toBe(50);
		expect(json.holeCards.length).toEqual(2);
		expect(json.holeCards[0].getCode()).toEqual(30);
		expect(json.holeCards[1].getCode()).toEqual(20);
	});
	
	it('should override toString', () =>
	{
		let player = Player('hey', 50);
		expect(player.toString()).toBe('hey\n50');
	});
	
	it('should let you clone a player', () =>
	{
		let player = Player('hey', 50);
		let cards = [Card(30), Card(20)];
		let holes;
		
		player.deal(cards);
		expect(player.getName()).toBe('hey');
		expect(player.getChips()).toBe(50);
		expect(player.hasHoleCards()).toBe(true);
		holes = player.getHoleCards();
		expect(holes.length).toBe(2);
		expect(holes[0].getCode()).toBe(30);
		expect(holes[1].getCode()).toBe(20);
		
		let newPlayer = player.clone();
		expect(newPlayer.getName()).toBe('hey');
		expect(newPlayer.getChips()).toBe(50);
		expect(newPlayer.hasHoleCards()).toBe(true);
		holes = newPlayer.getHoleCards();
		expect(holes.length).toBe(2);
		expect(holes[0].getCode()).toBe(30);
		expect(holes[1].getCode()).toBe(20);
		
		cards[0] = Card(40);
		holes = newPlayer.getHoleCards();
		expect(holes.length).toBe(2);
		expect(holes[0].getCode()).toBe(30);
		expect(holes[1].getCode()).toBe(20);
		
		cards = [];
		holes = newPlayer.getHoleCards();
		expect(holes.length).toBe(2);
		expect(holes[0].getCode()).toBe(30);
		expect(holes[1].getCode()).toBe(20);
	});
});