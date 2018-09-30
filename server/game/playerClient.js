let PlayerClient = (isDealer, player = null, hasHoleCards = false, ongoingRoundAction = null, isActive = false) =>
{
	let self =
	{
		player: player,
		hasHoleCards: hasHoleCards,
		isDealer: isDealer,
		ongoingRoundAction: ongoingRoundAction,
		isActive: isActive
	}
	
	return self;
}

module.exports = PlayerClient;
