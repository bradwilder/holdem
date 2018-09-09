let TablePlayer = (player, socket) =>
{
	let sittingOut = true;
	
	
	
	
	
	let self =
	{
		getPlayer: () => player,
		isSittingOut: () => sittingOut,
		setSittingOut: (isSittingOut) =>
		{
			sittingOut = isSittingOut;
		}
		
		
		
		
		
		
	}
	
	return self;
}

module.exports = TablePlayer;
