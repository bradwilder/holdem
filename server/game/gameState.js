let GameState = (state, potSize, bigBlind, dealerIndex, board, players, nextAction, nextActionPlayer, winners) =>
{
	return {
		state: state,
		potSize: potSize,
		bigBlind: bigBlind,
		dealerIndex: dealerIndex,
		board: board,
		players: players.slice(),
		nextAction: nextAction,
		nextActionPlayer: nextActionPlayer,
		winners: winners
	}
}

module.exports = GameState;
