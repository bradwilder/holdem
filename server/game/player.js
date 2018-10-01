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
			holeCards = cards ? cards.map((card) => card.clone()) : [];
		},
		getName: () => name,
		getChips: () => chips,
		getHoleCards: () => holeCards.map((card) => card.clone()),
		hasHoleCards: () => holeCards.length == 2,
		awardChips: (newChips) =>
		{
			chips += newChips;
		},
		bet: (betChips) =>
		{
			chips -= betChips;
		},
		toString: () => name + '\n' + chips,
		toJSON: () => ({name: name, chips: chips, holeCards: holeCards}),
		clone: () => 
		{
			let player = Player(name, chips);
			player.deal(self.getHoleCards());
			return player;
		}
	}
	
	return self;
}

module.exports = Player;
