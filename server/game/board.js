let Board = (cards = null) =>
{
	let board = cards ? cards.map((card) => card.clone()) : [];
	
	let cloneBoard = () => board.map((card) => card.clone());
	
	return {
		getFlop: () => board.length >= 3 ? cloneBoard().slice(0, 3) : [],
		getTurn: () => board.length >= 4 ? cloneBoard().slice(3, 4) : [],
		getRiver: () => board.length >= 4 ? cloneBoard().slice(4, 5) : [],
		getBoard: () => cloneBoard(),
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
