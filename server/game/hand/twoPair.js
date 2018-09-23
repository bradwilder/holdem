let Hand = require('./hand');

let TwoPair = (cards) =>
{
	const TWO_PAIR = 2;
	
	let rank = Hand(TWO_PAIR);
	
	let pairValues = [];
	pairValues[0] = cards[0].getValue();
	pairValues[1] = cards[2].getValue();
	let kicker = cards[4].getValue();
	
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
				if (pairValues[i] !== twoPair.getPairValue(i))
				{
					return pairValues[i] - twoPair.getPairValue(i);
				}
			}
			
			return kicker - twoPair.getKicker();
		},
		getPairValue: (i) => pairValues[i],
		getKicker: () => kicker,
		toString: () => 'Two pair (' + pairValues[0] + "'s and " + pairValues[1] + "'s, " + kicker + ' kicker)'
	}
	
	return self;
}

module.exports = TwoPair;
