let ActionLog = require('../../game/actionLog');
let ActionLogEntry = require('../../game/actionLogEntry');
let Player = require('../../game/player');

describe('actionLog', () =>
{
	it('should let you create an empty log', () =>
	{
		let log = ActionLog();
		expect(log.getEntries().length).toBe(0);
	});
	
	it('should let you create a system entry', () =>
	{
		let log = ActionLog();
		log.addSystemEntry('hey');
		let newEntries = log.getEntries();
		expect(newEntries.length).toBe(1);
		expect(newEntries[0].toString()).toBe('<hey>');
	});
	
	it('should let you create an entry for a single player', () =>
	{
		let log = ActionLog();
		let player = Player('me');
		log.addPlayerEntry('hey', player);
		let newEntries = log.getEntries();
		expect(newEntries.length).toBe(1);
		expect(newEntries[0].toString()).toBe('me hey');
	});
	
	it('should let you add an entry', () =>
	{
		let log = ActionLog();
		let player1 = Player('me');
		let player2 = Player('too');
		let entry = ActionLogEntry('hey', [player1, player2]);
		log.addEntry(entry);
		let newEntries = log.getEntries();
		expect(newEntries.length).toBe(1);
		expect(newEntries[0].toString()).toBe('me and too hey');
	});
	
	it('should let you add multiple entries', () =>
	{
		let log = ActionLog();
		let player1 = Player('me');
		let player2 = Player('too');
		let entries = [ActionLogEntry('hey', [player1]), ActionLogEntry('you', [player2])];
		log.addEntries(entries);
		let newEntries = log.getEntries();
		expect(newEntries.length).toBe(2);
		expect(newEntries[0].toString()).toBe('me hey');
		expect(newEntries[1].toString()).toBe('too you');
	});
	
	it('should let you append entries', () =>
	{
		let log = ActionLog();
		log.addSystemEntry('1');
		let player1 = Player('me');
		let player2 = Player('too');
		let entry = ActionLogEntry('2', [player1, player2]);
		log.addEntry(entry);
		log.addPlayerEntry('3', player2);
		let newEntries = log.getEntries();
		expect(newEntries.length).toBe(3);
		expect(newEntries[0].toString()).toBe('<1>');
		expect(newEntries[1].toString()).toBe('me and too 2');
		expect(newEntries[2].toString()).toBe('too 3');
	});
});