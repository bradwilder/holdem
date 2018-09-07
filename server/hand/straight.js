let Hand = require('./hand');

let Straight = (highValue) =>
{
	const STRAIGHT = 4;
	
	let rank = Hand(STRAIGHT);
	
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
		compareSameRank: (straight) =>
		{
			return highValue - straight.getHighValue();
		},
		getHighValue: () => highValue,
		toString: () =>
		{
			
		}
	}
	
	return self;
}

module.exports = Straight;
