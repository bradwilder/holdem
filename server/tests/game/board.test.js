let Board = require('../../game/board');
let Card = require('../../game/card');

describe('board', () =>
{
	it('should create an empty board', () =>
	{
		let board = Board();
		expect(board.getBoard()).toEqual([]);
	});
	
	it('should create a board with cards', () =>
	{
		let board = Board([Card(19), Card(32), Card(14)]);
		let newBoard = board.getBoard();
		expect(newBoard.length).toBe(3);
		expect(newBoard[0].getCode()).toBe(19);
		expect(newBoard[1].getCode()).toBe(32);
		expect(newBoard[2].getCode()).toBe(14);
	});
	
	it('should return a flop with at least 3 cards', () =>
	{
		let board = Board([Card(19), Card(32), Card(14)]);
		let newBoard = board.getFlop();
		expect(newBoard.length).toBe(3);
		expect(newBoard[0].getCode()).toBe(19);
		expect(newBoard[1].getCode()).toBe(32);
		expect(newBoard[2].getCode()).toBe(14);
	});
	
	it('should return no flop with only 2 cards', () =>
	{
		let board = Board([Card(19), Card(32)]);
		let newBoard = board.getFlop();
		expect(newBoard.length).toBe(0);
	});
	
	it('should return a turn with at least 4 cards', () =>
	{
		let board = Board([Card(19), Card(32), Card(14), Card(7), Card(41)]);
		let newBoard = board.getTurn();
		expect(newBoard.length).toBe(4);
		expect(newBoard[0].getCode()).toBe(19);
		expect(newBoard[1].getCode()).toBe(32);
		expect(newBoard[2].getCode()).toBe(14);
		expect(newBoard[3].getCode()).toBe(7);
	});
	
	it('should return no turn with only 2 cards', () =>
	{
		let board = Board([Card(19), Card(32)]);
		let newBoard = board.getTurn();
		expect(newBoard.length).toBe(0);
	});
	
	it('should return a river with 5 cards', () =>
	{
		let board = Board([Card(19), Card(32), Card(14), Card(7), Card(41)]);
		let newBoard = board.getRiver();
		expect(newBoard.length).toBe(5);
		expect(newBoard[0].getCode()).toBe(19);
		expect(newBoard[1].getCode()).toBe(32);
		expect(newBoard[2].getCode()).toBe(14);
		expect(newBoard[3].getCode()).toBe(7);
		expect(newBoard[4].getCode()).toBe(41);
	});
	
	it('should return no river with only 2 cards', () =>
	{
		let board = Board([Card(19), Card(32)]);
		let newBoard = board.getRiver();
		expect(newBoard.length).toBe(0);
	});
	
	it('should let you add a flop', () =>
	{
		let cards = [Card(19), Card(32), Card(14)];
		let board = Board();
		board.addFlop(cards);
		let newBoard = board.getBoard();
		expect(newBoard.length).toBe(3);
		expect(newBoard[0].getCode()).toBe(19);
		expect(newBoard[1].getCode()).toBe(32);
		expect(newBoard[2].getCode()).toBe(14);
	});
	
	it("shouldn't let you add a wrong-sized flop", () =>
	{
		let cards = [Card(19), Card(32)];
		let board = Board();
		expect(() => {board.addFlop(cards);}).toThrow();
	});
	
	it('should let you add a turn and river', () =>
	{
		let cards = [Card(19), Card(32), Card(14)];
		let board = Board();
		let newBoard;
		board.addFlop(cards);
		newBoard = board.getBoard();
		expect(newBoard.length).toBe(3);
		board.addTurnRiver(Card(21));
		newBoard = board.getBoard();
		expect(newBoard.length).toBe(4);
		expect(newBoard[3].getCode()).toBe(21);
		
		board.addTurnRiver(Card(28));
		newBoard = board.getBoard();
		expect(newBoard.length).toBe(5);
		expect(newBoard[4].getCode()).toBe(28);
	});
});