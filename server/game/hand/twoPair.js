let Hand = require('./hand');

const TWO_PAIR = 2;

class TwoPair extends Hand
{
	constructor(cards)
	{
		super(TWO_PAIR);
		
		this.cards = cards;
		this.pairValues = [];
		this.pairValues[0] = cards[0];
		this.pairValues[1] = cards[2];
		this.kicker = cards[4];
	}
	
	compareSameRank(twoPair)
	{
		for (let i = 0; i < 2; i++)
		{
			if (this.pairValues[i].getValue() !== twoPair.getPairValue(i))
			{
				return this.pairValues[i].getValue() - twoPair.getPairValue(i);
			}
		}
		
		return this.kicker.getValue() - twoPair.getKicker();
	}
	
	getPairValue(i)
	{
		return this.pairValues[i].getValue();
	}
	
	getKicker()
	{
		return this.kicker.getValue();
	}
	
	toString()
	{
		return 'Two pair (' + this.pairValues[0].getValueObject().toString() + "'s and " + this.pairValues[1].getValueObject().toString() + "'s, " + this.kicker.getValueObject().toString() + ' kicker)';
	}
}

module.exports = TwoPair;
