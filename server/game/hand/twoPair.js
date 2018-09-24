let Rank = require('./rank');

let TwoPair = (cards) =>
{
	const TWO_PAIR = 2;
	
	let rank = Rank(TWO_PAIR);
	
	let pairValues = [];
	pairValues[0] = cards[0];
	pairValues[1] = cards[2];
	let kicker = cards[4];
	
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
		compareSameRank: (twoPair) =>
		{
			for (let i = 0; i < 2; i++)
			{
				if (pairValues[i].getValue() !== twoPair.getPairValue(i))
				{
					return pairValues[i].getValue() - twoPair.getPairValue(i);
				}
			}
			
			return kicker.getValue() - twoPair.getKicker();
		},
		getPairValue: (i) => pairValues[i].getValue(),
		getKicker: () => kicker.getValue(),
		toString: () => 'Two pair (' + pairValues[0].toValueString() + "'s and " + pairValues[1].toValueString() + "'s, " + kicker.toValueString() + ' kicker)'
	}
	
	return self;
}

module.exports = TwoPair;
