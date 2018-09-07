let Hand = require('./hand');

let FullHouse = (threeKindValue, pairValue) =>
{
	const FULL_HOUSE = 6;
	
	let rank = Hand(FULL_HOUSE);
	
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
		toString: () =>
		{
			
		}
	}
	
	return self;
}

module.exports = FullHouse;
