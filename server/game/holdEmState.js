let HoldEmState = () =>
{
	return {
		BLINDS: 0,
		DEAL_HOLES: 1,
		BET_PREFLOP: 2,
		DEAL_FLOP: 3,
		BET_FLOP: 4,
		DEAL_TURN: 5,
		BET_TURN: 6,
		DEAL_RIVER: 7,
		BET_RIVER: 8,
		WINNER: 9,
		NO_GAME: 10
	}
}

module.exports = HoldEmState;
