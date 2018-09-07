let Card = (code) =>
{
	const NUM_SUITS = 4;
	const NUM_VALUES = 13;
	
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
		value: value
	}
}

module.exports = Card;
