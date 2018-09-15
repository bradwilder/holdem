let GameState = (state, potSize, players, nextAction) =>
{
	return {
		state: state,
		potSize: potSize,
		players: players,
		nextAction: nextAction
	}
}

module.exports = GameState;
