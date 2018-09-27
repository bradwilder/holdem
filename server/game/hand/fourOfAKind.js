let Hand = require('./hand');

const FOUR_KIND = 7;

class FourOfAKind extends Hand
{
	constructor(cards)
	{
		super(FOUR_KIND);
		
		this.cards = cards;
		this.fourKindValue = cards[0];
		this.kicker = cards[4];
	}
	
	compareSameRank(fourOfAKind)
	{
		if (this.fourKindValue.getValue() !== fourOfAKind.getFourKindValue())
		{
			return this.fourKindValue.getValue() - fourOfAKind.getourKindValue();
		}
		
		return this.kicker.getValue() - fourOfAKind.getKicker();
	}
	
	getFourKindValue()
	{
		return this.fourKindValue.getValue();
	}
	
	getKicker()
	{
		return this.kicker.getValue();
	}
	
	toString()
	{
		return 'Four of a kind (' + this.fourKindValue.getValueObject().toString() + "'s, " + this.kicker.getValueObject().toString() + ' kicker)';
	} 
}

module.exports = FourOfAKind;
