let Hand = require('./hand');

let HighCard = (values) =>
{
	const HIGH_CARD = 0;
	
	let rank = Hand(HIGH_CARD);
	
	let self =
	{
		getRank: () => rank,
		compare: (hand) =>
		{
			let rankCompare = rank.compare(hand.getRank());
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
			let valuesStr = '';
			for (let i = 0; i < 4; i++)
			{
				valuesStr += (values[i] + ', ');
			}
			valuesStr += values[4];
			
			return 'High card (' + valuesStr + ')';
		}
	}
	
	return self;
}

module.exports = HighCard;
