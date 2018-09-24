let Rank = require('./rank');

let Flush = (cards) =>
{
	const FLUSH = 5;
	
	let rank = Rank(FLUSH);
	
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
		compareSameRank: (flush) =>
		{
			for (let i = 0; i < 5; i++)
			{
				if (cards[i].getValue() !== flush.getValue(i))
				{
					return cards[i].getValue() - flush.getValue(i);
				}
			}
			
			return 0;
		},
		getValue: (i) => cards[i].getValue(),
		toString: () =>
		{
			let valuesStr = '';
			for (let i = 0; i < 4; i++)
			{
				valuesStr += (cards[i].getValue() + ', ');
			}
			valuesStr += cards[4].getValue();
			
			return 'Flush (' + valuesStr + ')';
		}
	}
	
	return self;
}

module.exports = Flush;
