let Rank = require('./rank');

let StraightFlush = (cards) =>
{
	const STRAIGHT_FLUSH = 8;
	
	let rank = Rank(STRAIGHT_FLUSH);
	
	let highValue = cards[0];
	
	let self =
	{
		cards: cards,
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
			return highValue.getValue() - straightFlush.getHighValue();
		},
		getHighValue: () => highValue.getValue(),
		toString: () => 'Straight flush (' + highValue.toValueString() + ' high)'
	}
	
	return self;
}

module.exports = StraightFlush;
