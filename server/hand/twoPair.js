let Hand = require('./hand');

let TwoPair = (pairValues, kicker) =>
{
	const TWO_PAIR = 2;
	
	let rank = Hand(TWO_PAIR);
	
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
		compareSameRank: function(twoPair)
		{
			for (let i = 0; i < 2; i++)
			{
				if (pairValues[i] !== twoPair.getPairValue(i))
				{
					return pairValues[i] - twoPair.getPairValue(i);
				}
			}
			
			return kicker - twoPair.getKicker();
		},
		getPair: (i) => pairValues[i],
		getKicker: () => kicker,
		toString: function()
		{
			
		}
	}
	
	return self;
}

module.exports = TwoPair;
