let Board = (cards) =>
{
	let board = cards.map((card) => card.clone());
	
	let cloneBoard = () => board.map((card) => card.clone());
	
	return {
		getFlop: () => cloneBoard().slice(0, 3),
		getTurn: () => cloneBoard().slice(3, 4),
		getRiver: () => cloneBoard().slice(4, 5),
		getBoard: () => cloneBoard()
	}
}

module.exports = Board;
