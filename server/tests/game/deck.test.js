let Deck = require('../../game/deck');

describe('deck', () =>
{
	it('should deal 52 cards', () =>
	{
		let deck = Deck();
		deck.shuffle();

		for (let i = 0; i < 52; i++)
		{
			expect(deck.deal()).not.toBe(null);
		}
		
		expect(deck.deal()).toBe(null);
	});
});