let Hand = require('./hand');

const FULL_HOUSE = 6;

class FullHouse extends Hand
{
	constructor(cards)
	{
		super(FULL_HOUSE);
		
		this.cards = cards;
		this.threeKindValue = cards[0];
		this.pairValue = cards[3];
	}
	
	compareSameRank(fullHouse)
	{
		if (this.threeKindValue.getValue() !== fullHouse.getThreeKindValue())
		{
			return this.threeKindValue.getValue() - fullHouse.getThreeKindValue();
		}
		
		return this.pairValue.getValue() - fullHouse.getPairValue();
	}
	
	getThreeKindValue()
	{
		return this.threeKindValue.getValue();
	}
	
	getPairValue()
	{
		return this.pairValue.getValue();
	}
	
	toString()
	{
		return "Full house (" + this.threeKindValue.toValueString() + "'s full of " + this.pairValue.toValueString() + "'s)";
	}
}

module.exports = FullHouse;
