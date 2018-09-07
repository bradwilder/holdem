let Board = (cards) =>
{
	let board = cards.slice();
	
	return {
		getFlop: () => board.slice(0, 3),
		getTurn: () => board.slice(3, 4),
		getRiver: () => board.slice(4, 5),
		getBoard: () => board.slice()
	}
}

module.exports = Board;
