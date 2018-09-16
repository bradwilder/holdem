let GameState = (state, potSize, board, players, nextAction) =>
{
	return {
		state: state,
		potSize: potSize,
		board: board,
		players: players,
		nextAction: nextAction
	}
}

module.exports = GameState;
