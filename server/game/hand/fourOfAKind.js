let Hand = require('./hand');

let FourOfAKind = (values) =>
{
	const FOUR_KIND = 7;
	
	let rank = Hand(FOUR_KIND);
	
	let fourKindValue = values[0];
	let kicker = values[1];
	
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
		toString: () => 'Four of a kind (' + fourKindValue + "'s, " + kicker + ' kicker)'
	}
	
	return self;
}

module.exports = FourOfAKind;
