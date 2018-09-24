let Rank = require('./rank');

let HighCard = (cards) =>
{
	const HIGH_CARD = 0;
	
	let rank = Rank(HIGH_CARD);
	
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
		compareSameRank: (highCard) =>
		{
			for (let i = 0; i < 5; i++)
			{
				if (cards[i].getValue() !== highCard.getValue(i))
				{
					return cards[i].getValue() - highCard.getValue(i);
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
			
			return 'High card (' + valuesStr + ')';
		}
	}
	
	return self;
}

module.exports = HighCard;
