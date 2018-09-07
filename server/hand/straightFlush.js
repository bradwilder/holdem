let Hand = require('./hand');

let StraightFlush = (highValue) =>
{
	const STRAIGHT_FLUSH = 8;
	
	let rank = Hand(STRAIGHT_FLUSH);
	
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
		compareSameRank: (straightFlush) =>
		{
			return highValue - straightFlush.getHighValue();
		},
		getHighValue: () => highValue,
		toString: function()
		{
			
		}
	}
	
	return self;
}

module.exports = StraightFlush;
