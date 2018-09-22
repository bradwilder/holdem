let Hand = require('./hand');

let Pair = (cards) =>
{
	const PAIR = 1;
	
	let rank = Hand(PAIR);
	
	let pairValue = cards[0].value;
	let kickers = cards.map((card) => card.value).slice(2);
	
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
			if (pairValue !== pair.getPairValue())
			{
				return pairValue - pair.getPairValue();
			}
			
			for (let i = 0; i < 3; i++)
			{
				if (kickers[i] !== pair.getKicker(i))
				{
					return kickers[i] - pair.getKicker(i);
				}
			}
			
			return 0;
		},
		getPairValue: () => pairValue,
		getKicker: (i) => kickers[i],
		toString: () =>
		{
			let kickerStr = '';
			for (let i = 0; i < 2; i++)
			{
				kickerStr += (kickers[i] + ', ');
			}
			kickerStr += kickers[2];
			
			return 'Pair (' + pairValue + "'s, [" + kickerStr + '] kickers)';
		}
	}
	
	return self;
}

module.exports = Pair;
