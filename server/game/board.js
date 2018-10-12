let Board = (cards = null) =>
{
	let cloneCards = (cards) => cards.map((card) => card.clone());
	
	let board = cards ? cloneCards(cards) : [];
	
	return {
		getFlop: () => board.length >= 3 ? cloneCards(board).slice(0, 3) : [],
		getTurn: () => board.length >= 4 ? cloneCards(board).slice(0, 4) : [],
		getRiver: () => board.length >= 4 ? cloneCards(board).slice(0, 5) : [],
		getBoard: () => cloneCards(board),
		addFlop: (cards) =>
		{
			if (cards.length !== 3)
			{
				throw 'Flop must be size 3'
			}
			board = cards.map((card) => card.clone());
		},
		addTurnRiver: (card) =>
		{
			if (board.length === 5)
			{
				throw 'Cannot add another card'
			}
			board.push(card.clone());
		}
	}
}

module.exports = Board;
