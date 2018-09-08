let Card = require('./card');

let Deck = () =>
{
	const NUM_CARDS = 52;
	
	let cardIndex = 0;
	let cards = [];
	for (let i = 0; i < NUM_CARDS; i++)
	{
		cards[i] = i;
	}
	
	let self =
	{
		shuffle: () =>
		{
			cardIndex = 0;
			let shuffledCards = [];
			let remaining = NUM_CARDS;
			for (let i = 0; i < NUM_CARDS; i++)
			{
				let randomIndex = Math.floor(Math.random() * remaining);
				shuffledCards[i] = cards.splice(randomIndex, 1);
				remaining--;
			}
			
			cards = shuffledCards;
		},
		deal: () =>
		{
			if (cardIndex == NUM_CARDS)
			{
				return null;
			}
			
			return Card(cards[cardIndex++]);
		},
		dealCards: (number) =>
		{
			let cards = [];
			while (number > 0)
			{
				let card = self.deal();
				if (!card)
				{
					return null;
				}
				cards.push(card);
				number--;
			}
			return cards;
		}
	}
	
	return self;
}

module.exports = Deck;
