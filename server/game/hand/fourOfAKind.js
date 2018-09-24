let Rank = require('./rank');

let FourOfAKind = (cards) =>
{
	const FOUR_KIND = 7;
	
	let rank = Rank(FOUR_KIND);
	
	let fourKindValue = cards[0];
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
		compareSameRank: (fourOfAKind) =>
		{
			if (fourKindValue.getValue() !== fourOfAKind.getFourKindValue())
			{
				return fourKindValue.getValue() - fourOfAKind.getourKindValue();
			}
			
			return kicker.getValue() - fourOfAKind.getKicker();
		},
		getFourKindValue: () => fourKindValue.getValue(),
		getKicker: () => kicker.getValue(),
		toString: () => 'Four of a kind (' + fourKindValue.toValueString() + "'s, " + kicker.toValueString() + ' kicker)'
	}
	
	return self;
}

module.exports = FourOfAKind;
