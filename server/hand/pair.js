let Hand = require('./hand');

let Pair = (pairValue, kickers) =>
{
	const PAIR = 1;
	
	let rank = Hand(PAIR);
	
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
		compareSameRank: (pair) =>
		{
			if (pairValue !== pair.getPairValue())
			{
				return pairValue - pair.getPairValue();
			}
			
			for (let i = 0; i < 3; i++)
			{
				if (kickers[i] !== pair.getKicker(i))
				{
					return kickers[i] - pair.getKicker(i);
				}
			}
			
			return 0;
		},
		getPairValue: () => pairValue,
		getKicker: (i) => kickers[i],
		toString: function()
		{
			
		}
	}
	
	return self;
}

module.exports = Pair;
