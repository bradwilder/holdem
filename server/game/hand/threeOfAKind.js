let Rank = require('./rank');

let ThreeOfAKind = (cards) =>
{
	const THREE_KIND = 3;
	
	let rank = Rank(THREE_KIND);
	
	let threeKindValue = cards[0].getValue();
	let kickers = cards.map((card) => card.getValue()).slice(3);
	
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
		getThreeKindValue: () => threeKindValue,
		getKicker: (i) => kickers[i],
		toString: () =>
		{
			let kickerStr = kickers[0] + ', ' + kickers[1];
			return 'Three of a kind (' + threeKindValue + "'s, [" + kickerStr + '] kickers)';
		}
	}
	
	return self;
}

module.exports = ThreeOfAKind;
