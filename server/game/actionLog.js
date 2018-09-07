let ActionLogEntry = require('./actionLogEntry');

let ActionLog = () =>
{
	let entries = [];
	
	let self =
	{
		addSystemEntry: (action) =>
		{
			self.addEntry(ActionLogEntry(action));
		},
		addPlayerEntry: (action, player) =>
		{
			self.addEntry(ActionLogEntry(action, [player]));
		},
		addEntry: (entry) =>
		{
			entries.push(entry);
		},
		addEntries: (newEntries) =>
		{
			entries = entries.concat(newEntries);
		},
		getEntries: () => entries
	}
	
	return self;
}

module.exports = ActionLog;
