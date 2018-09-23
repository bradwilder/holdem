let Hand = require('./hand');

let Straight = (cards) =>
{
	const STRAIGHT = 4;
	
	let rank = Hand(STRAIGHT);
	
	let highValue = cards[0].getValue();
	
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
		compareSameRank: (straight) =>
		{
			return highValue - straight.getHighValue();
		},
		getHighValue: () => highValue,
		toString: () => 'Straight (' + highValue + ' high)'
	}
	
	return self;
}

module.exports = Straight;
