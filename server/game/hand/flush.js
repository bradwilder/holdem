let Hand = require('./hand');

const FLUSH = 5;

class Flush extends Hand
{
	constructor(cards)
	{
		super(FLUSH);
		
		this.cards = cards;
	}
	
	compareSameRank(flush)
	{
		for (let i = 0; i < 5; i++)
		{
			if (this.cards[i].getValue() !== flush.getValue(i))
			{
				return this.cards[i].getValue() - flush.getValue(i);
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
			valuesStr += (this.cards[i].getValue().toString() + ', ');
		}
		valuesStr += this.cards[4].getValue().toString();
		
		return 'Flush (' + valuesStr + ')';
	}
}

module.exports = Flush;
