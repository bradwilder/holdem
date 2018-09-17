let Card = (code) =>
{
	const NUM_SUITS = 4;
	const NUM_VALUES = 13;
	const SPADES_INDEX = 0;
	const HEARTS_INDEX = 1;
	const CLUBS_INDEX = 2;
	const DIAMONDS_INDEX = 3;
	
	let suit;
	let value;
	if (code < NUM_SUITS * NUM_VALUES)
	{
		suit = Math.floor(code / NUM_VALUES);
		value = code % NUM_VALUES;
	}
	else
	{
		suit = -1;
		value = -1;
	}
	
	return {
		suit: suit,
		value: value,
		code: code,
		toString: () =>
		{
			let valueStr;
			switch (value)
			{
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					valueStr = value + 2;
					break;
				case 9:
					valueStr = 'Jack';
					break;
				case 10:
					valueStr = 'Queen';
					break;
				case 11:
					valueStr = 'King';
					break;
				case 12:
					valueStr = 'Ace';
					break;
			}
			
			let suitStr;
			switch (suit)
			{
				case CLUBS_INDEX:
					suitStr = 'Clubs';
					break;
				case DIAMONDS_INDEX:
					suitStr = 'Diamonds';
					break;
				case HEARTS_INDEX:
					suitStr = 'Hearts';
					break;
				case SPADES_INDEX:
					suitStr = 'Spades';
					break;
			}
			
			return valueStr + '/' + suitStr;
		}
	}
}

module.exports = Card;
