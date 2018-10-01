let GameStateClient = (players, bigBlind, nextAction, nextActionPlayer, potSize, board, winningHand = null) =>
{
	let rotatePlayersByOrigin = (playerOrigin, gamePlayers) =>
	{
		let indexOrigin = 0;
		for (let i = 0; i < gamePlayers.length; i++)
		{
			if (gamePlayers[i].player && gamePlayers[i].player.getName() === playerOrigin.getName())
			{
				indexOrigin = i;
				break;
			}
		}
		
		let numPlayers = gamePlayers.length;
		if (indexOrigin > 0)
		{
			gamePlayers = gamePlayers.splice(indexOrigin % numPlayers, numPlayers).concat(gamePlayers);
			return gamePlayers;
		}
		else
		{
			return gamePlayers;
		}
	}
	
	let self =
	{
		players: players,
		bigBlind: bigBlind,
		nextAction: nextAction,
		nextActionPlayer: nextActionPlayer,
		potSize: potSize,
		board: board,
		winningHand: winningHand,
		clone: () => GameStateClient(players.map((playerClient) => playerClient.clone()), bigBlind, nextAction, nextActionPlayer, potSize, board, winningHand),
		cloneForVisitor: () =>
		{
			let newPlayers = players.map((playerClient) => playerClient.clone()).map((playerClient) =>
			{
				if (playerClient.player)
				{
					playerClient.player.fold();
				}
				return playerClient;
			});
			return GameStateClient(newPlayers, bigBlind, null, null, potSize, board, winningHand)
		},
		cloneForPlayer: (player) =>
		{
			let newPlayers = rotatePlayersByOrigin(player, players.map((playerClient) => playerClient.clone()));
			let gameState = GameStateClient(newPlayers, bigBlind, nextAction, null, potSize, board, winningHand);
			
			if (!gameState.players.find((playerClient) => playerClient.player && playerClient.player.getName() === player.getName()).isActive)
			{
				gameState.nextAction = null;
			}
			
			gameState.nextActionPlayer = null;
			
			gameState.players.forEach((playerClient) =>
			{
				if (playerClient.player && playerClient.player.getName() !== player.getName())
				{
					playerClient.player.fold();
				}
			});
			
			return gameState;
		},
		cloneState: (player = null) => player ? self.cloneForPlayer(player) : self.cloneForVisitor(),
		cloneWinner: (winners, player = null) =>
		{
			let newWinners = winners.players.map((playerClient) => playerClient.clone());
			if (player)
			{
				newWinners = rotatePlayersByOrigin(player, newWinners);
			}
			return GameStateClient(newWinners, bigBlind, null, null, winners.potSize, board, winners.hand);
		}
	}
	
	return self;
}

module.exports = GameStateClient;
