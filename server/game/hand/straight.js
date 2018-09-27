let Hand = require('./hand');

const STRAIGHT = 4;

class Straight extends Hand
{
	constructor(cards)
	{
		super(STRAIGHT);
		
		this.cards = cards;
		this.highValue = cards[0];
	}
	
	compareSameRank(straight)
	{
		return this.highValue.getValue() - straight.getHighValue();
	}
	
	getHighValue()
	{
		return this.highValue.getValue();
	}
	
	toString()
	{
		return 'Straight (' + this.highValue.getValueObject().toString() + ' high)';
	}
}

module.exports = Straight;
