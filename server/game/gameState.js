let GameState = (state, potSize, bigBlind, board, players, nextAction) =>
{
	return {
		state: state,
		potSize: potSize,
		bigBlind: bigBlind,
		board: board,
		players: players,
		nextAction: nextAction
	}
}

module.exports = GameState;
