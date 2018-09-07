let Hand = require('./hand');

let FourOfAKind = (fourKindValue, kicker) =>
{
	const FOUR_KIND = 7;
	
	let rank = Hand(FOUR_KIND);
	
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
		compareSameRank: (fourOfAKind) =>
		{
			if (fourKindValue !== fourOfAKind.getFourKindValue())
			{
				return fourKindValue - fourOfAKind.getourKindValue();
			}
			
			return kicker - fourOfAKind.getKicker();
		},
		getFourKindValue: () => fourKindValue,
		getKicker: () => kicker,
		toString: function()
		{
			
		}
	}
	
	return self;
}

module.exports = FourOfAKind;
