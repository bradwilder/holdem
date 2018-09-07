let Hand = require('./hand');

let ThreeOfAKind = (threeKindValue, kickers) =>
{
	const THREE_KIND = 3;
	
	let rank = Hand(THREE_KIND);
	
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
		compareSameRank: (threeOfAKind) =>
		{
			if (threeKindValue !== threeOfAKind.getThreeKindValue())
			{
				return threeKindValue - threeOfAKind.getThreeKindValue();
			}
			
			for (let i = 0; i < 2; i++)
			{
				if (kickers[i] !== threeOfAKind.getKicker(i))
				{
					return kickers[i] - threeOfAKind.getKicker(i);
				}
			}
			
			return 0;
		},
		getThreeKindValue: () =>
		{
			
		},
		getKicker: (i) => kickers[i],
		toString: () =>
		{
			
		}
	}
	
	return self;
}

module.exports = ThreeOfAKind;
