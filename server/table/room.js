let Room = (id, name, bigBlind, maxPlayers) =>
{
	let tablePlayers = Array(maxPlayers).fill(null);
	
	let holdEm;
	
	let visitors = [];
	
	let getNumPlayersSittingIn = () =>
	{
		let count = 0;
		tablePlayers.forEach((player) =>
		{
			if (player && !player.isSittingOut())
			{
				count++;
			}
		});
		return count;
	}
	
	let getPlayersSittingIn = () =>
	{
		let players = [];
		tablePlayers.forEach((tablePlayer) =>
		{
			if (tablePlayer && !tablePlayer.isSittingOut())
			{
				tablePlayer.push(tablePlayer);
			}
		});
		return players;
	}
	
	
	
	let self =
	{
		id: id,
		name: name,
		bigBlind: bigBlind,
		maxPlayers: maxPlayers,
		getNumPlayers: () =>
		{
			let count = 0;
			tablePlayers.forEach((player) =>
			{
				if (player)
				{
					count++;
				}
			});
			return count;
		},
		addPlayer: (tablePlayer, i) =>
		{
			if (i >= tablePlayers.length || i < 0)
			{
				throw "Can't seat player at position " + i + " with max players " + tablePlayers.length;
			}
			
			tablePlayers[i] = tablePlayer;
			
			if (!holdEm && getNumPlayersSittingIn() >= 2)
			{
				startGame();
			}
		},
		startGame: () =>
		{
			let players = getPlayersSittingIn();
			
			// TODO
		},
		sitPlayerIn: (i) =>
		{
			let tablePlayer = tablePlayers[i];
			if (!tablePlayer)
			{
				throw 'No player at index ' + i;
			}
			
			if (!tablePlayer.isSittingOut())
			{
				throw 'Player ' + i + ' is already sitting in';
			}
			
			let newIndex = 0;
			for (let j = 0; j < tablePlayers.length && j < i; j++)
			{
				let tablePlayer = tablePlayers[j];
				if (tablePlayer && !tablePlayer.isSittingOut())
				{
					newIndex++;
				}
			}
			
			
			// TODO: is game active? if not, queue them for later
			//if ()
			
			//tablePlayer.setSittingOut(false);
			
		},
		addVisitor: (visitor) =>
		{
			if (visitors.indexOf(visitor) === -1)
			{
				visitors.push(visitor);
			}
		},
		removeVisitor: (visitor) =>
		{
			let index = visitors.indexOf(visitor);
			if (index !== -1)
			{
				visitors.splice(index, 1);
			}
		}
		
		
		
	}
	
	return self;
}

module.exports = Room;
