let ActionLogEntry = require('../../game/actionLogEntry');
let Player = require('../../game/player');

describe('actionLogEntry', () =>
{
	it('should let you create a system entry', () =>
	{
		let entry = ActionLogEntry('hey');
		expect(entry.toString()).toBe('<hey>');
	});
	
	it('should let you create an entry for a single player', () =>
	{
		let player = Player('me');
		let entry = ActionLogEntry('hey', [player]);
		expect(entry.toString()).toBe('me hey');
	});
	
	it('should let you create an entry for 2 players', () =>
	{
		let player1 = Player('me');
		let player2 = Player('too');
		let entry = ActionLogEntry('hey', [player1, player2]);
		expect(entry.toString()).toBe('me and too hey');
	});
	
	it('should let you create an entry for multiple players', () =>
	{
		let player1 = Player('me');
		let player2 = Player('too');
		let player3 = Player('yes');
		let player4 = Player('what');
		let entry = ActionLogEntry('hey', [player1, player2, player3, player4]);
		expect(entry.toString()).toBe('me, too, yes and what hey');
	});
});