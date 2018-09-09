let Hand = require('./hand');

let Flush = (values) =>
{
	const FLUSH = 5;
	
	let rank = Hand(FLUSH);
	
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
		compareSameRank: (flush) =>
		{
			for (let i = 0; i < 5; i++)
			{
				if (values[i] !== flush.getValue(i))
				{
					return values[i] - flush.getValue(i);
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
			
			return 'Flush (' + valuesStr + ')';
		}
	}
	
	return self;
}

module.exports = Flush;
