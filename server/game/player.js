let Player = (name, chips = 0) =>
{
	let holeCards = [];
	
	let self =
	{
		fold: () =>
		{
			holeCards = [];
		},
		deal: (cards) =>
		{
			holeCards = cards.slice();
		},
		getName: () => name,
		getChips: () => chips,
		getHoleCards: () => holeCards,
		hasHoleCards: () => holeCards.length == 2,
		awardChips: (newChips) =>
		{
			chips += newChips;
		},
		bet: (betChips) =>
		{
			chips -= betChips;
		},
		isAllIn: () => chips == 0 && self.hasHoleCards(),
		toString: () => name + '\n' + chips
	}
	
	return self;
}

module.exports = Player;
