let Rank = require('./rank');

let FullHouse = (cards) =>
{
	const FULL_HOUSE = 6;
	
	let rank = Rank(FULL_HOUSE);
	
	let threeKindValue = cards[0];
	let pairValue = cards[3];
	
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
		compareSameRank: (fullHouse) =>
		{
			if (threeKindValue.getValue() !== fullHouse.getThreeKindValue())
			{
				return threeKindValue.getValue() - fullHouse.getThreeKindValue();
			}
			
			return pairValue.getValue() - fullHouse.getPairValue();
		},
		getThreeKindValue: () => threeKindValue.getValue(),
		getPairValue: () => pairValue.getValue(),
		toString: () => "Full house (" + threeKindValue.toValueString() + "'s full of " + pairValue.toValueString() + "'s)"
	}
	
	return self;
}

module.exports = FullHouse;
