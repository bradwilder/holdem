let GameStateClient = (players, bigBlind, nextAction, nextActionPlayer, potSize, board, winnerState = null, lastAction = null) =>
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
		
		if (indexOrigin > 0)
		{
			let numPlayers = gamePlayers.length;
			gamePlayers = gamePlayers.splice(indexOrigin % numPlayers, numPlayers).concat(gamePlayers);
		}
		
		return gamePlayers;
	}
	
	let cloneForVisitor = () =>
	{
		let newPlayers = players.map((playerClient) => playerClient.clone()).map((playerClient) =>
		{
			if (playerClient.player)
			{
				playerClient.player.fold();
			}
			return playerClient;
		});
		return GameStateClient(newPlayers, bigBlind, null, null, potSize, board, winnerState, lastAction);
	}
	
	let cloneForPlayer = (player) =>
	{
		let newPlayers = rotatePlayersByOrigin(player, players.map((playerClient) => playerClient.clone()));
		let gameState = GameStateClient(newPlayers, bigBlind, nextAction, null, potSize, board, winnerState, lastAction);
		
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
	}
	
	let self =
	{
		players: players,
		bigBlind: bigBlind,
		nextAction: nextAction,
		nextActionPlayer: nextActionPlayer,
		potSize: potSize,
		board: board,
		winnerState: winnerState,
		lastAction: lastAction,
		clone: () => GameStateClient(players.map((playerClient) => playerClient.clone()), bigBlind, nextAction, nextActionPlayer, potSize, board, winnerState, lastAction),
		cloneState: (player = null) => player ? cloneForPlayer(player) : cloneForVisitor(),
		cloneWinner: (winners, player = null) =>
		{
			let newWinners = winners.players.map((playerClient) => playerClient.clone());
			if (player)
			{
				newWinners = rotatePlayersByOrigin(player, newWinners);
			}
			
			let winAction = winners.potSize >= 50 * bigBlind ? 'winLargePot' : 'winSmallPot';
			if (lastAction.indexOf(winAction) === -1)
			{
				lastAction.push(winAction);
			}
			
			return GameStateClient(newWinners, bigBlind, null, null, winners.potSize, board, winners.hand, lastAction);
		}
	}
	
	return self;
}

module.exports = GameStateClient;
