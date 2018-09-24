let Rank = require('./rank');

let ThreeOfAKind = (cards) =>
{
	const THREE_KIND = 3;
	
	let rank = Rank(THREE_KIND);
	
	let threeKindValue = cards[0];
	let kickers = cards.slice(3);
	
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
		compareSameRank: (threeOfAKind) =>
		{
			if (threeKindValue.getValue() !== threeOfAKind.getThreeKindValue())
			{
				return threeKindValue.getValue() - threeOfAKind.getThreeKindValue();
			}
			
			for (let i = 0; i < 2; i++)
			{
				if (kickers[i].getValue() !== threeOfAKind.getKicker(i))
				{
					return kickers[i].getValue() - threeOfAKind.getKicker(i);
				}
			}
			
			return 0;
		},
		getThreeKindValue: () => threeKindValue.getValue(),
		getKicker: (i) => kickers[i].getValue(),
		toString: () =>
		{
			let kickerStr = kickers[0].toValueString() + ', ' + kickers[1].toValueString();
			return 'Three of a kind (' + threeKindValue.toValueString() + "'s, [" + kickerStr + '] kickers)';
		}
	}
	
	return self;
}

module.exports = ThreeOfAKind;
