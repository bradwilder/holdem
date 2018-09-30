let ActionLogEntry = (action, players = []) =>
{
	return {
		toString: () =>
		{
			if (players.length === 0)
			{
				return '<' + action + '>';
			}
			else if (players.length === 1)
			{
				return players[0].getName() + ' ' + action;
			}
			else
			{
				let playerStr = players[0].getName();
				for (let i = 1; i < players.length - 1; i++)
				{
					let player = players[i];
					playerStr += ", " + player.getName();
				}
				playerStr += " and " + players[players.length - 1].getName();
				
				return playerStr + " " + action;
			}
		}
	}
}

module.exports = ActionLogEntry;
