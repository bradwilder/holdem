let Suit = require('./suit');
let Value = require('./value');

let Card = (code) =>
{
	const NUM_SUITS = 4;
	const NUM_VALUES = 13;
	
	let suit;
	let value;
	if (code < NUM_SUITS * NUM_VALUES)
	{
		suit = Suit(Math.floor(code / NUM_VALUES));
		value = Value(code % NUM_VALUES);
	}
	else
	{
		throw 'Code ' + code + ' is invalid'
	}
	
	return {
		getCode: () => code,
		getSuit: () => suit ? suit.suit : null,
		getValue: () => value ? value.value : null,
		getSuitObject: () => suit,
		getValueObject: () => value,
		toString: () =>
		{
			let valueStr = value ? value.toString() : '';
			let suitStr = suit ? suit.toString() : '';
			return valueStr + ' of ' + suitStr;
		},
		toJSON: () => ({code: code}),
		clone: () => Card(code)
	}
}

module.exports = Card;
