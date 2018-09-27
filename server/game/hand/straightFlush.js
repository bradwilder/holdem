let Hand = require('./hand');

const STRAIGHT_FLUSH = 8;

class StraightFlush extends Hand
{
	constructor(cards)
	{
		super(STRAIGHT_FLUSH);
		
		this.cards = cards;
		this.highValue = cards[0];
	}
	
	compareSameRank(straightFlush)
	{
		return this.highValue.getValue() - straightFlush.getHighValue();
	}
	
	getHighValue()
	{
		return this.highValue.getValue();
	}
	
	toString()
	{
		return 'Straight flush (' + this.highValue.toValueString() + ' high)';
	}
}

module.exports = StraightFlush;
