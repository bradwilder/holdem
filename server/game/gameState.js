let GameState = (state, potSize, bigBlind, board, players, nextAction, nextActionPlayer, winners) =>
{
	return {
		state: state,
		potSize: potSize,
		bigBlind: bigBlind,
		board: board,
		players: players,
		nextAction: nextAction,
		nextActionPlayer: nextActionPlayer,
		winners: winners
	}
}

module.exports = GameState;
