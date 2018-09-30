let GameStateClient = (players, bigBlind, nextAction, nextActionPlayer, potSize, board, winningHand = null) =>
{
	let self =
	{
		players: players,
		bigBlind: bigBlind,
		nextAction: nextAction,
		nextActionPlayer: nextActionPlayer,
		potSize: potSize,
		board: board,
		winningHand: winningHand,
		clone: () => GameStateClient(JSON.parse(JSON.stringify(players)), bigBlind, nextAction, nextActionPlayer, potSize, board, winningHand)
	}
	
	return self;
}

module.exports = GameStateClient;
