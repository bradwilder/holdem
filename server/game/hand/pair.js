let Hand = require('./hand');

const PAIR = 1;

class Pair extends Hand
{
	constructor(cards)
	{
		super(cards, PAIR);
		
		this.pairValue = cards[0];
		this.kickers = cards.slice(2);
	}
	
	compareSameRank(pair)
	{
		if (this.pairValue.getValue() !== pair.getPairValue())
		{
			return this.pairValue.getValue() - pair.getPairValue();
		}
		
		for (let i = 0; i < 3; i++)
		{
			if (this.kickers[i].getValue() !== pair.getKicker(i))
			{
				return this.kickers[i].getValue() - pair.getKicker(i);
			}
		}
		
		return 0;
	}
	
	getPairValue()
	{
		return this.pairValue.getValue();
	}
	
	getKicker(i)
	{
		return this.kickers[i].getValue();
	}
	
	toString()
	{
		let kickerStr = '';
		for (let i = 0; i < 2; i++)
		{
			kickerStr += (this.kickers[i].getValueObject().toString() + ', ');
		}
		kickerStr += this.kickers[2].getValueObject().toString();
		
		return 'Pair (' + this.pairValue.getValueObject().toString() + "'s, [" + kickerStr + '] kickers)';
	}
}

module.exports = Pair;
