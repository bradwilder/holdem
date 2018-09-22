let Hand = require('./hand');

let FullHouse = (cards) =>
{
	const FULL_HOUSE = 6;
	
	let rank = Hand(FULL_HOUSE);
	
	let threeKindValue = cards[0].value;
	let pairValue = cards[3].value;
	
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
			if (threeKindValue !== fullHouse.getThreeKindValue())
			{
				return threeKindValue - fullHouse.getThreeKindValue();
			}
			
			return pairValue - fullHouse.getPairValue();
		},
		getThreeKindValue: () => threeKindValue,
		getPairValue: () => pairValue,
		toString: () => "Full house (" + threeKindValue + "'s full of " + pairValue + "'s)"
	}
	
	return self;
}

module.exports = FullHouse;
