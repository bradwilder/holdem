let Hand = require('./hand');

let HighCard = (values) =>
{
	const HIGH_CARD = 5;
	
	let rank = Hand(HIGH_CARD);
	
	let self =
	{
		compare: (hand) =>
		{
			let rankCompare = rank.compare(hand);
			if (rankCompare)
			{
				return rankCompare;
			}
			
			return self.compareSameRank(hand);
		},
		compareSameRank: (highCard) =>
		{
			for (let i = 0; i < 5; i++)
			{
				if (values[i] !== highCard.getValue(i))
				{
					return values[i] - highCard.getValue(i);
				}
			}
			
			return 0;
		},
		getValue: (i) => values[i],
		toString: () =>
		{
			
		}
	}
	
	return self;
}

module.exports = HighCard;
