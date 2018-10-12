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
	
	it('should deal 52 unique cards', () =>
	{
		let deck = Deck();
		deck.shuffle();
		
		let dealt = Array(52).fill(false);
		for (let i = 0; i < 52; i++)
		{
			let code = deck.deal().getCode();
			expect(dealt[code]).toBe(false);
			dealt[code] = true;
		}
		
		for (let i = 0; i < 52; i++)
		{
			expect(dealt[i]).toBe(true);
		}
	});
});