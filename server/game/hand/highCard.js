let Hand = require('./hand');

const HIGH_CARD = 0;

class HighCard extends Hand
{
	constructor(cards)
	{
		super(cards, HIGH_CARD);
	}
	
	compareSameRank(highCard)
	{
		for (let i = 0; i < 5; i++)
		{
			if (this.cards[i].getValue() !== highCard.getValue(i))
			{
				return this.cards[i].getValue() - highCard.getValue(i);
			}
		}
		
		return 0;
	}
	
	getValue(i)
	{
		return this.cards[i].getValue();
	}
	
	toString()
	{
		let valuesStr = '';
		for (let i = 0; i < 4; i++)
		{
			valuesStr += (this.cards[i].getValueObject().toString() + ', ');
		}
		valuesStr += this.cards[4].getValueObject().toString();
		
		return 'High card (' + valuesStr + ')';
	}
}

module.exports = HighCard;
