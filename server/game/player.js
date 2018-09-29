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
		getChips: () => chips,
		name: name,
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
		toString: () => name + '\n' + chips
	}
	
	return self;
}

module.exports = Player;
