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
		name: name, // TODO: remove
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
