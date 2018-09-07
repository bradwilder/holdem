let GameState = (state, potSize, players, playerAction) =>
{
	return {
		state: state,
		potSize: potSize,
		players: players,
		playerAction: playerAction
	}
}

module.exports = GameState;
