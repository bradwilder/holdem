let Hand = require('./hand');

let StraightFlush = (highValue) =>
{
	const STRAIGHT_FLUSH = 8;
	
	let rank = Hand(STRAIGHT_FLUSH);
	
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
		compareSameRank: (straightFlush) =>
		{
			return highValue - straightFlush.getHighValue();
		},
		getHighValue: () => highValue,
		toString: () => 'Straight flush (' + highValue + ' high)'
	}
	
	return self;
}

module.exports = StraightFlush;
