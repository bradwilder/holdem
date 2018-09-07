let Hand = require('./hand');

let Flush = (values) =>
{
	const FLUSH = 5;
	
	let rank = Hand(FLUSH);
	
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
			
		}
	}
	
	return self;
}

module.exports = Flush;
