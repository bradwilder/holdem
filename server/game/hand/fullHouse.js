let Hand = require('./hand');

let FullHouse = (values) =>
{
	const FULL_HOUSE = 6;
	
	let rank = Hand(FULL_HOUSE);
	
	let threeKindValue = values[0];
	let pairValue = values[1];
	
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
