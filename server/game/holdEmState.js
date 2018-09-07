let HoldEmState = () =>
{
	return {
		BLINDS: 0,
		DEAL_HOLES: 1,
		BET_PREFLOP: 2,
		DEAL_FLOP: 3,
		BET_FLOP: 3,
		DEAL_TURN: 3,
		BET_TURN: 3,
		DEAL_RIVER: 3,
		BET_RIVER: 3,
		WINNER: 9
	}
}

module.exports = HoldEmState;
