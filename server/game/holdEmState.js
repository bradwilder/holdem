let HoldEmState = () =>
{
	return {
		BLINDS: 0,
		BET_PREFLOP: 1,
		BET_FLOP: 2,
		BET_TURN: 3,
		BET_RIVER: 4,
		WINNER: 5,
		NO_GAME: 6
	}
}

module.exports = HoldEmState;
