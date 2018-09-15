let TablePlayer = (player, socket) =>
{
	let self =
	{
		getPlayer: () => player,
		getSocket: () => socket	
	}
	
	return self;
}

module.exports = TablePlayer;
