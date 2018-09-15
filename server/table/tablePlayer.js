let TablePlayer = (player, socket) =>
{
	let sittingOut = false;
	
	
	
	
	
	let self =
	{
		getPlayer: () => player,
		getSocket: () => socket,
		isSittingOut: () => sittingOut,
		setSittingOut: (isSittingOut) =>
		{
			sittingOut = isSittingOut;
		}
		
		
		
		
		
		
	}
	
	return self;
}

module.exports = TablePlayer;
