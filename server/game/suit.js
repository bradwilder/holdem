let Suit = (suit) =>
{
	const SPADES_INDEX = 0;
	const HEARTS_INDEX = 1;
	const CLUBS_INDEX = 2;
	const DIAMONDS_INDEX = 3;
	
	return {
		suit: suit,
		toString: () =>
		{
			switch (suit)
			{
				case CLUBS_INDEX:
					return 'Clubs';
				case DIAMONDS_INDEX:
					return 'Diamonds';
				case HEARTS_INDEX:
					return 'Hearts';
				case SPADES_INDEX:
					return 'Spades';
			}
		}
	}
}

module.exports = Suit;
