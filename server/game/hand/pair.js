let Rank = require('./rank');

let Pair = (cards) =>
{
	const PAIR = 1;
	
	let rank = Rank(PAIR);
	
	let pairValue = cards[0];
	let kickers = cards.slice(2);
	
	let self =
	{
		card: cards,
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
		compareSameRank: (pair) =>
		{
			if (pairValue.getValue() !== pair.getPairValue())
			{
				return pairValue.getValue() - pair.getPairValue();
			}
			
			for (let i = 0; i < 3; i++)
			{
				if (kickers[i].getValue() !== pair.getKicker(i))
				{
					return kickers[i].getValue() - pair.getKicker(i);
				}
			}
			
			return 0;
		},
		getPairValue: () => pairValue.getValue(),
		getKicker: (i) => kickers[i].getValue(),
		toString: () =>
		{
			let kickerStr = '';
			for (let i = 0; i < 2; i++)
			{
				kickerStr += (kickers[i].toValueString() + ', ');
			}
			kickerStr += kickers[2].toValueString();
			
			return 'Pair (' + pairValue.toValueString() + "'s, [" + kickerStr + '] kickers)';
		}
	}
	
	return self;
}

module.exports = Pair;
