let Hand = require('./hand');

const THREE_KIND = 3;

class ThreeOfAKind extends Hand
{
	constructor(cards)
	{
		super(cards, THREE_KIND);
		
		this.threeKindValue = cards[0];
		this.kickers = cards.slice(3);
	}
	
	compareSameRank(threeOfAKind)
	{
		if (this.threeKindValue.getValue() !== threeOfAKind.getThreeKindValue())
		{
			return this.threeKindValue.getValue() - threeOfAKind.getThreeKindValue();
		}
		
		for (let i = 0; i < 2; i++)
		{
			if (this.kickers[i].getValue() !== threeOfAKind.getKicker(i))
			{
				return this.kickers[i].getValue() - threeOfAKind.getKicker(i);
			}
		}
		
		return 0;
	}
	
	getThreeKindValue()
	{
		return this.threeKindValue.getValue();
	}
	
	getKicker(i)
	{
		return this.kickers[i].getValue();
	}
	
	toString()
	{
		let kickerStr = this.kickers[0].getValueObject().toString() + ', ' + this.kickers[1].getValueObject().toString();
		return 'Three of a kind (' + this.threeKindValue.getValueObject().toString() + "'s, [" + kickerStr + '] kickers)';
	}
}

module.exports = ThreeOfAKind;
