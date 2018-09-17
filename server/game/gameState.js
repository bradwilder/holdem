let GameState = (state, potSize, bigBlind, board, players, nextAction, nextActionPlayer) =>
{
	return {
		state: state,
		potSize: potSize,
		bigBlind: bigBlind,
		board: board,
		players: players,
		nextAction: nextAction,
		nextActionPlayer: nextActionPlayer
	}
}

module.exports = GameState;
