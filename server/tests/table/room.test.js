let TablePlayer = require('../../table/tablePlayer');
let Room = require('../../table/room');
let Player = require('../../game/player');
let HoldEmState = require('../../game/holdEmState');

describe('room', () =>
{
	it('should let you add and remove visitors', () =>
	{
		let room = Room(0, 'my room', 20, 10, {sockets: {connected: []}});
		
		expect(room.getVisitors().length).toBe(0);
		
		let visitor1 = 'a434dksdkfalflkdsf';
		let visitors;
		
		room.addVisitor(visitor1);
		visitors = room.getVisitors();
		expect(visitors.length).toBe(1);
		expect(visitors[0]).toBe(visitor1);
		
		let gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board).toBeNull();
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer).toBeNull();
		expect(gameState.winners).toBeNull();
		
		room.removeOccupant(visitor1);
		visitors = room.getVisitors();
		expect(visitors.length).toBe(0);
	});
	
	it('should let you add and remove table players', () =>
	{
		let room = Room(0, 'my room', 20, 10, {sockets: {connected: []}});
		
		expect(room.getVisitors().length).toBe(0);
		expect(room.getNumPlayers()).toBe(0);
		
		let visitor1 = 'a434dksdkfalflkdsf';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		let players;
		
		room.addVisitor(visitor1);
		room.joinTable(tablePlayer1, 4);
		players = room.getTablePlayers();
		expect(room.getNumPlayers()).toBe(1);
		expect(players[4]).toBe(tablePlayer1);
		
		let gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board).toBeNull();
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer).toBeNull();
		expect(gameState.winners).toBeNull();
		expect(gameState.players[4].name).toBe('1');
		
		room.removeOccupant(visitor1);
		expect(room.getNumPlayers()).toBe(0);
		players = room.getTablePlayers();
		expect(players[4]).toBeNull();
	});
	
	it("should start a game after you add two players", () =>
	{
		let room = Room(0, 'my room', 20, 5, {sockets: {connected: []}}, 0);
		
		expect(room.getVisitors().length).toBe(0);
		expect(room.getNumPlayers()).toBe(0);
		
		let visitor1 = 'a434dksdkadsfsdfasfalflkdsf1';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf2';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		room.addVisitor(visitor1);
		room.addVisitor(visitor2);
		
		room.joinTable(tablePlayer1, 2);
		room.joinTable(tablePlayer2, 4);
		
		let gameState;
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer.name).toBe('1');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[4].name).toBe('2');
		expect(gameState.players[2].name).toBe('1');
		
		gameState = room.getGameState(tablePlayer1);
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction.call).toBe(10);
		expect(gameState.nextAction.minRaise).toBe(30);
		expect(gameState.nextAction.maxRaise).toBe(434);
		expect(gameState.nextActionPlayer.name).toBe('1');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[2].name).toBe('2');
		expect(gameState.players[0].name).toBe('1');
		
		gameState = room.getGameState(tablePlayer2);
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer.name).toBe('1');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[0].name).toBe('2');
		expect(gameState.players[3].name).toBe('1');
	});
	
	it("should let you remove a player after a game has started", () =>
	{
		let room = Room(0, 'my room', 20, 5, {sockets: {connected: []}}, 0);
		
		expect(room.getVisitors().length).toBe(0);
		expect(room.getNumPlayers()).toBe(0);
		
		let visitor1 = 'a434dksdkadsfsdfasfalflkdsf1';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf2';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		room.addVisitor(visitor1);
		room.addVisitor(visitor2);
		
		room.joinTable(tablePlayer1, 2);
		room.joinTable(tablePlayer2, 4);
		
		let gameState;
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		
		room.removeOccupant(visitor1);
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().WINNER);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer).toBeNull();
		expect(gameState.winners.pots.length).toBe(1);
		expect(gameState.winners.pots[0].players.length).toBe(1);
		expect(gameState.winners.pots[0].players[0].name).toBe('2');
		expect(gameState.winners.pots[0].winners.length).toBe(1);
		expect(gameState.winners.pots[0].winners[0].player.name).toBe('2');
		expect(gameState.winners.pots[0].size).toBe(30);
		expect(gameState.players[4].name).toBe('2');
	});
	
	it("should let you remove a player before a game has started", () =>
	{
		let room = Room(0, 'my room', 20, 5, {sockets: {connected: []}}, 0);
		
		let visitor1 = 'a434dksdkadsfsdfasfalflkdsf1';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		room.addVisitor(visitor1);
		
		room.joinTable(tablePlayer1, 2);
		
		let gameState;
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
		
		room.removeOccupant(visitor1);
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board).toBeNull();
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer).toBeNull();
		expect(gameState.winners).toBeNull();
		expect(gameState.players[2]).toBeNull();
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf2';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		let visitor3 = 'a434dksdkadsfsdfasfalflkdsf3';
		let player3 = Player('3', 444);
		let tablePlayer3 = TablePlayer(player3, visitor3);
		
		room.addVisitor(visitor2);
		room.addVisitor(visitor3);
		
		room.joinTable(tablePlayer2, 0);
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
		
		room.joinTable(tablePlayer3, 4);
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer.name).toBe('2');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[0].name).toBe('2');
		expect(gameState.players[4].name).toBe('3');
		expect(gameState.players[2]).toBeNull();
	});
	
	it("should let you add and remove a player while a game is in progress", () =>
	{
		let room = Room(0, 'my room', 20, 5, {sockets: {connected: []}}, 0);
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf2';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		let visitor3 = 'a434dksdkadsfsdfasfalflkdsf3';
		let player3 = Player('3', 444);
		let tablePlayer3 = TablePlayer(player3, visitor3);
		
		room.addVisitor(visitor2);
		room.addVisitor(visitor3);
		
		room.joinTable(tablePlayer2, 0);
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
		
		room.joinTable(tablePlayer3, 4);
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer.name).toBe('2');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[0].name).toBe('2');
		expect(gameState.players[4].name).toBe('3');
		expect(gameState.players[2]).toBeNull();
		
		let visitor1 = 'a434dksdkadsfsdfasfalflkdsf1';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		room.addVisitor(visitor1);
		
		room.joinTable(tablePlayer1, 2);		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer.name).toBe('2');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[0].name).toBe('2');
		expect(gameState.players[4].name).toBe('3');
		expect(gameState.players[2].name).toBe('1');
		
		room.removeOccupant(visitor1);
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		expect(gameState.potSize).toBe(0);
		expect(gameState.board.length).toBe(0);
		expect(gameState.nextAction).toBeNull();
		expect(gameState.nextActionPlayer.name).toBe('2');
		expect(gameState.winners).toBeNull();
		expect(gameState.players[0].name).toBe('2');
		expect(gameState.players[4].name).toBe('3');
		expect(gameState.players[2]).toBeNull();
	});
	
	it("should let you remove the last player", () =>
	{
		let room = Room(0, 'my room', 20, 5, {sockets: {connected: []}}, 0);
		
		expect(room.getVisitors().length).toBe(0);
		expect(room.getNumPlayers()).toBe(0);
		
		let visitor1 = 'a434dksdkadsfsdfasfalflkdsf1';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf2';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		room.addVisitor(visitor1);
		room.addVisitor(visitor2);
		
		room.joinTable(tablePlayer1, 2);
		room.joinTable(tablePlayer2, 4);
		
		let gameState;
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().BET_PREFLOP);
		
		room.removeOccupant(visitor1);
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().WINNER);
		
		room.removeOccupant(visitor2);
		
		gameState = room.getGameState();
		expect(gameState.state).toBe(HoldEmState().NO_GAME);
	});
	
	it("shouldn't let you add a table player that isn't a visitor", () =>
	{
		let room = Room(0, 'my room', 20, 10, {sockets: {connected: []}});
		
		expect(room.getVisitors().length).toBe(0);
		expect(room.getNumPlayers()).toBe(0);
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		expect(() => room.joinTable(tablePlayer2, 4)).toThrow();
	});
	
	it("shouldn't let you add more than the maximum number of players", () =>
	{
		let room = Room(0, 'my room', 20, 5, {sockets: {connected: []}});
		
		expect(room.getVisitors().length).toBe(0);
		expect(room.getNumPlayers()).toBe(0);
		
		let visitor1 = 'a434dksdkadsfsdfasfalflkdsf1';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		let visitor2 = 'a434dksdkadsfsdfasfalflkdsf2';
		let player2 = Player('2', 444);
		let tablePlayer2 = TablePlayer(player2, visitor2);
		
		let visitor3 = 'a434dksdkadsfsdfasfalflkdsf3';
		let player3 = Player('3', 444);
		let tablePlayer3 = TablePlayer(player3, visitor3);
		
		let visitor4 = 'a434dksdkadsfsdfasfalflkdsf4';
		let player4 = Player('4', 444);
		let tablePlayer4 = TablePlayer(player4, visitor4);
		
		let visitor5 = 'a434dksdkadsfsdfasfalflkdsf5';
		let player5 = Player('5', 444);
		let tablePlayer5 = TablePlayer(player5, visitor5);
		
		let visitor6 = 'a434dksdkadsfsdfasfalflkdsf6';
		let player6 = Player('6', 444);
		let tablePlayer6 = TablePlayer(player6, visitor6);
		
		room.addVisitor(visitor1);
		room.addVisitor(visitor2);
		room.addVisitor(visitor3);
		room.addVisitor(visitor4);
		room.addVisitor(visitor5);
		room.addVisitor(visitor6);
		
		room.joinTable(tablePlayer1, 2);
		room.joinTable(tablePlayer2, 4);
		room.joinTable(tablePlayer3, 0);
		room.joinTable(tablePlayer4, 1);
		room.joinTable(tablePlayer5, 3);
		
		expect(() => room.joinTable(tablePlayer6, 3)).toThrow();
	});
	
	it("shouldn't let you re-add the same player", () =>
	{
		let room = Room(0, 'my room', 20, 10, {sockets: {connected: []}});
		
		let visitor1 = 'a434dksdkfalflkdsf';
		let player1 = Player('1', 444);
		let tablePlayer1 = TablePlayer(player1, visitor1);
		
		room.addVisitor(visitor1);
		room.joinTable(tablePlayer1, 4);
		expect(room.getNumPlayers()).toBe(1);
		expect(() => room.joinTable(tablePlayer1, 3)).toThrow();
		expect(room.getNumPlayers()).toBe(1);
	});
});