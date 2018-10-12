let Card = require('../../game/card');

describe('card', () =>
{
	it('should let you create a card', () =>
	{
		let card = Card(47);
		expect(card.getCode()).toBe(47);
	});
	
	it('should throw if you create a card with invalid code', () =>
	{
		expect(() => {Card(57);}).toThrow();
	});
	
	it('should let you get a suit and value', () =>
	{
		let card = Card(47);
		expect(card.getSuit()).toBe(3);
		expect(card.getValue()).toBe(8);
	});
	
	it('should export to JSON', () =>
	{
		let card = Card(50);
		let json = card.toJSON();
		expect(Object.keys(json).length).toBe(1);
		expect(json.code).toBe(50);
	});
	
	it('should override toString', () =>
	{
		let card = Card(49);
		expect(card.toString()).toBe('Queen of Diamonds');
	});
});